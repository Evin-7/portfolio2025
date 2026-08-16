const containerClass = "mx-auto w-full max-w-[90rem] px-5 sm:px-8 md:px-12 lg:px-20 2xl:max-w-none 2xl:px-[clamp(6rem,7vw,13.75rem)]";
import Reveal from "../components/Reveal";
import { siNextdotjs, siPwa, siReact } from "simple-icons";

const highlights = [
  { title: "Web Development", description: "Websites and product platforms.", icon: siNextdotjs, color: "#e7e9ee" },
  { title: "App Development", description: "Clear, useful application flows.", icon: siReact, color: "#61dafb" },
  { title: "PWA Development", description: "Fast, reliable progressive apps.", icon: siPwa, color: "#d4af37" },
];

export default function Highlights() {
  return (
    <section className="relative overflow-hidden bg-ink/88 py-16 pb-10">
      <div className="pointer-events-none absolute -bottom-48 -right-36 size-[37.5rem] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.05),transparent_70%)]" aria-hidden="true" />
      <div className={`${containerClass} relative z-10`}>
        <Reveal className="grid gap-4 md:grid-cols-3" delay={0.1}>
          {highlights.map((item) => (
            <article key={item.title} className="cursor-pointer rounded-3xl border border-amber/20 bg-gradient-to-br from-panel to-panel/50 p-5 transition hover:-translate-y-1 hover:border-amber/50">
              <div className="flex items-center justify-end">
                <span className="inline-flex size-11 items-center justify-center rounded-2xl border border-amber/20 bg-ink/70 text-[var(--icon-color)]" style={{ "--icon-color": item.color }}>
                  <svg className="size-5 fill-current" viewBox="0 0 24 24" aria-hidden="true"><path d={item.icon.path} /></svg>
                </span>
              </div>
              <h3 className="mt-4 text-lg font-semibold leading-tight text-copy">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{item.description}</p>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
