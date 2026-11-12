# Evin Leyander Portfolio

Next.js portfolio site for Evin Leyander.

## Visitor notifications and privacy

Visitor notifications are optional and require an explicit choice in the site's privacy notice. After consent, a same-origin server route records a page path, the referring domain when available, Vercel's approximate country/region/city headers, and a grouped visit hour in IST. It never requests browser geolocation or collects visitor contact details, GPS coordinates, street addresses, or raw IP addresses. Missing location headers are reported as unavailable.

Daily summary email is the default and sends at most one visitor email per IST day. Aggregates expire after eight days. Set `VISITOR_NOTIFICATION_MODE=individual` only if needed; individual delivery is capped at two attempts per IST day and 25 per IST calendar month, in addition to per-network rate limits. Both modes enforce consent, bot checks, HMAC-keyed request limits, and a global daily visit cap. Do Not Track and Global Privacy Control signals are honored. The contact form continues to use the existing browser EmailJS implementation.

### Configuration

Keep the contact form's EmailJS template unchanged. Create a separate visitor template under the existing EmailJS service, set its recipient to the same notification address already configured for the contact form, set Subject to exactly `{{subject}}`, and set the body/content to exactly `{{message}}`. Put the new template ID in `EMAILJS_VISITOR_TEMPLATE_ID`. The service ID and public key continue to come from the contact form configuration. Set the EmailJS private key as `EMAILJS_PRIVATE_KEY` in Vercel; never expose it with a `NEXT_PUBLIC_` prefix.

Set these server-only Vercel environment variables:

- `EMAILJS_PRIVATE_KEY`
- `EMAILJS_VISITOR_TEMPLATE_ID`
- `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`
- `VISITOR_CONSENT_SECRET` and `VISITOR_HASH_SECRET` (use different random secrets, at least 32 characters each)
- `CRON_SECRET`
- `VISITOR_NOTIFICATIONS_ENABLED=true`
- `VISITOR_NOTIFICATION_MODE=daily` (or `individual`)
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
