import Image from "next/image";
import { siNodedotjs, siReact, siTypescript } from "simple-icons";

const technologies = [
  { name: "React", icon: siReact, className: "tech-float--react" },
  { name: "TypeScript", icon: siTypescript, className: "tech-float--typescript" },
  { name: "Node.js", icon: siNodedotjs, className: "tech-float--node" },
  { name: "AWS", className: "tech-float--cloud" },
];

export default function HeroVisual() {
  return (
    <div className="hero-visual" aria-label="Developer workspace with a code editor">
      <Image
        src="/developer-workspace.webp"
        alt="A dark code editor open on a laptop in a softly lit developer workspace"
        fill
        priority
        sizes="(max-width: 980px) 100vw, (max-width: 1279px) 70vw, 64vw"
        className="hero-visual-image"
      />
      <div className="orbit-path" aria-hidden="true" />
      {technologies.map((technology) => (
        <div
          className={`tech-float ${technology.className}`}
          key={technology.name}
          role="img"
          aria-label={technology.name}
        >
          {technology.icon ? (
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d={technology.icon.path} /></svg>
          ) : (
            <span className="tech-text-mark" aria-hidden="true">AWS</span>
          )}
          {technology.icon && <span>{technology.name}</span>}
        </div>
      ))}
      <span className="visual-caption"><span className="visual-live-dot" />Building for the web</span>
    </div>
  );
}
