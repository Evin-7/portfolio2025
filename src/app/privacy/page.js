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
        Visitor notifications are optional. Nothing is recorded for this feature unless you choose “Allow” in the notice on the site.
      </p>

      <section>
        <h2>What is recorded</h2>
        <p>
          After consent, the site records the page path, referring website’s domain (when available), approximate country, region, and city supplied by Vercel from network information, and a grouped hour of the visit in IST. The information can be unavailable or inaccurate, for example when a VPN, mobile carrier, or proxy is used. The site does not request browser geolocation and does not collect GPS coordinates, street address, name, or email address.
        </p>
      </section>

      <section>
        <h2>How it is used and retained</h2>
        <p>
          The data is grouped into daily counts by hour, approximate location, page, and referral domain, then emailed to the portfolio owner. Daily summary is the default; the owner can configure individual notifications with a daily email cap. Aggregates expire after eight days. A necessary, signed preference cookie remembers your choice for up to six months. Short-lived keyed digests are used to prevent duplicate and abusive requests; raw IP addresses are not stored by this feature. Browser Do Not Track and Global Privacy Control signals are honored.
        </p>
      </section>

      <section>
        <h2>Service providers and your choice</h2>
        <p>
          Vercel provides approximate network location. Upstash stores short-lived request controls and grouped counts. EmailJS sends the notification to the address configured by the site owner. Decline prevents this feature from recording a visit. You can change the saved choice using “Privacy choices” in the footer. The contact form is separate and continues to work as before.
        </p>
      </section>

      <a className="button button--outline privacy-back" href="/">Back to portfolio</a>
    </main>
  );
}
