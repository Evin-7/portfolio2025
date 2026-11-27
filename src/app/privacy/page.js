import Link from "next/link";
import { createPageMetadata } from "../../lib/siteMetadata";

export const metadata = createPageMetadata({
  title: "Privacy | Evin Leyander",
  description: "Privacy notice for Evin Leyander’s portfolio.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <main id="main-content" className="privacy-page page-container">
      <p className="section-kicker">Your choice</p>
      <h1>Privacy notice</h1>
      <p className="privacy-lead">
        This portfolio does not run custom visitor analytics, location tracking, or visitor email alerts.
      </p>

      <section>
        <h2>Contact form</h2>
        <p>
          If you submit the contact form, your name, email address, and message are sent through EmailJS so I can respond. Please avoid including sensitive information in the form.
        </p>
      </section>

      <section>
        <h2>Hosting</h2>
        <p>
          The site is hosted on Vercel, which may process standard technical request data to deliver and protect the website. The portfolio itself does not use that data to identify visitor locations or build visit profiles.
        </p>
      </section>

      <Link className="button button--outline privacy-back" href="/">Back to portfolio</Link>
    </main>
  );
}
