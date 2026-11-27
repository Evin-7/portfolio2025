"use client";

import { useEffect, useId, useRef } from "react";
import type { MutableRefObject } from "react";

export const INTRO_ART_DURATION = 2.85;

type Point = [number, number];
type IntroProgress = { value: number; render: () => void };
type LiquidIntroSvgProps = {
  enabledRef: MutableRefObject<boolean>;
  onReady?: (progress: IntroProgress) => void;
  onFailure?: () => void;
  previewTime?: number;
};
type SurfaceState = { time: number; points: Point[]; width: number; opacity: number };
type SurfaceDefinition = { id: string; side: number; phase: number; states: SurfaceState[] };
type SurfaceNodes = {
  group: SVGGElement | null;
  body: SVGPathElement | null;
  inner: SVGPathElement | null;
  softEdge: SVGPathElement | null;
  edge: SVGPathElement | null;
  reflection: SVGRadialGradientElement | null;
  edgeGradient: SVGLinearGradientElement | null;
};

// The source holds each frame for 180 ms, including a final 180 ms hold after
// frame 12. Map those source timestamps into the 2.85-second liquid phase.
const FRAME_TIMES = Array.from({ length: 12 }, (_, index) => index * 0.18 * (INTRO_ART_DURATION / 2.16));
const X = [-100, -28, 42, 112, 182, 252, 324, 460];

function horizontalState(index: number, ys: number[], width: number, opacity: number): SurfaceState {
  return { time: FRAME_TIMES[index], points: X.map((x, pointIndex) => [x, ys[pointIndex]]), width, opacity };
}

function pathState(index: number, points: Point[], width: number, opacity: number): SurfaceState {
  return { time: FRAME_TIMES[index], points, width, opacity };
}

