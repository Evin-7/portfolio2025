export const SITE_URL = "https://evinleyander.vercel.app";
export const SITE_NAME = "Evin Leyander Portfolio";
export const SOCIAL_PREVIEW_IMAGE = "/og-evin-leyander.png";

export const PROFILE = {
  name: "Evin Leyander",
  jobTitle: "Full Stack Software Engineer",
  description:
    "Evin Leyander is a software engineer based in Kerala, India, building web and mobile products with React, Next.js, TypeScript, Vue.js, and React Native.",
  url: SITE_URL,
  sameAs: [
    "https://github.com/Evin-7",
    "https://www.linkedin.com/in/evin-leyander-536a70236/",
  ],
};

export function createPageMetadata({ title, description, path = "/" }) {
  const url = new URL(path, SITE_URL).toString();

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      url,
      siteName: SITE_NAME,
      locale: "en_IN",
      title,
      description,
      images: [SOCIAL_PREVIEW_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [SOCIAL_PREVIEW_IMAGE],
    },
  };
}
