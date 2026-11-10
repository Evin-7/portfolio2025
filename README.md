# Evin Leyander Portfolio

Next.js portfolio site for Evin Leyander.

## Visitor location email

The portfolio can send one email per browser every 24 hours with the visitor's approximate city, Indian state when available, and country. It uses Vercel's `x-vercel-ip-*` request headers; it does not request GPS, send coordinates, include the raw IP address, or collect browser details. When the geo headers are unavailable, no email is sent. A notice explaining this behavior appears in the footer.

Email delivery uses the existing EmailJS service and contact template from a same-origin server route. Its service ID, template ID, and public key are already used by the contact form. EmailJS public keys identify a predefined template; Vercel Firewall limits this endpoint to one request per IP every 10 minutes.

The endpoint accepts no visitor-supplied location or recipient, only allows same-origin requests, and always sends to `yjevin75@gmail.com`. The browser throttle reduces normal repeat notices; the Vercel Firewall rule is the server-side abuse control. Configure a lawful basis and keep the footer notice in place before enabling collection for visitors in jurisdictions that regulate location data.

## Development

```bash
npm install
npm run dev
```

Visitor-location emails are disabled outside a production Vercel deployment.

## Production

```bash
npm run build
npm start
```
