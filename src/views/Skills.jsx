import Reveal from "../components/Reveal";

const containerClass = "mx-auto w-full max-w-[90rem] px-5 sm:px-8 md:px-12 lg:px-20 2xl:max-w-none 2xl:px-[clamp(6rem,7vw,13.75rem)]";

const featuredSkills = new Set(["C#", ".NET", "ASP.NET Core", "React", "TypeScript"]);

const skillGroups = [
  {
    title: "Languages",
    skills: ["TypeScript", "JavaScript", "C#", "Python", "SQL", "Java"],
  },
  {
    title: "Frontend & mobile",
    skills: ["React", "Next.js", "Vue.js", "Pinia", "Vuetify", "React Native", "Expo", "Redux Toolkit", "Tailwind CSS"],
  },
  {
    title: "Backend & APIs",
    skills: [".NET", "ASP.NET Core", "Node.js", "NestJS", "Express.js", "FastAPI", "Spring / Spring Boot", "REST APIs", "GraphQL", "Medusa.js"],
  },
  {
    title: "Data & infrastructure",
    skills: ["PostgreSQL", "MySQL", "MongoDB", "Neon", "Drizzle ORM", "Prisma", "Database modeling", "Redis", "Amazon SQS", "AWS S3", "Vector stores"],
  },
  {
    title: "AI & security",
    skills: ["LLM integrations", "RAG", "Embeddings", "Vector search", "Model Context Protocol (MCP)", "Google OAuth", "Authentication", "Authorization", "RBAC"],
  },
  {
    title: "Delivery & quality",
    skills: ["Vercel", "Git", "GitHub", "Docker", "CI/CD", "Jest", "Playwright", "React Testing Library", "Jira", "Confluence"],
  },
];

export default function Skills() {
  return (
    <section className="relative overflow-hidden bg-ink/88 py-[4.5rem]">
      <div className={containerClass}>
        <Reveal>
          <p className="m-0 text-xs font-bold uppercase tracking-[0.14em] text-amber">Toolkit</p>
          <h2 className="mt-3 text-[clamp(1.9rem,3.4vw,3rem)] font-semibold leading-none tracking-[-0.06em] text-copy">From interfaces to infrastructure.</h2>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-muted">Languages, frameworks, and tools used across web, mobile, SaaS, commerce, and AI products.</p>
        </Reveal>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3" aria-label="Technologies and tools">
          {skillGroups.map((group, index) => (
            <Reveal key={group.title} delay={index * 0.045} direction={index % 2 === 0 ? "up" : "left"}>
              <article className="h-full rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.055] to-panel/75 p-5 transition duration-300 hover:-translate-y-1 hover:border-amber/35">
                <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
                  <h3 className="text-sm font-semibold text-copy">{group.title}</h3>
                  <span className="font-mono text-[0.65rem] text-amber/70">{String(index + 1).padStart(2, "0")}</span>
                </div>
                <ul className="mt-4 flex flex-wrap gap-2" aria-label={group.title}>
                  {group.skills.map((skill) => (
                    <li
                      key={skill}
                      className={`rounded-full border px-3 py-1.5 text-[0.68rem] font-medium leading-5 transition ${
                        featuredSkills.has(skill)
                          ? "border-amber/35 bg-amber/[0.09] text-amber-light"
                          : "border-white/10 bg-ink/45 text-muted"
                      }`}
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
