"use client";

import { useRef } from "react";
import Image from "next/image";
import LiquidIntroCanvas from "../../components/LiquidIntroCanvas";

const frames = [
  { title: "Frame 04", time: 0.54, image: "frame-01.png" },
  { title: "Frame 09", time: 1.44, image: "frame-02.png" },
  { title: "Frame 16", time: 2.70, image: "frame-03.png" },
];

export default function IntroPreviewClient() {
  const enabledRef = useRef(true);

  return (
    <main className="min-h-screen bg-[#010705] px-5 py-10 text-white sm:px-8">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9ae7b6]">Local-only shader review</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Intro reference comparison</h1>
        <p className="mt-2 max-w-2xl text-sm text-white/60">The reference stills are served from a temporary localhost-only folder and are not included in the site bundle.</p>

        <div className="mt-8 grid gap-6">
          {frames.map((frame) => (
            <section key={frame.title} className="rounded-2xl border border-white/10 bg-white/[0.025] p-4 sm:p-5">
              <h2 className="mb-4 text-sm font-medium text-white/80">{frame.title} · {frame.time.toFixed(2)}s</h2>
              <div className="grid grid-cols-2 gap-3 sm:gap-5">
                <div>
                  <p className="mb-2 text-[11px] uppercase tracking-wider text-white/45">Reference</p>
                  <Image className="aspect-square w-full rounded-lg object-contain" src={`http://localhost:4174/${frame.image}`} alt={`${frame.title} reference`} width={480} height={480} unoptimized />
                </div>
                <div>
                  <p className="mb-2 text-[11px] uppercase tracking-wider text-white/45">Procedural render</p>
                  <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-[#010705]">
                    <LiquidIntroCanvas enabledRef={enabledRef} previewTime={frame.time} />
                    {frame.time >= 1.62 && (
                      <div className="pointer-events-none absolute inset-0 z-10 grid place-items-center" style={{ opacity: Math.min(1, (frame.time - 1.62) / 0.58) }}>
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
