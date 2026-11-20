import { isIP } from "node:net";
import { geolocation, ipAddress } from "@vercel/functions";
import {
  cleanLocationPart,
  locationFromProviderSources,
  normalizeCoordinates,
  requiresExplicitVisitorConsent,
} from "./visitorNotifications.mjs";

const PROVIDER_TIMEOUT_MS = 2500;

function isPublicIpv4(ip) {
  const [first, second, third] = ip.split(".").map(Number);
  if (first === 0 || first === 10 || first === 127 || first >= 224) return false;
  if (first === 100 && second >= 64 && second <= 127) return false;
  if (first === 169 && second === 254) return false;
  if (first === 172 && second >= 16 && second <= 31) return false;
  if (first === 192 && second === 168) return false;
  if (first === 192 && second === 0 && (third === 0 || third === 2)) return false;
  if (first === 192 && second === 88 && third === 99) return false;
  if (first === 198 && (second === 18 || second === 19 || (second === 51 && third === 100))) return false;
  if (first === 203 && second === 0 && third === 113) return false;
  return true;
}

function ipv6Bytes(ip) {
  if (ip.includes("%")) return null;
  let address = ip.toLowerCase();
  const ipv4Tail = address.match(/(?:^|:)(\d{1,3}(?:\.\d{1,3}){3})$/);
  if (ipv4Tail) {
    const octets = ipv4Tail[1].split(".").map(Number);
    if (octets.some((octet) => octet > 255)) return null;
    const hexTail = ((octets[0] << 8) | octets[1]).toString(16) + ":" + ((octets[2] << 8) | octets[3]).toString(16);
    address = address.slice(0, address.length - ipv4Tail[1].length) + hexTail;
  }

  const halves = address.split("::");
  if (halves.length > 2) return null;
  const parseHalf = (half) => half ? half.split(":").map((group) => /^[\da-f]{1,4}$/.test(group) ? Number.parseInt(group, 16) : NaN) : [];
  const left = parseHalf(halves[0]);
  const right = halves.length === 2 ? parseHalf(halves[1]) : [];
  if ([...left, ...right].some((group) => !Number.isInteger(group))) return null;
  const missing = 8 - left.length - right.length;
  if ((halves.length === 1 && missing !== 0) || (halves.length === 2 && missing < 1)) return null;
  return [...left, ...Array(missing).fill(0), ...right].flatMap((group) => [group >> 8, group & 255]);
}

function isPublicIpv6(ip) {
  const bytes = ipv6Bytes(ip);
  if (!bytes) return false;

  const isIpv4Mapped = bytes.slice(0, 10).every((byte) => byte === 0) && bytes[10] === 255 && bytes[11] === 255;
  if (isIpv4Mapped) return isPublicIpv4(bytes.slice(12).join("."));

  // Only globally routed unicast space is eligible for third-party lookups.
  if ((bytes[0] & 0xe0) !== 0x20) return false;
  const firstWord = (bytes[0] << 8) | bytes[1];
  const secondWord = (bytes[2] << 8) | bytes[3];
  const thirdWord = (bytes[4] << 8) | bytes[5];
  if (firstWord === 0x2001 && (secondWord === 0 || secondWord === 0x0db8)) return false;
  if (firstWord === 0x2001 && secondWord === 0x0002 && thirdWord === 0) return false;
  if (firstWord === 0x2001 && secondWord === 0x0010) return false;
  if (firstWord === 0x2001 && secondWord === 0x0020) return false;
  if (firstWord === 0x2002) return false;
  return true;
}

export function normalizePublicVisitorIp(value) {
  if (typeof value !== "string") return "";
  const ip = value.trim();
  const version = isIP(ip);
  if (version === 4 && isPublicIpv4(ip)) return ip;
  if (version === 6 && isPublicIpv6(ip)) return ip;
  return "";
}

function sameLookupAddress(requested, returned) {
  const address = normalizePublicVisitorIp(returned);
  if (!address) return false;
  const key = (ip) => isIP(ip) === 4
    ? ipv6Bytes("::ffff:" + ip).join(",")
    : ipv6Bytes(ip).join(",");
  return key(requested) === key(address);
}

function cleanProviderValue(value) {
  if (typeof value === "number" && Number.isFinite(value)) return cleanLocationPart(String(value));
  return cleanLocationPart(value);
}

