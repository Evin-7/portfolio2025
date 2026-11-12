import test from "node:test";
import assert from "node:assert/strict";
import {
  formatIstDateTime,
  istDayKey,
  istHourBucket,
  istMonthKey,
  locationFromHeaders,
  makeVisitorEmail,
  normalizeReferral,
  normalizeVisitedPage,
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

test("email contains required summary fields and no precise or personal data", () => {
  const email = makeVisitorEmail({
    location: {
      country: "DE",
      region: "Berlin",
      city: "Berlin",
      certainty: "Approximate; may be uncertain.",
    },
    page: "/",
    source: "linkedin.com",
    date: new Date("2026-11-12T13:00:00.000Z"),
  });
  assert.equal(email.subject, "New Portfolio Visitor");
  assert.match(email.message, /Country: DE/);
  assert.match(email.message, /Region: Berlin/);
  assert.match(email.message, /City: Berlin/);
  assert.match(email.message, /Visited: November 12, 2026/);
  assert.match(email.message, /Time: 6:30 PM IST/);
  assert.match(email.message, /Page: \/\n/);
  assert.match(email.message, /Source: linkedin\.com/);
  assert.match(email.message, /Location certainty:/);
  assert.doesNotMatch(email.message, /latitude|longitude|street address|visitor email/i);
});