const surfaces: SurfaceDefinition[] = [
  {
    id: "lower",
    side: -1,
    phase: 0.72,
    states: [
      horizontalState(0, [366, 366, 366, 365, 364, 362, 358, 350], 7, 0.08),
      horizontalState(1, [380, 367, 356, 341, 329, 316, 303, 289], 30, 0.18),
      horizontalState(2, [410, 307, 324, 292, 274, 269, 272, 282], 65, 0.4),
      horizontalState(3, [410, 385, 370, 315, 265, 243, 238, 230], 80, 0.66),
      horizontalState(4, [410, 385, 366, 318, 273, 250, 247, 255], 90, 0.78),
      horizontalState(5, [400, 365, 342, 303, 271, 260, 278, 312], 92, 0.86),
      horizontalState(6, [385, 350, 321, 296, 287, 303, 345, 374], 82, 0.9),
      horizontalState(7, [383, 347, 315, 294, 308, 339, 374, 396], 74, 0.88),
      horizontalState(8, [400, 395, 382, 355, 320, 285, 255, 242], 100, 0.84),
      horizontalState(9, [384, 351, 330, 318, 331, 352, 379, 402], 60, 0.76),
      horizontalState(10, [340, 325, 310, 295, 280, 265, 250, 240], 45, 0.58),
      horizontalState(11, [340, 340, 330, 315, 300, 282, 264, 250], 52, 0.72),
    ],
  },
  {
    id: "upper",
    side: 1,
    phase: 0.23,
    states: [
      horizontalState(0, [-25, -18, -10, 0, 8, 15, 21, 28], 8, 0.018),
      horizontalState(1, [-25, -14, -2, 10, 23, 34, 44, 50], 12, 0.045),
      horizontalState(2, [-30, -12, 8, 28, 44, 53, 60, 66], 16, 0.09),
      horizontalState(3, [-82, -45, 0, 20, 35, 55, 80, 120], 50, 0.26),
      horizontalState(4, [-35, 0, 36, 70, 92, 104, 91, 74], 30, 0.34),
      horizontalState(5, [-38, 24, 65, 92, 95, 75, 55, 84], 44, 0.56),
      horizontalState(6, [95, 60, 35, 25, 30, 52, 88, 125], 68, 0.7),
      horizontalState(7, [75, 48, 30, 20, 18, 24, 40, 68], 88, 0.82),
      horizontalState(8, [75, 48, 30, 20, 18, 24, 40, 68], 96, 0.88),
      horizontalState(9, [48, 30, 20, 18, 25, 42, 65, 95], 80, 0.78),
      horizontalState(10, [-42, -10, 0, -7, 21, 78, 106, 100], 34, 0.48),
      horizontalState(11, [-64, -39, -24, -14, -2, 9, 20, 29], 18, 0.19),
    ],
  },
  {
    id: "middle",
    side: -1,
    phase: 0.57,
    states: [
      horizontalState(0, [214, 211, 208, 207, 208, 210, 212, 214], 5, 0.006),
      horizontalState(1, [218, 214, 210, 207, 207, 210, 215, 221], 8, 0.012),
      horizontalState(2, [224, 220, 213, 207, 205, 211, 222, 235], 13, 0.03),
      horizontalState(3, [233, 225, 213, 203, 198, 207, 227, 248], 18, 0.08),
      horizontalState(4, [242, 231, 216, 201, 194, 206, 234, 263], 24, 0.16),
      horizontalState(5, [251, 237, 217, 194, 184, 201, 239, 279], 34, 0.28),
      horizontalState(6, [258, 240, 215, 184, 170, 195, 249, 305], 42, 0.42),
      horizontalState(7, [257, 236, 206, 171, 157, 188, 252, 317], 46, 0.5),
      horizontalState(8, [250, 225, 208, 198, 198, 206, 224, 250], 46, 0.24),
      horizontalState(9, [248, 232, 210, 190, 188, 210, 247, 289], 33, 0.4),
      horizontalState(10, [252, 243, 231, 223, 223, 230, 246, 265], 22, 0.25),
      horizontalState(11, [256, 252, 248, 246, 247, 250, 255, 260], 12, 0.1),
    ],
  },
  {
    id: "curl",
    side: -1,
    phase: 0.81,
    states: [
      { time: 0, points: [[-100, 210], [-25, 208], [50, 205], [125, 202], [200, 200], [275, 198], [350, 196], [460, 194]], width: 4, opacity: 0 },
      { time: 0.95, points: [[-100, 188], [-30, 156], [45, 126], [122, 108], [205, 102], [287, 116], [365, 157], [460, 216]], width: 18, opacity: 0.05 },
      { time: 1.425, points: [[-100, 166], [-30, 119], [47, 91], [125, 78], [207, 81], [289, 111], [370, 177], [460, 262]], width: 34, opacity: 0.16 },
      { time: 1.90, points: [[-100, 215], [-30, 205], [47, 192], [125, 184], [207, 187], [289, 199], [371, 220], [460, 246]], width: 38, opacity: 0.28 },
      { time: 2.14, points: [[-100, 220], [-30, 210], [47, 199], [125, 191], [207, 193], [289, 207], [371, 230], [460, 258]], width: 36, opacity: 0.3 },
      { time: 2.375, points: [[-100, 59], [-30, 42], [47, 48], [125, 69], [207, 104], [289, 142], [371, 174], [460, 201]], width: 28, opacity: 0.3 },
      { time: INTRO_ART_DURATION, points: [[-100, -22], [-30, -15], [47, -9], [125, -3], [207, 6], [289, 12], [371, 18], [460, 24]], width: 14, opacity: 0.06 },
    ],
  },
  {
    id: "left-fold",
    side: -1,
    phase: 0.34,
    states: [
      pathState(0, [[-75, -55], [-50, -12], [-28, 46], [-14, 115], [-17, 190], [-9, 266], [18, 340], [56, 415]], 6, 0),
      pathState(3, [[-100, -55], [-60, -5], [-31, 54], [-15, 122], [-18, 196], [-5, 272], [26, 350], [70, 430]], 15, 0.04),
      pathState(5, [[-115, -40], [-70, 6], [-35, 64], [-17, 132], [-22, 204], [-2, 278], [35, 355], [88, 430]], 34, 0.28),
      pathState(6, [[-125, -25], [-78, 17], [-39, 72], [-22, 139], [-30, 209], [-5, 282], [37, 359], [98, 435]], 48, 0.58),
      pathState(7, [[-130, -18], [-82, 22], [-44, 76], [-29, 142], [-40, 210], [-18, 280], [26, 354], [92, 430]], 54, 0.72),
      pathState(8, [[-132, -12], [-86, 26], [-49, 79], [-36, 144], [-47, 210], [-25, 278], [20, 350], [89, 426]], 56, 0.78),
      pathState(9, [[-126, -18], [-80, 20], [-43, 74], [-28, 140], [-37, 208], [-16, 278], [28, 354], [95, 434]], 48, 0.66),
      pathState(10, [[-112, -32], [-72, 10], [-39, 66], [-25, 134], [-31, 205], [-12, 278], [26, 355], [88, 430]], 28, 0.22),
      pathState(11, [[-92, -49], [-63, -5], [-37, 54], [-24, 124], [-28, 199], [-12, 274], [18, 350], [67, 423]], 14, 0.04),
    ],
  },
  {
    id: "right-fold",
    side: 1,
    phase: 0.68,
    states: [
      pathState(0, [[430, -50], [402, -4], [378, 55], [361, 125], [365, 199], [383, 272], [413, 345], [452, 418]], 6, 0),
      pathState(3, [[454, -56], [413, -12], [381, 45], [359, 115], [361, 191], [381, 267], [416, 344], [463, 422]], 15, 0.03),
      pathState(5, [[470, -43], [427, 1], [390, 57], [365, 126], [364, 201], [389, 277], [428, 354], [478, 430]], 34, 0.24),
      pathState(6, [[480, -27], [436, 14], [396, 69], [370, 136], [367, 208], [393, 282], [436, 358], [490, 436]], 48, 0.52),
      pathState(7, [[484, -17], [440, 23], [400, 77], [374, 143], [372, 212], [398, 282], [443, 355], [500, 432]], 54, 0.66),
      pathState(8, [[487, -10], [443, 29], [404, 82], [379, 146], [378, 212], [405, 280], [450, 351], [507, 426]], 56, 0.72),
      pathState(9, [[480, -17], [436, 22], [398, 76], [373, 142], [371, 210], [397, 281], [442, 355], [500, 434]], 48, 0.62),
      pathState(10, [[466, -32], [426, 8], [392, 64], [369, 132], [366, 205], [390, 280], [431, 356], [484, 432]], 28, 0.2),
      pathState(11, [[445, -50], [414, -7], [386, 52], [366, 122], [365, 198], [385, 274], [420, 351], [467, 425]], 14, 0.03),
    ],
  },
];

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function hermite(from: number, to: number, fromSlope: number, toSlope: number, duration: number, t: number): number {
  const t2 = t * t;
  const t3 = t2 * t;
  return (2 * t3 - 3 * t2 + 1) * from
    + (t3 - 2 * t2 + t) * duration * fromSlope
    + (-2 * t3 + 3 * t2) * to
    + (t3 - t2) * duration * toSlope;
}

