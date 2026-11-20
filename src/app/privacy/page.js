import Link from "next/link";
import VisitorPrivacySettings from "../../components/VisitorPrivacySettings";

export const metadata = {
  title: "Privacy — Evin Leyander",
  description: "Privacy information for Evin Leyander’s portfolio website.",
};

export default function PrivacyPage() {
  return (
    <main id="main-content" className="privacy-page page-container">
      <p className="section-kicker">Your choice</p>
      <h1>Privacy notice</h1>
      <p className="privacy-lead">
        This portfolio processes limited visit information to understand its reach. You can manage visitor-location notifications below; no location-permission popup is used. Visitors from the EEA and UK, and visitors in India from 13 May 2027, are not recorded until they explicitly allow it.
      </p>

      <section>
        <h2>What is recorded</h2>
        <p>
          When you visit, Vercel supplies an approximate country, region, and city based on the network address used for the request. For visitors eligible under the consent rules described here, the server also sends the trusted request IP to IPapi.is for an approximate estimate. IPapi.is’s anonymous tier does not require an account and is limited to 30 lookups per caller IP per UTC day; an optional server-side token can use its free account quota. If that provider is unavailable or rate-limited, available Vercel location data is used. The request IP is sent to IPinfo or IPapi.co only when their server-side tokens are configured. All IP-derived locations are low-confidence estimates; provider agreement does not verify your physical presence. Country, region, and city confidence are evaluated independently. Agreed country or region information is retained when a more-specific field conflicts. Conflicting city values are labeled as unverified provider estimates, and city-level coordinates are omitted; unresolved fields are marked uncertain. A single-source field is reported as a low-confidence estimate. Notifications may include approximate country and country code, region and city when supported by provider results, district, postal code, network organization/ISP, and coordinates when available location results support them. A possible cloud/hosting indicator may be shown when provider organization data suggests it; that does not confirm a VPN or proxy. IP-based coordinates are rounded to two decimal places (roughly city-level, about 1 km), and a map link may be included when coordinates are available. They do not identify your exact location. A VPN, mobile carrier, or proxy may make these estimates inaccurate. Provider-specific approximate location results may be retained in grouped records for up to eight days and included in the notification. The site does not store raw IP addresses; the location providers process the IP to answer the lookup and handle it under their own terms and privacy notices. If this browser already reports that location permission is granted, the site may also read device coordinates without prompting, after the same privacy eligibility check. It rounds them to two decimal places before transmission. Device coordinates are approximate after rounding and are not your exact location. The site does not request location permission or transmit or store unrounded device coordinates. It also records the page URL without query strings or fragments, the visit time in IST, the referring website’s domain when available, and a coarse device and browser description from the standard browser header. The site does not collect your name, email address, or street address.
        </p>
      </section>

      <section>
        <h2>How it is used and retained</h2>
        <p>
          The information is used to understand portfolio traffic and is sent to the portfolio owner through EmailJS. Eligible visits can each generate an individual email alert. Grouped visit records expire after eight days. Raw IP addresses and unrounded device coordinates are not stored by this feature; short-lived keyed digests throttle rapid requests from the same network for one minute and help limit abusive bursts. Browser Do Not Track and Global Privacy Control signals are honored. The signed opt-out preference lasts up to six months. The owner relies on a legitimate-interest basis where local law permits it and must use prior opt-in where local law requires consent.
        </p>
      </section>

      <section>
        <h2>Service providers and your rights</h2>
        <p>
          Vercel provides approximate network location and hosts the site; IPapi.is provides an additional approximate IP-based estimate, while IPinfo and IPapi.co are used only when their tokens are configured. Upstash stores short-lived request controls and grouped counts, and EmailJS sends eligible-visit alerts to the address configured by the site owner. These providers process information under their own terms and privacy notices. Use the setting below to object to or resume this processing on this browser. You may also contact the site owner about applicable access or deletion rights. The contact form is separate and continues to work as before.
        </p>
      </section>

      <VisitorPrivacySettings />

      <Link className="button button--outline privacy-back" href="/">Back to portfolio</Link>
    </main>
  );
}
