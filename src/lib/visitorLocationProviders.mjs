import { geolocation, ipAddress } from "@vercel/functions";
import {
  cleanLocationPart,
  locationFromProviderSources,
  normalizeCoordinates,
  requiresExplicitVisitorConsent,
} from "./visitorNotifications.mjs";

function providerSource(provider, data, country, region, city, latitude, longitude) {
  if (!data || data.error || data.bogon) return null;
  const source = {
    provider,
    country: cleanLocationPart(country),
    region: cleanLocationPart(region),
    city: cleanLocationPart(city),
  };
  const coordinates = normalizeCoordinates({ latitude, longitude });
  if (coordinates) source.coordinates = coordinates;
  return source.country || source.region || source.city || coordinates ? source : null;
}

async function fetchJson(url, options, fetchImpl) {
  try {
    const response = await fetchImpl(url, {
      ...options,
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
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
  return providerSource("ipinfo", data, data?.country, data?.region, data?.city, latitude, longitude);
}

async function fetchIpapi(ip, token, fetchImpl) {
  const url = "https://ipapi.co/" + encodeURIComponent(ip) + "/json/?key=" + encodeURIComponent(token);
  const data = await fetchJson(url, {}, fetchImpl);
  return providerSource(
    "ipapi.co", data, data?.country_code, data?.region, data?.city, data?.latitude, data?.longitude,
  );
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
      country: "Unavailable",
      region: "Unavailable",
      city: "Unavailable",
      certainty: "Not processed because visitor location eligibility or consent was not established.",
      providerCount: 0,
    };
  }

  const sources = [];
  try {
    const value = getVercelLocation(request);
    const source = providerSource(
      "vercel",
      value,
      value?.country,
      value?.countryRegion,
      value?.city,
      value?.latitude,
      value?.longitude,
    );
    if (source) sources.push(source);
  } catch {
    // Vercel location headers may be unavailable in local or preview requests.
  }

  let ip = "";
  try {
    ip = getIp(request) || "";
  } catch {
    // Do not fall back to an untrusted forwarded-IP header.
  }

  const lookups = [];
  if (ip && env.IPINFO_TOKEN) lookups.push(fetchIpinfo(ip, env.IPINFO_TOKEN, fetchImpl));
  if (ip && env.IPAPI_TOKEN) lookups.push(fetchIpapi(ip, env.IPAPI_TOKEN, fetchImpl));
  const results = await Promise.all(lookups);
  sources.push(...results.filter(Boolean));

  return locationFromProviderSources(sources);
}
