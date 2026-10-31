import Image from "next/image";
import Reveal from "../components/Reveal";

const experience = [
  {
    year: "2022",
    period: "Oct 2022 - Mar 2024",
    role: "Junior Frontend Developer",
    company: "Leopard Tech Labs, Kanjirappally, Kerala",
    country: "India",
    countryMap: "/company/india-outline.svg",
    focus: "Built Vue booking platforms with payment integrations, increasing online bookings by 40% and supporting 15,000+ monthly reserve bookings.",
  },
  {
    year: "2024",
    period: "Apr 2024 - Aug 2025",
    role: "Software Engineer",
    company: "Turinix, Mumbai, Maharashtra",
    country: "India",
    countryMap: "/company/india-outline.svg",
    focus: "Improved a Vue food-delivery platform's page loads by 60%, supporting 5,000+ concurrent users at 99.9% uptime.",
  },
  {
    year: "2026",
    period: "Feb 2026 - Aug 2026",
    role: "Software Engineer",
    company: "Penieltech LLC, Dubai",
    country: "United Arab Emirates",
    countryMap: "/company/uae-outline.svg",
    focus: "Built SaaS HR and AI workflows, contributed to check-printing and e-invoicing software, and delivered a Medusa.js storefront.",
  },
];

export default function About() {
  return (
    <section className="bg-ink py-20 sm:py-28">
      <div className="page-container">
        <Reveal className="max-w-[46rem]">
          <p className="m-0 text-xs font-semibold uppercase tracking-[0.18em] text-muted">About</p>
          <h2 className="mt-4 max-w-[18ch] text-[clamp(2.3rem,5vw,4.5rem)] font-medium leading-[0.98] tracking-[-0.065em] text-copy">
            Clean systems.<br />Scalable products.
          </h2>
          <p className="mt-6 max-w-[39rem] text-base leading-7 text-muted sm:text-lg sm:leading-8">
            Clear interfaces, thoughtful details, reliable delivery.
          </p>
        </Reveal>

        <Reveal className="relative mt-12 grid gap-5 before:absolute before:bottom-6 before:left-[0.45rem] before:top-3 before:w-px before:bg-copy/15 md:grid-cols-3 md:gap-6 md:before:bottom-auto md:before:left-0 md:before:right-0 md:before:top-4 md:before:h-px md:before:w-auto" delay={0.1}>
          {experience.map((item) => (
            <article key={item.company + "-" + item.period} className="relative pl-8 md:pl-0 md:pt-12">
              <span className="absolute left-[0.45rem] top-1 z-10 flex size-3 -translate-x-1/2 items-center justify-center rounded-full border border-ink bg-copy ring-4 ring-ink md:left-1/2 md:top-[0.3rem]">
                <span className="sr-only">{item.year}</span>
              </span>
              <div className="h-full rounded-2xl border border-copy/10 bg-panel p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3 border-b border-copy/10 pb-4">
                  <span className="text-xs font-medium tracking-wide text-muted">{item.period}</span>
                  <span className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted">{item.year}</span>
                </div>
                <h3 className="mt-5 text-lg font-semibold leading-tight tracking-[-0.025em] text-copy">{item.role}</h3>
                <div className="mt-3 flex items-center gap-2 text-sm leading-6 text-muted">
                  <span>{item.company}</span>
                  <span className="inline-flex size-7 shrink-0 items-center justify-center" title={item.country} aria-label={item.country}>
                    <Image
                      src={item.countryMap}
                      alt=""
                      width={20}
                      height={20}
                      className="size-6 object-contain grayscale brightness-0 opacity-70"
                    />
                  </span>
                </div>
                <p className="mb-0 mt-5 border-t border-copy/10 pt-4 text-sm leading-6 text-muted">{item.focus}</p>
              </div>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
