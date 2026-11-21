export const services = [
  {
    slug: "full-stack-development",
    name: "Full-stack development",
    title: "Freelance Full-Stack Developer for Web Products",
    description: "Plan and build web applications with React, Next.js, Vue.js, TypeScript, Node.js, APIs, and databases.",
    intro: "I help shape web products from interactive frontend through API and data integration. The work is grounded in the technologies and product types shown in my portfolio, with scope agreed around your team's goals.",
    capabilities: [
      "Product interfaces and responsive application flows",
      "REST API and third-party service integration",
      "Data-backed features using PostgreSQL and other project-specific stores",
      "Commerce, booking, internal operations, and SaaS workflows",
    ],
    technologies: ["React", "Next.js", "Vue.js", "TypeScript", "Node.js", "Express.js", "PostgreSQL", "REST APIs"],
    projectSlugs: ["mezeh", "mezeh-catering", "ontix", "sitecore", "st-george-csi-church"],
  },
  {
    slug: "react-nextjs-development",
    name: "React & Next.js development",
    title: "React and Next.js Developer for Product Teams",
    description: "Build and extend React and Next.js interfaces with TypeScript, accessible components, API integration, and responsive product flows.",
    intro: "I work on React and Next.js product interfaces where clear workflows, reliable data, and maintainable components matter. I can contribute to a new product surface or extend an existing application alongside your team.",
    capabilities: [
      "React and Next.js product interfaces",
      "TypeScript components and shared UI patterns",
      "Responsive layouts and accessible interaction states",
      "API-connected dashboards, forms, and customer workflows",
    ],
    technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Vite", "REST APIs", "PostgreSQL"],
    projectSlugs: ["sitecore", "ontix", "peniel-tech", "st-george-csi-church"],
  },
  {
    slug: "mobile-app-development",
    name: "React Native mobile apps",
    title: "React Native App Developer for iOS and Android",
    description: "Develop cross-platform mobile app features with React Native, Expo, Redux Toolkit, and API-connected product flows.",
    intro: "I build mobile product experiences with React Native and Expo, connecting app screens to the product's existing APIs and state patterns. Published examples in my portfolio include ordering, employee self-service, and workplace messaging apps.",
    capabilities: [
      "Cross-platform React Native screens and app flows",
      "API-connected ordering and employee self-service features",
      "State management with Redux Toolkit where appropriate",
      "Mobile product work that complements an existing web platform",
    ],
    technologies: ["React Native", "Expo", "Redux Toolkit", "TypeScript", "WebSockets", "REST APIs"],
    projectSlugs: ["mezeh-mobile-app", "elate-hrms-app", "elate-chat"],
  },
];

export function getService(slug) {
  return services.find((service) => service.slug === slug);
}
