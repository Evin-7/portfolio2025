import test from "node:test";
import assert from "node:assert/strict";
import {
  formatApproximateCoordinates,
  formatIstDateTime,
  istDayKey,
  istHourBucket,
  istMonthKey,
  locationFromHeaders,
  locationFromProviderSources,
  makeVisitorDailySummaryEmail,
  makeVisitorEmail,
  normalizeReferral,
  normalizeVisitedPage,
  requiresExplicitVisitorConsent,
} from "../src/lib/visitorNotifications.mjs";

test("formats visit dates in India Standard Time", () => {
  const date = new Date("2026-11-12T13:00:00.000Z");
  assert.equal(istDayKey(date), "20261112");
  assert.equal(istMonthKey(date), "202611");
  assert.deepEqual(formatIstDateTime(date), { date: "November 12, 2026", time: "6:30 PM" });
  assert.equal(istHourBucket(date), "6 PM IST");
});

test("keeps only the visited path, without query strings or fragments", () => {
  assert.equal(normalizeVisitedPage("/resume?email=private#contact"), "/resume");
  assert.equal(normalizeVisitedPage("/projects?email=private#contact"), "/other");
  assert.equal(normalizeVisitedPage("https://attacker.example/"), "/");
  assert.equal(normalizeVisitedPage("javascript:alert(1)"), "/");
});

test("referral records only an external hostname", () => {
  assert.equal(normalizeReferral("https://www.linkedin.com/feed/?tracking=private", "https://portfolio.example/page"), "linkedin.com");
  assert.equal(normalizeReferral("https://portfolio.example/projects", "https://portfolio.example/page"), "Internal navigation");
  assert.equal(normalizeReferral(""), "Direct / unavailable");
});

test("marks missing or partial Vercel location as unavailable or uncertain", () => {
  const empty = locationFromHeaders(new Headers());
  assert.equal(empty.country, "Unavailable");
  assert.match(empty.certainty, /Unavailable or uncertain/);

  const partial = locationFromHeaders(new Headers({ "x-vercel-ip-country": "DE", "x-vercel-ip-city": "Berlin" }));
  assert.equal(partial.country, "DE");
  assert.equal(partial.region, "Unavailable");
  assert.match(partial.certainty, /Approximate/);
  assert.equal(locationFromHeaders(new Headers({ "x-vercel-ip-city": "New%20York" })).city, "New York");
});

test("reads valid IP-based coordinates only for an eligible visitor", () => {
  const headers = new Headers({
    "x-vercel-ip-country": "DE",
    "x-vercel-ip-city": "Berlin",
    "x-vercel-ip-latitude": "52.520008",
    "x-vercel-ip-longitude": "13.404954",
  });
  const location = locationFromHeaders(headers, { trackingEligible: true, consentAccepted: true });
  assert.deepEqual(location.coordinates, { latitude: 52.52, longitude: 13.4 });
});

test("ignores missing or partial coordinate headers", () => {
  const eligible = { trackingEligible: true };
  assert.equal(locationFromHeaders(new Headers({ "x-vercel-ip-country": "US" }), eligible).coordinates, undefined);
  assert.equal(
    locationFromHeaders(new Headers({ "x-vercel-ip-country": "US", "x-vercel-ip-latitude": "40.71" }), eligible).coordinates,
    undefined,
  );
});

test("ignores invalid or out-of-range coordinate headers", () => {
  const eligible = { trackingEligible: true };
  const invalidLatitude = new Headers({ "x-vercel-ip-country": "US", "x-vercel-ip-latitude": "91", "x-vercel-ip-longitude": "10" });
  const invalidLongitude = new Headers({ "x-vercel-ip-country": "US", "x-vercel-ip-latitude": "10", "x-vercel-ip-longitude": "181" });
  const nonNumeric = new Headers({ "x-vercel-ip-country": "US", "x-vercel-ip-latitude": "north", "x-vercel-ip-longitude": "10" });
  assert.equal(locationFromHeaders(invalidLatitude, eligible).coordinates, undefined);
  assert.equal(locationFromHeaders(invalidLongitude, eligible).coordinates, undefined);
  assert.equal(locationFromHeaders(nonNumeric, eligible).coordinates, undefined);
});

