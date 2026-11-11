import Reveal from "../components/Reveal";
import TechCategoryRow from "../components/TechCategoryRow";
import { techCategories } from "../data/techStack";

export default function Skills() {
  return (
    <section className="section section--alternate" aria-labelledby="skills-title">
      <div className="page-container">
        <Reveal className="section-heading nav-anchor-target" id="skills">
          <p className="section-kicker">01 / Tech Stack</p>
          <h2 className="section-title" id="skills-title">
            Technologies I <span className="skill-heading-highlight">work with.</span>
          </h2>
          <p className="section-description">
            Tools used across web, mobile, SaaS, commerce, and AI products.
          </p>
        </Reveal>

        <div className="skill-groups" aria-label="Technologies and tools">
          {techCategories.map((category, index) => (
            <Reveal key={category.title} delay={index * 0.04}>
              <TechCategoryRow category={category} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
