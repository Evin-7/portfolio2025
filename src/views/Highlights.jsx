import Reveal from "../components/Reveal";
import { siNextdotjs, siPwa, siReact } from "simple-icons";

const containerClass = "mx-auto w-full max-w-[90rem] px-5 sm:px-8 md:px-12 lg:px-20 2xl:px-[clamp(6rem,7vw,13.75rem)]";

const highlights = [
  { title: "Web Development", description: "Websites and product platforms.", icon: siNextdotjs },
  { title: "App Development", description: "Clear, useful application flows.", icon: siReact },
  { title: "PWA Development", description: "Fast, reliable progressive apps.", icon: siPwa },
];

export default function Highlights() {
  return (
    <section className="border-y border-white/10 bg-panel py-8 sm:py-10">
      <div className={containerClass}>
        <Reveal className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-3">
          {highlights.map((item) => (
            <article key={item.title} className="bg-panel p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-white/15 text-copy">
                  <svg className="size-[1.1rem] fill-current" viewBox="0 0 24 24" aria-hidden="true"><path d={item.icon.path} /></svg>
                </span>
                <h3 className="text-base font-semibold tracking-[-0.02em] text-copy">{item.title}</h3>
              </div>
              <p className="mb-0 mt-3 pl-[3.25rem] text-sm leading-6 text-muted">{item.description}</p>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
