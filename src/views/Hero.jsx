import HeroVisual from "../components/HeroVisual";

function StatIcon({ kind }) {
  const paths = {
    code: "M8 5 3 12l5 7M16 5l5 7-5 7M14 3l-4 18",
    layers: "m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5",
    product: "M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v13a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 18.5v-13ZM8 8h8M8 12h8M8 16h5",
  };

  return (
    <svg className="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={paths[kind]} />
    </svg>
  );
}

const stats = [
  { value: "4+", label: "Years Experience", icon: "code" },
  { value: "19", label: "Projects Built", icon: "layers" },
  { value: "End-to-End", label: "Product Development", icon: "product" },
];

export default function Hero() {
  return (
    <section className="hero-section" aria-labelledby="hero-title">
      <div className="page-container hero-grid">
        <div className="hero-copy">
          <h1 className="hero-title" id="hero-title">
            <span className="hero-title-line">Hi, I’m</span>
            <span className="hero-title-line hero-title-name">Evin Leyander</span>
          </h1>
          <p className="hero-role">Full Stack Software Engineer</p>
          <p className="hero-description">
            I design and build scalable, user-focused web and mobile applications using React, TypeScript, Next.js, Node.js, and cloud technologies.
          </p>
          <div className="hero-ctas">
            <a className="button button--primary" href="#works">
              View Projects <span aria-hidden="true">→</span>
            </a>
            <a className="button button--outline" href="#contact">
              <svg className="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg>
              Get in Touch
            </a>
          </div>
        </div>

        <HeroVisual />

        <div className="hero-stats" aria-label="Experience highlights">
          {stats.map((stat) => (
            <div className="stat" key={stat.label}>
              <StatIcon kind={stat.icon} />
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
