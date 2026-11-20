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
          When you visit, Vercel supplies an approximate country, region, and city based on the network address used for the request. When Vercel also supplies valid latitude and longitude headers, and the visitor is eligible under the consent rules described here, the site includes those coordinates rounded to two decimal places in visitor emails. They are approximate IP-based, city-level estimates and do not identify your exact location; a VPN, mobile carrier, or proxy may make them inaccurate. The site records the page URL without query strings or fragments, the visit time in IST, the referring website’s domain when available, and a coarse device and browser description from the standard browser header. The site does not request GPS/browser geolocation or collect your name, email address, or street address.
        </p>
      </section>

      <section>
        <h2>How it is used and retained</h2>
        <p>
          The information is used to understand portfolio traffic and is sent to the portfolio owner through EmailJS. Eligible visits can each generate an individual email alert. Grouped visit records expire after eight days. Raw IP addresses are not stored by this feature; short-lived keyed digests throttle rapid requests from the same network for one minute and help limit abusive bursts. Browser Do Not Track and Global Privacy Control signals are honored. The signed opt-out preference lasts up to six months. The owner relies on a legitimate-interest basis where local law permits it and must use prior opt-in where local law requires consent.
        </p>
      </section>

      <section>
        <h2>Service providers and your rights</h2>
        <p>
          Vercel provides approximate network location, Upstash stores short-lived request controls and grouped counts, and EmailJS sends alerts to the address configured by the site owner. Use the setting below to object to or resume this processing on this browser. You may also contact the site owner about applicable access or deletion rights. The contact form is separate and continues to work as before.
        </p>
      </section>

      <VisitorPrivacySettings />

      <Link className="button button--outline privacy-back" href="/">Back to portfolio</Link>
    </main>
  );
}
