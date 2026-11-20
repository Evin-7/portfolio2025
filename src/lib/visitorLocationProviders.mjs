import { isIP } from "node:net";
import { geolocation, ipAddress } from "@vercel/functions";
import {
  cleanLocationPart,
  hasLocalSubdivision,
  locationCountryCode,
  locationFromProviderSources,
  normalizeCoordinates,
  requiresExplicitVisitorConsent,
} from "./visitorNotifications.mjs";

const PROVIDER_TIMEOUT_MS = 2500;
const MAX_DIAGNOSTIC_WINDOW_MS = 24 * 60 * 60 * 1000;
const UNVERIFIED_RESPONSE_IP = Symbol("unverified response IP");

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
    ["is_anonymous", "Provider identifies an anonymizing network"],
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
      redirect: "error",
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

function lookupAddressVerified(ip, data, returnedIp = data?.ip) {
  if (!data || data.error || data.code) return null;
  return sameLookupAddress(ip, returnedIp) ? data : UNVERIFIED_RESPONSE_IP;
}

async function fetchIpinfo(ip, token, fetchImpl) {
  const url = "https://api.ipinfo.io/lookup/" + encodeURIComponent(ip);
  const data = await fetchJson(url, {
    headers: { Authorization: "Bearer " + token },
  }, fetchImpl);
  const verified = lookupAddressVerified(ip, data);
  if (!verified || verified === UNVERIFIED_RESPONSE_IP) return verified;
  const geo = data.geo;
  const [latitude, longitude] = typeof data?.loc === "string" ? data.loc.split(",") : [];
  return providerSource("ipinfo", {
    ...data,
    is_datacenter: data.is_hosting === true || data.privacy?.hosting === true || data.as?.type === "hosting",
    is_vpn: data.is_vpn === true || data.anonymous?.is_vpn === true || data.privacy?.vpn === true,
    is_proxy: data.is_proxy === true || data.anonymous?.is_proxy === true || data.anonymous?.is_res_proxy === true || data.privacy?.proxy === true,
    is_tor: data.is_tor === true || data.anonymous?.is_tor === true || data.privacy?.tor === true,
    is_relay: data.is_relay === true || data.anonymous?.is_relay === true || data.privacy?.relay === true,
  }, {
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
  const verified = lookupAddressVerified(ip, data);
  if (!verified || verified === UNVERIFIED_RESPONSE_IP) return verified;
  if (!/^[A-Z]{2}$/.test(data.country_code)) return null;

  return providerSource("ipinfo-lite", data, {
    country: data.country,
    countryCode: data.country_code,
    organization: data.as_name,
  });
}

async function fetchIpapiCo(ip, token, fetchImpl) {
  const url = "https://ipapi.co/" + encodeURIComponent(ip) + "/json/?key=" + encodeURIComponent(token);
  const data = await fetchJson(url, {}, fetchImpl);
  const verified = lookupAddressVerified(ip, data);
  if (!verified || verified === UNVERIFIED_RESPONSE_IP) return verified;
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
  const verified = lookupAddressVerified(ip, data);
  if (!verified || verified === UNVERIFIED_RESPONSE_IP) return verified;
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

async function fetchMaxMind(ip, accountId, licenseKey, fetchImpl) {
  const url = "https://geolite.info/geoip/v2.1/country/" + encodeURIComponent(ip);
  const data = await fetchJson(url, {
    headers: { Authorization: "Basic " + Buffer.from(accountId + ":" + licenseKey).toString("base64") },
  }, fetchImpl);
  const verified = lookupAddressVerified(ip, data, data?.traits?.ip_address);
  if (!verified || verified === UNVERIFIED_RESPONSE_IP) return verified;
  const code = data.country?.iso_code;
  if (!/^[A-Z]{2}$/.test(code)) return null;

  const traits = data.traits || {};
  const anonymizer = data.anonymizer || {};
  const hasFlag = (key) => traits[key] === true || anonymizer[key] === true;
  return providerSource("maxmind", {
    is_anonymous: hasFlag("is_anonymous"),
    is_datacenter: hasFlag("is_hosting_provider"),
    is_vpn: hasFlag("is_anonymous_vpn"),
    is_proxy: hasFlag("is_public_proxy") || hasFlag("is_residential_proxy"),
    is_tor: hasFlag("is_tor_exit_node"),
    is_anycast: hasFlag("is_anycast"),
  }, {
    countryCode: code,
    country: data.country.names?.en,
  });
}

function diagnosticOutcome(provider, source) {
  if (source === UNVERIFIED_RESPONSE_IP) return { provider, status: "unverified_response_ip" };
  if (!source) return { provider, status: "unavailable" };
  return {
    provider,
    status: "usable",
    countryCode: locationCountryCode(source) || null,
    networkIndicators: source.networkIndicators || [],
    crawler: source.crawlerDetected === true,
  };
}

async function normalizeUnknownSubdivisions(sources, token, fetchImpl) {
  const lookups = new Map();
  return Promise.all(sources.map(async (source) => {
    const { countryCode, region } = source;
    if (!/^[A-Z]{2}$/.test(countryCode) || hasLocalSubdivision(countryCode, region)) return source;

    const code = region.startsWith(countryCode + "-") ? region.slice(3) : region;
    if (!/^[A-Z0-9]{1,3}$/.test(code)) return source;

    const key = countryCode + "-" + code;
    if (!lookups.has(key)) {
      const url = "https://api.countrystatecity.in/v1/countries/" + countryCode + "/states/" + code;
      lookups.set(key, fetchJson(url, {
        headers: { "X-CSCAPI-KEY": token },
        redirect: "error",
      }, fetchImpl));
    }
    const data = await lookups.get(key);
    const name = cleanLocationPart(data?.name);
    if (!name || data.country_code !== countryCode || data.iso2 !== code) return source;

    return { ...source, region: name };
  }));
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
  now = Date.now(),
  logDiagnostic = (details) => console.info("Portfolio visitor geo diagnostic", details),
} = {}) {
  if (!trackingEligible || (requiresExplicitVisitorConsent(request.headers) && consentAccepted !== true)) {
    return {
      ...unavailableLocation(),
      certainty: "Not processed because visitor location eligibility or consent was not established.",
    };
  }

  const sources = [];
  const expiry = Date.parse(env.VISITOR_GEO_DIAGNOSTICS_UNTIL || "");
  const diagnosticsEnabled = expiry > now && expiry - now <= MAX_DIAGNOSTIC_WINDOW_MS;
  let ipStatus = "missing";
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
    const rawIp = getIp(request);
    ip = normalizePublicVisitorIp(rawIp);
    ipStatus = ip ? "public" : rawIp ? "invalid_or_nonpublic" : "missing";
  } catch {
    // Without Vercel's trusted visitor IP, skip third-party lookups and retain Vercel data.
  }

  const lookups = [];
  if (ip && env.IPINFO_TOKEN) lookups.push(["ipinfo", fetchIpinfo(ip, env.IPINFO_TOKEN, fetchImpl)]);
  else if (ip && env.IPINFO_LITE_TOKEN) lookups.push(["ipinfo-lite", fetchIpinfoLite(ip, env.IPINFO_LITE_TOKEN, fetchImpl)]);
  if (ip && env.IPAPI_TOKEN) lookups.push(["ipapi.co", fetchIpapiCo(ip, env.IPAPI_TOKEN, fetchImpl)]);
  if (ip) lookups.push(["ipapi.is", fetchIpapiIs(ip, env.IPAPI_IS_TOKEN, fetchImpl)]);
  if (ip && env.MAXMIND_ACCOUNT_ID && env.MAXMIND_LICENSE_KEY) {
    lookups.push(["maxmind", fetchMaxMind(ip, env.MAXMIND_ACCOUNT_ID, env.MAXMIND_LICENSE_KEY, fetchImpl)]);
  }

  const results = await Promise.all(lookups.map(([, lookup]) => lookup));
  const vercelSource = sources[0];
  sources.push(...results.filter((source) => source && source !== UNVERIFIED_RESPONSE_IP));
  const providerTotal = 1 + lookups.length;
  const crawlerDetected = sources.some((source) => source.crawlerDetected);
  const normalized = !crawlerDetected && env.COUNTRY_STATE_CITY_API_KEY
    ? await normalizeUnknownSubdivisions(sources, env.COUNTRY_STATE_CITY_API_KEY, fetchImpl)
    : sources;
  const location = normalized.length
    ? locationFromProviderSources(normalized, { providerTotal })
    : unavailableLocation(providerTotal);

  if (diagnosticsEnabled) {
    logDiagnostic({
      ipSource: "@vercel/functions ipAddress (x-real-ip)",
      ipStatus,
      ipVersion: ip ? isIP(ip) : null,
      providers: [
        diagnosticOutcome("vercel", vercelSource),
        ...results.map((source, index) => diagnosticOutcome(lookups[index][0], source)),
      ],
      fieldConfidence: location.fieldConfidence || null,
    });
  }
  return crawlerDetected ? { crawlerDetected: true } : location;
}
