const unsafeText = /[\u0000-\u001f\u007f]/g;
const consentFirstCountries = new Set([
  "AT", "BE", "BG", "CY", "CZ", "DE", "DK", "EE", "ES", "FI", "FR", "GB", "GR", "HR", "HU", "IE", "IS", "IT",
  "LI", "LT", "LU", "LV", "MT", "NL", "NO", "PL", "PT", "RO", "SE", "SI", "SK",
]);

export function requiresExplicitVisitorConsent(headers, date = new Date()) {
  const country = cleanLocationPart(headers.get("x-vercel-ip-country")).toUpperCase();
  if (!country) return true;
  if (consentFirstCountries.has(country)) return true;
  // India’s DPDP Act core processing provisions are scheduled to commence 18 months after 13 Nov 2025.
  return country === "IN" && date >= new Date("2027-05-13T00:00:00+05:30");
}

export function cleanLocationPart(value) {
  if (typeof value !== "string") return "";
  let decoded = value;
  try { decoded = decodeURIComponent(value); } catch { /* keep the provider value as supplied */ }
  return decoded.replace(unsafeText, " ").replace(/\s+/g, " ").trim().slice(0, 80);
}

export function normalizeVisitedPage(value) {
  if (typeof value !== "string" || !value.startsWith("/")) return "/";
  try {
    const pathname = new URL(value, "https://portfolio.invalid").pathname;
    return ["/", "/resume", "/privacy"].includes(pathname) ? pathname : "/other";
  } catch {
    return "/";
  }
}

export function normalizeReferral(value, siteOrigin) {
  if (typeof value !== "string" || !value) return "Direct / unavailable";
  try {
    const referrer = new URL(value);
    const currentSite = siteOrigin ? new URL(siteOrigin) : null;
    if (currentSite && referrer.origin === currentSite.origin) return "Internal navigation";
    const hostname = referrer.hostname.toLowerCase().replace(/^www\./, "");
    return hostname && hostname !== "portfolio.invalid" ? hostname.slice(0, 100) : "Internal navigation";
  } catch {
    return "Unavailable";
  }
}

export function istDayKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const part = (type) => parts.find((item) => item.type === type)?.value || "00";
  return part("year") + part("month") + part("day");
}

export function istMonthKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
  }).formatToParts(date);
  const part = (type) => parts.find((item) => item.type === type)?.value || "00";
  return part("year") + part("month");
}

export function formatIstDateTime(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).formatToParts(date);
  const get = (type) => parts.find((part) => part.type === type)?.value || "";
  return {
    date: [get("month"), get("day") + ",", get("year")].filter(Boolean).join(" "),
    time: [get("hour"), get("minute"), get("dayPeriod").toUpperCase()].filter(Boolean).join(":").replace(":AM", " AM").replace(":PM", " PM"),
  };
}

export function istHourBucket(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    hour12: true,
  }).formatToParts(date);
  const hour = parts.find((part) => part.type === "hour")?.value || "Unavailable";
  const period = parts.find((part) => part.type === "dayPeriod")?.value?.toUpperCase() || "";
  return period ? hour + " " + period + " IST" : "Unavailable";
}

function roundCoordinate(value, minimum, maximum) {
  if (typeof value !== "number" || !Number.isFinite(value) || value < minimum || value > maximum) return null;
  return Math.round(value * 100) / 100;
}

function roundedCoordinate(headers, name, minimum, maximum) {
  const raw = headers.get(name);
  if (typeof raw !== "string" || !raw.trim()) return null;
  const value = Number(raw);
  return roundCoordinate(value, minimum, maximum);
}

export function normalizeCoordinates(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  const latitudeValue = typeof value.latitude === "string" && value.latitude.trim() ? Number(value.latitude) : value.latitude;
  const longitudeValue = typeof value.longitude === "string" && value.longitude.trim() ? Number(value.longitude) : value.longitude;
  const latitude = roundCoordinate(latitudeValue, -90, 90);
  const longitude = roundCoordinate(longitudeValue, -180, 180);
  if (latitude === null || longitude === null) return undefined;
  return { latitude, longitude };
}

export function approximateCoordinatesFromHeaders(headers, {
  trackingEligible = false,
  consentAccepted = false,
  date = new Date(),
} = {}) {
  if (!trackingEligible || (requiresExplicitVisitorConsent(headers, date) && consentAccepted !== true)) return undefined;

  const latitude = roundedCoordinate(headers, "x-vercel-ip-latitude", -90, 90);
  const longitude = roundedCoordinate(headers, "x-vercel-ip-longitude", -180, 180);
  if (latitude === null || longitude === null) return undefined;
  return { latitude, longitude };
}

