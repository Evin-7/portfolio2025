import abeZauto from "../assets/images/abezauto.webp";
import agsyba from "../assets/images/agsyba.webp";
import call2day from "../assets/images/call2day.webp";
import elateHrmsApp from "../assets/images/elatehrmsapp.webp";
import elateHrms from "../assets/images/elatehrmscom.webp";
import elateChat from "../assets/images/elatechatapp.webp";
import elateTime from "../assets/images/elatetimecom.webp";
import homeMaintenance from "../assets/images/homemaintaince.webp";
import mezehCatering from "../assets/images/mezehcateting.webp";
import mezehFrontend from "../assets/images/mezehfrontend.webp";
import mezehMobile from "../assets/images/mezehmobileapp.webp";
import mudumalai from "../assets/images/mudumaialia.webp";
import ontix from "../assets/images/ontixx.webp";
import ohYesWorld from "../assets/images/ohyescom.webp";
import parambikulam from "../assets/images/parambikulam.webp";
import penielTech from "../assets/images/penieltech.webp";
import periyar from "../assets/images/periyartigerreserve.webp";
import sitecore from "../assets/images/sitecore.webp";
import stGeorgeCsi from "../assets/images/stgeorgecsi.webp";
import veltrix from "../assets/images/veltrix.webp";

