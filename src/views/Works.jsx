"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { technologyCatalog } from "../data/techStack";
import { projects } from "../data/projects";

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

const filters = [{ label: "All", value: "all" },
  { label: "Web", value: "web" },
  { label: "Mobile", value: "mobile" },
  { label: "Backend", value: "backend" },
  { label: "Full Stack", value: "full-stack" },
];

function ProjectTitle({ name, className = "" }) {
  return (
    <h3 className={className} aria-label={name}>
      <span className="sr-only">{name}</span>
      <span
        className="work-feature-title-visual"
        aria-hidden="true"
      >
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
            <a className="work-feature-link" href={link.href} key={link.href} target="_blank" rel="noopener noreferrer">
              {link.label} <span aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      </div>
      <figure className="work-feature-visual">
        <a
          className="work-feature-image-link"
          href={project.links[0].href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${project.name} in a new tab`}
        >
          <Image
            className={project.imageFit === "cover" ? "work-feature-image work-feature-image--cover" : "work-feature-image"}
            src={project.image}
            alt=""
            width={project.image.width}
            height={project.image.height}
            sizes="(max-width: 720px) 92vw, 64vw"
          />
        </a>
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
          gsap.fromTo(title, {
            yPercent: 108,
            rotateX: -40,
            autoAlpha: 0.12,
            transformOrigin: "50% 100%",
          }, {
            yPercent: 0,
            rotateX: 0,
            autoAlpha: 1,
            duration: 1,
            stagger: { each: 0.018, from: "center" },
            ease: "none",
            scrollTrigger: {
              trigger: scene,
              start: "top 88%",
              end: "top 50%",
              scrub: true,
              invalidateOnRefresh: true,
            },
          });
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
            .fromTo(copy.querySelector(".work-feature-description"), { y: 24, autoAlpha: 0.3 }, { y: 0, autoAlpha: 1, ease: "none" }, 0.18)
            .fromTo(copy.querySelector(".work-feature-meta"), { y: 20, autoAlpha: 0.25 }, { y: 0, autoAlpha: 1, ease: "none" }, 0.24)
            .fromTo(copy.querySelector(".work-feature-actions"), { y: 18, autoAlpha: 0.2 }, { y: 0, autoAlpha: 1, ease: "none" }, 0.28)
            .to(visual, { scale: 1.06, clipPath: "inset(0% 0% 0% 0% round 4px)", ease: "none" }, 0.76)
            // Keep the copy inside the card’s clipped bounds as the scene recedes.
            .to(copy, { yPercent: -3, opacity: 0.65, ease: "none" }, 0.78);
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
          <Link className="work-heading-link" href="/projects">Browse all projects <span aria-hidden="true">↗</span></Link>
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
