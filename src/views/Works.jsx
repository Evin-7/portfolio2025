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
import ohYesWorld from "../assets/images/ohyescom.webp";
import parambikulam from "../assets/images/parambikulam.webp";
import penielTech from "../assets/images/penieltech.webp";
import periyar from "../assets/images/periyartigerreserve.webp";

const containerClass = "mx-auto w-full max-w-[90rem] px-5 sm:px-8 md:px-12 lg:px-20 2xl:max-w-none 2xl:px-[clamp(6rem,7vw,13.75rem)]";
const cardClass = "min-h-48 cursor-pointer overflow-hidden rounded-2xl border border-amber/20 bg-gradient-to-br from-panel to-panel/80 p-2.5 shadow-none transition duration-200 hover:-translate-y-1.5 hover:border-amber hover:shadow-2xl hover:shadow-black/30";

const works = [
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
  const openWebsite = (href) => {
    window.open(href, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="relative overflow-hidden bg-ink py-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(212,175,55,0.04),transparent_70%)]" aria-hidden="true" />
      <div className={`${containerClass} relative z-10`}>
        <Reveal className="mb-9">
          <p className="m-0 text-xs font-bold uppercase tracking-[0.12em] text-amber">Projects</p>
          <h2 className="mt-3 bg-gradient-to-br from-copy to-amber-light bg-clip-text text-[clamp(1.8rem,3vw,3rem)] font-semibold leading-none tracking-[-0.055em] text-transparent">Selected work.</h2>
        </Reveal>

        {groups.map((group) => (
          <div className={group.key === "mobile" ? "mt-[clamp(3.4rem,7vw,6rem)]" : ""} key={group.key}>
            {group.key === "mobile" ? (
              <Reveal className="mb-5 flex items-end justify-between gap-8 border-b border-amber/15 pb-4 max-md:block" direction="right">
                <div>
                  <p className="m-0 text-[0.63rem] font-bold uppercase tracking-[0.13em] text-amber">{group.eyebrow}</p>
                  <h3 className="mt-2 text-[clamp(1.35rem,2.2vw,2rem)] font-semibold leading-tight tracking-[-0.055em] text-copy">{group.title}</h3>
                </div>
                <p className="m-0 max-w-[30ch] text-right text-xs leading-relaxed text-muted max-md:mt-3 max-md:text-left">{group.description}</p>
              </Reveal>
            ) : null}

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {group.items.map((work, index) => (
                <Reveal key={work.name} delay={index * 0.045} direction={index % 2 === 0 ? "up" : "right"}>
                  <article
                    className={cardClass}
                    onClick={group.key === "websites" ? () => openWebsite(work.links[0][1]) : undefined}
                    onKeyDown={group.key === "websites" ? (event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        openWebsite(work.links[0][1]);
                      }
                    } : undefined}
                    role={group.key === "websites" ? "link" : undefined}
                    tabIndex={group.key === "websites" ? 0 : undefined}
                    aria-label={group.key === "websites" ? `Open ${work.name} website` : undefined}
                  >
                  <div className="grid h-full grid-rows-[auto_minmax(0,1fr)_auto] gap-3">
                    <div>
                      <p className="m-0 mb-2 font-mono text-[0.61rem] font-bold uppercase tracking-[0.1em] text-amber-light">{String(index + 1).padStart(2, "0")}</p>
                      <h3 className="m-0 text-[clamp(0.88rem,1.15vw,1.15rem)] font-semibold leading-tight tracking-[-0.04em] text-copy">{work.name}</h3>
                    </div>

                    <div className="flex min-h-0 items-center">
                      <div className="flex w-full flex-col items-center">
                        <div className="relative aspect-[1.56/1] w-[64%] max-w-[14rem] overflow-hidden rounded-t-xl bg-gradient-to-br from-panel-alt to-ink p-1.5 pb-1 shadow-[inset_0_0_30px_rgba(212,175,55,0.1)] sm:w-[72%]">
                          <div className="flex gap-1.5 pb-1.5"><span className="size-1.5 rounded-full bg-amber-deep" /><span className="size-1.5 rounded-full bg-amber" /><span className="size-1.5 rounded-full bg-amber-light" /></div>
                          <div className="absolute left-1/2 top-1 h-[0.18rem] w-[18%] max-w-8 -translate-x-1/2 rounded-full bg-white/10" />
                          <Image src={work.image} alt={work.name} width={1536} height={1024} loading={work.name === "Elate HRMS" ? "eager" : "lazy"} sizes="(max-width: 768px) 88vw, (max-width: 1280px) 42vw, 28vw" className="block h-[calc(100%-13px)] w-full rounded-xl bg-panel-alt object-cover p-1" />
                        </div>
                        <div className="relative h-2.5 w-[72%] max-w-[16rem] rounded-b-xl bg-gradient-to-r from-[#7a6f5f] via-muted to-[#7a6f5f] shadow-lg after:absolute after:left-1/2 after:top-0.5 after:h-1 after:w-[18%] after:-translate-x-1/2 after:rounded-full after:bg-white/60" />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <div className="flex flex-wrap justify-end gap-2">
                        {work.links.map(([label, href]) => <a key={href} href={href} target="_blank" rel="noopener noreferrer" onClick={(event) => event.stopPropagation()} className="inline-flex items-center gap-2 rounded-xl border border-amber/20 bg-amber/10 px-3 py-2 text-[0.68rem] font-bold text-amber transition hover:translate-x-1 hover:bg-amber hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-cyan"><span>{label}</span><strong>↗</strong></a>)}
                      </div>
                    </div>
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
