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
import veltrix from "../assets/images/veltrix.webp";

const cardClass = "h-full rounded-2xl border border-white/10 bg-panel p-4 transition-colors hover:border-white/25 sm:p-5";

const works = [
  {
    name: "VELTRIX",
    category: "",
    summary: "",
    stack: "",
    links: [["Live project", "https://veltrix-evins.vercel.app/"]],
    image: veltrix,
  },
  {
    name: "Ontix",
    stack: "",
    links: [["Live project", "https://ontixx.vercel.app/"]],
    image: ontix,
    wide: true,
  },
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
  { key: "websites", items: works.filter((work) => work.type !== "mobile") },
  { key: "mobile", eyebrow: "Mobile products", title: "Useful everywhere.", description: "Clear, dependable app experiences.", items: works.filter((work) => work.type === "mobile") },
];

export default function Works() {
  return (
    <section className="bg-ink py-20 sm:py-28">
      <div className="page-container">
        <Reveal className="mb-10 sm:mb-12">
          <p className="m-0 text-xs font-semibold uppercase tracking-[0.18em] text-muted">Projects</p>
          <h2 className="mt-4 text-[clamp(2.3rem,5vw,4rem)] font-medium leading-[0.98] tracking-[-0.065em] text-copy">
            Selected work.
          </h2>
        </Reveal>

        {groups.map((group) => (
          <div className={group.key === "mobile" ? "mt-16 sm:mt-24" : ""} key={group.key}>
            {group.key === "mobile" ? (
              <Reveal className="mb-7 flex items-end justify-between gap-8 border-b border-white/15 pb-5 max-md:block">
                <div>
                  <p className="m-0 text-xs font-semibold uppercase tracking-[0.18em] text-muted">{group.eyebrow}</p>
                  <h3 className="mt-3 text-[clamp(1.6rem,3vw,2.5rem)] font-medium leading-tight tracking-[-0.05em] text-copy">{group.title}</h3>
                </div>
                <p className="m-0 max-w-[30ch] text-sm leading-6 text-muted max-md:mt-3">{group.description}</p>
              </Reveal>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {group.items.map((work, index) => {
                const isWebsite = group.key === "websites";
                const heading = (
                  <div>
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="m-0 text-lg font-semibold leading-tight tracking-[-0.035em] text-copy">{work.name}</h3>
                      <span className="text-[0.65rem] tracking-[0.12em] text-muted">{String(index + 1).padStart(2, "0")}</span>
                    </div>
                    {work.category ? <p className="mb-0 mt-2 text-xs font-medium uppercase tracking-[0.12em] text-muted">{work.category}</p> : null}
                    {work.summary ? <p className="mb-0 mt-2 max-w-[32ch] text-sm leading-6 text-muted">{work.summary}</p> : null}
                  </div>
                );
                const preview = (
                  <div className="mt-4 overflow-hidden rounded-xl border border-white/10 bg-panel-alt">
                    <div className="flex h-8 items-center gap-1.5 border-b border-white/10 px-3">
                      <span className="size-1.5 rounded-full bg-white/25" />
                      <span className="size-1.5 rounded-full bg-white/15" />
                      <span className="size-1.5 rounded-full bg-white/10" />
                      <span className="ml-3 h-1 w-1/4 rounded-full bg-white/10" />
                    </div>
                    <Image
                      src={work.image}
                      alt={work.name + " project preview"}
                      width={work.image.width}
                      height={work.image.height}
                      loading={work.name === "Elate HRMS" ? "eager" : "lazy"}
                      sizes="(max-width: 768px) 88vw, (max-width: 1280px) 42vw, 28vw"
                      className={"block w-full object-cover grayscale " + (work.wide ? "aspect-[1.84/1] object-bottom" : "aspect-[1.56/1] object-center")}
                    />
                  </div>
                );

                return (
                  <Reveal key={work.name} className="h-full" delay={index * 0.035}>
                    <article className={cardClass}>
                      {isWebsite ? (
                        <a href={work.links[0][1]} target="_blank" rel="noopener noreferrer" className="group block rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
                          {heading}
                          {preview}
                        </a>
                      ) : (
                        <div>{heading}{preview}</div>
                      )}

                      <div className="mt-4 flex flex-wrap gap-2">
                        {work.links.map(([label, href]) => (
                          <a
                            key={href}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-copy transition-colors hover:bg-copy hover:text-ink"
                          >
                            <span>{label}</span><span aria-hidden="true">↗</span>
                          </a>
                        ))}
                      </div>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
