import test from "node:test";
import assert from "node:assert/strict";
import { normalizePublicVisitorIp, resolveVisitorLocation } from "../src/lib/visitorLocationProviders.mjs";

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
    ip: "8.8.8.8",
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
    getIp: () => "8.8.8.8",
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
    getIp: () => { ipLookups += 1; return "8.8.8.8"; },
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

test("accepts only public IPv4 and IPv6 addresses for provider lookups", () => {
  assert.equal(normalizePublicVisitorIp("8.8.8.8"), "8.8.8.8");
  assert.equal(normalizePublicVisitorIp("2001:4860:4860::8888"), "2001:4860:4860::8888");
  assert.equal(normalizePublicVisitorIp("::ffff:8.8.8.8"), "::ffff:8.8.8.8");
  for (const address of [
    "",
    "not-an-ip",
    "10.0.0.1",
    "127.0.0.1",
    "169.254.1.2",
    "203.0.113.1",
    "::1",
    "fd12::1",
    "fe80::1",
    "2001:db8::1",
    "::ffff:192.168.0.1",
  ]) assert.equal(normalizePublicVisitorIp(address), "", address);
});

test("uses IPapi.is with the trusted visitor IP and normalizes its anonymous response", async () => {
  const calls = [];
  const location = await resolveVisitorLocation(request("IN", { "x-forwarded-for": "198.51.100.77" }), getLocationOptions({
    getIp: () => "8.8.8.8",
    fetchImpl: async (url, options) => {
      calls.push({ url: String(url), options });
      return jsonResponse(ipapiIsResponse());
    },
  }));

  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, "https://api.ipapi.is/");
  assert.deepEqual(JSON.parse(calls[0].options.body), { q: "8.8.8.8" });
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
  assert.deepEqual(JSON.parse(call.options.body), { q: "8.8.8.8", key: "private-test-token" });
});

test("uses Vercel's x-real-ip helper and ignores arbitrary forwarded client headers", async () => {
  let body;
  await resolveVisitorLocation(request("US", {
    "x-real-ip": "8.8.8.8",
    "x-forwarded-for": "1.1.1.1",
    "x-vercel-forwarded-for": "1.1.1.1",
  }), getLocationOptions({
    getIp: undefined,
    fetchImpl: async (_url, options) => {
      body = JSON.parse(options.body);
      return jsonResponse(ipapiIsResponse());
    },
  }));
  assert.deepEqual(body, { q: "8.8.8.8" });
});

test("does not send reserved or invalid trusted IP values to providers", async () => {
  let calls = 0;
  const location = await resolveVisitorLocation(request("US", { "x-forwarded-for": "8.8.8.8" }), getLocationOptions({
    getIp: () => "203.0.113.1",
    getVercelLocation: () => ({ country: "US", countryRegion: "VA", city: "Example City" }),
    fetchImpl: async () => { calls += 1; return jsonResponse(ipapiIsResponse()); },
  }));
  assert.equal(calls, 0);
  assert.equal(location.city, "Example City");
  assert.equal(location.providerTotal, 1);
});

test("sends a validated public IPv6 address explicitly to IPapi.is", async () => {
  let body;
  const location = await resolveVisitorLocation(request("US"), getLocationOptions({
    getIp: () => "2001:4860:4860::8888",
    fetchImpl: async (_url, options) => {
      body = JSON.parse(options.body);
      return jsonResponse(ipapiIsResponse({ ip: "2001:4860:4860:0:0:0:0:8888" }));
    },
  }));
  assert.equal(location.providerCount, 1);
  assert.deepEqual(body, { q: "2001:4860:4860::8888" });
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
      ? jsonResponse({ geo: { country: "India", country_code: "IN", region: "Kerala", city: "Punalur", latitude: 9, longitude: 76.93333, postal_code: "691331", timezone: "Asia/Kolkata" }, as: { name: "Kerala Fibre Optic Network Limited" } })
      : jsonResponse(ipapiIsResponse({ city: "Punalur" })),
  }));

  assert.equal(location.country, "India");
  assert.equal(location.city, "Punalur");
  assert.equal(location.postalCode, "691331");
  assert.equal(location.timezone, "Asia/Kolkata");
  assert.deepEqual(location.coordinates, { latitude: 9, longitude: 76.93 });
  assert.equal(location.providerCount, 3);
  assert.equal(location.providerTotal, 3);
  assert.deepEqual(location.fieldConfidence, { country: "agree", region: "agree", city: "agree" });
  assert.match(location.confidence, /city agrees across providers/);
  assert.match(location.confidence, /do not establish physical presence/);
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
  assert.deepEqual(location.fieldConfidence, { country: "agree", region: "majority", city: "agree" });
  assert.match(location.certainty, /provider estimates differ for region/);
});

