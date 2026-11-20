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

export function formatGoogleMapsLink(location) {
  const { latitude, longitude } = location?.coordinates || {};
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return "";
  return `https://www.google.com/maps?q=${latitude.toFixed(2)},${longitude.toFixed(2)}`;
}

export function formatLocationProviderLine(location) {
  if (!Number.isInteger(location?.providerCount)) return "";
  const names = location.providerNames?.length ? location.providerNames.join(", ") : "none returned usable data";
  return `Location providers: ${names} (${location.providerCount} usable of ${location.providerTotal ?? location.providerCount} checked)`;
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
  return source.provider === "vercel" ? 0
    : source.provider === "ipinfo" ? 1
      : source.provider === "ipapi.co" ? 2
        : 3;
}

function locationFields(sources) {
  const ranked = [...sources].sort((left, right) => sourcePriority(left) - sourcePriority(right));
  const first = (key) => ranked.find((source) => source[key])?.[key];
  const citySource = ranked.find((source) => source.city) || ranked[0];
  const coordinates = normalizeCoordinates(citySource?.coordinates) || ranked.map((source) => normalizeCoordinates(source.coordinates)).find(Boolean);
  const networkIndicators = collectNetworkIndicators(ranked);
  return {
    country: first("country") || "Unavailable",
    ...(first("countryCode") ? { countryCode: first("countryCode") } : {}),
    region: first("region") || "Unavailable",
    city: first("city") || "Unavailable",
    ...(first("district") ? { district: first("district") } : {}),
    ...(first("postalCode") ? { postalCode: first("postalCode") } : {}),
    ...(first("organization") ? { organization: first("organization") } : {}),
    ...(coordinates ? { coordinates } : {}),
    ...(networkIndicators.length ? { networkIndicators } : {}),
    providerObservations: ranked.map((source) => ({
      provider: cleanLocationPart(source.provider) || "unknown",
      country: cleanLocationPart(source.country),
      region: cleanLocationPart(source.region),
      city: cleanLocationPart(source.city),
    })),
  };
}

function collectNetworkIndicators(sources) {
  return [...new Set(sources.flatMap((source) => source.networkIndicators || []))];
}

function providerObservations(sources) {
  return sources.map((source) => ({
    provider: cleanLocationPart(source.provider) || "unknown",
    country: cleanLocationPart(source.country),
    region: cleanLocationPart(source.region),
    city: cleanLocationPart(source.city),
  }));
}

function providersConflict(sources) {
  const countries = new Set(sources.map((source) => normalizedGroupValue(source.country)).filter(Boolean));
  const cities = new Set(sources
    .filter((source) => source.country && source.city)
    .map((source) => normalizedGroupValue(source.country) + ":" + normalizedGroupValue(source.city)));
  const regions = new Map();
  for (const source of sources) {
    const country = normalizedGroupValue(source.country);
    if (!country || !source.region) continue;
    const values = regions.get(country) || [];
    values.push(source.region);
    regions.set(country, values);
  }
  const regionConflict = [...regions.values()].some((values) => {
    const fullNames = new Set(values.filter((value) => !/^[A-Z]{2}$/.test(value)).map(normalizedGroupValue));
    const codes = new Set(values.filter((value) => /^[A-Z]{2}$/.test(value)).map(normalizedGroupValue));
    return fullNames.size > 1 || codes.size > 1;
  });
  return countries.size > 1 || cities.size > 1 || regionConflict;
}

function uncertainCountryOnly(sources) {
  const groups = new Map();
  for (const source of sources) {
    const country = normalizedGroupValue(source.country);
    if (!country) continue;
    const group = groups.get(country) || [];
    group.push(source);
    groups.set(country, group);
  }
  return largestGroup(groups);
}

