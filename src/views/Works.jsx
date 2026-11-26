"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { technologyCatalog } from "../data/techStack";
import { projects } from "../data/projects";

const technologyByName = new Map(
  technologyCatalog.flatMap(({ technologies }) => technologies.map((technology) => [
    technology.name.toLowerCase().replace(/\s+\d+(?:\.\d+)*$/, ""),
    technology,
  ])),
);

function normalizeTechnologyName(name) {
  const normalized = name.toLowerCase().replace(/\s+\d+(?:\.\d+)*$/, "");
  if (normalized.startsWith("vue ")) return "vue.js";
  if (normalized === "upstash redis") return "redis";
  return normalized;
}

function TechnologyList({ technologies }) {
  if (!technologies?.length) return null;

  return (
    <ul className="work-technology-list" aria-label="Technologies used">
      {technologies.map((name) => {
        const technology = technologyByName.get(normalizeTechnologyName(name));
        const logo = technology?.logo;

        return (
          <li className="work-technology-chip" key={name}>
            {logo?.path ? (
              <svg className="work-technology-logo" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d={logo.path} />
              </svg>
            ) : null}
            <span>{name}</span>
          </li>
        );
      })}
    </ul>
  );
}

function wrapIndex(index, total) {
  return (index + total) % total;
}

function ProjectCard({ project, index, offset, cardStep, onSelect, reducedMotion, total }) {
  const distance = Math.abs(offset);
  const scale = distance === 0 ? 1.1 : distance === 1 ? 0.92 : 0.72;
  const rotation = offset === 0 ? 0 : offset < 0 ? (distance === 1 ? 13 : 20) : (distance === 1 ? -13 : -20);

  return (
    <motion.button
      className={`coverflow-card${offset === 0 ? " is-active" : ""}`}
      type="button"
      aria-label={offset === 0 ? `${project.name}, selected project` : `Show ${project.name}`}
      aria-pressed={offset === 0}
      aria-roledescription="slide"
      tabIndex={distance > 1 ? -1 : 0}
      data-offset={offset}
      style={{
        left: `calc(50% + ${offset * cardStep}px)`,
        zIndex: 5 - distance,
      }}
      animate={{
        scale,
        rotateY: rotation,
        opacity: distance === 0 ? 1 : distance === 1 ? 0.9 : 0.64,
      }}
      transition={{
        duration: reducedMotion ? 0 : 0.82,
        ease: [0.22, 1, 0.36, 1],
      }}
      onClick={() => {
        if (offset !== 0) onSelect(index);
      }}
    >
      <span className="coverflow-card-visual">
        <Image
          className={project.imageFit === "cover" ? "coverflow-card-image coverflow-card-image--cover" : "coverflow-card-image"}
          src={project.image}
          alt=""
          width={project.image.width}
          height={project.image.height}
          sizes="(max-width: 620px) 72vw, (max-width: 1199px) 46vw, 23.5vw"
          loading="eager"
        />
      </span>
      <span className="coverflow-card-caption">
        <span className="coverflow-card-name">{project.name}</span>
        <span className="coverflow-card-number" aria-hidden="true">
          {String(index + 1).padStart(2, "0")} <span>/</span> {String(total).padStart(2, "0")}
        </span>
      </span>
    </motion.button>
  );
}

