import SmoothScroll from "../components/SmoothScroll";
import VisitorLocationPing from "../components/VisitorLocationPing";
import "./globals.css";

export const metadata = {
  title: "Evin Leyander — Software Engineer",
  description:
    "Portfolio of Evin Leyander, a software engineer building clear interfaces, reliable systems, and production-ready digital products.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SmoothScroll>
          <VisitorLocationPing />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
