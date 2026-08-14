import {
  siConfluence,
  siGit,
  siGithub,
  siJira,
  siMedusa,
  siNodedotjs,
  siNestjs,
  siNextdotjs,
  siReact,
  siSpringboot,
  siVuedotjs,
} from "simple-icons";
import Reveal from "../components/Reveal";

const containerClass = "mx-auto w-full max-w-[90rem] px-5 sm:px-8 md:px-12 lg:px-20 2xl:max-w-none 2xl:px-[clamp(6rem,7vw,13.75rem)]";

const skills = [
  { name: "Vue", icon: siVuedotjs, color: "#42b883" },
  { name: "React", icon: siReact, color: "#61dafb" },
  { name: "Next.js", icon: siNextdotjs, color: "#f5f5f5" },
  { name: "React Native", icon: siReact, color: "#61dafb" },
  { name: "Node.js", icon: siNodedotjs, color: "#8cc84b" },
  { name: "NestJS", icon: siNestjs, color: "#e0234e" },
  { name: "Spring Boot", icon: siSpringboot, color: "#6db33f" },
  { name: "Medusa.js", icon: siMedusa, color: "#e6cb77" },
  { name: "Git", icon: siGit, color: "#f05032" },
  { name: "GitHub", icon: siGithub, color: "#f5f5f5" },
  { name: "Jira", icon: siJira, color: "#579dff" },
  { name: "Confluence", icon: siConfluence, color: "#7c9cff" },
];

export default function Skills() {
  return (
    <section className="relative overflow-hidden bg-ink py-[4.5rem]">
      <div className={containerClass}>
        <Reveal>
          <p className="m-0 text-xs font-bold uppercase tracking-[0.14em] text-amber">Toolkit</p>
          <h2 className="mt-3 text-[clamp(1.9rem,3.4vw,3rem)] font-semibold leading-none tracking-[-0.06em] text-copy">Core stack.</h2>
        </Reveal>

        <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6" role="list" aria-label="Core technologies and tools">
          {skills.map((skill, index) => (
            <Reveal key={skill.name} delay={index * 0.045} direction={index % 2 === 0 ? "up" : "left"}>
              <div className="flex min-h-20 cursor-pointer items-center gap-3 rounded-2xl border border-amber/15 bg-gradient-to-br from-white/[0.08] to-panel-alt/90 px-3 py-3 text-xs font-semibold text-copy transition hover:-translate-y-1 hover:border-amber/50" role="listitem">
                <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-ink/70 text-[var(--icon-color)]" style={{ "--icon-color": skill.color }}>
                  <svg className="size-[1.1rem] fill-current" viewBox="0 0 24 24" aria-hidden="true"><path d={skill.icon.path} /></svg>
                </span>
                <span>{skill.name}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