function keySlope(keys: SurfaceState[], keyIndex: number, getValue: (state: SurfaceState) => number): number {
  if (keyIndex <= 0 || keyIndex >= keys.length - 1) return 0;
  const previous = keys[keyIndex - 1];
  const next = keys[keyIndex + 1];
  return (getValue(next) - getValue(previous)) / Math.max(0.001, next.time - previous.time);
}

function interpolateState(definition: SurfaceDefinition, time: number): SurfaceState {
  const keys = definition.states;
  let index = 0;
  while (index < keys.length - 2 && time > keys[index + 1].time) index += 1;
  const from = keys[index];
  const to = keys[index + 1];
  const duration = Math.max(0.001, to.time - from.time);
  const amount = clamp01((time - from.time) / duration);
  const interpolate = (getValue: (state: SurfaceState) => number) => hermite(
    getValue(from),
    getValue(to),
    keySlope(keys, index, getValue),
    keySlope(keys, index + 1, getValue),
    duration,
    amount,
  );
  return {
    time,
    width: Math.max(0, interpolate((state) => state.width)),
    opacity: clamp01(interpolate((state) => state.opacity)),
    points: from.points.map((point, pointIndex) => [
      interpolate((state) => state.points[pointIndex][0]),
      interpolate((state) => state.points[pointIndex][1]),
    ]),
  };
}

