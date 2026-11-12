import SmoothScroll from "../components/SmoothScroll";
import CinematicIntro from "../components/CinematicIntro";
import VisitorLocationShare from "../components/VisitorLocationShare";
import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://evinleyander.vercel.app"),
  title: "Evin Leyander — Full Stack Software Engineer",
  description:
    "Portfolio of Evin Leyander, a full stack software engineer building thoughtful web and mobile products with React, TypeScript, Vue, and Node.js.",
  openGraph: {
    type: "website",
    url: "https://evinleyander.vercel.app",
    title: "Evin Leyander — Full Stack Software Engineer",
    description: "Thoughtful web and mobile products, software engineering, and selected work by Evin Leyander.",
    images: ["/developer-workspace.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Evin Leyander — Full Stack Software Engineer",
    description: "Thoughtful web and mobile products, software engineering, and selected work by Evin Leyander.",
    images: ["/developer-workspace.webp"],
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <noscript>
          <style>{`.intro-loader{display:none!important}.hero-eyebrow,.hero-word,.hero-ctas,.hero-meta{opacity:1!important;transform:none!important;filter:none!important}`}</style>
        </noscript>
        <SmoothScroll>
          <CinematicIntro />
          <VisitorLocationShare />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
