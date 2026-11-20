import test from "node:test";
import assert from "node:assert/strict";
import { resolveVisitorLocation } from "../src/lib/visitorLocationProviders.mjs";

function jsonResponse(data, status = 200) {
  return { ok: status >= 200 && status < 300, status, json: async () => data };
}

function request(country = "US", headers = {}) {
  return new Request("https://portfolio.example/api/visitor", {
    headers: { "x-vercel-ip-country": country, ...headers },
  });
}

function ipapiIsResponse(overrides = {}) {
  return {
    is_bogon: false,
    city: "Punalūr",
    region: "Kerala",
    country: "India",
    lat: 9,
    lon: 76.93333,
    company: "Kerala Fibre Optic Network Limited",
    asn: "AS141549 Kerala Fibre Optic Network Limited",
    ...overrides,
  };
}

function getLocationOptions(overrides = {}) {
  return {
    trackingEligible: true,
    env: {},
    getIp: () => "203.0.113.1",
    getVercelLocation: () => null,
    fetchImpl: async () => jsonResponse(ipapiIsResponse()),
    ...overrides,
  };
}

test("does not call location providers unless visitor eligibility and opt-in are established", async () => {
  let ipLookups = 0;
  let externalCalls = 0;
  const dependencies = {
    env: { IPINFO_TOKEN: "test-ipinfo", IPAPI_TOKEN: "test-ipapi" },
    getIp: () => { ipLookups += 1; return "203.0.113.1"; },
    getVercelLocation: () => ({ country: "DE", region: "Berlin", city: "Berlin" }),
    fetchImpl: async () => { externalCalls += 1; throw new Error("must not call external provider"); },
  };

  const ineligible = await resolveVisitorLocation(request("US"), {
    ...dependencies,
    trackingEligible: false,
  });
  const withoutOptIn = await resolveVisitorLocation(request("DE"), {
    ...dependencies,
    trackingEligible: true,
    consentAccepted: false,
  });

  assert.equal(ipLookups, 0);
  assert.equal(externalCalls, 0);
  assert.equal(ineligible.providerCount, 0);
  assert.equal(withoutOptIn.providerCount, 0);
  assert.equal(ineligible.coordinates, undefined);
  assert.equal(withoutOptIn.coordinates, undefined);
});

test("uses IPapi.is with the trusted visitor IP and normalizes its anonymous response", async () => {
  const calls = [];
  const location = await resolveVisitorLocation(request("IN", { "x-forwarded-for": "198.51.100.77" }), getLocationOptions({
    getIp: () => "203.0.113.1",
    fetchImpl: async (url, options) => {
      calls.push({ url: String(url), options });
      return jsonResponse(ipapiIsResponse());
    },
  }));

  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, "https://api.ipapi.is/");
  assert.deepEqual(JSON.parse(calls[0].options.body), { q: "203.0.113.1" });
  assert.equal(location.providerNames[0], "ipapi.is");
  assert.equal(location.providerCount, 1);
  assert.equal(location.providerTotal, 2);
  assert.equal(location.country, "India");
  assert.equal(location.region, "Kerala");
  assert.equal(location.city, "Punalūr");
  assert.deepEqual(location.coordinates, { latitude: 9, longitude: 76.93 });
  assert.equal(location.organization, "Kerala Fibre Optic Network Limited");
  assert.match(location.certainty, /Single provider — approximate location/);
});

test("keeps an optional IPapi.is token server-side and sends it in the request body", async () => {
  let call;
  await resolveVisitorLocation(request(), getLocationOptions({
    env: { IPAPI_IS_TOKEN: "private-test-token" },
    fetchImpl: async (url, options) => {
      call = { url: String(url), options };
      return jsonResponse(ipapiIsResponse());
    },
  }));

  assert.equal(call.url.includes("private-test-token"), false);
  assert.deepEqual(JSON.parse(call.options.body), { q: "203.0.113.1", key: "private-test-token" });
});

test("uses Vercel data as the single-provider fallback when IPapi.is is rate-limited", async () => {
  const location = await resolveVisitorLocation(request("US"), getLocationOptions({
    getVercelLocation: () => ({
      country: "US",
      countryRegion: "Virginia",
      city: "Boydton",
      latitude: 36.67,
      longitude: -78.37,
    }),
    fetchImpl: async () => jsonResponse({ error: "rate limited" }, 429),
  }));

  assert.equal(location.country, "United States");
  assert.equal(location.countryCode, "US");
  assert.equal(location.region, "Virginia");
  assert.equal(location.city, "Boydton");
  assert.deepEqual(location.coordinates, { latitude: 36.67, longitude: -78.37 });
  assert.equal(location.providerCount, 1);
  assert.equal(location.providerTotal, 2);
  assert.match(location.certainty, /Single provider — approximate location/);
  assert.doesNotMatch(location.certainty, /Uncertain/);
});

