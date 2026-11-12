const unsafeText = /[\u0000-\u001f\u007f]/g;

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

export function locationFromHeaders(headers) {
  const country = cleanLocationPart(headers.get("x-vercel-ip-country"));
  const region = cleanLocationPart(headers.get("x-vercel-ip-country-region"));
  const city = cleanLocationPart(headers.get("x-vercel-ip-city"));
  const available = Boolean(country || region || city);
  return {
    country: country || "Unavailable",
    region: region || "Unavailable",
    city: city || "Unavailable",
    certainty: available
      ? "Approximate; network location may be uncertain, especially with a VPN, mobile carrier, or proxy."
      : "Unavailable or uncertain; Vercel did not provide usable location information.",
  };
}

export function makeVisitorEmail({ location, page, source, date = new Date(), count = 1, title = "New Portfolio Visitor" }) {
  const { date: istDate, time: istTime } = formatIstDateTime(date);
  const countLine = count > 1 ? "Eligible visits recorded: " + count : "A visitor opened your portfolio.";
  return {
    subject: title,
    message: [
      countLine,
      "",
      "Country: " + location.country,
      "Region: " + location.region,
      "City: " + location.city,
      "Visited: " + istDate,
      "Time: " + istTime + " IST",
      "Page: " + page,
      "Source: " + source,
      "Location certainty: " + location.certainty,
      "",
      "Location is approximate and derived from network information. No precise location or visitor contact details were collected.",
    ].join("\n"),
  };
}

