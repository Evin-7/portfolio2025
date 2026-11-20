import { geolocation, ipAddress } from "@vercel/functions";
import {
  cleanLocationPart,
  locationFromProviderSources,
  normalizeCoordinates,
  requiresExplicitVisitorConsent,
} from "./visitorNotifications.mjs";

const PROVIDER_TIMEOUT_MS = 2500;

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
    district: cleanProviderValue(fields.district),
    postalCode: cleanProviderValue(fields.postalCode),
    organization: cleanProviderValue(fields.organization),
  };
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
  const [latitude, longitude] = typeof data?.loc === "string" ? data.loc.split(",") : [];
  return providerSource("ipinfo", data, {
    country: data?.country,
    countryCode: data?.country,
    region: data?.region,
    city: data?.city,
    district: data?.district,
    postalCode: data?.postal,
    organization: data?.org,
    latitude,
    longitude,
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
    district: data?.district,
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
  const location = data?.location || {};
  const company = data?.company;
  const organization = typeof company === "string"
    ? company
    : company?.name || data?.asn?.org || data?.asn;
  return providerSource("ipapi.is", data, {
    country: location.country || data?.country,
    countryCode: location.country_code || data?.country_code,
    region: location.state || data?.region,
    city: location.city || data?.city,
    district: location.district || data?.district,
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
      region: value?.countryRegion || value?.region,
      city: value?.city,
      district: value?.district,
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
    ip = getIp(request) || "";
  } catch {
    // Without Vercel's trusted visitor IP, skip third-party lookups and retain Vercel data.
  }

  const lookups = [];
  if (ip && env.IPINFO_TOKEN) lookups.push(fetchIpinfo(ip, env.IPINFO_TOKEN, fetchImpl));
  if (ip && env.IPAPI_TOKEN) lookups.push(fetchIpapiCo(ip, env.IPAPI_TOKEN, fetchImpl));
  if (ip) lookups.push(fetchIpapiIs(ip, env.IPAPI_IS_TOKEN, fetchImpl));
  providerTotal += lookups.length;
  if (!ip) return sources.length ? locationFromProviderSources(sources, { providerTotal }) : unavailableLocation(providerTotal);

  const results = await Promise.all(lookups);
  sources.push(...results.filter(Boolean));
  return sources.length
    ? locationFromProviderSources(sources, { providerTotal })
    : unavailableLocation(providerTotal);
}
