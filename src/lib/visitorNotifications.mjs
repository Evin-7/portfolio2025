import * as countryRegionData from "country-region-data";

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

export function flagLocationOffsetMismatch(location, browserOffset, date) {
  if (!location.timezone || !Number.isInteger(browserOffset) || Math.abs(browserOffset) > 14 * 60) return location;

  let offset;
  try {
    offset = new Intl.DateTimeFormat("en-US", {
      timeZone: location.timezone,
      timeZoneName: "longOffset",
    }).formatToParts(date).find(({ type }) => type === "timeZoneName")?.value;
  } catch {
    return location;
  }

  const parts = /^GMT([+-])(\d{2}):(\d{2})$/.exec(offset);
  if (!parts && offset !== "GMT") return location;
  const ipOffset = parts
    ? (parts[1] === "-" ? -1 : 1) * (Number(parts[2]) * 60 + Number(parts[3]))
    : 0;
  if (Math.abs(ipOffset - browserOffset) < 180) return location;

  const flagged = { ...location, browserOffsetMismatch: true };
  delete flagged.coordinates;
  delete flagged.postalCode;
  return flagged;
}

function countryEstimateNotice(location) {
  if (location.browserOffsetMismatch) {
    return "Visitor country: Unverified. The browser UTC offset differs substantially from the IP timezone.";
  }
  if (location.networkIndicators?.length) {
    return "Visitor country: Unverified. The IP country may represent a network exit.";
  }
  return "";
}

