"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function ScrollStories() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      const hero = document.querySelector(".hero-section");
      const heroTitle = hero?.querySelector(".hero-title");
      const heroParallax = hero?.querySelector(".hero-parallax-layer");

      if (hero && heroTitle) {
        gsap.fromTo(heroTitle, {
          yPercent: 0,
          scale: 1,
          transformOrigin: "50% 0%",
        }, {
          yPercent: -20,
          scale: 0.78,
          opacity: 0.35,
          ease: "none",
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: 0.7,
          },
        });
      }

      if (hero && heroParallax) {
        gsap.to(heroParallax, {
          scale: 1.12,
          yPercent: 11,
          ease: "none",
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });
      }

      // Keep the compact stacked rows readable without scroll-linked transforms.
      // Their existing in-view reveal still provides a lightweight entrance.
      if (!window.matchMedia("(max-width: 620px)").matches) {
        gsap.utils.toArray("[data-story='highlights'] .highlight-item").forEach((item, index) => {
          const heading = item.querySelector(".highlight-heading");
          const detail = item.querySelector("p");
          if (!heading || !detail) return;

          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: item,
              start: "top 92%",
              end: "top 58%",
              scrub: 0.7,
            },
          });
          timeline
            .fromTo(heading, { y: index % 2 ? 34 : 52, rotateX: index % 2 ? 22 : -22, transformOrigin: "50% 100%" }, { y: 0, rotateX: 0, ease: "none" })
            .fromTo(detail, { x: index % 2 ? -24 : 24, clipPath: "inset(0 100% 0 0)" }, { x: 0, clipPath: "inset(0 0% 0 0)", ease: "none" }, 0.08);
        });
      }

      gsap.utils.toArray("[data-story='skills'] .skill-group").forEach((row, index) => {
        const direction = index % 2 === 0 ? -1 : 1;
        gsap.fromTo(row, {
          xPercent: direction * 12,
          rotateY: direction * -7,
          clipPath: direction < 0 ? "inset(0 0 0 14%)" : "inset(0 14% 0 0)",
          transformPerspective: 1000,
        }, {
          xPercent: 0,
          rotateY: 0,
          clipPath: "inset(0 0 0 0)",
          ease: "none",
          scrollTrigger: {
            trigger: row,
            start: "top 88%",
            end: "top 54%",
            scrub: 0.65,
          },
        });
      });

      const experienceList = document.querySelector("[data-story='experience'] .experience-list");
      if (experienceList) {
        gsap.set(experienceList, { "--timeline-progress": 0 });
        gsap.to(experienceList, {
          "--timeline-progress": 1,
          ease: "none",
          scrollTrigger: {
            trigger: experienceList,
            start: "top 78%",
            end: "bottom 64%",
            scrub: true,
          },
        });

        gsap.utils.toArray("[data-story='experience'] .experience-card").forEach((card, index) => {
          const direction = index % 2 === 0 ? -1 : 1;
          gsap.fromTo(card, {
            x: direction * 54,
            rotateY: direction * -5,
            clipPath: direction < 0 ? "inset(0 0 0 20% round 16px)" : "inset(0 20% 0 0 round 16px)",
          }, {
            x: 0,
            rotateY: 0,
            clipPath: "inset(0 0 0 0 round 16px)",
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              end: "top 60%",
              scrub: 0.6,
            },
          });
        });
      }

      const contact = document.querySelector("[data-story='contact']");
      const contactTitle = contact?.querySelector(".section-title");
      const contactForm = contact?.querySelector(".contact-form");
      if (contact && contactTitle) {
        gsap.fromTo(contactTitle, {
          xPercent: -12,
          yPercent: 12,
          scale: 0.86,
          rotate: -2,
          clipPath: "inset(0 0 100% 0)",
        }, {
          xPercent: 0,
          yPercent: 0,
          scale: 1,
          rotate: 0,
          clipPath: "inset(0 0 0 0)",
          ease: "none",
          scrollTrigger: {
            trigger: contact,
            start: "top 78%",
            end: "top 28%",
            scrub: 0.8,
          },
        });
      }
      if (contact && contactForm) {
        gsap.fromTo(contactForm, {
          y: 64,
          rotateX: -8,
          scale: 0.94,
          transformPerspective: 1100,
        }, {
          y: 0,
          rotateX: 0,
          scale: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: contactForm,
            start: "top 91%",
            end: "top 55%",
            scrub: 0.65,
          },
        });
      }
    });

    const refreshFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      window.cancelAnimationFrame(refreshFrame);
      context.revert();
    };
  }, [pathname]);

  return null;
}
