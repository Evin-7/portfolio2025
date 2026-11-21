import SmoothScroll from "../components/SmoothScroll";
import VisitorTracker from "../components/VisitorTracker";
import { createPageMetadata, PROFILE, SITE_NAME, SITE_URL } from "../lib/siteMetadata";
import "./globals.css";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  ...createPageMetadata({
    title: "Evin Leyander | Full Stack Software Engineer",
    description: PROFILE.description,
  }),
  authors: [{ name: PROFILE.name, url: PROFILE.url }],
  creator: PROFILE.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [{ url: "/el-monogram-favicon.png", sizes: "256x256", type: "image/png" }],
    apple: [{ url: "/el-monogram-favicon.png", sizes: "256x256", type: "image/png" }],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <noscript>
          <style>{`.cinematic-intro{display:none!important}.hero-eyebrow,.hero-word,.hero-ctas,.hero-meta{opacity:1!important;transform:none!important;filter:none!important}`}</style>
        </noscript>
        <SmoothScroll>
          <VisitorTracker />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
