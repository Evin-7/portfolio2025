import {
  siConfluence,
  siChartdotjs,
  siD3,
  siDocker,
  siDrizzle,
  siExpress,
  siExpo,
  siFastapi,
  siGit,
  siGithub,
  siGoogle,
  siGraphql,
  siJest,
  siJavascript,
  siJira,
  siMedusa,
  siMongodb,
  siMysql,
  siNeon,
  siNextdotjs,
  siNodedotjs,
  siOpenapiinitiative,
  siPinia,
  siPostgresql,
  siPrisma,
  siPython,
  siReact,
  siRedis,
  siRedux,
  siSpringboot,
  siTailwindcss,
  siThreedotjs,
  siTestinglibrary,
  siTypescript,
  siVercel,
  siVuedotjs,
  siVuetify,
} from "simple-icons";

const catalogGroups = [
  {
    title: "Languages",
    technologies: [
      { name: "TypeScript", logo: siTypescript },
      { name: "JavaScript", logo: siJavascript },
      { name: "Python", logo: siPython },
      { name: "SQL" },
      { name: "Java" },
    ],
  },
  {
    title: "Frontend & Web",
    technologies: [
      { name: "React", logo: siReact },
      { name: "Next.js", logo: siNextdotjs },
      { name: "Vue.js", logo: siVuedotjs },
      { name: "Pinia", logo: siPinia },
      { name: "Vuetify", logo: siVuetify },
      { name: "Redux Toolkit", logo: siRedux },
      { name: "Tailwind CSS", logo: siTailwindcss },
    ],
  },
  {
    title: "Visualization & 3D",
    technologies: [
      { name: "Chart.js", logo: siChartdotjs },
      { name: "D3", logo: siD3 },
      { name: "Three.js", logo: siThreedotjs },
      { name: "React Three Fiber", logo: siReact },
      { name: "Drei", logo: siThreedotjs },
    ],
  },
  {
    title: "Mobile Development",
    technologies: [
      { name: "React Native", logo: siReact },
      { name: "Expo", logo: siExpo },
      { name: "NativeWind", logo: siTailwindcss },
    ],
  },
  {
    title: "Backend & APIs",
    technologies: [
      { name: "Node.js", logo: siNodedotjs },
      { name: "Express.js", logo: siExpress },
      { name: "FastAPI", logo: siFastapi },
      { name: "Spring / Spring Boot", logo: siSpringboot },
      { name: "REST APIs", logo: siOpenapiinitiative },
      { name: "GraphQL", logo: siGraphql },
      { name: "Medusa.js", logo: siMedusa },
    ],
  },
  {
    title: "Databases & Messaging",
    technologies: [
      { name: "PostgreSQL", logo: siPostgresql },
      { name: "MySQL", logo: siMysql },
      { name: "MongoDB", logo: siMongodb },
      { name: "Neon", logo: siNeon },
      { name: "Drizzle ORM", logo: siDrizzle },
      { name: "Prisma", logo: siPrisma },
      { name: "Database modeling" },
      { name: "Redis", logo: siRedis },
      { name: "Amazon SQS", icon: "cloud" },
      { name: "AWS S3", icon: "cloud" },
      { name: "Vector stores" },
    ],
  },
  {
    title: "Cloud & Developer Tools",
    technologies: [
      { name: "Vercel", logo: siVercel },
      { name: "Git", logo: siGit },
      { name: "GitHub", logo: siGithub },
      { name: "Docker", logo: siDocker },
      { name: "CI/CD" },
      { name: "Jest", logo: siJest },
      { name: "Playwright" },
      { name: "React Testing Library", logo: siTestinglibrary },
      { name: "Jira", logo: siJira },
      { name: "Confluence", logo: siConfluence },
    ],
  },
  {
    title: "Additional technologies & concepts",
    technologies: [
      { name: "LLM integrations" },
      { name: "RAG" },
      { name: "Embeddings" },
      { name: "Vector search" },
      { name: "Model Context Protocol (MCP)" },
      { name: "Google OAuth", logo: siGoogle },
      { name: "Authentication" },
      { name: "Authorization" },
      { name: "RBAC" },
    ],
  },
];

// Keep the full set of skills previously shown on the portfolio available in data.
// Only the curated names below are rendered in the primary Tech Stack grid.
export const technologyCatalog = catalogGroups;

const primaryGroups = [
  {
    title: "Frontend & Web",
    description: "Build responsive and modern web interfaces",
    icon: "browser",
    featured: ["React", "Next.js", "Vue.js", "Tailwind CSS", "Vuetify", "Redux Toolkit"],
  },
  {
    title: "Visualization & 3D",
    description: "Build data visualizations and interactive 3D experiences",
    icon: "visualization",
    featured: ["Chart.js", "D3", "Three.js", "React Three Fiber", "Drei"],
  },
  {
    title: "Mobile Development",
    description: "Build native-feeling applications for iOS and Android",
    icon: "mobile",
    featured: ["React Native", "Expo", "NativeWind"],
  },
  {
    title: "Backend & APIs",
    description: "Build scalable services and integrations",
    icon: "server",
    featured: ["Node.js", "Express.js", "FastAPI", "REST APIs"],
  },
  {
    title: "Databases & Messaging",
    description: "Data storage and asynchronous communication",
    icon: "database",
    featured: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Amazon SQS"],
  },
  {
    title: "Cloud & Dev Tools",
    description: "Deployment, versioning and project collaboration",
    icon: "cloud",
    featured: ["AWS S3", "Docker", "Git", "GitHub", "Vercel", "Jira"],
  },
];

const technologyByName = new Map(
  catalogGroups.flatMap(({ technologies }) => technologies).map((technology) => [technology.name, technology]),
);

export const techCategories = primaryGroups.map(({ featured, ...category }) => ({
  ...category,
  technologies: featured.map((name) => technologyByName.get(name)),
}));
