const categoryPaths = {
  browser: "M4 5.5h16a1.5 1.5 0 0 1 1.5 1.5v10a1.5 1.5 0 0 1-1.5 1.5H4A1.5 1.5 0 0 1 2.5 17V7A1.5 1.5 0 0 1 4 5.5ZM2.5 9.5h19M6 7.5h.01M9 7.5h.01",
  server: "M4 4h16v6H4zM4 14h16v6H4zM7 7h.01M7 17h.01M11 7h6M11 17h6",
  mobile: "M7 2.75h10A1.75 1.75 0 0 1 18.75 4.5v15A1.75 1.75 0 0 1 17 21.25H7A1.75 1.75 0 0 1 5.25 19.5v-15A1.75 1.75 0 0 1 7 2.75ZM5.5 17.5h13M10 5.5h4M11.5 19.25h1",
  database: "M12 3C7.3 3 3.5 4.35 3.5 6s3.8 3 8.5 3 8.5-1.35 8.5-3S16.7 3 12 3ZM3.5 6v12c0 1.66 3.8 3 8.5 3s8.5-1.34 8.5-3V6M3.5 12c0 1.66 3.8 3 8.5 3s8.5-1.34 8.5-3",
  cloud: "M7.5 18.5h9a4.5 4.5 0 0 0 .35-8.99A5.75 5.75 0 0 0 5.8 8.25a5.15 5.15 0 0 0 1.7 10.25ZM12 12v6m-2.5-3.5L12 12l2.5 2.5",
  visualization: "M3 3v18h18M7 14l4-4 4 4 6-8",
};

function CategoryIcon({ kind }) {
  return (
    <span className="skill-category-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">
        <path d={categoryPaths[kind]} />
      </svg>
    </span>
  );
}

function technologyColor(hex) {
  const channels = [0, 2, 4].map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255);
  const linear = channels.map((channel) => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
  const luminance = (linear[0] * 0.2126) + (linear[1] * 0.7152) + (linear[2] * 0.0722);
  return luminance < 0.13 ? "var(--text-secondary)" : `#${hex}`;
}

function TechnologyBadge({ technology }) {
  const { name, logo, icon } = technology;

  return (
    <li className="tech-badge">
      {logo ? (
        <svg
          className="tech-badge-mark"
          viewBox="0 0 24 24"
          aria-hidden="true"
          style={{ color: technologyColor(logo.hex) }}
        >
          <path d={logo.path} />
        </svg>
      ) : icon === "cloud" ? (
        <svg className="tech-badge-mark tech-badge-mark--generic" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M7.5 18.5h9a4.5 4.5 0 0 0 .35-8.99A5.75 5.75 0 0 0 5.8 8.25a5.15 5.15 0 0 0 1.7 10.25Z" />
        </svg>
      ) : (
        <span className="tech-badge-mark-placeholder" aria-hidden="true" />
      )}
      <span>{name}</span>
    </li>
  );
}

export default function TechCategoryRow({ category }) {
  return (
    <article className="skill-group">
      <div className="skill-group-heading">
        <CategoryIcon kind={category.icon} />
        <div className="skill-group-copy">
          <h3>{category.title}</h3>
        </div>
      </div>
      <ul className="tech-badge-list" aria-label={`${category.title} technologies`}>
        {category.technologies.map((technology) => (
          <TechnologyBadge key={technology.name} technology={technology} />
        ))}
      </ul>
    </article>
  );
}