export const projects = [
  {
    name: "Mezeh",
    description: "The customer-facing ordering experience for Mezeh Mediterranean Grill.",
    categories: ["web", "backend", "full-stack"],
    technologies: ["Vue 3", "Vite", "Pinia", "Tailwind CSS", "Vue Router", "Axios", "Swiper", "Express.js", "Azure", "Olo Pay", "Paytronix"],
    links: [{ label: "Open Mezeh", href: "https://mezeh-frontend-production.azurewebsites.net/" }],
    image: mezehFrontend,
  },
  {
    name: "Mezeh Catering",
    description: "A catering booking experience for Mezeh Mediterranean Grill.",
    categories: ["web"],
    technologies: ["Vue.js", "Vite", "Tailwind CSS", "React Big Calendar", "Olo Pay", "Paytronix", "Pinia", "Vue Router", "Express.js", "Azure"],
    links: [{ label: "Open Mezeh Catering", href: "https://catering.mezeh.com/" }],
    image: mezehCatering,
  },
  {
    name: "SiteCore",
    featured: true,
    description: "An interactive 3D operations viewer for exploring site assets, buildings, and infrastructure.",
    categories: ["web", "backend", "full-stack"],
    technologies: ["React", "TypeScript", "Vite", "Tailwind CSS", "Supabase", "Chart.js", "D3", "Three.js 0.187", "React Three Fiber 9", "Drei 10"],
    links: [{ label: "Open SiteCore", href: "https://sitecore-rho.vercel.app/" }],
    image: sitecore,
  },
  {
    name: "VELTRIX",
    description: "A premium gaming collection built around virtual play currency.",
    categories: ["web"],
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "PostgreSQL", "Prisma", "Neon"],
    links: [{ label: "Open VELTRIX", href: "https://veltrix-evins.vercel.app/" }],
    image: veltrix,
  },
  {
    name: "Ontix",
    description: "An enterprise operations workspace for monitoring projects, cases, customers, and teams.",
    categories: ["web"],
    technologies: ["Next.js", "React", "TypeScript", "Palantir Foundry", "Neon", "Prisma", "Upstash Redis", "Tailwind CSS"],
    links: [{ label: "Open Ontix", href: "https://ontixx.vercel.app/" }],
    image: ontix,
  },
  {
    name: "AbeZauto",
    description: "An online storefront for OEM and aftermarket parts across leading vehicle brands.",
    categories: ["web"],
    technologies: ["Next.js", "Neon"],
    links: [{ label: "Open AbeZauto", href: "https://abezauto.com/" }],
    image: abeZauto,
  },
  {
    name: "AGSYBA",
    description: "A fashion storefront for curated everyday clothing and accessories.",
    categories: ["web"],
    technologies: ["Medusa.js", "Redis", "Amazon SQS"],
    links: [{ label: "Open AGSYBA", href: "https://agsyba.com/" }],
    image: agsyba,
  },
  {
    name: "Call2Day",
    description: "A home-services platform for finding and booking repair and maintenance professionals.",
    categories: ["web"],
    technologies: ["Next.js", "Neon"],
    links: [{ label: "Open Call2Day", href: "https://call2day.com/" }],
    image: call2day,
  },
  {
    name: "Elate HRMS App",
    description: "A mobile self-service companion for employees using Elate HRMS.",
    categories: ["mobile"],
    technologies: ["React Native"],
    links: [{ label: "View on Google Play", href: "https://play.google.com/store/apps/details?id=com.penieltech.elatehrmsconnect" }],
    image: elateHrmsApp,
  },
  {
    name: "Elate HRMS",
    description: "HR workflows covering recruitment, payroll, attendance, leave, and employee self-service.",
    categories: ["web", "backend", "full-stack"],
    technologies: ["React", "PostgreSQL", "Drizzle ORM", "Stripe"],
    links: [{ label: "Open Elate HRMS", href: "https://elatehrms.com/" }],
    image: elateHrms,
  },
  {
    name: "Elate Chat",
    description: "A mobile workplace messaging app with real-time chat.",
    categories: ["mobile"],
    technologies: ["React Native", "WebSockets"],
    links: [{ label: "View on Google Play", href: "https://play.google.com/store/apps/details?id=com.binsonsamuel.elatechat" }],
    image: elateChat,
  },
  {
    name: "Elate Time",
    description: "Time and attendance software with employee tools and biometric-device integration.",
    categories: ["web", "backend", "full-stack"],
    technologies: ["React", "PostgreSQL", "Drizzle ORM", "Stripe"],
    links: [{ label: "Open Elate Time", href: "https://elatetime.com/" }],
    image: elateTime,
  },
  {
    name: "Oh Yes Home Maintenance",
    description: "A home-maintenance service site for booking cleaning, repair, and installation help.",
    categories: ["web"],
    technologies: ["Vue 2", "Razorpay"],
    links: [{ label: "Open Home Maintenance", href: "https://homemaintenance.ohyesworld.com/" }],
    image: homeMaintenance,
  },
  {
    name: "Mezeh Mobile App",
    description: "A mobile ordering experience for Mezeh Mediterranean Grill.",
    categories: ["mobile"],
    technologies: ["React Native", "Expo", "Redux Toolkit"],
    imageFit: "cover",
    links: [
      { label: "View on Google Play", href: "https://play.google.com/store/apps/details?id=com.mezeh.MezehApp&hl=en_IN" },
      { label: "View on the App Store", href: "https://apps.apple.com/us/app/mezeh-mediterranean-grill/id6747373231" },
    ],
    image: mezehMobile,
  },
  {
    name: "Mudumalai Tiger Reserve",
    description: "A visitor booking website for Mudumalai Tiger Reserve.",
    categories: ["web"],
    technologies: ["Vue.js", "Vuetify", "REST APIs", "Node.js"],
    links: [{ label: "Open Mudumalai Tiger Reserve", href: "https://www.mudumalaitigerreserve.com/" }],
    image: mudumalai,
  },
  {
    name: "Oh Yes World",
    description: "A home-solutions website connecting customers with household services in Kerala.",
    categories: ["web"],
    technologies: ["Vue 2", "Vuetify", "Vue Router", "GSAP", "Axios", "Swiper", "Razorpay", "Node.js"],
    links: [{ label: "Open Oh Yes World", href: "https://ohyesworld.com/" }],
    image: ohYesWorld,
  },
  {
    name: "Parambikulam Tiger Reserve",
    description: "A visitor booking website for Parambikulam Tiger Reserve.",
    categories: ["web"],
    technologies: ["Vue.js", "Vuetify", "REST APIs", "Razorpay", "Node.js"],
    links: [{ label: "Open Parambikulam Tiger Reserve", href: "https://parambikulam.org/" }],
    image: parambikulam,
  },
  {
    name: "Peniel Tech",
    description: "A corporate website presenting Penieltech's software and IT services.",
    categories: ["web"],
    technologies: ["Next.js", "Strapi", "Tailwind CSS"],
    links: [{ label: "Open Peniel Tech", href: "https://www.penieltech.com/" }],
    image: penielTech,
  },
  {
    name: "Periyar Tiger Reserve",
    description: "A visitor booking website for Periyar Tiger Reserve.",
    categories: ["web"],
    technologies: ["Vue.js", "Vuetify", "REST APIs", "Razorpay", "Node.js"],
    links: [{ label: "Open Periyar Tiger Reserve", href: "https://www.periyartigerreserve.org/" }],
    image: periyar,
  },
  {
    name: "St. George CSI Church",
    description: "A heritage website for St. George CSI Church, paired with a companion admin app for managing site content and gallery albums.",
    categories: ["web", "backend", "full-stack"],
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion", "Swiper", "Axios", "EmailJS", "MongoDB", "Mongoose", "Cloudinary", "jose"],
    links: [{ label: "Visit St. George CSI Church", href: "https://stgeorgecsichurchofficial.com" }],
    image: stGeorgeCsi,
  },
].map((project) => ({
  ...project,
  slug: project.name.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
}));
