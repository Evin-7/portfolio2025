import { SITE_URL } from "../lib/siteMetadata";
import { services } from "../data/services";

const publicPages = ["/", "/about", "/projects", "/services", "/contact", "/privacy"];

export default function sitemap() {
  const servicePages = services.map(({ slug }) => `/services/${slug}`);

  return [...publicPages, ...servicePages].map((path) => ({
    url: new URL(path, SITE_URL).toString(),
  }));
}
