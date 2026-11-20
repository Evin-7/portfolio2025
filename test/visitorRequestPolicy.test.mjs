import test from "node:test";
import assert from "node:assert/strict";
import { hasPrivacyOptOut, isSameOriginRequest, looksAutomated } from "../src/lib/visitorRequestPolicy.mjs";

function request(headers = {}) {
  return new Request("https://portfolio.example/api/visitor", { headers });
}

test("filters common crawler and command-line user agents", () => {
  assert.equal(looksAutomated(request({ "user-agent": "Googlebot/2.1" })), true);
  assert.equal(looksAutomated(request({ "user-agent": "python-requests/2.32" })), true);
  assert.equal(looksAutomated(request({ "user-agent": "Mozilla/5.0 Chrome/131 Safari/537.36" })), false);
  assert.equal(looksAutomated(request()), true);
});

test("filters cross-site fetches while allowing same-origin browser requests", () => {
  assert.equal(looksAutomated(request({ "user-agent": "Chrome", "sec-fetch-site": "same-origin" })), false);
  assert.equal(looksAutomated(request({ "user-agent": "Chrome", "sec-fetch-site": "cross-site" })), true);
});

test("keeps DNT and Global Privacy Control opt-outs active", () => {
  assert.equal(hasPrivacyOptOut(request({ dnt: "1" })), true);
  assert.equal(hasPrivacyOptOut(request({ "sec-gpc": "1" })), true);
  assert.equal(hasPrivacyOptOut(request({ dnt: "0", "sec-gpc": "0" })), false);
});

test("accepts only a same-origin request for visitor capture", () => {
  assert.equal(isSameOriginRequest(new Request("https://portfolio.example/api/visitor", { headers: { origin: "https://portfolio.example" } })), true);
  assert.equal(isSameOriginRequest(new Request("https://portfolio.example/api/visitor", { headers: { origin: "https://attacker.example" } })), false);
  assert.equal(isSameOriginRequest(new Request("https://portfolio.example/api/visitor")), false);
});
