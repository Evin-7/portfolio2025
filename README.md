# Evin Leyander Portfolio

Next.js portfolio site for Evin Leyander.

## Visitor notifications and privacy

Visitor notifications are optional and require an explicit choice in the site's privacy notice. After consent, a same-origin server route records a page path, the referring domain when available, Vercel's approximate country/region/city headers, and a grouped visit hour in IST. It never requests browser geolocation or collects visitor contact details, GPS coordinates, street addresses, or raw IP addresses. Missing location headers are reported as unavailable.

Daily summary email is the default. Aggregates expire after eight days. Set `VISITOR_NOTIFICATION_MODE=individual` to send one email per eligible visitor per IST day; abuse protection limits this mode to 20 emails per day. Both modes enforce consent, bot checks, HMAC-keyed request limits, and a global daily cap. Do Not Track and Global Privacy Control signals are honored. The contact form continues to use the existing browser EmailJS implementation.

### Configuration

The existing EmailJS service and template remain in use, with the current recipient configured in that template (`yjevin75@gmail.com`). For server-side notification delivery, set the EmailJS private key as `EMAILJS_PRIVATE_KEY` in Vercel; never expose it with a `NEXT_PUBLIC_` prefix. Map the template subject to `{{subject}}` and its body to `{{message}}` so the notification title and content are included. The service ID, template ID, and public key continue to come from the existing contact form configuration.

Set these server-only Vercel environment variables:

- `EMAILJS_PRIVATE_KEY`
- `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`
- `VISITOR_CONSENT_SECRET` and `VISITOR_HASH_SECRET` (use different random secrets, at least 32 characters each)
- `CRON_SECRET`
- `VISITOR_NOTIFICATIONS_ENABLED=true`
- `VISITOR_NOTIFICATION_MODE=daily` (or `individual`)
- `VISITOR_EMAIL_ORIGIN` if the deployed site's origin is not allowed in EmailJS

Copy `.env.example` as a reference. Vercel Cron calls `/api/cron/visitor-summary` daily at 00:05 IST to send the preceding day's summary. Until the required Vercel variables are configured, the feature stays disabled.

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
