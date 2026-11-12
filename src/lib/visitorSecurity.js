import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import {
  EMAILJS_PUBLIC_KEY,
  EMAILJS_SERVICE_ID,
  EMAILJS_VISITOR_TEMPLATE_ID,
} from "./emailjsConfig";

export const VISITOR_CONSENT_COOKIE = "portfolio_visitor_consent";
const LOCAL_CONSENT_SECRET = "local-only-portfolio-consent-secret-for-tests";
const LOCAL_HASH_SECRET = "local-only-portfolio-hash-secret-for-tests";

export function isLocalTestMode() {
  return process.env.NODE_ENV !== "production" && process.env.VISITOR_NOTIFICATIONS_TEST_MODE === "true";
}

export function visitorFeatureEnabled() {
  if (process.env.VISITOR_NOTIFICATIONS_ENABLED === "false") return false;
  if (isLocalTestMode()) return true;
  return Boolean(
    process.env.EMAILJS_PRIVATE_KEY &&
    EMAILJS_SERVICE_ID &&
    EMAILJS_VISITOR_TEMPLATE_ID &&
    EMAILJS_PUBLIC_KEY &&
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN &&
    getConsentSecret() &&
    getHashSecret(),
  );
}

export function getConsentSecret() {
  const secret = process.env.VISITOR_CONSENT_SECRET || (isLocalTestMode() ? LOCAL_CONSENT_SECRET : "");
  return secret.length >= 32 ? secret : "";
}

export function getHashSecret() {
  const secret = process.env.VISITOR_HASH_SECRET || (isLocalTestMode() ? LOCAL_HASH_SECRET : "");
  return secret.length >= 32 ? secret : "";
}

export function getNotificationMode() {
  return process.env.VISITOR_NOTIFICATION_MODE === "individual" ? "individual" : "daily";
}

export function isSameOriginRequest(request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

export function getConsentFromRequest(request) {
  const header = request.headers.get("cookie") || "";
  const pair = header.split(";").map((entry) => entry.trim()).find((entry) => entry.startsWith(VISITOR_CONSENT_COOKIE + "="));
  if (!pair) return null;
  let value;
  try {
    value = decodeURIComponent(pair.slice(VISITOR_CONSENT_COOKIE.length + 1));
  } catch {
    return null;
  }
  const pieces = value.split(".");
  if (pieces.length !== 5 || pieces[0] !== "v1" || !/^(accepted|declined)$/.test(pieces[2]) || !/^\d{10,}$/.test(pieces[3])) return null;
  const secret = getConsentSecret();
  if (!secret) return null;
  const [version, id, decision, issuedAt, signature] = pieces;
  const expected = createHmac("sha256", secret).update([version, id, decision, issuedAt].join(".")).digest("base64url");
  const receivedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (receivedBuffer.length !== expectedBuffer.length || !timingSafeEqual(receivedBuffer, expectedBuffer)) return null;
  const timestamp = Number(issuedAt);
  if (!Number.isFinite(timestamp) || Date.now() - timestamp > 180 * 24 * 60 * 60 * 1000 || timestamp > Date.now() + 60_000) return null;
  if (decision !== "accepted" || id === "none") return { accepted: false };
  return { accepted: true, id };
}

export function createConsentCookie(decision) {
  const secret = getConsentSecret();
  const id = decision === "accepted" ? randomUUID() : "none";
  const issuedAt = String(Date.now());
  const signed = ["v1", id, decision, issuedAt].join(".");
  const signature = createHmac("sha256", secret).update(signed).digest("base64url");
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return VISITOR_CONSENT_COOKIE + "=" + signed + "." + signature + "; Path=/; Max-Age=15552000; HttpOnly; SameSite=Lax" + secure;
}

export function hasPrivacyOptOut(request) {
  return request.headers.get("dnt") === "1" || request.headers.get("sec-gpc") === "1";
}

export function getPseudonymousNetworkKey(request) {
  if (isLocalTestMode()) return createHmac("sha256", getHashSecret()).update("local-test-network").digest("hex");
  const forwarded = request.headers.get("x-forwarded-for") || "";
  const address = forwarded.split(",")[0].trim() || request.headers.get("x-real-ip") || "unknown";
  return createHmac("sha256", getHashSecret()).update(address).digest("hex");
}

export function getEmailOrigin(request) {
  if (process.env.VISITOR_EMAIL_ORIGIN) return process.env.VISITOR_EMAIL_ORIGIN;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return "https://" + process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (process.env.VERCEL_URL) return "https://" + process.env.VERCEL_URL;
  if (request?.headers.get("origin")) return request.headers.get("origin");
  return "https://evinleyander.vercel.app";
}

export async function sendVisitorEmail(request, templateParams) {
  if (isLocalTestMode()) return { sent: true, dryRun: true };
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8_000);
  try {
    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      cache: "no-store",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Origin: getEmailOrigin(request),
      },
      body: JSON.stringify({
        service_id: EMAILJS_SERVICE_ID,
        template_id: EMAILJS_VISITOR_TEMPLATE_ID,
        user_id: EMAILJS_PUBLIC_KEY,
        accessToken: process.env.EMAILJS_PRIVATE_KEY,
        template_params: {
          name: "Portfolio visitor notification",
          email: "",
          ...templateParams,
        },
      }),
    });
    return { sent: response.ok, status: response.status };
  } finally {
    clearTimeout(timeout);
  }
}
