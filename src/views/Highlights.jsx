import Reveal from "../components/Reveal";
import { siNextdotjs, siPwa, siReact } from "simple-icons";

const highlights = [
  { title: "Web Development", description: "Websites and product platforms.", icon: siNextdotjs },
  { title: "App Development", description: "Clear, useful application flows.", icon: siReact },
  { title: "PWA Development", description: "Fast, reliable progressive apps.", icon: siPwa },
];

export default function Highlights() {
  return (
    <section className="highlight-section" aria-label="Areas of focus">
      <div className="page-container highlight-grid">
        {highlights.map((item, index) => (
          <Reveal className="highlight-item" key={item.title} delay={index * 0.05}>
            <div className="highlight-heading">
              <svg className="highlight-icon" viewBox="0 0 24 24" aria-hidden="true"><path d={item.icon.path} /></svg>
              <h2>{item.title}</h2>
            </div>
            <p>{item.description}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
