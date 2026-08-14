import { JetBrains_Mono } from "next/font/google";
import SmoothScroll from "../components/SmoothScroll";
import "./globals.css";

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-site-mono",
  display: "swap",
});

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
      <body className={mono.variable}><SmoothScroll>{children}</SmoothScroll></body>
    </html>
  );
}
