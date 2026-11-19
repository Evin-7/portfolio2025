# Evin Leyander Portfolio

Next.js portfolio site for Evin Leyander.

## Visitor notifications and privacy

After the page renders, a lightweight same-origin request records the page URL, referring domain, coarse device/browser, and Vercel's approximate country/region/city headers. It never requests browser geolocation or stores raw IP addresses. Do Not Track, Global Privacy Control, and the visitor opt-out on `/privacy` are honored. Visitors from the EEA and UK, and visitors from India after the DPDP Act's scheduled commencement of its core processing provisions, are not recorded until they explicitly opt in through the privacy settings. If location headers are unavailable, the route fails closed until an explicit opt-in.

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
