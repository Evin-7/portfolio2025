import Reveal from "../components/Reveal";
import { siNextdotjs, siNodedotjs, siReact, siTypescript, siVuedotjs } from "simple-icons";

const featuredMarks = {
  React: siReact,
  TypeScript: siTypescript,
  "Next.js": siNextdotjs,
  "Node.js": siNodedotjs,
  "Vue.js": siVuedotjs,
};

const skillGroups = [
  { title: "Languages", skills: ["TypeScript", "JavaScript", "Python", "SQL", "Java"] },
  { title: "Frontend & mobile", skills: ["React", "Next.js", "Vue.js", "Pinia", "Vuetify", "React Native", "Expo", "Redux Toolkit", "Tailwind CSS"] },
  { title: "Backend & APIs", skills: ["Node.js", "NestJS", "Express.js", "FastAPI", "Spring / Spring Boot", "REST APIs", "GraphQL", "Medusa.js"] },
  { title: "Data & infrastructure", skills: ["PostgreSQL", "MySQL", "MongoDB", "Neon", "Drizzle ORM", "Prisma", "Database modeling", "Redis", "Amazon SQS", "AWS S3", "Vector stores"] },
  { title: "AI & security", skills: ["LLM integrations", "RAG", "Embeddings", "Vector search", "Model Context Protocol (MCP)", "Google OAuth", "Authentication", "Authorization", "RBAC"] },
  { title: "Delivery & quality", skills: ["Vercel", "Git", "GitHub", "Docker", "CI/CD", "Jest", "Playwright", "React Testing Library", "Jira", "Confluence"] },
];

export default function Skills() {
  return (
    <section className="section section--alternate" aria-labelledby="skills-title">
      <div className="page-container">
        <Reveal className="section-heading">
          <p className="section-kicker">02 / Tech Stack</p>
          <h2 className="section-title" id="skills-title">Technologies I work with.</h2>
          <p className="section-description">Tools used across web, mobile, SaaS, commerce, and AI products.</p>
        </Reveal>

        <div className="skill-groups" aria-label="Technologies and tools">
          {skillGroups.map((group, index) => (
            <Reveal key={group.title} delay={index * 0.04}>
              <article className="skill-group">
                <div className="skill-group-heading">
                  <h3>{group.title}</h3>
                  <span className="skill-group-number">{String(index + 1).padStart(2, "0")}</span>
                </div>
                <ul className="skill-list" aria-label={group.title}>
                  {group.skills.map((skill) => {
                    const mark = featuredMarks[skill];
                    return (
                      <li className="skill-chip" key={skill}>
                        {mark ? <svg className="skill-chip-mark" viewBox="0 0 24 24" aria-hidden="true"><path d={mark.path} /></svg> : null}
                        {skill}
                      </li>
                    );
                  })}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