test("rounds coordinates to two decimal places", () => {
  const headers = new Headers({
    "x-vercel-ip-country": "US",
    "x-vercel-ip-latitude": "37.7749",
    "x-vercel-ip-longitude": "-122.4194",
  });
  const location = locationFromHeaders(headers, { trackingEligible: true });
  assert.deepEqual(location.coordinates, { latitude: 37.77, longitude: -122.42 });
  assert.equal(
    formatApproximateCoordinates(location),
    "Approximate coordinates (IP-based, city-level): 37.77, -122.42",
  );
});

test("does not include coordinates without tracking eligibility or required opt-in", () => {
  const headers = new Headers({
    "x-vercel-ip-country": "DE",
    "x-vercel-ip-latitude": "52.52",
    "x-vercel-ip-longitude": "13.40",
  });
  assert.equal(locationFromHeaders(headers, { trackingEligible: true }).coordinates, undefined);
  assert.equal(
    locationFromHeaders(headers, { trackingEligible: true, consentAccepted: false }).coordinates,
    undefined,
  );
  assert.equal(locationFromHeaders(headers, { trackingEligible: false, consentAccepted: true }).coordinates, undefined);
});

test("requires explicit opt-in for consent-first regions and when country is unavailable", () => {
  assert.equal(requiresExplicitVisitorConsent(new Headers({ "x-vercel-ip-country": "DE" })), true);
  assert.equal(requiresExplicitVisitorConsent(new Headers({ "x-vercel-ip-country": "GB" })), true);
  assert.equal(requiresExplicitVisitorConsent(new Headers({ "x-vercel-ip-country": "US" })), false);
  assert.equal(requiresExplicitVisitorConsent(new Headers()), true);
  assert.equal(
    requiresExplicitVisitorConsent(new Headers({ "x-vercel-ip-country": "IN" }), new Date("2027-05-13T00:00:00+05:30")),
    true,
  );
  assert.equal(
    requiresExplicitVisitorConsent(new Headers({ "x-vercel-ip-country": "IN" }), new Date("2027-05-12T23:59:59+05:30")),
    false,
  );
});

test("email contains required summary fields and no precise or personal data", () => {
  const email = makeVisitorEmail({
    location: {
      country: "Germany",
      countryCode: "DE",
      region: "Berlin",
      city: "Berlin",
      district: "Mitte",
      postalCode: "10115",
      organization: "Example ISP",
      coordinates: { latitude: 52.52, longitude: 13.4 },
      certainty: "Approximate; may be uncertain.",
      providerCount: 3,
      providerTotal: 3,
      providerNames: ["vercel", "ipinfo", "ipapi.is"],
      networkIndicators: ["Provider organization suggests cloud or hosting infrastructure; VPN/proxy status is unconfirmed"],
      providerObservations: [
        { provider: "vercel", country: "Germany", region: "Berlin", city: "Berlin" },
        { provider: "ipinfo", country: "Germany", region: "Berlin", city: "Berlin" },
        { provider: "ipapi.is", country: "Germany", region: "Berlin", city: "Berlin" },
      ],
    },
    page: "/",
    pageUrl: "https://portfolio.example/",
    deviceBrowser: "Desktop · macOS · Safari",
    source: "linkedin.com",
    date: new Date("2026-11-12T13:00:00.000Z"),
  });
  assert.equal(email.subject, "New Portfolio Visitor");
  assert.match(email.message, /Country: Germany/);
  assert.match(email.message, /Country code: DE/);
  assert.match(email.message, /Region: Berlin/);
  assert.match(email.message, /City: Berlin \(IP estimate\)/);
  assert.match(email.message, /District: Mitte/);
  assert.match(email.message, /Postal code: 10115/);
  assert.match(email.message, /Approximate coordinates \(IP-based, city-level\): 52\.52, 13\.40/);
  assert.match(email.message, /Google Maps: https:\/\/www\.google\.com\/maps\?q=52\.52,13\.40/);
  assert.match(email.message, /Network organization \/ ISP: Example ISP/);
  assert.match(email.message, /Network indicator: Provider organization suggests cloud or hosting infrastructure/);
  assert.match(email.message, /Visited: November 12, 2026/);
  assert.match(email.message, /Time: 6:30 PM IST/);
  assert.match(email.message, /Page URL: https:\/\/portfolio\.example\/\n/);
  assert.match(email.message, /Device\/browser: Desktop · macOS · Safari/);
  assert.match(email.message, /Source: linkedin\.com/);
  assert.match(email.message, /Location providers: vercel, ipinfo, ipapi\.is \(3 usable of 3 checked\)/);
  assert.match(email.message, /Location confidence:/);
  assert.match(email.message, /Provider results:/);
  assert.match(email.message, /Location certainty:/);
  assert.doesNotMatch(email.message, /latitude|longitude|street address|visitor email/i);
});

