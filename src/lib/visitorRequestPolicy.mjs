export function looksAutomated(request) {
  const agent = request.headers.get("user-agent") || "";
  if (!agent || /bot|crawler|spider|slurp|headless|phantom|python-requests|curl\/|wget\/|scrapy/i.test(agent)) return true;
  const fetchSite = request.headers.get("sec-fetch-site");
  return Boolean(fetchSite && fetchSite !== "same-origin");
}

export function hasPrivacyOptOut(request) {
  return request.headers.get("dnt") === "1" || request.headers.get("sec-gpc") === "1";
}

export function isSameOriginRequest(request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}