export function locationFromProviderSources(sources, { providerTotal } = {}) {
  const usable = Array.isArray(sources)
    ? sources.filter((source) => source && (
      normalizedGroupValue(source.country) || normalizedGroupValue(source.region) || normalizedGroupValue(source.city) ||
      normalizeCoordinates(source.coordinates)
    ))
    : [];
  const total = Number.isInteger(providerTotal) && providerTotal >= usable.length ? providerTotal : usable.length;
  const providerNames = usable.map((source) => source.provider || "unknown");
  if (usable.length === 0) {
    return {
      country: "Unavailable",
      region: "Unavailable",
      city: "Unavailable",
      certainty: "Unavailable; no IP location provider returned usable data.",
      providerCount: 0,
      providerTotal: total,
      providerNames,
      confidence: "Unavailable",
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
    const conflicted = providersConflict(usable);
    return {
      ...agreed,
      ...(collectNetworkIndicators(usable).length ? { networkIndicators: collectNetworkIndicators(usable) } : {}),
      providerObservations: providerObservations(usable),
      providerConflict: conflicted,
      confidence: "Low — approximate IP estimate; provider agreement cannot establish physical presence.",
      certainty: conflicted
        ? `Uncertain; ${cityWinner.length} of ${usable.length} location sources report the selected city, while other provider results differ. IP geolocation cannot establish physical presence.`
        : `Approximate IP-derived location; ${cityWinner.length} of ${usable.length} location sources report the same city. Provider agreement does not verify physical presence.`,
      providerCount: usable.length,
      providerTotal: total,
      providerNames,
    };
  }

  const fallback = locationFields(usable);
  if (usable.length === 1) {
    return {
      ...fallback,
      confidence: "Low — single-provider IP estimate; physical presence is unverified.",
      certainty: `Single provider — approximate location. Only ${usable[0].provider || "one location source"} returned usable data; this network estimate may be inaccurate.`,
      providerCount: 1,
      providerTotal: total,
      providerNames,
    };
  }

  const countryWinner = uncertainCountryOnly(usable);
  if (countryWinner.length >= 2) {
    const agreedCountry = locationFields(countryWinner);
    return {
      country: agreedCountry.country,
      ...(agreedCountry.countryCode ? { countryCode: agreedCountry.countryCode } : {}),
      region: "Unavailable",
      city: "Unavailable",
      ...(agreedCountry.organization ? { organization: agreedCountry.organization } : {}),
      ...(collectNetworkIndicators(usable).length ? { networkIndicators: collectNetworkIndicators(usable) } : {}),
      providerObservations: providerObservations(usable),
      providerConflict: true,
      confidence: "Low — country agreement only; city and region omitted because provider results conflict.",
      certainty: `Uncertain; providers agree on country but disagree on city or region. Only country is reported; ${usable.length - countryWinner.length} provider result(s) differ.`,
      providerCount: usable.length,
      providerTotal: total,
      providerNames,
    };
  }

  const preferredSource = [...usable].sort((left, right) => sourcePriority(left) - sourcePriority(right))[0];
  return {
    ...fallback,
    providerObservations: providerObservations(usable),
    providerConflict: true,
    confidence: "Low — conflicting IP estimates; selected Vercel-first fallback is not verified.",
    certainty: `Uncertain; location sources conflict or do not share a city. Fallback: prefer Vercel data, then IPinfo, then IPapi.co, then IPapi.is, filling missing fields from the next available source. Selected source: ${preferredSource.provider || "unknown"}.`,
    providerCount: usable.length,
    providerTotal: total,
    providerNames,
  };
}

export function makeVisitorEmail({ location, page, pageUrl, deviceBrowser, source, date = new Date(), count = 1, title = "New Portfolio Visitor" }) {
  const { date: istDate, time: istTime } = formatIstDateTime(date);
  const countLine = count > 1 ? "Eligible visits recorded: " + count : "A visitor opened your portfolio.";
  const coordinates = formatApproximateCoordinates(location);
  const providerLine = formatLocationProviderLine(location);
  const coordinatesLink = formatGoogleMapsLink(location);
  const confidence = location.confidence || (location.coordinateSource === "device"
    ? "Previously granted device location; rounded before transmission."
    : location.country !== "Unavailable"
      ? "Low — approximate IP estimate; provider agreement cannot establish physical presence."
      : "Unavailable — no usable location data.");
  const providerResults = location.providerObservations?.length > 1
    ? location.providerObservations.map((observation) => {
      const place = [observation.city, observation.region, observation.country].filter(Boolean).join(", ") || "location unavailable";
      return `${observation.provider}: ${place}`;
    })
    : [];
  const networkIndicators = location.networkIndicators || [];
  return {
    subject: title,
    message: [
      countLine,
      "",
      "Country: " + location.country,
      ...(location.countryCode ? ["Country code: " + location.countryCode] : []),
      "Region: " + location.region,
      "City: " + location.city + (location.city !== "Unavailable" ? " (IP estimate)" : ""),
      ...(location.district ? ["District: " + location.district] : []),
      ...(location.postalCode ? ["Postal code: " + location.postalCode] : []),
      ...(coordinates ? [coordinates] : []),
      ...(coordinatesLink ? ["Google Maps: " + coordinatesLink] : []),
      ...(location.organization ? ["Network organization / ISP: " + location.organization] : []),
      ...(networkIndicators.length ? ["Network indicator: " + networkIndicators.join("; ")] : []),
      "Visited: " + istDate,
      "Time: " + istTime + " IST",
      "Page URL: " + (pageUrl || page),
      "Device/browser: " + (deviceBrowser || "Unavailable"),
      "Source: " + source,
      ...(providerLine ? [providerLine] : []),
      ...(providerResults.length ? ["Provider results: " + providerResults.join(" | ")] : []),
      "Location confidence: " + confidence,
      "Location certainty: " + location.certainty,
      "",
      "IP-based location is approximate and may be uncertain. For eligible visits, the site shares the trusted visitor IP with Vercel and IPapi.is, and with IPinfo or IPapi.co only when their server-side tokens are configured. If providers conflict, the email marks the result uncertain and prefers Vercel, then IPinfo, IPapi.co, and IPapi.is, filling missing fields from other sources. A single result is reported as a single-provider estimate. Device coordinates are used only when browser location permission was already granted and are rounded before transmission. No raw IP addresses or unrounded device coordinates are stored by this site.",
    ].join("\n"),
  };
}

export function makeVisitorDailySummaryEmail(rows, day, date = new Date()) {
  const sorted = [...rows].sort((a, b) => b.count - a.count);
  const visible = sorted.slice(0, 60);
  const omitted = sorted.slice(60).reduce((sum, row) => sum + row.count, 0);
  const total = rows.reduce((sum, row) => sum + row.count, 0);
  const summaryTime = formatIstDateTime(date);
  const lines = [
    "Daily portfolio visitor summary",
    "Date covered: " + day.slice(0, 4) + "-" + day.slice(4, 6) + "-" + day.slice(6, 8) + " (IST)",
    "Summary sent: " + summaryTime.date + " at " + summaryTime.time + " IST",
    "Visit times below are grouped by hour; individual timestamps are not retained.",
    "Eligible visits recorded: " + total,
    "",
  ];
  for (const row of visible) {
    const location = row.details.location || {};
    const city = location.city && location.city !== "Unavailable" ? location.city + " (IP estimate)" : location.city || "Unavailable";
    const place = [city, location.region, location.country].filter(Boolean).join(", ");
    lines.push(
      String(row.count) + " visit(s) | " + row.details.visitHour + " | " + place + " | " + (row.details.pageUrl || row.details.page) + " | " + (row.details.deviceBrowser || "Device/browser unavailable") + " | " + row.details.source +
        " | " + (location.certainty || "Location certainty unavailable"),
    );
    if (location.countryCode) lines.push("Country code: " + location.countryCode);
    if (location.district) lines.push("District: " + location.district);
    if (location.postalCode) lines.push("Postal code: " + location.postalCode);
    if (location.organization) lines.push("Network organization / ISP: " + location.organization);
    if (location.networkIndicators?.length) lines.push("Network indicator: " + location.networkIndicators.join("; "));
    const providerLine = formatLocationProviderLine(location);
    if (providerLine) lines.push(providerLine);
    if (location.providerObservations?.length > 1) {
      const providerResults = location.providerObservations.map((observation) => {
        const observedPlace = [observation.city, observation.region, observation.country].filter(Boolean).join(", ") || "location unavailable";
        return `${observation.provider}: ${observedPlace}`;
      });
      lines.push("Provider results: " + providerResults.join(" | "));
    }
    if (location.confidence) lines.push("Location confidence: " + location.confidence);
    else lines.push("Location confidence: " + (location.coordinateSource === "device"
      ? "Previously granted device location; rounded before transmission."
      : location.country && location.country !== "Unavailable"
        ? "Low — approximate IP estimate; provider agreement cannot establish physical presence."
        : "Unavailable — no usable location data."));
    const coordinates = formatApproximateCoordinates(location);
    if (coordinates) lines.push(coordinates);
    const mapLink = formatGoogleMapsLink(location);
    if (mapLink) lines.push("Google Maps: " + mapLink);
  }
  if (omitted) lines.push("", "Additional grouped visits not listed: " + omitted);
  lines.push("", "IP-based coordinates are approximate city-level estimates. Eligible requests use Vercel and IPapi.is; IPinfo and IPapi.co are used only when their server-side tokens are configured. IPapi.is rate limits or outages fall back to available Vercel data. Provider results may disagree. Device coordinates are only read when browser location permission was already granted and are rounded before transmission. No raw IP addresses or unrounded device coordinates were stored by this site.");
  return { subject: "New Portfolio Visitor", message: lines.join("\n") };
}

