import Link from "next/link";
import { SITE_URL } from "../lib/siteMetadata";
import JsonLd from "./JsonLd";

export default function BreadcrumbTrail({ items }) {
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: new URL(item.href, SITE_URL).toString(),
    })),
  };

  return (
    <>
      <JsonLd data={breadcrumbData} />
      <nav className="page-breadcrumbs" aria-label="Breadcrumb">
        <ol>
          {items.map((item, index) => (
            <li key={item.href}>
              {index < items.length - 1 ? <Link href={item.href}>{item.name}</Link> : <span aria-current="page">{item.name}</span>}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
