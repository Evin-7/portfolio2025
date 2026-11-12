import { Redis } from "@upstash/redis";

const localState = globalThis.__portfolioVisitorTestState || {
  buckets: new Map(),
  keys: new Map(),
};
globalThis.__portfolioVisitorTestState = localState;

function isLocalTestMode() {
  return process.env.NODE_ENV !== "production" && process.env.VISITOR_NOTIFICATIONS_TEST_MODE === "true";
}

let redis;
function getRedis() {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    throw new Error("visitor-store-unconfigured");
  }
  if (!redis) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }
  return redis;
}

function localKeyExists(key, now) {
  const expiry = localState.keys.get(key);
  if (!expiry) return false;
  if (expiry <= now) {
    localState.keys.delete(key);
    return false;
  }
  return true;
}

export async function claimKey(key, ttlSeconds) {
  const now = Date.now();
  if (isLocalTestMode()) {
    if (localKeyExists(key, now)) return false;
    localState.keys.set(key, now + ttlSeconds * 1000);
    return true;
  }
  return (await getRedis().set(key, "1", { nx: true, ex: ttlSeconds })) === "OK";
}

export async function releaseKey(key) {
  if (isLocalTestMode()) {
    localState.keys.delete(key);
    return;
  }
  await getRedis().del(key);
}

export async function incrementCounter(key, ttlSeconds) {
  if (isLocalTestMode()) {
    const current = Number(localState.buckets.get(key) || 0) + 1;
    localState.buckets.set(key, current);
    return current;
  }
  const client = getRedis();
  const value = await client.incr(key);
  if (value === 1) await client.expire(key, ttlSeconds);
  return value;
}

export async function decrementCounter(key) {
  if (isLocalTestMode()) {
    localState.buckets.set(key, Math.max(0, Number(localState.buckets.get(key) || 0) - 1));
    return;
  }
  await getRedis().decr(key);
}

export async function addAggregate(day, bucketId, details, ttlSeconds = 8 * 24 * 60 * 60) {
  if (isLocalTestMode()) {
    const key = day + ":" + bucketId;
    const current = localState.buckets.get(key) || { details, count: 0 };
    current.count += 1;
    localState.buckets.set(key, current);
    return;
  }
  const client = getRedis();
  const aggregateKey = "portfolio:visitors:aggregate:" + day;
  await client.hset(aggregateKey, { ["meta:" + bucketId]: JSON.stringify(details) });
  await client.hincrby(aggregateKey, "count:" + bucketId, 1);
  await client.expire(aggregateKey, ttlSeconds);
}

export async function getAggregates(day) {
  if (isLocalTestMode()) {
    return Array.from(localState.buckets.entries())
      .filter(([key]) => key.startsWith(day + ":"))
      .map(([, bucket]) => bucket);
  }
  const data = await getRedis().hgetall("portfolio:visitors:aggregate:" + day);
  if (!data) return [];
  const rows = [];
  for (const [field, value] of Object.entries(data)) {
    if (!field.startsWith("count:")) continue;
    const bucketId = field.slice(6);
    const details = data["meta:" + bucketId];
    try {
      rows.push({ details: JSON.parse(details), count: Number(value) || 0 });
    } catch {
      // Ignore malformed aggregate rows; never fail the email for one bad field.
    }
  }
  return rows;
}