function countryName(country, countryCode) {
  const code = cleanProviderValue(countryCode).toUpperCase();
  const rawCountry = cleanProviderValue(country);
  const candidate = /^[A-Z]{2}$/.test(code)
    ? code
    : /^[A-Z]{2}$/.test(rawCountry.toUpperCase()) ? rawCountry.toUpperCase() : "";
  if (candidate) {
    try {
      const displayName = new Intl.DisplayNames(["en"], { type: "region" }).of(candidate);
      if (displayName && displayName !== candidate) return displayName;
    } catch {
      // Keep the provider's original value when a runtime lacks this country mapping.
    }
  }
  return rawCountry;
}

function providerSource(provider, data, fields = {}) {
  if (!data || data.error || data.bogon || data.is_bogon) return null;
  const code = cleanProviderValue(fields.countryCode).toUpperCase();
  const source = {
    provider,
    country: countryName(fields.country, code),
    countryCode: /^[A-Z]{2}$/.test(code) ? code : "",
    region: cleanProviderValue(fields.region),
    city: cleanProviderValue(fields.city),
    timezone: cleanProviderValue(fields.timezone),
    postalCode: cleanProviderValue(fields.postalCode),
    organization: cleanProviderValue(fields.organization),
  };
  const networkIndicators = [];
  for (const [field, label] of [
    ["is_datacenter", "Provider identifies a data-center network"],
    ["is_vpn", "Provider identifies a VPN"],
    ["is_proxy", "Provider identifies a proxy"],
    ["is_tor", "Provider identifies a Tor exit"],
    ["is_relay", "Provider identifies a privacy relay"],
    ["is_anycast", "Provider identifies an anycast network"],
  ]) {
    if (field === "is_vpn" ? Boolean(data[field]) : data[field] === true) networkIndicators.push(label);
  }
  if (/\b(cloud|hosting|data[ -]?cent(?:er|re)|vps|colocation|server farm)\b/i.test(source.organization)) {
    networkIndicators.push("Provider organization suggests cloud or hosting infrastructure; VPN/proxy status is unconfirmed");
  }
  if (data.egress_service?.type) networkIndicators.push("Provider identifies an egress service");
  if (networkIndicators.length) source.networkIndicators = networkIndicators;
  if (data.is_crawler === true || (typeof data.is_crawler === "string" && data.is_crawler.trim())) source.crawlerDetected = true;
  const coordinates = normalizeCoordinates({ latitude: fields.latitude, longitude: fields.longitude });
  if (coordinates) source.coordinates = coordinates;
  return Object.values(source).some((value) => value && value !== provider) || source.coordinates ? source : null;
}

