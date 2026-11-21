import { cleanLocationPart, normalizeDeviceCoordinates } from "./visitorNotifications.mjs";

const DEFAULT_REVERSE_GEOCODER_URL = "https://nominatim.openstreetmap.org/reverse";
const CACHE_TTL_SECONDS = 24 * 60 * 60;
const GEOCODER_TIMEOUT_MS = 1800;

function roundedForLookup(value) {
  return Math.round(value * 10_000) / 10_000;
}

function firstAddressValue(address, fields) {
  for (const field of fields) {
    const value = cleanLocationPart(address?.[field]);
    if (value) return value;
  }
  return "";
}

export function normalizeReverseGeocodedPlace(data) {
  const address = data?.address;
  if (!address || typeof address !== "object" || Array.isArray(address)) return undefined;

  const place = {
    locality: firstAddressValue(address, ["city", "town", "village", "municipality", "hamlet", "suburb", "neighbourhood"]),
    district: firstAddressValue(address, ["state_district", "county", "district"]),
    additionalArea: firstAddressValue(address, ["county"]),
    state: firstAddressValue(address, ["state", "province", "region"]),
    country: firstAddressValue(address, ["country"]),
    countryCode: cleanLocationPart(address.country_code).toUpperCase(),
  };
  if (place.additionalArea.toLocaleLowerCase("en") === place.district.toLocaleLowerCase("en")) place.additionalArea = "";
  if (!/^[A-Z]{2}$/.test(place.countryCode)) place.countryCode = "";
  return Object.values(place).some(Boolean) ? place : undefined;
}

function makeReverseGeocoderUrl(baseUrl, latitude, longitude) {
  if (baseUrl === "off") return null;
  try {
    const url = new URL(baseUrl || DEFAULT_REVERSE_GEOCODER_URL);
    if (url.protocol !== "https:" || !url.hostname || url.username || url.password) return null;
    url.search = "";
    url.searchParams.set("format", "jsonv2");
    url.searchParams.set("lat", String(latitude));
    url.searchParams.set("lon", String(longitude));
    url.searchParams.set("zoom", "13");
    url.searchParams.set("addressdetails", "1");
    url.searchParams.set("accept-language", "en");
    return url;
  } catch {
    return null;
  }
}

export async function reverseGeocodeDeviceCoordinates(value, {
  baseUrl = process.env.VISITOR_REVERSE_GEOCODER_URL,
  cacheKey,
  getCached,
  setCached,
  claimProviderSlot,
  fetchImpl = fetch,
  referer = "https://evinleyander.vercel.app/privacy",
} = {}) {
  const coordinates = normalizeDeviceCoordinates(value);
  if (!coordinates || typeof cacheKey !== "string" || !cacheKey) return undefined;

  const latitude = roundedForLookup(coordinates.latitude);
  const longitude = roundedForLookup(coordinates.longitude);
  const url = makeReverseGeocoderUrl(baseUrl, latitude, longitude);
  if (!url) return undefined;

  try {
    const cached = await getCached?.(cacheKey);
    if (cached?.lookedUp === true) return cached.place || undefined;
  } catch {
    return undefined;
  }

  try {
    if (typeof claimProviderSlot !== "function" || !(await claimProviderSlot())) return undefined;
  } catch {
    return undefined;
  }

  let place;
  try {
    const response = await fetchImpl(url, {
      headers: {
        "User-Agent": "EvinLeyanderPortfolio/1.0 (+https://evinleyander.vercel.app/privacy)",
        Referer: referer,
      },
      redirect: "error",
      cache: "no-store",
      signal: AbortSignal.timeout(GEOCODER_TIMEOUT_MS),
    });
    if (!response.ok) return undefined;
    place = normalizeReverseGeocodedPlace(await response.json());
  } catch {
    return undefined;
  }

  try {
    await setCached?.(cacheKey, { lookedUp: true, place: place || null }, CACHE_TTL_SECONDS);
  } catch {
    // A cache outage must not delay or prevent the visitor notification.
  }
  return place;
}
