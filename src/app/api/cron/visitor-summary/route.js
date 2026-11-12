import {
  claimKey,
  getAggregates,
  releaseKey,
} from "../../../../lib/visitorStore";
import {
  getNotificationMode,
  isLocalTestMode,
  sendVisitorEmail,
  visitorFeatureEnabled,
} from "../../../../lib/visitorSecurity";
import { formatIstDateTime, istDayKey } from "../../../../lib/visitorNotifications.mjs";

export const runtime = "nodejs";

function json(body, status = 200) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}

function emailBody(rows, day) {
  const sorted = [...rows].sort((a, b) => b.count - a.count);
  const visible = sorted.slice(0, 60);
  const omitted = sorted.slice(60).reduce((sum, row) => sum + row.count, 0);
  const total = rows.reduce((sum, row) => sum + row.count, 0);
  const summaryTime = formatIstDateTime(new Date());
  const lines = [
    "Daily portfolio visitor summary",
    "Date covered: " + day.slice(0, 4) + "-" + day.slice(4, 6) + "-" + day.slice(6, 8) + " (IST)",
    "Summary sent: " + summaryTime.date + " at " + summaryTime.time + " IST",
    "Visit times below are grouped by hour; individual timestamps are not retained.",
    "Eligible visits recorded: " + total,
    "",
  ];
  for (const row of visible) {
    const place = [row.details.location.city, row.details.location.region, row.details.location.country].join(", ");
    lines.push(
      String(row.count) + " visit(s) | " + row.details.visitHour + " | " + place + " | " + row.details.page + " | " + row.details.source +
        " | " + row.details.location.certainty,
    );
  }
  if (omitted) lines.push("", "Additional grouped visits not listed: " + omitted);
  lines.push("", "All locations are approximate and derived from network information. No precise location or visitor contact details were collected.");
  return { subject: "New Portfolio Visitor", message: lines.join("\n") };
}

export async function GET(request) {
  const secret = process.env.CRON_SECRET || (isLocalTestMode() ? "dev-local-cron-secret-only" : "");
  if (!secret || request.headers.get("authorization") !== "Bearer " + secret) return json({ ok: false }, 401);
  if (!visitorFeatureEnabled()) return json({ ok: true, sent: false, reason: "disabled" });
  if (getNotificationMode() !== "daily") return json({ ok: true, sent: false, reason: "individual-mode" });
  if (!isLocalTestMode() && process.env.VERCEL_ENV !== "production") return json({ ok: true, sent: false, reason: "not-production" });

  // Vercel invokes this at 00:05 IST, so summarize the day that just ended.
  const day = isLocalTestMode()
    ? istDayKey()
    : istDayKey(new Date(Date.now() - 24 * 60 * 60 * 1000));
  const lockKey = "portfolio:visitors:summary-lock:" + day;
  const sentKey = "portfolio:visitors:summary-sent:" + day;
  let deliveryAttempted = false;
  try {
    if (!(await claimKey(lockKey, 10 * 60))) return json({ ok: true, sent: false, duplicate: true });
    if (!(await claimKey(sentKey, 14 * 24 * 60 * 60))) {
      await releaseKey(lockKey);
      return json({ ok: true, sent: false, duplicate: true });
    }
    const rows = await getAggregates(day);
    if (rows.length === 0) {
      await releaseKey(sentKey);
      await releaseKey(lockKey);
      return json({ ok: true, sent: false, empty: true });
    }

    deliveryAttempted = true;
    const result = await sendVisitorEmail(request, emailBody(rows, day));
    if (!result.sent) {
      // Keep the idempotency marker after uncertain delivery to avoid duplicate emails.
      if (result.status >= 400 && result.status < 500) await releaseKey(sentKey);
      await releaseKey(lockKey);
      console.error("Portfolio visitor summary delivery failed", { status: result.status || 0 });
      return json({ ok: true, sent: false });
    }
    try { await releaseKey(lockKey); } catch { /* the short lock expires automatically */ }
    return json({ ok: true, sent: true, dryRun: Boolean(result.dryRun), visits: rows.reduce((sum, row) => sum + row.count, 0) });
  } catch {
    try { await releaseKey(lockKey); } catch { /* storage may be unavailable */ }
    if (!deliveryAttempted) {
      try { await releaseKey(sentKey); } catch { /* storage may be unavailable */ }
    }
    console.error("Portfolio visitor summary could not be sent");
    return json({ ok: true, sent: false });
  }
}
