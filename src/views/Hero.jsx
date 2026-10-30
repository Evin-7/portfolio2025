import Image from "next/image";
import portrait from "../assets/images/evin-portrait.webp";

const containerClass = "mx-auto grid w-full max-w-[90rem] items-center gap-8 px-5 sm:px-8 md:px-12 lg:grid-cols-[1.04fr_0.96fr] lg:gap-12 lg:px-20 2xl:px-[clamp(6rem,7vw,13.75rem)]";

export default function Hero() {
  return (
    <section className="bg-ink pb-8 pt-24 sm:pb-12 sm:pt-28 lg:min-h-[calc(100svh-1rem)] lg:py-24">
      <div className={containerClass}>
        <div className="relative z-10 order-2 max-w-[44rem] py-2 lg:col-start-1 lg:row-start-1 lg:order-1 lg:py-10">
          <p className="mb-7 flex items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-muted sm:mb-9">
            <span className="h-px w-8 bg-subtle" aria-hidden="true" />
            Portfolio · 2026
          </p>
          <h1 className="text-[clamp(3.4rem,8vw,7.4rem)] font-semibold uppercase leading-[0.83] tracking-[-0.085em] text-copy">
            Evin
            <span className="mt-2 block text-subtle">Leyander</span>
          </h1>
          <p className="mt-8 text-[clamp(1.15rem,2vw,1.55rem)] font-medium tracking-[-0.035em] text-copy">
            Full Stack Software Engineer
          </p>
          <p className="mt-4 max-w-[39rem] text-[0.98rem] leading-7 text-muted sm:text-[1.05rem] sm:leading-8">
            For 4 years, I’ve built and shipped thoughtful digital products across React, TypeScript, Next.js, Node.js, .NET, and AI-powered software.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#works" className="inline-flex min-h-12 items-center justify-center rounded-full bg-copy px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-muted">
              View Projects <span className="ml-2" aria-hidden="true">↗</span>
            </a>
            <a href="/resume" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-copy transition-colors hover:border-white/60 hover:bg-white/[0.06]">
              Download Resume <span className="ml-2 text-subtle" aria-hidden="true">↓</span>
            </a>
            <a href="#contact" className="inline-flex min-h-12 items-center px-3 py-3 text-sm font-medium text-muted transition-colors hover:text-copy">
              Contact Me <span className="ml-2" aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        <div className="relative order-1 mx-auto w-full max-w-[31rem] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:order-2 lg:mx-0 lg:ml-auto lg:max-w-[35rem]">
          <Image
            src={portrait}
            alt="Evin Leyander wearing a black three-piece suit"
            priority
            sizes="(max-width: 1023px) 88vw, (max-width: 1440px) 42vw, 35rem"
            className="mx-auto block h-auto max-h-[78svh] w-full object-contain object-bottom"
          />
        </div>

        <div className="order-3 flex flex-wrap gap-x-9 gap-y-4 border-t border-white/15 pt-6 lg:col-start-1 lg:row-start-2">
          <div className="grid gap-1">
            <strong className="text-2xl font-medium tracking-[-0.06em] text-copy">4+</strong>
            <span className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-muted">Years shipping</span>
          </div>
          <div className="grid gap-1">
            <strong className="text-2xl font-medium tracking-[-0.06em] text-copy">20+</strong>
            <span className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-muted">Products built</span>
          </div>
          <div className="grid gap-1">
            <strong className="text-2xl font-medium tracking-[-0.06em] text-copy">∞</strong>
            <span className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-muted">Curiosity</span>
          </div>
        </div>
      </div>
    </section>
  );
}