async function fetchJson(url, options, fetchImpl) {
  try {
    const response = await fetchImpl(url, {
      ...options,
      cache: "no-store",
      signal: AbortSignal.timeout(PROVIDER_TIMEOUT_MS),
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    // Provider outages and timeouts must not block a visitor notification.
    return null;
  }
}

async function fetchIpinfo(ip, token, fetchImpl) {
  const url = "https://api.ipinfo.io/lookup/" + encodeURIComponent(ip);
  const data = await fetchJson(url, {
    headers: { Authorization: "Bearer " + token },
  }, fetchImpl);
  const geo = data?.geo;
  const [latitude, longitude] = typeof data?.loc === "string" ? data.loc.split(",") : [];
  return providerSource("ipinfo", data, {
    country: geo?.country || data?.country,
    countryCode: geo?.country_code || data?.country_code || data?.country,
    region: geo?.region || geo?.region_code || data?.region,
    city: geo?.city || data?.city,
    timezone: geo?.timezone || data?.timezone,
    postalCode: geo?.postal_code || data?.postal,
    organization: data?.as?.name || data?.asn_name || data?.org,
    latitude: geo?.latitude ?? latitude,
    longitude: geo?.longitude ?? longitude,
  });
}

async function fetchIpinfoLite(ip, token, fetchImpl) {
  const url = "https://api.ipinfo.io/lite/" + encodeURIComponent(ip);
  const data = await fetchJson(url, {
    headers: { Authorization: "Bearer " + token },
  }, fetchImpl);
  if (!sameLookupAddress(ip, data?.ip) || !/^[A-Z]{2}$/.test(data.country_code)) return null;

  return providerSource("ipinfo-lite", data, {
    country: data.country,
    countryCode: data.country_code,
    organization: data.as_name,
  });
}

async function fetchIpapiCo(ip, token, fetchImpl) {
  const url = "https://ipapi.co/" + encodeURIComponent(ip) + "/json/?key=" + encodeURIComponent(token);
  const data = await fetchJson(url, {}, fetchImpl);
  return providerSource("ipapi.co", data, {
    country: data?.country_name || data?.country_code,
    countryCode: data?.country_code,
    region: data?.region,
    city: data?.city,
    timezone: data?.timezone,
    postalCode: data?.postal,
    organization: data?.org,
    latitude: data?.latitude,
    longitude: data?.longitude,
  });
}

async function fetchIpapiIs(ip, token, fetchImpl) {
  const body = { q: ip };
  if (token) body.key = token;
  const data = await fetchJson("https://api.ipapi.is/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }, fetchImpl);
  // IPapi.is echoes the lookup address. Accept equivalent IPv6 spellings.
  if (!sameLookupAddress(ip, data?.ip)) return null;
  const location = data?.location || {};
  const company = data?.company;
  const companyEntry = Array.isArray(company) ? company[0] : company;
  const organization = typeof company === "string"
    ? company
    : companyEntry?.name || data?.asn?.org || data?.asn;
  return providerSource("ipapi.is", data, {
    country: location.country || data?.country,
    countryCode: location.country_code || data?.country_code,
    region: location.state || data?.region,
    city: location.city || data?.city,
    timezone: location.timezone || data?.timezone,
    postalCode: location.zip || data?.postal,
    organization,
    latitude: location.latitude ?? data?.lat,
    longitude: location.longitude ?? data?.lon,
  });
}

function unavailableLocation(providerTotal = 0) {
  return {
    country: "Unavailable",
    region: "Unavailable",
    city: "Unavailable",
    certainty: "Unavailable; no IP location provider returned usable data.",
    providerCount: 0,
    providerTotal,
    providerNames: [],
  };
}

export async function resolveVisitorLocation(request, {
  trackingEligible = false,
  consentAccepted = false,
  env = process.env,
  fetchImpl = fetch,
  getIp = ipAddress,
  getVercelLocation = geolocation,
} = {}) {
  if (!trackingEligible || (requiresExplicitVisitorConsent(request.headers) && consentAccepted !== true)) {
    return {
      ...unavailableLocation(),
      certainty: "Not processed because visitor location eligibility or consent was not established.",
    };
  }

  const sources = [];
  let providerTotal = 1;
  try {
    const value = getVercelLocation(request);
    const source = providerSource("vercel", value, {
      country: value?.countryName || value?.country,
      countryCode: value?.countryCode || value?.country,
      // `geolocation().region` is the Vercel execution region from x-vercel-id,
      // not the visitor's state/region. Use only countryRegion for visitor geography.
      region: value?.countryRegion,
      city: value?.city,
      timezone: request.headers.get("x-vercel-ip-timezone"),
      postalCode: value?.postalCode || request.headers.get("x-vercel-ip-postal-code"),
      latitude: value?.latitude,
      longitude: value?.longitude,
    });
    if (source) sources.push(source);
  } catch {
    // Vercel location headers may be unavailable in local or preview requests.
  }

  let ip = "";
  try {
    // @vercel/functions reads Vercel's trusted client-IP context; never use request headers here.
    ip = normalizePublicVisitorIp(getIp(request) || "");
  } catch {
    // Without Vercel's trusted visitor IP, skip third-party lookups and retain Vercel data.
  }

  const lookups = [];
  if (ip && env.IPINFO_TOKEN) lookups.push(fetchIpinfo(ip, env.IPINFO_TOKEN, fetchImpl));
  else if (ip && env.IPINFO_LITE_TOKEN) lookups.push(fetchIpinfoLite(ip, env.IPINFO_LITE_TOKEN, fetchImpl));
  if (ip && env.IPAPI_TOKEN) lookups.push(fetchIpapiCo(ip, env.IPAPI_TOKEN, fetchImpl));
  if (ip) lookups.push(fetchIpapiIs(ip, env.IPAPI_IS_TOKEN, fetchImpl));
  providerTotal += lookups.length;
  if (!ip) return sources.length ? locationFromProviderSources(sources, { providerTotal }) : unavailableLocation(providerTotal);

  const results = await Promise.all(lookups);
  sources.push(...results.filter(Boolean));
  if (sources.some((source) => source.crawlerDetected)) return { crawlerDetected: true };
  return sources.length
    ? locationFromProviderSources(sources, { providerTotal })
    : unavailableLocation(providerTotal);
}
