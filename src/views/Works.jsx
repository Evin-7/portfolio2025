"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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
import { technologyCatalog } from "../data/techStack";

function normalizeTechnologyName(name) {
  const normalized = name.toLowerCase().replace(/\s+\d+(?:\.\d+)*$/, "");
  if (normalized.startsWith("vue ")) return "vue.js";
  if (normalized === "upstash redis") return "redis";
  return normalized;
}

const technologyByName = new Map(
  technologyCatalog.flatMap(({ technologies }) => technologies.map((technology) => [
    normalizeTechnologyName(technology.name),
    technology,
  ])),
);

const projects = [
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

function ProjectTitle({ name, className = "" }) {
  return (
    <h3 className={className} aria-label={name}>
      <span className="sr-only">{name}</span>
      <span className="work-feature-title-visual" aria-hidden="true">
        {name.split(" ").flatMap((word, wordIndex) => [
          wordIndex > 0 ? " " : null,
          <span className="work-feature-title-word" key={wordIndex}>
            {Array.from(word).map((character, characterIndex) => (
              <span className="work-feature-title-char" key={characterIndex}>{character}</span>
            ))}
          </span>,
        ])}
      </span>
    </h3>
  );
}

function TechnologyList({ technologies }) {
  if (!technologies.length) return null;
  return (
    <ul className="work-technology-list" aria-label="Technologies used">
      {technologies.map((name) => {
        const technology = technologyByName.get(normalizeTechnologyName(name));
        const logo = technology?.logo;

        return (
          <li className="work-technology-chip" key={name}>
            <span className="work-technology-logo" aria-hidden="true">
              {logo?.path ? (
                <svg viewBox="0 0 24 24" focusable="false"><path d={logo.path} /></svg>
              ) : (
                <span>{name.replace(/[^A-Za-z0-9]/g, "").slice(0, 2).toUpperCase()}</span>
              )}
            </span>
            <span>{name}</span>
          </li>
        );
      })}
    </ul>
  );
}

function WorkFeature({ project, index, total }) {
  return (
    <article className={"work-feature work-feature--" + (index + 1)} data-work-feature>
      <span className="work-feature-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
      <div className="work-feature-copy">
        <p className="work-feature-eyebrow">
          <span>Selected project</span>
          <span>{String(index + 1).padStart(2, "0")} <span aria-hidden="true">/</span> {String(total).padStart(2, "0")}</span>
        </p>
        <ProjectTitle name={project.name} className="work-feature-title" />
        <span className="work-feature-rule" aria-hidden="true" />
        <p className="work-feature-description">{project.description}</p>
        <div className="work-feature-meta">
          <TechnologyList technologies={project.technologies} />
        </div>
        <div className="work-feature-actions">
          {project.links.map((link) => (
            <a className="work-feature-link" href={link.href} key={link.href} target="_blank" rel="noopener noreferrer" data-cursor-label="VISIT">
              {link.label} <span aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      </div>
      <figure className="work-feature-visual">
        <Image
          className="work-feature-image"
          src={project.image}
          alt={project.name + " project preview"}
          width={project.image.width}
          height={project.image.height}
          sizes="(max-width: 720px) 92vw, 64vw"
        />
        <figcaption className="sr-only">{project.name}: {project.description}</figcaption>
      </figure>
    </article>
  );
}

export default function Works() {
  const rootRef = useRef(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const filteredProjects = useMemo(
    () => activeFilter === "all" ? projects : projects.filter((project) => project.categories.includes(activeFilter)),
    [activeFilter],
  );
  useEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    gsap.registerPlugin(ScrollTrigger);
    const responsiveMotion = gsap.matchMedia(root);
    responsiveMotion.add("(min-width: 901px) and (prefers-reduced-motion: no-preference)", () => {
        root.querySelectorAll("[data-work-feature]").forEach((scene, index) => {
          const visual = scene.querySelector(".work-feature-visual");
          const copy = scene.querySelector(".work-feature-copy");
          const title = scene.querySelectorAll(".work-feature-title-char");
          const number = scene.querySelector(".work-feature-index");
          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: scene,
              start: "top 96%",
              end: "bottom 8%",
              scrub: 0.78,
              invalidateOnRefresh: true,
            },
          });

          timeline
            .fromTo(visual, {
              clipPath: "inset(13% 10% 13% 10% round 28px)",
              scale: 0.88,
              xPercent: index % 2 === 0 ? 5 : -5,
              rotateY: index % 2 === 0 ? -5 : 5,
              transformPerspective: 1200,
            }, {
              clipPath: "inset(0% 0% 0% 0% round 18px)",
              scale: 1,
              xPercent: 0,
              rotateY: 0,
              ease: "none",
            }, 0)
            .fromTo(number, { xPercent: -14, opacity: 0.06 }, { xPercent: 0, opacity: 0.15, ease: "none" }, 0)
            .fromTo(title, {
              yPercent: 112,
              rotateX: -48,
              autoAlpha: 0.12,
              transformOrigin: "50% 100%",
            }, {
              yPercent: 0,
              rotateX: 0,
              autoAlpha: 1,
              stagger: { each: 0.025, from: "center" },
              ease: "none",
            }, 0.05)
            .fromTo(copy.querySelector(".work-feature-description"), { y: 24, autoAlpha: 0.3 }, { y: 0, autoAlpha: 1, ease: "none" }, 0.18)
            .fromTo(copy.querySelector(".work-feature-meta"), { y: 20, autoAlpha: 0.25 }, { y: 0, autoAlpha: 1, ease: "none" }, 0.24)
            .fromTo(copy.querySelector(".work-feature-actions"), { y: 18, autoAlpha: 0.2 }, { y: 0, autoAlpha: 1, ease: "none" }, 0.28)
            .to(visual, { scale: 1.06, clipPath: "inset(0% 0% 0% 0% round 4px)", ease: "none" }, 0.76)
            // Let scenes recede without pulling the readable copy into the clipped edge.
            .to(copy, { xPercent: -1.5, yPercent: -3, opacity: 0.65, ease: "none" }, 0.78);
        });
      });

    responsiveMotion.add("(max-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
        root.querySelectorAll("[data-work-feature]").forEach((scene) => {
          const visual = scene.querySelector(".work-feature-visual");
          const copy = scene.querySelector(".work-feature-copy");
          gsap.from(visual, {
            clipPath: "inset(0% 0% 9% 0% round 18px)",
            y: 24,
            immediateRender: false,
            ease: "power2.out",
            scrollTrigger: { trigger: scene, start: "top 88%", end: "top 52%", toggleActions: "play none play reverse" },
          });
          gsap.from(copy, {
            y: 22,
            autoAlpha: 0.75,
            immediateRender: false,
            ease: "power2.out",
            scrollTrigger: { trigger: scene, start: "top 84%", end: "top 55%", toggleActions: "play none play reverse" },
          });
        });
      });

    let refreshFrame = 0;
    let disposed = false;
    const refresh = () => {
      if (disposed) return;
      window.cancelAnimationFrame(refreshFrame);
      refreshFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh());
    };
    const onImageLoad = (event) => {
      if (event.target instanceof HTMLImageElement) refresh();
    };
    root.addEventListener("load", onImageLoad, true);
    document.fonts?.ready.then(refresh).catch(() => {});
    refresh();

    return () => {
      disposed = true;
      window.cancelAnimationFrame(refreshFrame);
      root.removeEventListener("load", onImageLoad, true);
      responsiveMotion.revert();
    };
  }, [activeFilter]);

  return (
    <section className="section projects-section" aria-labelledby="works-title" data-story="projects" ref={rootRef}>
      <div className="page-container work-exhibition">
        <header className="project-heading nav-anchor-target" id="works">
          <div>
            <p className="section-kicker">02 / Digital exhibition</p>
            <h2 className="section-title" id="works-title">Selected work<span aria-hidden="true">.</span></h2>
          </div>
          <p className="work-heading-note">A collection of products and experiences, shaped from first idea to launch.</p>
        </header>

        <div className="project-filter-row">
          <div className="project-filters" role="group" aria-label="Filter projects by category">
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
            {String(filteredProjects.length).padStart(2, "0")} projects
          </span>
        </div>

        {filteredProjects.length > 0 && (
          <div className="work-feature-list" aria-label="Projects">
            {filteredProjects.map((project, index) => (
              <WorkFeature key={project.name} project={project} index={index} total={filteredProjects.length} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