test("normalizes country subdivisions so KL and Kerala agree while conflicting cities remain unverified", () => {
  const location = locationFromProviderSources([
    {
      provider: "vercel",
      country: "India",
      countryCode: "IN",
      region: "KL",
      city: "Tirur",
      coordinates: { latitude: 10.91, longitude: 75.92 },
    },
    {
      provider: "ipapi.is",
      country: "India",
      countryCode: "IN",
      region: "Kerala",
      city: "Punalur",
      coordinates: { latitude: 9.02, longitude: 76.93 },
    },
  ]);

  assert.equal(location.country, "India");
  assert.equal(location.region, "Kerala");
  assert.equal(location.city, "Uncertain");
  assert.deepEqual(location.fieldConfidence, { country: "agree", region: "agree", city: "conflicting" });
  assert.equal(location.confidence.startsWith("Country and region agree; city estimates conflict."), true);
  assert.deepEqual(location.cityEstimates, [
    { provider: "vercel", value: "Tirur" },
    { provider: "ipapi.is", value: "Punalur" },
  ]);
  assert.equal(location.coordinates, undefined);

  const email = makeVisitorEmail({
    location,
    page: "/",
    pageUrl: "https://portfolio.example/",
    deviceBrowser: "Desktop · Windows · Chrome",
    source: "Direct / unavailable",
  });
  assert.match(email.message, /Country: India/);
  assert.match(email.message, /Region: Kerala/);
  assert.match(email.message, /City: Uncertain \(Vercel: Tirur; IPapi\.is: Punalur\)/);
  assert.match(email.message, /Conflicting city values are unverified IP estimates/);
  assert.match(email.message, /Location confidence: Country and region agree; city estimates conflict/);
  assert.doesNotMatch(email.message, /Approximate coordinates|Google Maps:/);
});

test("retains matching country when provider regions conflict", () => {
  const location = locationFromProviderSources([
    { provider: "vercel", country: "India", countryCode: "IN", region: "Kerala", city: "Example City", coordinates: { latitude: 9, longitude: 76 } },
    { provider: "ipapi.is", country: "India", countryCode: "IN", region: "Tamil Nadu", city: "Example City", coordinates: { latitude: 11, longitude: 78 } },
  ]);

  assert.equal(location.country, "India");
  assert.equal(location.region, "Uncertain");
  assert.equal(location.city, "Example City");
  assert.deepEqual(location.fieldConfidence, { country: "agree", region: "conflicting", city: "agree" });
  assert.match(location.confidence, /country agrees across providers; region estimates conflict; city agrees across providers/i);
  assert.equal(location.coordinates, undefined);
});

test("uses one provider as a low-confidence fallback", () => {
  const location = locationFromProviderSources([
    { provider: "vercel", country: "India", countryCode: "IN", region: "KL", city: "Tirur" },
  ]);

  assert.equal(location.country, "India");
  assert.equal(location.region, "Kerala");
  assert.equal(location.city, "Tirur");
  assert.deepEqual(location.fieldConfidence, { country: "single", region: "single", city: "single" });
  assert.match(location.certainty, /Single provider — approximate location/);
});

test("keeps available fields when other provider fields are missing", () => {
  const location = locationFromProviderSources([
    { provider: "vercel", country: "India", countryCode: "IN", region: "KL", city: "" },
    { provider: "ipapi.is", country: "India", countryCode: "IN", region: "", city: "" },
  ]);

  assert.equal(location.country, "India");
  assert.equal(location.region, "Kerala");
  assert.equal(location.city, "Unavailable");
  assert.deepEqual(location.fieldConfidence, { country: "agree", region: "single", city: "unavailable" });
});

test("does not report a selected country when providers identify different countries", () => {
  const location = locationFromProviderSources([
    { provider: "vercel", country: "United States", countryCode: "US", region: "Virginia", city: "Boydton" },
    { provider: "ipapi.is", country: "India", countryCode: "IN", region: "Kerala", city: "Punalur" },
  ]);

  assert.equal(location.country, "Uncertain");
  assert.equal(location.countryCode, undefined);
  assert.equal(location.region, "Unavailable");
  assert.equal(location.city, "Unavailable");
  assert.equal(location.providerObservations.length, 2);
  assert.deepEqual(location.fieldConfidence, { country: "conflicting", region: "unavailable", city: "unavailable" });
});

