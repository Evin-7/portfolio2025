export default function Hero() {
  return (
    <section className="hero-section" aria-labelledby="hero-title">
      <div className="page-container hero-grid">
        <div className="hero-copy nav-anchor-target" id="home">
          <p className="hero-eyebrow">EVIN LEYANDER <span aria-hidden="true">·</span> SOFTWARE ENGINEER</p>
          <h1 className="hero-title" id="hero-title">
            Building <span className="hero-title-accent">thoughtful</span><br className="hero-title-break" /> digital experiences.
          </h1>
          <div className="hero-ctas">
            <a className="button button--primary" href="#works">
              View Projects <span aria-hidden="true">→</span>
            </a>
            <a className="button button--outline" href="#contact">
              <svg className="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg>
              Get in Touch
            </a>
          </div>
          <p className="hero-meta" aria-label="Portfolio highlights">
            <span>50+ projects</span><span>End-to-end product development</span>
          </p>
        </div>
      </div>
    </section>
  );
}