export function formatApproximateCoordinates(location) {
  if (isCityConflict(location) || location?.networkIndicators?.length || location?.coordinateSource === "device") return "";
  const { latitude, longitude } = location?.coordinates || {};
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return "";
  const label = "Approximate coordinates (IP-based, city-level)";
  return `${label}: ${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
}

export function formatGoogleMapsLink(location) {
  if (isCityConflict(location) || location?.networkIndicators?.length || location?.coordinateSource === "device") return "";
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

const countryIndex = new Map();
const subdivisionIndexes = new Map();

for (const [exportName, entry] of Object.entries(countryRegionData)) {
  if (!/^[A-Z]{2}$/.test(exportName) || !Array.isArray(entry) || entry[1] !== exportName || !Array.isArray(entry[2])) continue;

  const [name, code, subdivisions] = entry;
  const country = { code, name, key: normalizedGroupValue(code) };
  countryIndex.set(normalizedGroupValue(code), country);
  countryIndex.set(normalizedGroupValue(name), country);

  const subdivisionIndex = new Map();
  for (const subdivision of subdivisions) {
    if (!Array.isArray(subdivision) || typeof subdivision[0] !== "string" || typeof subdivision[1] !== "string") continue;
    const [subdivisionName, subdivisionCode] = subdivision;
    const value = { key: normalizedGroupValue(subdivisionCode), name: cleanLocationPart(subdivisionName) };
    subdivisionIndex.set(normalizedGroupValue(subdivisionName), value);
    subdivisionIndex.set(normalizedGroupValue(subdivisionCode), value);
    subdivisionIndex.set(normalizedGroupValue(code + "-" + subdivisionCode), value);
  }
  subdivisionIndexes.set(country.key, subdivisionIndex);
}

function countryIdentity(source) {
  const code = cleanLocationPart(source.countryCode).toUpperCase();
  const country = countryIndex.get(normalizedGroupValue(code)) || countryIndex.get(normalizedGroupValue(source.country));
  if (country) return country;
  const raw = cleanLocationPart(source.country);
  const key = normalizedGroupValue(raw);
  return key ? { code: "", name: raw, key: "name:" + key } : null;
}

function subdivisionIdentity(country, value) {
  const name = cleanLocationPart(value);
  const key = normalizedGroupValue(name);
  if (!key) return null;
  const subdivision = country ? subdivisionIndexes.get(country.key)?.get(key) : null;
  return subdivision || { key, name };
}

function sourcePriority(source) {
  return source.provider === "vercel" ? 0
    : source.provider === "ipinfo" ? 1
      : source.provider === "ipapi.co" ? 2
        : 3;
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

function resolveField(sources, getIdentity) {
  const groups = new Map();
  for (const source of sources) {
    const identity = getIdentity(source);
    if (!identity?.key) continue;
    const group = groups.get(identity.key) || { identity, sources: [] };
    group.sources.push(source);
    groups.set(identity.key, group);
  }

  const ranked = [...groups.values()].sort((left, right) => right.sources.length - left.sources.length);
  if (!ranked.length) return { status: "unavailable", sources: [] };
  if (ranked.length === 1) {
    const winner = ranked[0];
    return { status: winner.sources.length > 1 ? "agree" : "single", ...winner };
  }
  if (ranked[0].sources.length >= 2 && ranked[0].sources.length > ranked[1].sources.length) {
    return { status: "majority", ...ranked[0] };
  }
  return { status: "conflicting", sources: ranked.flatMap((group) => group.sources), groups: ranked };
}

function confidenceSummary(fields) {
  const { country, region, city } = fields;
  if (country === "agree" && region === "agree" && city === "conflicting") {
    return "Country and region agree; city estimates conflict.";
  }
  const describe = (field, status) => {
    const label = field;
    if (status === "agree") return `${label} agrees across providers`;
    if (status === "majority") return `${label} has a provider majority`;
    if (status === "single") return `${label} relies on one provider`;
    if (status === "conflicting") return `${label} estimates conflict`;
    return `${label} is unavailable`;
  };
  const parts = [describe("country", country), describe("region", region), describe("city", city)];
  return "Low confidence — " + parts.join("; ") + ". IP estimates do not establish physical presence.";
}

function providerEstimates(sources, field) {
  return sources
    .filter((source) => cleanLocationPart(source[field]))
    .map((source) => ({
      provider: cleanLocationPart(source.provider) || "unknown",
      value: cleanLocationPart(source[field]),
    }));
}

function consensusCoordinates(sources) {
  const valid = sources.map((source) => normalizeCoordinates(source.coordinates)).filter(Boolean);
  if (!valid.length) return undefined;
  const groups = new Map();
  for (const coordinates of valid) {
    const key = coordinates.latitude.toFixed(2) + ":" + coordinates.longitude.toFixed(2);
    groups.set(key, (groups.get(key) || 0) + 1);
  }
  if (groups.size > 1) return undefined;
  return valid[0];
}

export function locationFromProviderSources(sources, { providerTotal } = {}) {
  const observations = Array.isArray(sources) ? sources.filter(Boolean) : [];
  const usable = observations.filter((source) => (
      normalizedGroupValue(source.country) || normalizedGroupValue(source.region) || normalizedGroupValue(source.city) ||
      normalizeCoordinates(source.coordinates)
    ));
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

  const country = resolveField(usable, countryIdentity);
  const countrySources = country.status === "conflicting" ? [] : country.sources;
  let regionScope = [];
  if (country.status === "unavailable") {
    regionScope = usable;
  } else if (countrySources.length) {
    regionScope = usable.filter((source) => {
      const identity = countryIdentity(source);
      return !identity || identity.key === country.identity.key;
    });
  }
  const region = country.status === "conflicting"
    ? { status: "unavailable", sources: [] }
    : resolveField(regionScope, (source) => subdivisionIdentity(country.identity, source.region));
  const cityScope = region.status === "conflicting" || country.status === "conflicting"
    ? regionScope
    : region.sources.length ? region.sources : regionScope;
  const rawCity = resolveField(cityScope, (source) => {
    const value = cleanLocationPart(source.city);
    return value ? { key: normalizedGroupValue(value), name: value } : null;
  });
  const city = rawCity;
  const networkIndicators = collectNetworkIndicators(observations);
  const coordinates = !networkIndicators.length && city.status !== "conflicting" && region.status !== "conflicting"
    ? consensusCoordinates(city.sources)
    : undefined;
  const providerConflict = [country, region, city].some((field) => field.status === "conflicting" || field.status === "majority");
  const countryDisplay = country.status === "conflicting" ? "Uncertain" : country.identity?.name || "Unavailable";
  const regionDisplay = region.status === "conflicting" ? "Uncertain" : region.identity?.name || "Unavailable";
  const cityDisplay = city.status === "conflicting" ? "Uncertain" : city.identity?.name || "Unavailable";
  const countryCode = country.status !== "conflicting" ? country.identity?.code : "";
  const supportingSources = city.sources.length ? city.sources : region.sources.length ? region.sources : country.sources;
  const first = (key) => [...supportingSources].sort((left, right) => sourcePriority(left) - sourcePriority(right)).find((source) => source[key])?.[key];
  const cityEstimates = city.status === "conflicting" ? providerEstimates(city.sources, "city") : [];
  const matchingValue = (key) => {
    const values = new Set(supportingSources.map((source) => source[key]).filter(Boolean));
    return values.size === 1 ? [...values][0] : undefined;
  };
  const postalCode = !networkIndicators.length && city.identity && region.status !== "conflicting"
    ? matchingValue("postalCode")
    : undefined;
  const timezone = matchingValue("timezone");
  const organization = first("organization") || observations.find((source) => source.organization)?.organization;
  const fieldConfidence = { country: country.status, region: region.status, city: city.status };
  const confidence = confidenceSummary(fieldConfidence);
  const certainty = providerConflict
    ? `Uncertain; provider estimates differ for ${[
      country.status === "conflicting" || country.status === "majority" ? "country" : "",
      region.status === "conflicting" || region.status === "majority" ? "region" : "",
      city.status === "conflicting" || city.status === "majority" ? "city" : "",
    ].filter(Boolean).join(", ")}. Resolved fields remain approximate and do not confirm physical presence.` +
      (city.status === "conflicting"
        ? " Conflicting city values are unverified IP estimates; coordinates are omitted."
        : region.status === "conflicting" ? " Region disagreement prevents reporting city-level coordinates." : "")
    : usable.length === 1
      ? `Single provider — approximate location. Only ${usable[0].provider || "one location source"} returned usable data; this network estimate may be inaccurate.`
      : `Approximate IP-derived location. Country, region, and city confidence are evaluated independently; provider agreement does not verify physical presence.`;
  return {
    country: countryDisplay,
    ...(countryCode ? { countryCode } : {}),
    region: regionDisplay,
    city: cityDisplay,
    ...(cityEstimates.length ? { cityEstimates } : {}),
    ...(timezone ? { timezone } : {}),
    ...(postalCode ? { postalCode } : {}),
    ...(organization ? { organization } : {}),
    ...(coordinates ? { coordinates } : {}),
    ...(networkIndicators.length ? { networkIndicators } : {}),
    providerObservations: providerObservations(usable),
    providerConflict,
    fieldConfidence,
    confidence,
    certainty,
    providerCount: usable.length,
    providerTotal: total,
    providerNames,
  };
}

function isCityConflict(location) {
  return location?.cityStatus === "conflicting" || location?.fieldConfidence?.city === "conflicting" || location?.city === "Uncertain";
}

function formatCity(location) {
  if (isCityConflict(location)) {
    const estimates = (location.cityEstimates || [])
      .map((estimate) => `${displayProviderName(estimate.provider)}: ${estimate.value}`)
      .filter(Boolean);
    return `Uncertain${estimates.length ? " (" + estimates.join("; ") + ")" : ""}`;
  }
  return location?.city || "Unavailable";
}

function displayProviderName(provider) {
  return ({
    vercel: "Vercel",
    ipinfo: "IPinfo",
    "ipapi.co": "IPapi.co",
    "ipapi.is": "IPapi.is",
  })[provider] || provider;
}

export function makeVisitorEmail({ location, page, pageUrl, deviceBrowser, source, date = new Date(), count = 1, title = "New Portfolio Visitor" }) {
  const { date: istDate, time: istTime } = formatIstDateTime(date);
  const countLine = count > 1 ? "Eligible visits recorded: " + count : "A visitor opened your portfolio.";
  const coordinates = formatApproximateCoordinates(location);
  const providerLine = formatLocationProviderLine(location);
  const coordinatesLink = formatGoogleMapsLink(location);
  const confidence = location.confidence || (location.country !== "Unavailable"
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
      "Country (IP estimate): " + location.country,
      ...(countryEstimateNotice(location) ? [countryEstimateNotice(location)] : []),
      ...(location.countryCode ? ["Country code: " + location.countryCode] : []),
      "Region: " + location.region,
      "City: " + formatCity(location) + (location.city !== "Unavailable" && !isCityConflict(location) ? " (IP estimate)" : ""),
      ...(isCityConflict(location)
        ? ["Conflicting city values are unverified IP estimates, not a confirmed physical location."]
        : []),
      "Postal code (IP estimate): " + (networkIndicators.length ? "Unavailable" : location.postalCode || "Unavailable"),
      "Timezone (IP estimate): " + (location.timezone || "Unavailable"),
      ...(coordinates ? [coordinates] : []),
      ...(coordinatesLink ? ["Google Maps: " + coordinatesLink] : []),
      ...(location.organization ? ["Network organization / ISP: " + location.organization] : []),
      ...(networkIndicators.length ? ["Network indicator: " + networkIndicators.join("; ")] : []),
      ...(networkIndicators.length ? ["Network exit estimate: The reported place may be the network exit. The visitor’s physical location is unknown."] : []),
      "Visited: " + istDate,
      "Time: " + istTime + " IST",
      "Time (UTC): " + date.toISOString(),
      "Page URL: " + (pageUrl || page),
      "Device/browser: " + (deviceBrowser || "Unavailable"),
      "Source: " + (source || "Unavailable"),
      ...(providerLine ? [providerLine] : []),
      ...(providerResults.length ? ["Provider results: " + providerResults.join(" | ")] : []),
      "Location confidence: " + confidence,
      "Location certainty: " + location.certainty,
      "",
      "IP-based location is an approximate, low-confidence estimate; provider agreement does not establish physical presence. Eligible visits share the trusted visitor IP with Vercel and IPapi.is, and with IPinfo or IPapi.co only when their server-side tokens are configured. Country, region, and city confidence are evaluated independently; conflicting city values are shown as unverified estimates and coordinates are omitted. A possible cloud/hosting indicator comes from provider metadata and does not confirm a VPN or proxy. This feature uses IP location only. Raw IP addresses are not stored by this feature.",
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
    const formattedCity = formatCity(location);
    const city = location.city && location.city !== "Unavailable" && !isCityConflict(location)
      ? formattedCity + " (IP estimate)"
      : formattedCity;
    const place = [city, location.region, location.country].filter(Boolean).join(", ");
    lines.push(
      String(row.count) + " visit(s) | " + row.details.visitHour + " | " + place + " | " + (row.details.pageUrl || row.details.page) + " | " + (row.details.deviceBrowser || "Device/browser unavailable") + " | " + row.details.source +
        " | " + (location.certainty || "Location certainty unavailable"),
    );
    if (countryEstimateNotice(location)) lines.push(countryEstimateNotice(location));
    if (location.countryCode) lines.push("Country code: " + location.countryCode);
    if (location.postalCode && !location.networkIndicators?.length) lines.push("Postal code (IP estimate): " + location.postalCode);
    if (location.timezone) lines.push("Timezone (IP estimate): " + location.timezone);
    if (location.organization) lines.push("Network organization / ISP: " + location.organization);
    if (location.networkIndicators?.length) {
      lines.push("Network indicator: " + location.networkIndicators.join("; "));
      lines.push("Network exit estimate: The reported place may be the network exit. The visitor’s physical location is unknown.");
    }
    const providerLine = formatLocationProviderLine(location);
    if (providerLine) lines.push(providerLine);
    if (location.providerObservations?.length > 1) {
      const providerResults = location.providerObservations.map((observation) => {
        const observedPlace = [observation.city, observation.region, observation.country].filter(Boolean).join(", ") || "location unavailable";
        return `${observation.provider}: ${observedPlace}`;
      });
      lines.push("Provider results: " + providerResults.join(" | "));
    }
    if (isCityConflict(location)) {
      lines.push("Conflicting city values are unverified IP estimates, not a confirmed physical location.");
    }
    if (location.confidence) lines.push("Location confidence: " + location.confidence);
    else lines.push("Location confidence: " + (location.country && location.country !== "Unavailable"
        ? "Low — approximate IP estimate; provider agreement cannot establish physical presence."
        : "Unavailable — no usable location data."));
    const coordinates = formatApproximateCoordinates(location);
    if (coordinates) lines.push(coordinates);
    const mapLink = formatGoogleMapsLink(location);
    if (mapLink) lines.push("Google Maps: " + mapLink);
  }
  if (omitted) lines.push("", "Additional grouped visits not listed: " + omitted);
  lines.push("", "IP-based location and coordinates are approximate, low-confidence estimates; provider agreement does not establish physical presence. Eligible requests use Vercel and IPapi.is; IPinfo and IPapi.co are used only when their server-side tokens are configured. IPapi.is rate limits or outages fall back to available Vercel data. Country, region, and city confidence are evaluated independently; conflicting city values are shown as unverified estimates and coordinates are omitted. A possible cloud/hosting indicator from provider data does not confirm a VPN or proxy. This feature uses IP location only. Raw IP addresses are not stored by this feature.");
  return { subject: "New Portfolio Visitor", message: lines.join("\n") };
}