function sampleSpline(points: Point[], t: number): Point {
  const scaled = Math.max(0, Math.min(0.999999, t)) * (points.length - 1);
  const segment = Math.floor(scaled);
  const local = scaled - segment;
  const p0 = points[Math.max(0, segment - 1)];
  const p1 = points[segment];
  const p2 = points[segment + 1];
  const p3 = points[Math.min(points.length - 1, segment + 2)];
  const t2 = local * local;
  const t3 = t2 * local;
  const component = (axis: 0 | 1) => 0.5 * (
    2 * p1[axis]
    + (-p0[axis] + p2[axis]) * local
    + (2 * p0[axis] - 5 * p1[axis] + 4 * p2[axis] - p3[axis]) * t2
    + (-p0[axis] + 3 * p1[axis] - 3 * p2[axis] + p3[axis]) * t3
  );
  return [component(0), component(1)];
}

function makeCurvePath(points: Point[], move = true): string {
  if (points.length < 2) return "";
  let path = move ? `M ${points[0][0].toFixed(2)} ${points[0][1].toFixed(2)}` : "";
  for (let index = 0; index < points.length - 1; index += 1) {
    const previous = points[Math.max(0, index - 1)];
    const start = points[index];
    const end = points[index + 1];
    const next = points[Math.min(points.length - 1, index + 2)];
    const cp1: Point = [start[0] + (end[0] - previous[0]) / 6, start[1] + (end[1] - previous[1]) / 6];
    const cp2: Point = [end[0] - (next[0] - start[0]) / 6, end[1] - (next[1] - start[1]) / 6];
    path += ` C ${cp1[0].toFixed(2)} ${cp1[1].toFixed(2)}, ${cp2[0].toFixed(2)} ${cp2[1].toFixed(2)}, ${end[0].toFixed(2)} ${end[1].toFixed(2)}`;
  }
  return path;
}

function makeBandGeometry(state: SurfaceState, side: number, scaleX: number, scaleY: number) {
  const center: Point[] = [];
  const edge: Point[] = [];
  const sampleCount = 44;
  for (let index = 0; index <= sampleCount; index += 1) {
    const t = index / sampleCount;
    const point = sampleSpline(state.points, t);
    const before = sampleSpline(state.points, Math.max(0, t - 0.002));
    const after = sampleSpline(state.points, Math.min(0.999999, t + 0.002));
    // Compute the normal in screen space so a 16:9 viewport keeps the same
    // apparent sheet thickness as the square reference instead of stretching
    // each ribbon sideways.
    const dx = (after[0] - before[0]) * scaleX;
    const dy = (after[1] - before[1]) * scaleY;
    const length = Math.max(0.001, Math.hypot(dx, dy));
    const taper = 0.28 + 0.72 * Math.sin(Math.PI * t) ** 0.62;
    const fold = 1 + 0.2 * Math.sin(t * Math.PI * 3.6 + state.time * 1.15)
      + 0.08 * Math.sin(t * Math.PI * 7.1 - state.time * 0.8);
    const offset = (state.width * taper * fold * 0.5) * side * scaleY;
    const normal: Point = [-dy / length, dx / length];
    center.push(point);
    edge.push([point[0] + normal[0] * offset / scaleX, point[1] + normal[1] * offset / scaleY]);
  }
  const otherSide = center.map((point, index): Point => [
    point[0] - (edge[index][0] - point[0]),
    point[1] - (edge[index][1] - point[1]),
  ]);
  const reverse = [...otherSide].reverse();
  const d = `${makeCurvePath(edge)} L ${reverse[0][0].toFixed(2)} ${reverse[0][1].toFixed(2)}${makeCurvePath(reverse, false)} Z`;
  return { d, edgeD: makeCurvePath(edge), center };
}