test("retains agreed region when providers disagree on city", async () => {
  const location = await resolveVisitorLocation(request("US"), getLocationOptions({
    getVercelLocation: () => ({ country: "US", countryRegion: "VA", city: "Example City", latitude: 38, longitude: -77 }),
    fetchImpl: async () => jsonResponse(ipapiIsResponse({
      country: "United States",
      country_code: "US",
      city: "Other City",
      region: "Virginia",
      lat: 37,
      lon: -78,
    })),
  }));
  assert.equal(location.country, "United States");
  assert.equal(location.countryCode, "US");
  assert.equal(location.region, "Virginia");
  assert.equal(location.city, "Uncertain");
  assert.equal(location.coordinates, undefined);
  assert.match(location.confidence, /country and region agree; city estimates conflict/i);
  assert.deepEqual(location.cityEstimates, [
    { provider: "vercel", value: "Example City" },
    { provider: "ipapi.is", value: "Other City" },
  ]);
  assert.equal(location.providerObservations.length, 2);
});

test("marks cloud organization labels as a possible infrastructure exit, not a confirmed VPN", async () => {
  const location = await resolveVisitorLocation(request("US"), getLocationOptions({
    getIp: () => "1.1.1.1",
    fetchImpl: async () => jsonResponse(ipapiIsResponse({ country: "United States", country_code: "US", region: "Virginia", city: "Example City", company: "cloud", ip: "1.1.1.1" })),
  }));
  assert.match(location.networkIndicators.join(" "), /suggests cloud or hosting infrastructure/);
  assert.match(location.networkIndicators.join(" "), /VPN\/proxy status is unconfirmed/);
  assert.equal(location.confidence.startsWith("Low"), true);
});

test("does not mistake Vercel execution region for the visitor's region", async () => {
  const location = await resolveVisitorLocation(request("US"), getLocationOptions({
    getIp: () => "",
    getVercelLocation: () => ({ country: "US", city: "Example City", region: "iad1" }),
  }));
  assert.equal(location.region, "Unavailable");
});

test("retains country while reporting conflicting region and city estimates", async () => {
  const location = await resolveVisitorLocation(request("US"), getLocationOptions({
    env: { IPINFO_TOKEN: "token-one", IPAPI_TOKEN: "token-two" },
    getVercelLocation: () => ({ country: "US", countryRegion: "Massachusetts", city: "Boston", latitude: 42.36, longitude: -71.06 }),
    fetchImpl: async (url) => {
      if (String(url).includes("api.ipinfo.io")) return jsonResponse({ country: "US", region: "Florida", city: "Miami", loc: "25.76,-80.19" });
      if (String(url).includes("ipapi.co")) return jsonResponse({ country_code: "US", region: "Texas", city: "Austin", latitude: 30.27, longitude: -97.74 });
      return jsonResponse(ipapiIsResponse({ country: "India", region: "Kerala", city: "Punalur" }));
    },
  }));

  assert.equal(location.country, "United States");
  assert.equal(location.city, "Uncertain");
  assert.equal(location.region, "Uncertain");
  assert.equal(location.coordinates, undefined);
  assert.equal(location.providerTotal, 4);
  assert.match(location.confidence, /region estimates conflict; city estimates conflict/i);
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


test("discards IPapi.is data for a different or unverified request IP", async () => {
  for (const ip of ["1.1.1.1", undefined]) {
    const location = await resolveVisitorLocation(request("IN"), getLocationOptions({
      getVercelLocation: () => ({ country: "IN", countryRegion: "KL", city: "Tirur" }),
      fetchImpl: async () => jsonResponse(ipapiIsResponse({ ip, country: "United States", city: "Dulles Town Center" })),
    }));
    assert.deepEqual(location.providerNames, ["vercel"]);
    assert.equal(location.city, "Tirur");
  }
});

test("hides coordinates and postal codes for VPNs, proxies, and hosting networks", async () => {
  for (const flag of ["is_vpn", "is_proxy", "is_datacenter"]) {
    const location = await resolveVisitorLocation(request("IN"), getLocationOptions({
      fetchImpl: async () => jsonResponse(ipapiIsResponse({ [flag]: true, postal: "691331" })),
    }));
    assert.equal(location.city, "Punalūr");
    assert.equal(location.networkIndicators.length, 1);
    assert.equal(location.coordinates, undefined);
    assert.equal(location.postalCode, undefined);
  }
});

test("recognizes documented named crawler results", async () => {
  const location = await resolveVisitorLocation(request(), getLocationOptions({
    fetchImpl: async () => jsonResponse(ipapiIsResponse({ is_crawler: "ExampleBot" })),
  }));
  assert.deepEqual(location, { crawlerDetected: true });
});

test("missing trusted geolocation and IP yields unavailable data without a lookup", async () => {
  const location = await resolveVisitorLocation(new Request("https://portfolio.example/api/visitor"), {
    ...getLocationOptions({
      getIp: undefined,
      getVercelLocation: undefined,
      fetchImpl: async () => assert.fail("No IP to look up"),
    }),
    consentAccepted: true,
  });
  assert.equal(location.country, "Unavailable");
  assert.equal(location.providerCount, 0);
});
