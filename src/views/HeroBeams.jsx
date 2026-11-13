"use client";

import { useEffect, useId, useRef, useState } from "react";

// Coordinates follow the four light edges in works-neon-beams.webp.
const beams = [
  { from: [0, 96], to: [409, 424], duration: 3.8, delay: -1.2, echo: true },
  { from: [0, 739], to: [409, 424], duration: 4.7, delay: -3.1 },
  { from: [1774, 132], to: [1377, 434], duration: 4.3, delay: -2.4 },
  { from: [1774, 752], to: [1377, 434], duration: 4.9, delay: -0.7, echo: true },
];

export default function HeroBeams({ introComplete }) {
  const ref = useRef(null);
  const id = useId();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <svg
      ref={ref}
      className="hero-beams"
      data-ready={introComplete}
      data-visible={visible}
      viewBox="0 0 1774 887"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id={`${id}-bloom`}>
          <stop stopColor="#00FF87" stopOpacity=".65" />
          <stop offset=".42" stopColor="#39FF14" stopOpacity=".3" />
          <stop offset="1" stopColor="#39FF14" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-trail`} gradientUnits="userSpaceOnUse" x1="-94" y1="0" x2="22" y2="0">
          <stop stopColor="#39FF14" stopOpacity="0" />
          <stop offset=".48" stopColor="#39FF14" stopOpacity=".75" />
          <stop offset=".82" stopColor="#D7FFE5" />
          <stop offset="1" stopColor="#00FF87" stopOpacity="0" />
        </linearGradient>
      </defs>
      {beams.map(({ from: [x, y], to: [tipX, tipY], duration, delay, echo }) => {
        const dx = tipX - x;
        const dy = tipY - y;
        const length = Math.hypot(dx, dy).toFixed(3);
        const angle = (Math.atan2(dy, dx) * 180 / Math.PI).toFixed(4);

        return (
          <g
            key={y}
            transform={`translate(${x} ${y}) rotate(${angle})`}
            style={{ "--beam-length": `${length}px`, "--beam-duration": `${duration}s`, "--beam-delay": `${delay}s` }}
          >
            <g className="hero-beam-streak">
              <ellipse className="hero-beam-bloom" cx="-19" rx="73" ry="24" fill={`url(#${id}-bloom)`} />
              <path d="M -94 0 H 22" stroke={`url(#${id}-trail)`} strokeWidth="5" />
              <path d="M -44 0 H 14" stroke={`url(#${id}-trail)`} strokeWidth="2" />
              {echo && <ellipse className="hero-beam-echo" cx="-108" rx="27" ry="6" fill={`url(#${id}-bloom)`} />}
            </g>
            <circle className="hero-beam-tip" cx={length} r="28" fill={`url(#${id}-bloom)`} />
          </g>
        );
      })}
    </svg>
  );
}
