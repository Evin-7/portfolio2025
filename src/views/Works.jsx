"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Reveal from "../components/Reveal";
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
import veltrix from "../assets/images/veltrix.webp";
import {
  siAxios,
  siChartdotjs,
  siD3,
  siDrizzle,
  siExpo,
  siExpress,
  siGsap,
  siMedusa,
  siNeon,
  siNextdotjs,
  siNodedotjs,
  siPalantir,
  siPinia,
  siPostgresql,
  siPrisma,
  siRazorpay,
  siReact,
  siRedis,
  siRedux,
  siStrapi,
  siStripe,
  siSupabase,
  siSwiper,
  siTailwindcss,
  siThreedotjs,
  siTypescript,
  siUpstash,
  siVite,
  siVuedotjs,
  siVuetify,
} from "simple-icons";

const lightIconColor = "#d3d5e2";

function brandIcon(icon, color) {
  const brandColor = color ?? `#${icon.hex}`;
  const [red, green, blue] = brandColor.slice(1).match(/.{2}/g).map((channel) => parseInt(channel, 16));
  const luminance = (red * 0.299 + green * 0.587 + blue * 0.114) / 255;

  return {
    path: icon.path,
    color: luminance < 0.29 ? lightIconColor : brandColor,
    kind: "brand",
  };
}

const outlineIcon = (path, color = lightIconColor) => ({ path, color, kind: "outline" });

const projectTechnologyIcons = {
  React: brandIcon(siReact),
  "React Native": brandIcon(siReact),
  "React Three Fiber 9": brandIcon(siReact),
  "TypeScript": brandIcon(siTypescript),
  Vite: brandIcon(siVite),
  "Tailwind CSS": brandIcon(siTailwindcss),
  Supabase: brandIcon(siSupabase),
  "Chart.js": brandIcon(siChartdotjs),
  D3: brandIcon(siD3),
  "Three.js 0.187": brandIcon(siThreedotjs, lightIconColor),
  "Drei 10": brandIcon(siThreedotjs, lightIconColor),
  "Next.js": brandIcon(siNextdotjs, lightIconColor),
  "PostgreSQL": brandIcon(siPostgresql),
  Prisma: brandIcon(siPrisma),
  Neon: brandIcon(siNeon),
  "Upstash Redis": brandIcon(siUpstash),
  Redis: brandIcon(siRedis),
  "Palantir Foundry": brandIcon(siPalantir),
  "Medusa.js": brandIcon(siMedusa),
  "Amazon SQS": outlineIcon("M7.5 18.5h9a4.5 4.5 0 0 0 .35-8.99A5.75 5.75 0 0 0 5.8 8.25a5.15 5.15 0 0 0 1.7 10.25ZM12 12v6m-2.5-3.5L12 12l2.5 2.5", "#FF9900"),
  Stripe: brandIcon(siStripe),
  WebSockets: outlineIcon("M7.5 7.5 16.5 16.5M16.5 7.5l-9 9M4.5 12h3m9 0h3M12 4.5v3m0 9v3"),
  "Vue 2": brandIcon(siVuedotjs),
  "Vue 3": brandIcon(siVuedotjs),
  "Vue.js": brandIcon(siVuedotjs),
  "Vue Router": outlineIcon("M5 6.5h5.5a3 3 0 0 1 3 3v5a3 3 0 0 0 3 3H19m-2.5-2.5L19 17l-2.5 2.5M5 17.5h3"),
  Razorpay: brandIcon(siRazorpay),
  "React Big Calendar": outlineIcon("M7 3.5v3m10-3v3M4.5 9h15m-13-4h11a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm1.5 7h3m2 0h3m-8 4h3m2 0h3"),
  Pinia: brandIcon(siPinia),
  Axios: brandIcon(siAxios),
  Swiper: brandIcon(siSwiper),
  "Express.js": brandIcon(siExpress),
  Azure: outlineIcon("M12 3.5 4.5 17h7l1.5 3.5L19.5 7H13l-1-3.5Zm.3 5.5h3.7l-3.8 7h-4L12.3 9Z", "#38BDF8"),
  Vuetify: brandIcon(siVuetify),
  "REST APIs": outlineIcon("M8 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h2m8-14h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-2M10 8l-3 4 3 4m4-8 3 4-3 4"),
  "Node.js": brandIcon(siNodedotjs),
  "GSAP": brandIcon(siGsap),
  Strapi: brandIcon(siStrapi),
  "Drizzle ORM": brandIcon(siDrizzle),
  Expo: brandIcon(siExpo),
  "Redux Toolkit": brandIcon(siRedux),
};

const projects = [
  {
    name: "SiteCore",
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
    name: "Mezeh Catering",
    description: "A catering booking experience for Mezeh Mediterranean Grill.",
    categories: ["web"],
    technologies: ["React", "TypeScript", "Vite", "Tailwind CSS", "React Big Calendar"],
    links: [{ label: "Open Mezeh Catering", href: "https://catering.mezeh.com/" }],
    image: mezehCatering,
  },
  {
    name: "Mezeh Frontend",
    description: "The customer-facing web experience for Mezeh Mediterranean Grill.",
    categories: ["web"],
    technologies: ["Vue 3", "Vite", "Pinia", "Tailwind CSS", "Vue Router", "Axios", "Swiper", "Express.js", "Azure"],
    links: [{ label: "Open Mezeh", href: "https://mezeh-frontend-production.azurewebsites.net/" }],
    image: mezehFrontend,
  },
  {
    name: "Mezeh Mobile App",
    description: "A mobile ordering experience for Mezeh Mediterranean Grill.",
    categories: ["mobile"],
    technologies: ["React Native", "Expo", "Redux Toolkit"],
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
];

const filters = [
  { label: "All", value: "all" },
  { label: "Web", value: "web" },
  { label: "Mobile", value: "mobile" },
  { label: "Backend", value: "backend" },
  { label: "Full Stack", value: "full-stack" },
];

function ExternalLinkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 4h6v6M20 4 10 14" />
      <path d="M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5" />
    </svg>
  );
}

