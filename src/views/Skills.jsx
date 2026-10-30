import Reveal from "../components/Reveal";

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
    <section className="border-y border-white/10 bg-panel py-20 sm:py-28">
      <div className="page-container">
        <Reveal className="max-w-[54rem]">
          <p className="m-0 text-xs font-semibold uppercase tracking-[0.18em] text-muted">Toolkit</p>
          <h2 className="mt-4 text-[clamp(2rem,4vw,3.5rem)] font-medium leading-[1.02] tracking-[-0.06em] text-copy">
            From interfaces to infrastructure.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted">
            Languages, frameworks, and tools used across web, mobile, SaaS, commerce, and AI products.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-3 md:grid-cols-2 xl:grid-cols-3" aria-label="Technologies and tools">
          {skillGroups.map((group, index) => (
            <Reveal key={group.title} delay={index * 0.04}>
              <article className="h-full rounded-2xl border border-white/10 bg-ink p-5 transition-colors hover:border-white/30 sm:p-6">
                <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <h3 className="text-sm font-semibold text-copy">{group.title}</h3>
                  <span className="text-xs text-muted">{String(index + 1).padStart(2, "0")}</span>
                </div>
                <ul className="mt-4 flex flex-wrap gap-2" aria-label={group.title}>
                  {group.skills.map((skill) => (
                    <li
                      key={skill}
                      className={"rounded-full border px-3 py-1.5 text-[0.7rem] font-medium leading-5 transition-colors " + (
                        featuredSkills.has(skill)
                          ? "border-white/30 bg-white/[0.08] text-copy"
                          : "border-white/10 text-muted"
                      )}
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
