"use client";

import { useMemo, useState } from "react";
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
import { siRedis } from "simple-icons";

const projectTechnologyIcons = {
  Redis: { path: siRedis.path, color: `#${siRedis.hex}`, kind: "brand" },
  "Amazon SQS": {
    path: "M7.5 18.5h9a4.5 4.5 0 0 0 .35-8.99A5.75 5.75 0 0 0 5.8 8.25a5.15 5.15 0 0 0 1.7 10.25ZM12 12v6m-2.5-3.5L12 12l2.5 2.5",
    color: "#FF9900",
    kind: "outline",
  },
};

const projects = [
  {
    name: "SiteCore",
    description: "An interactive 3D operations viewer for exploring site assets, buildings, and infrastructure.",
    categories: ["web", "backend", "full-stack"],
    technologies: ["React", "TypeScript", "Vite", "Tailwind CSS", "Three.js", "React Three Fiber", "Drei", "Supabase"],
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
                        <ul className="project-tags" aria-label={`${project.name} technologies`}>
                          {project.technologies.map((technology) => {
                            const icon = projectTechnologyIcons[technology];
                            return (
                              <li key={technology}>
                                {icon && (
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
                                )}
                                <span>{technology}</span>
                              </li>
                            );
                          })}
                        </ul>
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
