import test from "node:test";
import assert from "node:assert/strict";
import {
  formatApproximateCoordinates,
  formatIstDateTime,
  istDayKey,
  istHourBucket,
  istMonthKey,
  locationFromHeaders,
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
      country: "DE",
      region: "Berlin",
      city: "Berlin",
      coordinates: { latitude: 52.52, longitude: 13.4 },
      certainty: "Approximate; may be uncertain.",
      providerCount: 3,
    },
    page: "/",
    pageUrl: "https://portfolio.example/",
    deviceBrowser: "Desktop · macOS · Safari",
    source: "linkedin.com",
    date: new Date("2026-11-12T13:00:00.000Z"),
  });
  assert.equal(email.subject, "New Portfolio Visitor");
  assert.match(email.message, /Country: DE/);
  assert.match(email.message, /Region: Berlin/);
  assert.match(email.message, /City: Berlin/);
  assert.match(email.message, /Approximate coordinates \(IP-based, city-level\): 52\.52, 13\.40/);
  assert.match(email.message, /Visited: November 12, 2026/);
  assert.match(email.message, /Time: 6:30 PM IST/);
  assert.match(email.message, /Page URL: https:\/\/portfolio\.example\/\n/);
  assert.match(email.message, /Device\/browser: Desktop · macOS · Safari/);
  assert.match(email.message, /Source: linkedin\.com/);
  assert.match(email.message, /Location providers: 3 of 3 responded/);
  assert.match(email.message, /Location certainty:/);
  assert.doesNotMatch(email.message, /latitude|longitude|street address|visitor email/i);
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
