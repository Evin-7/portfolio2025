import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";

process.env.NODE_ENV = "test";
process.env.VISITOR_NOTIFICATIONS_TEST_MODE = "true";

const { claimKey, releaseKey } = await import("../src/lib/visitorStore.js");

test("duplicate visitor notification claims are throttled until their TTL expires", async () => {
  const key = "test:visitor-notification:" + randomUUID();
  assert.equal(await claimKey(key, 60), true);
  assert.equal(await claimKey(key, 60), false);
  await releaseKey(key);
  assert.equal(await claimKey(key, 60), true);
  await releaseKey(key);
});