function ProjectTechnologyStrip({ projectName, technologies }) {
  const listId = useId();
  const listRef = useRef(null);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return undefined;

    const updateScrollState = () => {
      const overflow = list.scrollWidth > list.clientWidth + 1;
      setHasOverflow(overflow);
      setCanScrollRight(overflow && list.scrollLeft + list.clientWidth < list.scrollWidth - 1);
    };

    updateScrollState();
    list.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    const resizeObserver = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(updateScrollState);
    resizeObserver?.observe(list);
    if (list.parentElement) resizeObserver?.observe(list.parentElement);

    return () => {
      list.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
      resizeObserver?.disconnect();
    };
  }, [technologies.length]);

  const scrollRight = () => {
    const list = listRef.current;
    if (!list) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    list.scrollBy({ left: Math.max(list.clientWidth * 0.72, 100), behavior: reduceMotion ? "auto" : "smooth" });
  };

  return (
    <div className="project-tags-scroller">
      <ul className="project-tags" id={listId} ref={listRef} aria-label={`${projectName} technologies`}>
        {technologies.map((technology) => {
          const icon = projectTechnologyIcons[technology] ?? outlineIcon("M5 12h14m-7-7 7 7-7 7");
          return (
            <li key={technology}>
              <svg
                className={`project-tag-icon project-tag-icon--${icon.kind}`}
                viewBox="0 0 24 24"
                aria-hidden="true"
                style={{ color: icon.color }}
                {...(icon.kind === "outline" ? {
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: 1.8,
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                } : { fill: "currentColor" })}
              >
                <path d={icon.path} />
              </svg>
              <span>{technology}</span>
            </li>
          );
        })}
      </ul>
      {hasOverflow && (
        <button
          className="project-tag-scroll-button"
          type="button"
          aria-label={`Scroll ${projectName} technologies right`}
          aria-controls={listId}
          title="Show more technologies"
          disabled={!canScrollRight}
          onClick={scrollRight}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m9 5 7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default function Works() {
  const [activeFilter, setActiveFilter] = useState("all");
  const filteredProjects = useMemo(
    () => activeFilter === "all" ? projects : projects.filter((project) => project.categories.includes(activeFilter)),
    [activeFilter],
  );
  const projectGroups = useMemo(() => [
    { key: "web", title: "Web products", projects: filteredProjects.filter((project) => !project.categories.includes("mobile")) },
    { key: "mobile", title: "Mobile apps", projects: filteredProjects.filter((project) => project.categories.includes("mobile")) },
  ].filter((group) => group.projects.length > 0), [filteredProjects]);

  return (
    <section className="section projects-section" aria-labelledby="works-title">
      <div className="page-container">
        <Reveal className="project-heading nav-anchor-target" id="works">
          <p className="section-kicker">02 / Selected Work</p>
          <h2 className="section-title" id="works-title">Things I&apos;ve built.</h2>
        </Reveal>

        <div className="project-filter-row" aria-label="Filter projects by category">
          <div className="project-filters" role="group" aria-label="Project categories">
            {filters.map((filter) => (
              <button
                className="project-filter"
                type="button"
                key={filter.value}
                aria-pressed={activeFilter === filter.value}
                onClick={() => setActiveFilter(filter.value)}
              >
                {filter.label}
              </button>
            ))}
          </div>
          <span className="project-count" aria-live="polite">
            {filteredProjects.length} {filteredProjects.length === 1 ? "Project" : "Projects"}
          </span>
        </div>

        {projectGroups.map((group) => (
          <section className={`project-group project-group--${group.key}`} key={group.key} aria-label={group.title}>
            {group.key === "mobile" && (
              <div className="project-group-heading">
                <h3>{group.title}</h3>
                <span>Useful, clear app experiences across devices.</span>
              </div>
            )}
            <div className="project-grid" aria-live="polite">
              {group.projects.map((project, index) => (
                <Reveal className="project-card-wrap" key={project.name} delay={Math.min(index * 0.025, 0.15)}>
                  <article className="project-card">
                    <a
                      className="project-card-hit-area"
                      href={project.links[0].href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={project.links[0].label}
                    />
                    <div className="project-preview">
                      <Image
                        src={project.image}
                        alt={`${project.name} project preview`}
                        width={project.image.width}
                        height={project.image.height}
                        sizes="(max-width: 620px) 90vw, (max-width: 920px) 44vw, 29vw"
                        className="project-image"
                      />
                    </div>
                    <div className="project-card-content">
                      <h3>{project.name}</h3>
                      <p className="project-summary">{project.description}</p>
                    </div>
                    <div className="project-card-footer">
                      {project.technologies.length > 0 ? (
                        <ProjectTechnologyStrip projectName={project.name} technologies={project.technologies} />
                      ) : <span className="project-tags-spacer" aria-hidden="true" />}
                      <div className="project-card-actions">
                        {project.links.map((link) => (
                          <a
                            className="project-link"
                            key={link.href}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={link.label}
                            title={link.label}
                          >
                            <ExternalLinkIcon />
                          </a>
                        ))}
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
