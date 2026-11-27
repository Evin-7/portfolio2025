"use client";

import { useRef } from "react";
import Image from "next/image";
import LiquidIntroSvg from "../../components/LiquidIntroSvg";

const frames = [
  { title: "Flowing lower wave · reference frame 04", time: 0.71, image: "ref-04.png" },
  { title: "Folds around logo · reference frame 09", time: 1.90, image: "ref-09.png" },
  { title: "Released surfaces · reference frame 12", time: 2.85, image: "ref-12.png" },
];

export default function IntroPreviewClient() {
  const enabledRef = useRef(true);

  return (
    <main className="min-h-screen bg-[#010705] px-5 py-10 text-white sm:px-8">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9ae7b6]">Local-only SVG review</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Emerald intro reference comparison</h1>
        <p className="mt-2 max-w-2xl text-sm text-white/60">The three stills are served from a temporary localhost folder. They are not included in the website or animation.</p>

        <div className="mt-8 grid gap-6">
          {frames.map((frame) => (
            <section key={frame.title} className="rounded-2xl border border-white/10 bg-white/[0.025] p-4 sm:p-5">
              <h2 className="mb-4 text-sm font-medium text-white/80">{frame.title} · {frame.time.toFixed(2)}s</h2>
              <div className="grid grid-cols-2 gap-3 sm:gap-5">
                <div>
                  <p className="mb-2 text-[11px] uppercase tracking-wider text-white/45">Reference GIF still</p>
                  <div className="aspect-square w-full rounded-lg bg-[#020605] bg-contain bg-center bg-no-repeat" role="img" aria-label={`${frame.title} reference`} style={{ backgroundImage: `url(http://localhost:4175/${frame.image})` }} />
                </div>
                <div>
                  <p className="mb-2 text-[11px] uppercase tracking-wider text-white/45">Procedural render</p>
                  <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-[#010705]">
                    <LiquidIntroSvg enabledRef={enabledRef} previewTime={frame.time} />
                    {frame.time >= 1.43 && (
                      <div className="pointer-events-none absolute inset-0 z-10 grid place-items-center" style={{ opacity: Math.min(1, (frame.time - 1.43) / 0.47) }}>
                        <Image className="h-auto w-[28%]" src="/el-monogram-intro.png" alt="" width={783} height={509} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
