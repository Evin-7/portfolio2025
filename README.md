# Evin Leyander Portfolio

Next.js portfolio site for Evin Leyander.

## Privacy and contact form

The portfolio does not run custom visitor analytics, location tracking, or visitor email alerts. Vercel hosts the site and may process standard technical request data needed to deliver and protect it. Contact form submissions send the name, email address, and message through EmailJS so Evin can respond.

## Development

- Install dependencies with npm install.
- Start the local site with npm run dev.
- Run the unit suite with npm test.

### Google Calendar appointment scheduling

Create a 30-minute appointment schedule in Google Calendar and enable Google Meet conferencing in that schedule's booking settings. Open the schedule's **Sharing options → Website embed → Inline booking page**, then copy the src URL from Google's iframe snippet into NEXT_PUBLIC_GOOGLE_CALENDAR_BOOKING_URL. The portfolio embeds Google's live scheduler and also links to the same page in a new tab. If the variable is unset, the section offers an email fallback and does not show fabricated availability.

For local development, add the variable to .env.local and restart the dev server. In Vercel, open the project **Settings → Environment Variables**, add NEXT_PUBLIC_GOOGLE_CALENDAR_BOOKING_URL with the copied HTTPS calendar.google.com URL for the environments you use, save it, and redeploy. This public URL is exposed to website visitors; do not put credentials or private tokens in it. Google controls appointment availability, confirmations, calendar invitations, and Meet links through the schedule settings.

## Production

- Create the production build with npm run build.
- Serve the production build with npm start.
