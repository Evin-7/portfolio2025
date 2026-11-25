import { locationCountryCode, normalizeDeviceCoordinates } from "./visitorNotifications.mjs";

const countryNames = new Intl.DisplayNames(["en"], { type: "region" });

export function normalizeVisitorBrowserSignals(payload) {
  const signals = {};
  if (typeof payload.browserTimezone === "string" && /^[A-Za-z0-9_+/-]{1,64}$/.test(payload.browserTimezone)) {
    try {
      signals.timezone = new Intl.DateTimeFormat("en", { timeZone: payload.browserTimezone }).resolvedOptions().timeZone;
    } catch {
      // Unsupported time zones provide no evidence.
    }
  }
  if (typeof payload.browserLanguage === "string" && /^[A-Za-z0-9-]{1,48}$/.test(payload.browserLanguage)) {
    try {
      const { language, script, region } = new Intl.Locale(payload.browserLanguage);
      signals.language = [language, script, region].filter(Boolean).join("-");
      if (region) signals.languageRegion = region;
    } catch {
      // Malformed language tags provide no evidence.
    }
  }
  if (payload.webdriver === true) signals.webdriver = true;
  return signals;
}

export function timeZoneOffsetMinutes(timeZone, date) {
  if (!timeZone) return undefined;
  try {
    const offset = new Intl.DateTimeFormat("en-US", {
      timeZone,
      timeZoneName: "longOffset",
    }).formatToParts(date).find(({ type }) => type === "timeZoneName")?.value;
    if (offset === "GMT") return 0;
    const match = /^GMT([+-])(\d{2}):(\d{2})$/.exec(offset);
    if (match) return (match[1] === "-" ? -1 : 1) * (Number(match[2]) * 60 + Number(match[3]));
  } catch {
    // Ignore missing or invalid location metadata.
  }
}

function estimate(countryCode, score, reason) {
  return {
    country: countryCode ? countryNames.of(countryCode) : "Unknown",
    ...(countryCode ? { countryCode } : {}),
    confidence: score >= 85 ? "High" : score >= 60 ? "Medium" : score > 0 ? "Low" : "Unknown",
    score,
    reason,
  };
}

export function estimateVisitorCountry({ location, browser = {}, deviceCoordinates, devicePlace, date = new Date() }) {
  const deviceCode = locationCountryCode({ countryCode: devicePlace?.countryCode });
  const accuracy = normalizeDeviceCoordinates(deviceCoordinates)?.accuracyMeters;
  if (deviceCode && Number.isFinite(accuracy) && accuracy <= 50_000 && !browser.webdriver) {
    return estimate(deviceCode, accuracy <= 5_000 ? 90 : 65,
      "Based on the country returned by reverse geocoding browser coordinates supplied after location permission. The browser fix and map boundary remain estimates.");
  }

  const networkCode = locationCountryCode(location);
  const agreement = location.fieldConfidence?.country;
  if (browser.webdriver) return estimate("", 0, "The browser reported WebDriver automation. The network country does not establish a visitor’s location.");
  if (location.networkIndicators?.length || location.browserOffsetMismatch) {
    return estimate("", 0, "Network-exit indicators or a substantial time-zone mismatch make the IP country unreliable. Browser settings alone cannot establish a country.");
  }
  if (agreement === "conflicting" || agreement === "majority") {
    return estimate("", 0, "IP providers disagree on country and no usable browser-derived country resolved the conflict.");
  }
  if (!networkCode) return estimate("", 0, "No usable country from device location or the request network.");

  const browserOffset = timeZoneOffsetMinutes(browser.timezone, date);
  const networkOffset = timeZoneOffsetMinutes(location.timezone, date);
  const compatible = browserOffset !== undefined && networkOffset !== undefined && browserOffset === networkOffset;
  const localeSupports = browser.languageRegion === networkCode;
  if (agreement === "agree" && compatible) {
    return estimate(networkCode, localeSupports ? 70 : 65, localeSupports
      ? "IP providers agree and the browser time zone and locale are compatible. These settings provide limited corroboration."
      : "IP providers agree and the browser time zone is compatible. Several countries can share that time zone.");
  }
  return estimate(networkCode, agreement === "agree" ? 45 : 30, agreement === "agree"
    ? "IP providers agree on the network country, with limited browser corroboration."
    : "The country relies on a single IP estimate.");
}