export function formatApproximateCoordinates(location) {
  const { latitude, longitude } = location?.coordinates || {};
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return "";
  const label = location.coordinateSource === "device"
    ? "Approximate coordinates (device location, rounded)"
    : "Approximate coordinates (IP-based, city-level)";
  return `${label}: ${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
}

export function locationFromHeaders(headers, options) {
  const country = cleanLocationPart(headers.get("x-vercel-ip-country"));
  const region = cleanLocationPart(headers.get("x-vercel-ip-country-region"));
  const city = cleanLocationPart(headers.get("x-vercel-ip-city"));
  const coordinates = approximateCoordinatesFromHeaders(headers, options);
  const available = Boolean(country || region || city);
  return {
    country: country || "Unavailable",
    region: region || "Unavailable",
    city: city || "Unavailable",
    ...(coordinates ? { coordinates } : {}),
    certainty: available
      ? "Approximate; network location may be uncertain, especially with a VPN, mobile carrier, or proxy."
      : "Unavailable or uncertain; Vercel did not provide usable location information.",
  };
}

function normalizedGroupValue(value) {
  return cleanLocationPart(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("en-US")
    .replace(/[^\p{L}\p{N}]/gu, "");
}

function largestGroup(groups) {
  const ranked = [...groups.values()].sort((left, right) => right.length - left.length);
  const winner = ranked[0] || [];
  const runnerUp = ranked[1] || [];
  return winner.length >= 2 && winner.length > runnerUp.length ? winner : [];
}

function sourcePriority(source) {
  return source.provider === "vercel" ? 0 : source.provider === "ipinfo" ? 1 : 2;
}

function locationFields(sources) {
  const ranked = [...sources].sort((left, right) => sourcePriority(left) - sourcePriority(right));
  const first = (key) => ranked.find((source) => source[key])?.[key];
  const citySource = ranked.find((source) => source.city) || ranked[0];
  const coordinates = normalizeCoordinates(citySource?.coordinates) || ranked.map((source) => normalizeCoordinates(source.coordinates)).find(Boolean);
  return {
    country: first("country") || "Unavailable",
    region: first("region") || "Unavailable",
    city: first("city") || "Unavailable",
    ...(coordinates ? { coordinates } : {}),
  };
}

export function locationFromProviderSources(sources) {
  const usable = Array.isArray(sources)
    ? sources.filter((source) => source && (
      normalizedGroupValue(source.country) || normalizedGroupValue(source.region) || normalizedGroupValue(source.city) ||
      normalizeCoordinates(source.coordinates)
    ))
    : [];
  if (usable.length === 0) {
    return {
      country: "Unavailable",
      region: "Unavailable",
      city: "Unavailable",
      certainty: "Unavailable; no IP location providers returned usable data.",
      providerCount: 0,
    };
  }

  const cityGroups = new Map();
  for (const source of usable) {
    const country = normalizedGroupValue(source.country);
    const city = normalizedGroupValue(source.city);
    if (!country || !city) continue;
    const key = country + ":" + city;
    const group = cityGroups.get(key) || [];
    group.push(source);
    cityGroups.set(key, group);
  }

  const cityWinner = largestGroup(cityGroups);
  if (cityWinner.length >= 2) {
    const agreed = locationFields(cityWinner);
    const conflicted = cityWinner.length < usable.length;
    return {
      ...agreed,
      certainty: conflicted
        ? `Uncertain; ${cityWinner.length} of ${usable.length} location sources agree on city. Using the majority result; other source(s) conflict. A VPN, mobile carrier, or proxy may make it inaccurate.`
        : `Approximate; ${cityWinner.length} of ${usable.length} location sources agree on city. A VPN, mobile carrier, or proxy may make it inaccurate.`,
      providerCount: usable.length,
    };
  }

  const fallback = locationFields(usable);
  if (usable.length === 1) {
    return {
      ...fallback,
      certainty: `Low confidence; only ${usable[0].provider || "one location source"} returned usable data. This is an approximate network location and may be inaccurate.`,
      providerCount: 1,
    };
  }

  const preferredSource = [...usable].sort((left, right) => sourcePriority(left) - sourcePriority(right))[0];
  return {
    ...fallback,
    certainty: `Uncertain; location sources conflict or do not share a city. Fallback: prefer Vercel data, then IPinfo, then IPapi.co, filling missing fields from the next available source. Selected source: ${preferredSource.provider || "unknown"}.`,
    providerCount: usable.length,
  };
}

export function makeVisitorEmail({ location, page, pageUrl, deviceBrowser, source, date = new Date(), count = 1, title = "New Portfolio Visitor" }) {
  const { date: istDate, time: istTime } = formatIstDateTime(date);
  const countLine = count > 1 ? "Eligible visits recorded: " + count : "A visitor opened your portfolio.";
  const coordinates = formatApproximateCoordinates(location);
  return {
    subject: title,
    message: [
      countLine,
      "",
      "Country: " + location.country,
      "Region: " + location.region,
      "City: " + location.city,
      ...(coordinates ? [coordinates] : []),
      "Visited: " + istDate,
      "Time: " + istTime + " IST",
      "Page URL: " + (pageUrl || page),
      "Device/browser: " + (deviceBrowser || "Unavailable"),
      "Source: " + source,
      ...(Number.isInteger(location.providerCount) ? [`Location providers: ${location.providerCount} of 3 responded`] : []),
      "Location certainty: " + location.certainty,
      "",
      "IP-based location is approximate and may be uncertain. When configured, the site shares the visitor IP with Vercel, IPinfo, and IPapi.co to estimate location. If sources conflict, Vercel is preferred, then IPinfo, then IPapi.co; the email marks the result uncertain. A single available source is reported as low confidence. Device coordinates are used only when browser location permission was already granted and are rounded before transmission. No raw IP addresses or unrounded device coordinates are stored by this site.",
    ].join("\n"),
  };
}

