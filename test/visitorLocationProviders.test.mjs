import test from "node:test";
import assert from "node:assert/strict";
import { resolveVisitorLocation } from "../src/lib/visitorLocationProviders.mjs";

function jsonResponse(data, status = 200) {
  return { ok: status >= 200 && status < 300, status, json: async () => data };
}

function request(country = "US") {
  return new Request("https://portfolio.example/api/visitor", {
    headers: { "x-vercel-ip-country": country },
  });
}

test("does not call location providers unless visitor eligibility and required opt-in are established", async () => {
  let ipLookups = 0;
  const dependencies = {
    env: { IPINFO_TOKEN: "test-ipinfo", IPAPI_TOKEN: "test-ipapi" },
    getIp: () => { ipLookups += 1; return "203.0.113.1"; },
    getVercelLocation: () => ({ country: "DE", region: "Berlin", city: "Berlin" }),
    fetchImpl: async () => { throw new Error("must not call external provider"); },
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
  assert.equal(ineligible.providerCount, 0);
  assert.equal(withoutOptIn.providerCount, 0);
  assert.equal(ineligible.coordinates, undefined);
  assert.equal(withoutOptIn.coordinates, undefined);
});

test("compares Vercel, IPinfo, and IPapi results and rounds agreed coordinates", async () => {
  const calls = [];
  const location = await resolveVisitorLocation(request(), {
    trackingEligible: true,
    env: { IPINFO_TOKEN: "private-test-token", IPAPI_TOKEN: "private-test-token-2" },
    getIp: () => "203.0.113.1",
    getVercelLocation: () => ({
      country: "US",
      countryRegion: "California",
      city: "San Francisco",
      latitude: "37.7749",
      longitude: "-122.4194",
    }),
    fetchImpl: async (url, options) => {
      calls.push({ url: String(url), options });
      if (String(url).includes("api.ipinfo.io")) {
        return jsonResponse({ country: "US", region: "California", city: "San Francisco", loc: "37.7749,-122.4194" });
      }
      return jsonResponse({ country_code: "US", region: "California", city: "San Francisco", latitude: 37.7749, longitude: -122.4194 });
    },
  });

  assert.equal(calls.length, 2);
  assert.equal(calls[0].options.headers.Authorization, "Bearer private-test-token");
  assert.equal(calls[0].url.includes("private-test-token"), false);
  assert.deepEqual(location.coordinates, { latitude: 37.77, longitude: -122.42 });
  assert.equal(location.city, "San Francisco");
  assert.equal(location.providerCount, 3);
  assert.match(location.certainty, /3 of 3 location sources agree/);
});

test("uses two agreeing sources when the third source conflicts and marks the conflict", async () => {
  const location = await resolveVisitorLocation(request(), {
    trackingEligible: true,
    env: { IPINFO_TOKEN: "test-ipinfo", IPAPI_TOKEN: "test-ipapi" },
    getIp: () => "203.0.113.1",
    getVercelLocation: () => ({ country: "US", countryRegion: "Massachusetts", city: "Boston", latitude: 42.36, longitude: -71.06 }),
    fetchImpl: async (url) => String(url).includes("api.ipinfo.io")
      ? jsonResponse({ country: "US", region: "Massachusetts", city: "Boston", loc: "42.36,-71.06" })
      : jsonResponse({ country_code: "US", region: "Texas", city: "Austin", latitude: 30.27, longitude: -97.74 }),
  });

  assert.equal(location.city, "Boston");
  assert.equal(location.coordinates.latitude, 42.36);
  assert.equal(location.providerCount, 3);
  assert.match(location.certainty, /2 of 3 location sources agree/);
  assert.match(location.certainty, /Uncertain/);
});

test("uses Vercel as the documented fallback when providers conflict", async () => {
  const location = await resolveVisitorLocation(request(), {
    trackingEligible: true,
    env: { IPINFO_TOKEN: "test-ipinfo", IPAPI_TOKEN: "test-ipapi" },
    getIp: () => "203.0.113.1",
    getVercelLocation: () => ({ country: "US", countryRegion: "Massachusetts", city: "Boston", latitude: 42.36, longitude: -71.06 }),
    fetchImpl: async (url) => String(url).includes("api.ipinfo.io")
      ? jsonResponse({ country: "US", region: "Florida", city: "Miami", loc: "25.76,-80.19" })
      : jsonResponse({ country_code: "US", region: "Texas", city: "Austin", latitude: 30.27, longitude: -97.74 }),
  });

  assert.equal(location.city, "Boston");
  assert.equal(location.region, "Massachusetts");
  assert.deepEqual(location.coordinates, { latitude: 42.36, longitude: -71.06 });
  assert.match(location.certainty, /Fallback: prefer Vercel data/);
  assert.match(location.certainty, /Uncertain/);
});

test("uses valid Vercel location with low confidence when provider tokens are missing", async () => {
  let calls = 0;
  const location = await resolveVisitorLocation(request(), {
    trackingEligible: true,
    env: {},
    getIp: () => "203.0.113.1",
    getVercelLocation: () => ({ country: "US", countryRegion: "Virginia", city: "Boydton", latitude: 36.67, longitude: -78.37 }),
    fetchImpl: async () => { calls += 1; return jsonResponse({}); },
  });

  assert.equal(calls, 0);
  assert.equal(location.providerCount, 1);
  assert.equal(location.country, "US");
  assert.equal(location.region, "Virginia");
  assert.equal(location.city, "Boydton");
  assert.deepEqual(location.coordinates, { latitude: 36.67, longitude: -78.37 });
  assert.match(location.certainty, /Low confidence/);
});