export default function LiquidIntroSvg({ enabledRef, onReady, onFailure, previewTime }: LiquidIntroSvgProps) {
  const instanceId = useId().replace(/:/g, "");
  const svgRef = useRef<SVGSVGElement | null>(null);
  const nodesRef = useRef<Map<string, SurfaceNodes>>(new Map());
  const callbacksRef = useRef({ onReady, onFailure });
  const previewTimeRef = useRef(previewTime);
  useEffect(() => { callbacksRef.current = { onReady, onFailure }; }, [onFailure, onReady]);
  useEffect(() => { previewTimeRef.current = previewTime; }, [previewTime]);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    let disposed = false;
    let readyFrame = 0;
    const nodes = nodesRef.current;
    let scaleX = 1;
    let scaleY = 1;
    const updateScale = () => {
      const bounds = svg.getBoundingClientRect();
      scaleX = bounds.width / 357 || 1;
      scaleY = bounds.height / 358 || 1;
    };
    updateScale();
    const resizeObserver = new ResizeObserver(updateScale);
    resizeObserver.observe(svg);
    const renderAt = (rawTime: number) => {
      const time = Math.max(0, Math.min(INTRO_ART_DURATION, rawTime));
      surfaces.forEach((surface) => {
        const elements = nodes.get(surface.id);
        if (!elements?.body || !elements.inner || !elements.softEdge || !elements.edge || !elements.group || !elements.reflection || !elements.edgeGradient) return;
        const shape = interpolateState(surface, time);
        const { d, edgeD, center } = makeBandGeometry(shape, surface.side, scaleX, scaleY);
        elements.body.setAttribute("d", d);
        elements.inner.setAttribute("d", d);
        elements.softEdge.setAttribute("d", edgeD);
        elements.edge.setAttribute("d", edgeD);
        elements.group.setAttribute("opacity", String(shape.opacity));
        const travel = (time / INTRO_ART_DURATION + surface.phase) % 1;
        const reflectionIndex = Math.round(travel * (center.length - 1));
        const reflectionPoint = center[reflectionIndex];
        const tangentBefore = center[Math.max(0, reflectionIndex - 2)];
        const tangentAfter = center[Math.min(center.length - 1, reflectionIndex + 2)];
        const reflectionAngle = Math.atan2(tangentAfter[1] - tangentBefore[1], tangentAfter[0] - tangentBefore[0]) * 180 / Math.PI;
        elements.reflection.setAttribute("cx", reflectionPoint[0].toFixed(2));
        elements.reflection.setAttribute("cy", reflectionPoint[1].toFixed(2));
        elements.reflection.setAttribute("r", `${Math.max(28, shape.width * 1.2).toFixed(2)}`);
        elements.reflection.setAttribute("gradientTransform", `translate(${reflectionPoint[0].toFixed(2)} ${reflectionPoint[1].toFixed(2)}) rotate(${reflectionAngle.toFixed(2)}) scale(2.35 0.24) translate(${-reflectionPoint[0].toFixed(2)} ${-reflectionPoint[1].toFixed(2)})`);
        elements.edgeGradient.setAttribute("x1", (reflectionPoint[0] - 62).toFixed(2));
        elements.edgeGradient.setAttribute("x2", (reflectionPoint[0] + 62).toFixed(2));
      });
    };

    surfaces.forEach((surface) => {
      nodes.set(surface.id, {
        group: svg.querySelector<SVGGElement>(`[data-liquid-group="${surface.id}"]`),
        body: svg.querySelector<SVGPathElement>(`[data-liquid-body="${surface.id}"]`),
        inner: svg.querySelector<SVGPathElement>(`[data-liquid-inner="${surface.id}"]`),
        softEdge: svg.querySelector<SVGPathElement>(`[data-liquid-soft-edge="${surface.id}"]`),
        edge: svg.querySelector<SVGPathElement>(`[data-liquid-edge="${surface.id}"]`),
        reflection: svg.querySelector<SVGRadialGradientElement>(`[data-liquid-reflection="${surface.id}"]`),
        edgeGradient: svg.querySelector<SVGLinearGradientElement>(`[data-liquid-edge-gradient="${surface.id}"]`),
      });
    });

    try {
      if (previewTimeRef.current !== undefined) {
        renderAt(previewTimeRef.current);
      } else {
        const controller: IntroProgress = { value: 0, render: () => renderAt(controller.value * INTRO_ART_DURATION) };
        renderAt(0);
        readyFrame = window.requestAnimationFrame(() => {
          if (!disposed && enabledRef.current) callbacksRef.current.onReady?.(controller);
        });
      }
    } catch {
      callbacksRef.current.onFailure?.();
    }

    return () => {
      disposed = true;
      window.cancelAnimationFrame(readyFrame);
      resizeObserver.disconnect();
      nodes.clear();
    };
  }, [enabledRef]);

  return (
    <svg
      ref={svgRef}
      className="intro-liquid-svg absolute inset-0 z-[1] block h-full w-full"
      viewBox="0 0 357 358"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${instanceId}-emerald-glass-fill`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#052318" stopOpacity="0.16" />
          <stop offset="0.18" stopColor="#063923" stopOpacity="0.28" />
          <stop offset="0.42" stopColor="#0b5839" stopOpacity="0.48" />
          <stop offset="0.62" stopColor="#0d4e35" stopOpacity="0.44" />
          <stop offset="0.84" stopColor="#052f20" stopOpacity="0.25" />
          <stop offset="1" stopColor="#02130d" stopOpacity="0.06" />
        </linearGradient>
        {surfaces.map((surface) => (
          <g key={surface.id}>
            <radialGradient id={`${instanceId}-emerald-reflection-${surface.id}`} data-liquid-reflection={surface.id} gradientUnits="userSpaceOnUse" cx="180" cy="180" r="72">
              <stop offset="0" stopColor="#e2fff0" stopOpacity="0.52" />
              <stop offset="0.12" stopColor="#72f3b8" stopOpacity="0.46" />
              <stop offset="0.5" stopColor="#126346" stopOpacity="0.16" />
              <stop offset="1" stopColor="#126346" stopOpacity="0" />
            </radialGradient>
            <linearGradient id={`${instanceId}-emerald-edge-${surface.id}`} data-liquid-edge-gradient={surface.id} gradientUnits="userSpaceOnUse" x1="-95" y1="0" x2="50" y2="0">
              <stop offset="0" stopColor="#35e5a0" stopOpacity="0" />
              <stop offset="0.35" stopColor="#35e5a0" stopOpacity="0.04" />
              <stop offset="0.5" stopColor="#f0fff8" stopOpacity="0.96" />
              <stop offset="0.57" stopColor="#72f3b8" stopOpacity="0.42" />
              <stop offset="0.72" stopColor="#126346" stopOpacity="0.08" />
              <stop offset="1" stopColor="#35e5a0" stopOpacity="0" />
            </linearGradient>
          </g>
        ))}
        <filter id={`${instanceId}-liquid-soft-reflection`} x="-25%" y="-25%" width="150%" height="150%" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation="3.1" />
        </filter>
      </defs>
      <rect width="357" height="358" fill="#020605" />
      <g className="liquid-sheet-stack">
        {surfaces.map((surface) => (
          <g key={surface.id} data-liquid-group={surface.id} opacity="0">
            <path data-liquid-body={surface.id} fill={`url(#${instanceId}-emerald-glass-fill)`} />
            <path data-liquid-inner={surface.id} fill={`url(#${instanceId}-emerald-reflection-${surface.id})`} opacity="0.9" />
            <path data-liquid-soft-edge={surface.id} fill="none" stroke={`url(#${instanceId}-emerald-edge-${surface.id})`} strokeWidth="10" strokeLinecap="round" opacity="0.26" filter={`url(#${instanceId}-liquid-soft-reflection)`} />
            <path data-liquid-edge={surface.id} fill="none" stroke={`url(#${instanceId}-emerald-edge-${surface.id})`} strokeWidth="1.5" strokeLinecap="round" opacity="0.96" />
          </g>
        ))}
      </g>
    </svg>
  );
}