test("omits invalid provider coordinates", () => {
  const location = locationFromProviderSources([
    { provider: "ipapi.is", country: "India", countryCode: "IN", region: "Kerala", city: "Punalur", coordinates: { latitude: 91, longitude: 76 } },
  ]);

  assert.equal(location.city, "Punalur");
  assert.equal(location.coordinates, undefined);
});

test("daily summary keeps agreed region and labels conflicting city estimates", () => {
  const email = makeVisitorDailySummaryEmail([{
    count: 1,
    details: {
      location: {
        country: "India",
        countryCode: "IN",
        region: "Kerala",
        city: "Uncertain",
        cityEstimates: [
          { provider: "vercel", value: "Tirur" },
          { provider: "ipapi.is", value: "Punalur" },
        ],
        fieldConfidence: { country: "agree", region: "agree", city: "conflicting" },
        providerObservations: [
          { provider: "vercel", country: "India", region: "KL", city: "Tirur" },
          { provider: "ipapi.is", country: "India", region: "Kerala", city: "Punalur" },
        ],
        confidence: "Country and region agree; city estimates conflict.",
        certainty: "City estimates conflict.",
      },
      visitHour: "9 AM IST",
      page: "/",
      pageUrl: "https://portfolio.example/",
      deviceBrowser: "Desktop · Windows · Chrome",
      source: "Direct / unavailable",
    },
  }], "20261120", new Date("2026-11-20T03:30:00.000Z"));

  assert.match(email.message, /Uncertain \(Vercel: Tirur; IPapi\.is: Punalur\), Kerala, India/);
  assert.match(email.message, /Conflicting city values are unverified IP estimates/);
  assert.match(email.message, /Location confidence: Country and region agree; city estimates conflict/);
  assert.doesNotMatch(email.message, /Approximate coordinates|Google Maps:/);
});

test("omits the coordinate line when coordinates are unavailable", () => {
  const email = makeVisitorEmail({
    location: { country: "Unavailable", region: "Unavailable", city: "Unavailable", certainty: "Unavailable" },
    page: "/",
    deviceBrowser: "Desktop · macOS · Safari",
    source: "Direct / unavailable",
  });
  assert.doesNotMatch(email.message, /Approximate coordinates \(IP-based, city-level\):/);
});

test("daily summary includes approximate location details, providers, coordinates, and map link", () => {
  const email = makeVisitorDailySummaryEmail([{
    count: 2,
    details: {
      location: {
        country: "India",
        countryCode: "IN",
        region: "Kerala",
        city: "Punalur",
        postalCode: "691331",
        organization: "Example ISP",
        coordinates: { latitude: 9, longitude: 76.93 },
        certainty: "Single provider — approximate location.",
        providerCount: 1,
        providerTotal: 2,
        providerNames: ["ipapi.is"],
        confidence: "Low — single-provider IP estimate; physical presence is unverified.",
      },
      visitHour: "9 AM IST",
      page: "/",
      pageUrl: "https://portfolio.example/",
      deviceBrowser: "Desktop · macOS · Safari",
      source: "Direct / unavailable",
    },
  }], "20261120", new Date("2026-11-20T03:30:00.000Z"));

  assert.equal(email.subject, "New Portfolio Visitor");
  assert.match(email.message, /Punalur \(IP estimate\), Kerala, India/);
  assert.match(email.message, /Country code: IN/);
  assert.match(email.message, /Postal code: 691331/);
  assert.match(email.message, /Network organization \/ ISP: Example ISP/);
  assert.match(email.message, /Location providers: ipapi\.is \(1 usable of 2 checked\)/);
  assert.match(email.message, /Approximate coordinates \(IP-based, city-level\): 9\.00, 76\.93/);
  assert.match(email.message, /Google Maps: https:\/\/www\.google\.com\/maps\?q=9\.00,76\.93/);
  assert.match(email.message, /Location confidence:/);
  assert.match(email.message, /IPapi\.is rate limits or outages fall back to available Vercel data/);
  assert.doesNotMatch(email.message, /144\.16\.176\.142|203\.0\.113\.1/);
});
