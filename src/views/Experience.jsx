import Image from "next/image";
import Reveal from "../components/Reveal";

const experience = [
  {
    period: "Oct 2022 – Mar 2024",
    role: "Junior Frontend Developer",
    company: "Leopard Tech Labs",
    location: "Kanjirappally, Kerala, India",
    country: "India",
    countryMap: "/company/india-outline.svg",
    focus: "Built Vue booking platforms with payment integrations, increasing online bookings by 40% and supporting 15,000+ monthly reserve bookings.",
  },
  {
    period: "Apr 2024 – Aug 2025",
    role: "Software Engineer",
    company: "Turinix",
    location: "Mumbai, India",
    country: "India",
    countryMap: "/company/india-outline.svg",
    focus: "Improved a Vue food-delivery platform's page loads by 60%, supporting 5,000+ concurrent users at 99.9% uptime.",
  },
  {
    period: "Feb 2026 – Aug 2026",
    role: "Software Engineer",
    company: "Penieltech LLC",
    location: "Dubai, UAE",
    country: "United Arab Emirates",
    countryMap: "/company/uae-outline.svg",
    focus: "Built SaaS HR and AI workflows, contributed to check-printing and e-invoicing software, and delivered a Medusa.js storefront.",
  },
];

function LocationIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

export default function Experience() {
  return (
    <section className="section section--alternate" aria-labelledby="experience-title" data-story="experience">
      <div className="page-container">
        <Reveal className="section-heading nav-anchor-target" id="experience">
          <p className="section-kicker">03 / Experience</p>
          <h2 className="section-title" id="experience-title">My professional journey.</h2>
        </Reveal>

        <ol className="experience-list" aria-label="Professional experience">
          {experience.map((item, index) => (
            <Reveal as="li" className="experience-item" key={item.company} delay={index * 0.06} direction={index % 2 === 0 ? "left" : "right"}>
              <span className="experience-date">{item.period}</span>
              <span className="experience-marker" aria-hidden="true" />
              <article className="experience-card">
                <h3>{item.role}</h3>
                <div className="experience-company">
                  <strong>{item.company}</strong>
                  <Image className="experience-flag" src={item.countryMap} alt={item.country} width={17} height={17} />
                  <span className="experience-location"><LocationIcon />{item.location}</span>
                </div>
                <p>{item.focus}</p>
              </article>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