export default function Works() {
  const reducedMotion = useReducedMotion();
  const stageRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [cardStep, setCardStep] = useState(280);
  const [visibleCards, setVisibleCards] = useState(2);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [pageIsVisible, setPageIsVisible] = useState(true);
  const total = projects.length;
  const activeProject = projects[activeIndex];
  const autoplayPaused = hovered || focused || dragging || !pageIsVisible || reducedMotion;

  const moveBy = useCallback((amount) => {
    setActiveIndex((current) => wrapIndex(current + amount, total));
  }, [total]);

  const selectProject = useCallback((index) => {
    setActiveIndex(wrapIndex(index, total));
  }, [total]);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;

    const updateLayout = () => {
      const width = stage.getBoundingClientRect().width;
      const mobile = width <= 620;
      const compact = width < 1200;
      const cardWidth = stage.querySelector(".coverflow-card")?.offsetWidth ?? (mobile ? Math.min(300, width * 0.72) : compact ? Math.max(230, Math.min(410, width * 0.46)) : Math.max(220, Math.min(540, width * 0.235)));
      const gap = mobile ? 14 : compact ? 22 : 28;
      const step = cardWidth * ((1.1 + 0.92) / 2) + gap;
      setVisibleCards(compact ? 1 : 2);
      setCardStep(Math.ceil(step));
    };

    updateLayout();
    const observer = new ResizeObserver(updateLayout);
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const updateVisibility = () => setPageIsVisible(!document.hidden);
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    return () => document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  useEffect(() => {
    if (autoplayPaused || total < 2) return undefined;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => wrapIndex(current + 1, total));
    }, 3500);
    return () => window.clearInterval(timer);
  }, [activeIndex, autoplayPaused, total]);

  const handleKeyDown = (event) => {
    if (event.target instanceof HTMLElement && event.target.closest("a")) return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      moveBy(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      moveBy(1);
    }
  };

  const offsets = visibleCards === 2 ? [-2, -1, 0, 1, 2] : [-1, 0, 1];

  return (
    <section className="section projects-section" aria-labelledby="works-title" data-story="projects">
      <div className="page-container work-exhibition">
        <header className="project-heading nav-anchor-target" id="works">
          <div>
            <p className="section-kicker">02 / Digital exhibition</p>
            <h2 className="section-title" id="works-title">Selected work<span aria-hidden="true">.</span></h2>
          </div>
          <Link className="work-heading-link" href="/projects">Browse all projects <span aria-hidden="true">↗</span></Link>
        </header>
      </div>

      <div
        className="coverflow-shell"
        role="region"
        aria-label="Selected project carousel"
        aria-roledescription="carousel"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setFocused(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
        }}
      >
        <motion.div
          className="coverflow-stage"
          ref={stageRef}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.08}
          dragMomentum={false}
          onDragStart={() => setDragging(true)}
          onDragEnd={(_, info) => {
            setDragging(false);
            if (info.offset.x < -48 || info.velocity.x < -500) moveBy(1);
            else if (info.offset.x > 48 || info.velocity.x > 500) moveBy(-1);
          }}
        >
          {offsets.map((offset) => {
            const index = wrapIndex(activeIndex + offset, total);
            const project = projects[index];

            return (
              <ProjectCard
                key={project.slug}
                project={project}
                index={index}
                offset={offset}
                cardStep={cardStep}
                total={total}
                reducedMotion={reducedMotion}
                onSelect={selectProject}
              />
            );
          })}
        </motion.div>
      </div>

      <div className="page-container work-exhibition">
        <div className="coverflow-controls" aria-label="Carousel controls">
          <button className="coverflow-arrow" type="button" onClick={() => moveBy(-1)} aria-label="Previous project">
            <span aria-hidden="true">←</span>
          </button>
          <p className="coverflow-counter" aria-label={`Project ${activeIndex + 1} of ${total}`}>
            <span>{String(activeIndex + 1).padStart(2, "0")}</span>
            <span className="coverflow-counter-divider" aria-hidden="true">/</span>
            <span>{String(total).padStart(2, "0")}</span>
          </p>
          <button className="coverflow-arrow" type="button" onClick={() => moveBy(1)} aria-label="Next project">
            <span aria-hidden="true">→</span>
          </button>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            className="active-project-panel"
            key={activeProject.slug}
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: reducedMotion ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
            aria-label={`${activeProject.name} project details`}
          >
            <div className="active-project-copy">
              <p className="active-project-kicker">Featured project</p>
              <h3 className="active-project-name">{activeProject.name}</h3>
              <p className="active-project-description">{activeProject.description}</p>
              <TechnologyList technologies={activeProject.technologies} />
            </div>
            <div className="active-project-actions" aria-label="Project links">
              {activeProject.links?.map((link) => (
                <a className="work-feature-link" href={link.href} key={link.href} target="_blank" rel="noopener noreferrer">
                  {link.label} <span aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
