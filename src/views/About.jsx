import Reveal from "../components/Reveal";

const principles = [
  { title: "Build around people", description: "Start with the problem and make everyday product flows feel clear and considered." },
  { title: "Keep systems understandable", description: "Choose maintainable structures that help teams make changes with confidence." },
  { title: "Own the whole journey", description: "Move comfortably from interface and APIs through integration, delivery, and iteration." },
];

export default function About() {
  return (
    <section className="section" aria-labelledby="about-title">
      <div className="page-container about-layout">
        <Reveal className="about-copy">
          <p className="section-kicker">01 / About</p>
          <h2 className="section-title" id="about-title">Engineering products with purpose.</h2>
          <p>
            I’m a software engineer with more than four years of experience building production web and mobile applications. My work spans React and Vue interfaces, backend services, SaaS platforms, commerce, and AI-powered workflows.
          </p>
          <p>
            I care about the details that make software dependable: clear interfaces, thoughtful architecture, useful feedback, and steady collaboration from the first requirement through delivery.
          </p>
          <div className="about-note">A practical, product-minded approach to building software people can rely on.</div>
        </Reveal>

        <Reveal className="about-points" delay={0.1}>
          {principles.map((principle, index) => (
            <article className="about-point" key={principle.title}>
              <span className="about-point-number" aria-hidden="true">0{index + 1}</span>
              <div>
                <h3>{principle.title}</h3>
                <p>{principle.description}</p>
              </div>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
