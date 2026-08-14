import Image from "next/image";
import Reveal from "../components/Reveal";

const containerClass = "mx-auto w-full max-w-[90rem] px-5 sm:px-8 md:px-12 lg:px-20 2xl:max-w-none 2xl:px-[clamp(6rem,7vw,13.75rem)]";


const experience = [
  {
    year: "2022",
    period: "Oct 2022 - Mar 2024",
    role: "Frontend Developer",
    company: "Leopard Tech Labs, Kanjirappally, Kerala",
    country: "India",
    countryMap: "/company/india-outline.svg",
  },
  {
    year: "2024",
    period: "Apr 2024 - Jan 2026",
    role: "Software Engineer",
    company: "Turinix, Mumbai, Maharashtra",
    country: "India",
    countryMap: "/company/india-outline.svg",
  },
  {
    year: "2026",
    period: "Feb 2026 - Present",
    role: "Senior Software Engineer",
    company: "Penieltech LLC, Dubai",
    country: "United Arab Emirates",
    countryMap: "/company/uae-outline.svg",
  },
];

export default function About() {
  return (
    <section className="relative overflow-hidden bg-ink py-[5.5rem]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(212,175,55,0.03),transparent_60%)]" aria-hidden="true" />
      <div className={`${containerClass} relative z-10`}>
        <Reveal className="max-w-[45rem]">
          <p className="m-0 text-xs font-bold uppercase tracking-[0.12em] text-amber">About</p>
          <h2 className="mt-3 max-w-[18ch] bg-gradient-to-br from-copy to-amber-light bg-clip-text text-[clamp(2.2rem,5vw,4rem)] font-semibold leading-tight tracking-[-0.055em] text-transparent">Clean systems.<br />Scalable products.</h2>
          <p className="mt-5 max-w-[39rem] text-base leading-7 text-muted">Clear interfaces, thoughtful details, reliable delivery.</p>
        </Reveal>

        <Reveal className="relative mt-10 grid gap-8 pl-16 before:absolute before:bottom-5 before:left-6 before:top-5 before:w-px before:bg-gradient-to-b before:from-amber before:via-amber/60 before:to-cyan/40 md:grid-cols-3 md:gap-5 md:pl-0 md:before:bottom-auto md:before:left-0 md:before:right-0 md:before:top-5 md:before:h-px md:before:w-auto md:before:bg-gradient-to-r md:before:from-amber md:before:via-amber/60 md:before:to-cyan/40" delay={0.1}>
          {experience.map((item) => (
            <article key={item.role} className="relative pt-0 md:pt-12">
              <span className="absolute -left-8 top-0 z-10 flex size-10 -translate-x-1/2 items-center justify-center rounded-full border-2 border-ink bg-amber text-[0.58rem] font-bold text-ink shadow-[0_0_0_4px_rgba(212,175,55,0.14)] md:left-1/2 md:top-0" aria-hidden="true">{item.year}</span>
              <div className="cursor-pointer rounded-3xl border border-amber/20 bg-gradient-to-br from-panel to-panel/50 p-5 transition hover:-translate-y-1 hover:border-amber">
                <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
                  <span className="font-mono text-sm font-semibold text-amber">{item.period}</span>
                </div>
                <h3 className="mt-4 text-base font-semibold leading-tight text-copy">{item.role}</h3>
                <div className="mt-2 flex items-center gap-2 text-xs leading-relaxed text-muted">
                  <span>{item.company}</span>
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-md border border-amber/45 bg-amber/10 text-amber" title={item.country} aria-label={item.country}>
                    <Image
                      src={item.countryMap}
                      alt=""
                      width={20}
                      height={20}
                      className="size-6 object-contain opacity-100 [filter:brightness(0)_saturate(100%)_invert(76%)_sepia(57%)_saturate(686%)_hue-rotate(4deg)_brightness(91%)_contrast(87%)]"
                    />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
