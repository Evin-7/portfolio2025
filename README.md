# Evin Leyander Portfolio

Next.js portfolio site for Evin Leyander.

## Visitor notifications and privacy

After the page renders, a lightweight same-origin request records the page URL, referring domain, coarse device/browser, and approximate network location. Only after the existing consent, DNT/GPC, opt-out, bot, rate-limit, and daily-cap checks pass, the server compares Vercel's location with IPapi.is and with IPinfo or IPapi.co when their server-side tokens are configured. IPapi.is works without a token; its anonymous tier allows up to 30 lookups per caller IP per UTC day, and a `429` or provider failure falls back to available Vercel data. A server-side `IPAPI_IS_TOKEN` can use the provider's free account quota (1,000 lookups/day). All IP-derived locations are low-confidence estimates; provider agreement does not verify physical presence. Country, region, and city confidence are evaluated independently. Agreed country or region information is retained when a more-specific field conflicts. Conflicting city values are labeled as unverified provider estimates, and city-level coordinates are omitted; unresolved fields are marked uncertain. A single-source field remains a low-confidence estimate. Notifications may include country/code, region and city when supported by provider results, estimated postal code and timezone, network organization/ISP, a possible cloud/hosting indicator when suggested by provider data, and rounded approximate coordinates with a map link when the location fields support them. A cloud/hosting indicator is not a confirmed VPN or proxy determination. IP-derived coordinates are rounded to two decimal places (roughly city-level) before storage or email. For eligible visitors when individual alerts are enabled, the browser may show its native geolocation permission prompt. If allowed, the server sends coordinates rounded to four decimal places to Nominatim (or a compatible service configured by the owner) for a village/suburb-level reverse-geocoding lookup. The email may include map-derived locality, district, an additional administrative area, state, and country estimates; it never includes street or house-number details from that lookup. Nominatim may return the nearest suitable map feature and administrative fields can be incomplete, so these labels are not verified addresses. The request is globally limited to one every two seconds, and successful or empty results are cached for 24 hours under a keyed coordinate digest. The resulting place labels and browser-reported coordinates/accuracy are included only in the individual email and are not retained in grouped records or daily summaries. The email links to OpenStreetMap contributor attribution. No custom location modal is used. If permission is denied or unavailable, the notification uses approximate IP-based location only. A browser UTC offset that differs by at least three hours from the IP timezone flags the visitor country as unverified and suppresses postal codes and map coordinates. Only the mismatch flag is retained. If network metadata suggests hosting, VPN, or proxy traffic, the email identifies the result as a possible network exit and omits postal codes and map coordinates. Grouped records expire after eight days. The portfolio does not store raw IP addresses. IPapi.is receives the trusted visitor IP for eligible lookups; IPinfo and IPapi.co receive it only when their server-side tokens are configured. These providers process requests under their own terms. Do Not Track, Global Privacy Control, and the visitor opt-out on `/privacy` are honored. Visitors from the EEA and UK, and visitors from India after the DPDP Act's scheduled commencement of its core processing provisions, are not recorded until they explicitly opt in through the privacy settings. If location eligibility or consent cannot be confirmed, location is not processed.

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
- `VISITOR_REVERSE_GEOCODER_URL` (optional Nominatim-compatible HTTPS `/reverse` endpoint; blank uses `https://nominatim.openstreetmap.org/reverse`, set to `off` to disable)
- `IPINFO_TOKEN` (optional provider token with city-level lookup access)
- `IPINFO_LITE_TOKEN` (optional [free IPinfo Lite token](https://ipinfo.io/dashboard/lite) for country and network organization, used when `IPINFO_TOKEN` is unset)
- `IPAPI_IS_TOKEN` (optional [free IPapi.is key](https://ipapi.is/developers.html) for state estimates, a higher quota, and network indicators)
- `IPAPI_TOKEN` (optional production API token)
- `COUNTRY_STATE_CITY_API_KEY` (optional [Country State City API key](https://app.countrystatecity.in/) for state codes missing from the local dictionary. Only country and subdivision codes are sent.)

IPapi.is is the production-compatible free fallback and does not require an account; its anonymous endpoint is limited to 30 lookups per caller IP per UTC day, and rate-limit responses fall back to Vercel. An optional `IPAPI_IS_TOKEN` uses the free account quota of 1,000 requests/day. The server uses at most one IPinfo endpoint per visit. IPinfo Lite can corroborate the country and contributes no state or city data. IPapi.co is skipped without `IPAPI_TOKEN`. Keep all tokens server-only. Production use of IPapi.co requires a production plan/token; do not use its public test endpoint for production traffic.

For optional country corroboration, set `MAXMIND_ACCOUNT_ID` and `MAXMIND_LICENSE_KEY` for a [MaxMind GeoLite account](https://dev.maxmind.com/geoip/docs/web-services/requests/). Both are server-only. MaxMind receives the validated request IP and contributes a country result, with network indicators when available. The free country service has limited network data.

For a short production investigation, set `VISITOR_GEO_DIAGNOSTICS_UNTIL` to an ISO UTC timestamp less than 24 hours ahead and redeploy. The runtime log entry `Portfolio visitor geo diagnostic` contains the IP source, address family, provider outcomes, country codes and network indicators, and agreement or conflict at each location level. It contains no raw IPs, request identifiers, coordinates, user agents, or credentials. Logging stops at the specified time. Historical email estimates cannot be traced to an IP from these diagnostic records.

Browser coordinates are reverse-geocoded only for eligible individual alerts after the browser grants native location permission. The request rounds coordinates to four decimal places, uses village/suburb-level Nominatim detail, omits street-level fields, and has a shared two-second minimum between provider requests. Results, including empty results, are cached for 24 hours using a keyed digest. A configured alternate endpoint must be Nominatim-compatible and meet its own service terms. The email includes OpenStreetMap attribution.

On the Vercel production domain, `ipAddress(request)` reads Vercel’s `x-real-ip` header. Every outbound IP lookup uses that same validated public address and checks the address echoed in the response. Vercel's location headers are derived separately at its network edge. Requests without a valid public address use available Vercel data only. Country State City receives only country and subdivision codes.

Copy `.env.example` as a reference. Vercel Cron calls `/api/cron/visitor-summary` daily at 00:05 IST to send the preceding day's summary. A delivery attempt is marked before contacting EmailJS to avoid duplicate messages if the provider response is lost. Until the required Vercel variables are configured, the feature stays disabled.

## Development

```bash
npm install
npm run dev
```

Run `VISITOR_NOTIFICATIONS_TEST_MODE=true npm run dev` to test consent, visit capture, and the scheduled summary locally. This mode uses in-memory storage and simulates email delivery; it never contacts EmailJS. Run the unit suite with `npm test`.

### Google Calendar appointment scheduling

Create a 30-minute appointment schedule in Google Calendar and enable Google Meet conferencing in that schedule's booking settings. Open the schedule's **Sharing options → Website embed → Inline booking page**, then copy the `src` URL from Google's iframe snippet into `NEXT_PUBLIC_GOOGLE_CALENDAR_BOOKING_URL`. The portfolio embeds Google's live scheduler and also links to the same page in a new tab. If the variable is unset, the section offers an email fallback and does not show fabricated availability.

For local development, add the variable to `.env.local` and restart the dev server. In Vercel, open the project **Settings → Environment Variables**, add `NEXT_PUBLIC_GOOGLE_CALENDAR_BOOKING_URL` with the copied HTTPS `calendar.google.com` URL for the environments you use, save it, and redeploy. This public URL is exposed to website visitors; do not put credentials or private tokens in it. Google controls appointment availability, confirmations, calendar invitations, and Meet links through the schedule settings.

## Production

```bash
npm run build
npm start
```

Production notifications require the Vercel environment variables above and the configured Cron job. Do not enable notifications until the privacy notice and consent flow are appropriate for the jurisdictions where the portfolio is available.