test("uses Vercel, IPinfo, and IPapi.is when their city and country agree", async () => {
  const location = await resolveVisitorLocation(request("IN"), getLocationOptions({
    env: { IPINFO_TOKEN: "private-test-token" },
    getVercelLocation: () => ({ country: "IN", countryRegion: "Kerala", city: "Punalur", latitude: 9, longitude: 76.93333 }),
    fetchImpl: async (url) => String(url).includes("api.ipinfo.io")
      ? jsonResponse({ country: "IN", region: "Kerala", city: "Punalur", loc: "9,76.93333", postal: "691331", org: "Kerala Fibre Optic Network Limited" })
      : jsonResponse(ipapiIsResponse({ city: "Punalur" })),
  }));

  assert.equal(location.country, "India");
  assert.equal(location.city, "Punalur");
  assert.equal(location.postalCode, "691331");
  assert.deepEqual(location.coordinates, { latitude: 9, longitude: 76.93 });
  assert.equal(location.providerCount, 3);
  assert.equal(location.providerTotal, 3);
  assert.match(location.certainty, /3 of 3 location sources agree/);
});

test("uses the two-provider majority and marks a conflicting provider uncertain", async () => {
  const location = await resolveVisitorLocation(request("IN"), getLocationOptions({
    env: { IPINFO_TOKEN: "private-test-token" },
    getVercelLocation: () => ({ country: "IN", countryRegion: "Kerala", city: "Punalur", latitude: 9, longitude: 76.93333 }),
    fetchImpl: async (url) => String(url).includes("api.ipinfo.io")
      ? jsonResponse({ country: "IN", region: "Tamil Nadu", city: "Chennai", loc: "13.08,80.27" })
      : jsonResponse(ipapiIsResponse({ city: "Punalur" })),
  }));

  assert.equal(location.city, "Punalur");
  assert.equal(location.providerCount, 3);
  assert.match(location.certainty, /2 of 3 location sources agree/);
  assert.match(location.certainty, /Uncertain/);
});

test("prefers Vercel and preserves provider fields when all providers conflict", async () => {
  const location = await resolveVisitorLocation(request("US"), getLocationOptions({
    env: { IPINFO_TOKEN: "token-one", IPAPI_TOKEN: "token-two" },
    getVercelLocation: () => ({ country: "US", countryRegion: "Massachusetts", city: "Boston", latitude: 42.36, longitude: -71.06 }),
    fetchImpl: async (url) => {
      if (String(url).includes("api.ipinfo.io")) return jsonResponse({ country: "US", region: "Florida", city: "Miami", loc: "25.76,-80.19" });
      if (String(url).includes("ipapi.co")) return jsonResponse({ country_code: "US", region: "Texas", city: "Austin", latitude: 30.27, longitude: -97.74 });
      return jsonResponse(ipapiIsResponse({ country: "India", region: "Kerala", city: "Punalur" }));
    },
  }));

  assert.equal(location.city, "Boston");
  assert.equal(location.region, "Massachusetts");
  assert.deepEqual(location.coordinates, { latitude: 42.36, longitude: -71.06 });
  assert.equal(location.providerTotal, 4);
  assert.match(location.certainty, /Fallback: prefer Vercel data/);
  assert.match(location.certainty, /Uncertain/);
});

test("retains region and country when city and coordinates are missing", async () => {
  const location = await resolveVisitorLocation(request("IN"), getLocationOptions({
    fetchImpl: async () => jsonResponse(ipapiIsResponse({ city: null, lat: null, lon: null })),
  }));

  assert.equal(location.country, "India");
  assert.equal(location.region, "Kerala");
  assert.equal(location.city, "Unavailable");
  assert.equal(location.coordinates, undefined);
  assert.match(location.certainty, /Single provider — approximate location/);
});

test("falls back to usable Vercel data when IPapi.is returns an invalid response", async () => {
  const location = await resolveVisitorLocation(request(), getLocationOptions({
    getVercelLocation: () => ({ country: "US", countryRegion: "Virginia", city: "Boydton" }),
    fetchImpl: async () => jsonResponse({ error: "invalid ip" }),
  }));

  assert.equal(location.city, "Boydton");
  assert.equal(location.providerCount, 1);
  assert.match(location.certainty, /Single provider — approximate location/);
  assert.doesNotMatch(location.certainty, /Uncertain/);
});

test("falls back to usable Vercel data when IPapi.is times out", async () => {
  const location = await resolveVisitorLocation(request(), getLocationOptions({
    getVercelLocation: () => ({ country: "US", countryRegion: "Virginia", city: "Boydton" }),
    fetchImpl: async (_url, options) => {
      assert.ok(options.signal);
      throw new Error("provider timeout");
    },
  }));

  assert.equal(location.city, "Boydton");
  assert.equal(location.providerCount, 1);
  assert.match(location.certainty, /Single provider — approximate location/);
  assert.doesNotMatch(location.certainty, /Uncertain/);
});

test("does not call external providers without a trusted visitor IP", async () => {
  let calls = 0;
  const location = await resolveVisitorLocation(request("US", { "x-forwarded-for": "198.51.100.77" }), getLocationOptions({
    getIp: () => "",
    getVercelLocation: () => ({ country: "US", countryRegion: "Virginia", city: "Boydton" }),
    fetchImpl: async () => { calls += 1; return jsonResponse(ipapiIsResponse()); },
  }));

  assert.equal(calls, 0);
  assert.equal(location.city, "Boydton");
  assert.equal(location.providerTotal, 1);
});
