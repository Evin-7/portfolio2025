# Evin Leyander Portfolio

Next.js portfolio site for Evin Leyander.

## Visitor notifications and privacy

After the page renders, a lightweight same-origin request records the page URL, referring domain, coarse device/browser, and approximate network location. Only after the existing consent, DNT/GPC, opt-out, bot, rate-limit, and daily-cap checks pass, the server compares Vercel's location with IPapi.is and with IPinfo or IPapi.co when their server-side tokens are configured. IPapi.is works without a token; its anonymous tier allows up to 30 lookups per caller IP per UTC day, and a `429` or provider failure falls back to available Vercel data. A server-side `IPAPI_IS_TOKEN` can use the provider's free account quota (1,000 lookups/day). Two or more matching sources determine the city; a majority result is marked uncertain when another source conflicts. A single valid source is reported as a single-provider approximate location. If sources conflict without a majority, the fallback prefers Vercel, then IPinfo, IPapi.co, and IPapi.is, filling missing fields from the next available source and marking the result uncertain. The notification may include the city, region, country/code, district or postal code when available, network organization/ISP, and rounded approximate coordinates with a map link. Coordinates are rounded to two decimal places (roughly city-level) before storage or email. The site reads device coordinates only when the browser's permission state is already `granted` and the visitor passes the same eligibility preflight; it never prompts. Device coordinates are rounded in the browser and again on the server. Neither source identifies the visitor's exact location. The portfolio does not store raw IP addresses or unrounded device coordinates. IPapi.is receives the trusted visitor IP for eligible lookups; IPinfo and IPapi.co receive it only when their server-side tokens are configured. These providers process requests under their own terms. Do Not Track, Global Privacy Control, and the visitor opt-out on `/privacy` are honored. Visitors from the EEA and UK, and visitors from India after the DPDP Act's scheduled commencement of its core processing provisions, are not recorded until they explicitly opt in through the privacy settings. If location eligibility or consent cannot be confirmed, location is not processed.

Individual visitor emails are the default and have no separate daily or monthly email cap. Eligible visits can each generate an alert. Requests from the same network are throttled for one minute, and the global daily visit cap, region-specific opt-in, browser opt-outs, and bot checks remain active. Set `VISITOR_NOTIFICATION_MODE=daily` to send a single daily summary instead. Aggregates expire after eight days. The contact form continues to use the existing browser EmailJS implementation.

### Configuration

Keep the contact form's EmailJS template unchanged. Create a separate visitor template under the existing EmailJS service, set its recipient to the same notification address already configured for the contact form, set Subject to exactly `{{subject}}`, and set the body/content to exactly `{{message}}`. Put the new template ID in `EMAILJS_VISITOR_TEMPLATE_ID`. The service ID and public key continue to come from the contact form configuration. Set the EmailJS private key as `EMAILJS_PRIVATE_KEY` in Vercel; never expose it with a `NEXT_PUBLIC_` prefix.

Set these server-only Vercel environment variables:

- `EMAILJS_PRIVATE_KEY`
- `EMAILJS_VISITOR_TEMPLATE_ID`
- `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`
- `VISITOR_CONSENT_SECRET` and `VISITOR_HASH_SECRET` (use different random secrets, at least 32 characters each)
- `CRON_SECRET`
- `VISITOR_NOTIFICATIONS_ENABLED=true`
- `VISITOR_NOTIFICATION_MODE=individual` (or `daily` for a daily digest)
- `VISITOR_EMAIL_ORIGIN` only if the deployment URL cannot be derived or must be overridden
- `IPINFO_TOKEN` (optional provider token with city-level lookup access)
- `IPAPI_TOKEN` (optional production API token)

IPapi.is is the production-compatible free fallback and does not require an account; its anonymous endpoint is limited to 30 lookups per caller IP per UTC day, and rate-limit responses fall back to Vercel. An optional `IPAPI_IS_TOKEN` uses the free account quota of 1,000 requests/day. `IPINFO_TOKEN` and `IPAPI_TOKEN` remain optional; without them those providers are skipped. Keep all tokens server-only. Production use of IPapi.co requires a production plan/token; do not use its public test endpoint for production traffic.

Copy `.env.example` as a reference. Vercel Cron calls `/api/cron/visitor-summary` daily at 00:05 IST to send the preceding day's summary. A delivery attempt is marked before contacting EmailJS to avoid duplicate messages if the provider response is lost. Until the required Vercel variables are configured, the feature stays disabled.

## Development

```bash
npm install
npm run dev
```

Run `VISITOR_NOTIFICATIONS_TEST_MODE=true npm run dev` to test consent, visit capture, and the scheduled summary locally. This mode uses in-memory storage and simulates email delivery; it never contacts EmailJS. Run the unit suite with `npm test`.

## Production

```bash
npm run build
npm start
```

Production notifications require the Vercel environment variables above and the configured Cron job. Do not enable notifications until the privacy notice and consent flow are appropriate for the jurisdictions where the portfolio is available.
