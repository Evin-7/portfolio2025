"use client";

import Image from "next/image";
import Reveal from "../components/Reveal";
import abeZauto from "../assets/images/abezauto.webp";
import agsyba from "../assets/images/agsyba.webp";
import call2day from "../assets/images/call2day.webp";
import elateHrmsApp from "../assets/images/elatehrmsapp.webp";
import elateHrms from "../assets/images/elatehrmscom.webp";
import elateChat from "../assets/images/elatechatapp.webp";
import elateTime from "../assets/images/elatetimecom.webp";
import homeMaintenance from "../assets/images/homemaintaince.webp";
import mezehCatering from "../assets/images/mezehcateting.webp";
import mezehFrontend from "../assets/images/mezehfrontend.webp";
import mezehMobile from "../assets/images/mezehmobileapp.webp";
import mudumalai from "../assets/images/mudumaialia.webp";
import ontix from "../assets/images/ontixx.webp";
import ohYesWorld from "../assets/images/ohyescom.webp";
import parambikulam from "../assets/images/parambikulam.webp";
import penielTech from "../assets/images/penieltech.webp";
import periyar from "../assets/images/periyartigerreserve.webp";
import sitecore from "../assets/images/sitecore.webp";
import veltrix from "../assets/images/veltrix.webp";

const works = [
  { name: "SiteCore", category: "", summary: "", links: [["Live project", "https://sitecore-rho.vercel.app/"]], image: sitecore },
  { name: "VELTRIX", category: "", summary: "", stack: "", links: [["Live project", "https://veltrix-evins.vercel.app/"]], image: veltrix },
  { name: "Ontix", category: "", summary: "", stack: "", links: [["Live project", "https://ontixx.vercel.app/"]], image: ontix, wide: true },
  { name: "AbeZauto", links: [["Visit site", "https://abezauto.com/"]], image: abeZauto },
  { name: "AGSYBA", links: [["Visit site", "https://agsyba.com/"]], image: agsyba },
  { name: "Call2Day", links: [["Visit site", "https://call2day.com/"]], image: call2day },
  { name: "Elate HRMS App", type: "mobile", links: [["Google Play", "https://play.google.com/store/apps/details?id=com.penieltech.elatehrmsconnect"]], image: elateHrmsApp },
  { name: "Elate HRMS", links: [["Visit site", "https://elatehrms.com/"]], image: elateHrms },
  { name: "Elate Chat", type: "mobile", links: [["Google Play", "https://play.google.com/store/apps/details?id=com.binsonsamuel.elatechat"]], image: elateChat },
  { name: "Elate Time", links: [["Visit site", "https://elatetime.com/"]], image: elateTime },
  { name: "Oh Yes Home Maintenance", links: [["Visit site", "https://homemaintenance.ohyesworld.com/"]], image: homeMaintenance },
  { name: "Mezeh Catering", links: [["Visit site", "https://catering.mezeh.com/"]], image: mezehCatering },
  { name: "Mezeh Frontend", links: [["Visit site", "https://mezeh-frontend-production.azurewebsites.net/"]], image: mezehFrontend },
  { name: "Mezeh Mobile App", type: "mobile", links: [["Google Play", "https://play.google.com/store/apps/details?id=com.mezeh.MezehApp&hl=en_IN"], ["App Store", "https://apps.apple.com/us/app/mezeh-mediterranean-grill/id6747373231"]], image: mezehMobile },
  { name: "Mudumalai Tiger Reserve", links: [["Visit site", "https://www.mudumalaitigerreserve.com/"]], image: mudumalai },
  { name: "Oh Yes World", links: [["Visit site", "https://ohyesworld.com/"]], image: ohYesWorld },
  { name: "Parambikulam Tiger Reserve", links: [["Visit site", "https://parambikulam.org/"]], image: parambikulam },
  { name: "Peniel Tech", links: [["Visit site", "https://www.penieltech.com/"]], image: penielTech },
  { name: "Periyar Tiger Reserve", links: [["Visit site", "https://www.periyartigerreserve.org/"]], image: periyar },
];

const groups = [
  { key: "web", title: "Web products", items: works.filter((work) => work.type !== "mobile") },
  { key: "mobile", title: "Mobile products", description: "Useful, clear app experiences across devices.", items: works.filter((work) => work.type === "mobile") },
];

function ArrowIcon() {
  return <svg className="project-link-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10" /></svg>;
}

export default function Works() {
  return (
    <section className="section" aria-labelledby="works-title">
      <div className="page-container">
        <Reveal className="project-header-row">
          <div className="section-heading">
            <p className="section-kicker">03 / Selected Work</p>
            <h2 className="section-title" id="works-title">Things I’ve built.</h2>
          </div>
          <span className="project-count">{works.length} projects</span>
        </Reveal>

        {groups.map((group) => (
          <div className={"project-group project-group--" + group.key} key={group.key}>
            {group.description ? (
              <Reveal className="project-group-heading">
                <h3>{group.title}</h3>
                <p>{group.description}</p>
              </Reveal>
            ) : null}
            <div className="project-grid">
              {group.items.map((work, index) => (
                <Reveal className="project-card-wrap" key={work.name} delay={Math.min(index * 0.025, 0.15)}>
                  <article className={"project-card" + (work.name === "SiteCore" ? " project-card--featured" : "")}>
                    <div className="project-card-content">
                      <div className="project-card-title-row">
                        <h3>{work.name}</h3>
                        <span className="project-index">{String(works.indexOf(work) + 1).padStart(2, "0")}</span>
                      </div>
                      {work.category ? <p className="project-category">{work.category}</p> : null}
                      {work.summary ? <p className="project-summary">{work.summary}</p> : null}
                      <a
                        href={work.links[0][1]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-preview"
                        aria-label={"Open " + work.name + " project"}
                      >
                        <span className="project-browser-bar" aria-hidden="true"><i /><i /><i /><span /></span>
                        <Image
                          src={work.image}
                          alt={work.name + " project screenshot"}
                          width={work.image.width}
                          height={work.image.height}
                          sizes="(max-width: 620px) 90vw, (max-width: 920px) 44vw, 29vw"
                          className={work.wide ? "project-image project-image--wide" : "project-image"}
                        />
                      </a>
                    </div>
                    <div className="project-card-actions">
                      {work.links.map(([label, href]) => (
                        <a className="project-link" key={href} href={href} target="_blank" rel="noopener noreferrer">
                          {label}<ArrowIcon />
                        </a>
                      ))}
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
