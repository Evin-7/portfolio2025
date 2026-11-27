"use client";

import { useEffect, useRef } from "react";
import type { MutableRefObject } from "react";
import type {
  BufferGeometry,
  Mesh,
  MeshPhysicalMaterial,
  OrthographicCamera,
  Scene,
  WebGLRenderTarget,
  WebGLRenderer,
} from "three";

type ProgressUniform = { value: number };
type LiquidIntroCanvasProps = {
  enabledRef: MutableRefObject<boolean>;
  onReady?: (uniform: ProgressUniform) => void;
  onFailure?: () => void;
  previewTime?: number;
};
type Point = [number, number];
type RibbonShape = { points: Point[]; width: number; opacity: number };
type RibbonKey = { time: number; shape: RibbonShape };
type RibbonDefinition = {
  keys: [RibbonKey, RibbonKey, RibbonKey];
  side: number;
  z: number;
  bend: number;
  phase: number;
  color: string;
  attenuation: string;
};
type Ribbon = {
  geometry: BufferGeometry;
  mesh: Mesh;
  material: MeshPhysicalMaterial;
  definition: RibbonDefinition;
  positions: Float32Array;
};

const KEY_TIMES = [0.54, 1.44, 2.7] as const;
const SEGMENTS = 112;
const WIDTH_SEGMENTS = 24;
const BASE_SQUARE_SIZE = 1.55;

const ribbonDefinitions: RibbonDefinition[] = [
  {
    keys: [
      { time: KEY_TIMES[0], shape: { points: [[-0.92, -0.64], [-0.7, -0.63], [-0.48, -0.6], [-0.24, -0.43], [0.02, -0.16], [0.32, -0.1], [0.62, -0.17], [0.92, -0.24]], width: 0.22, opacity: 0.78 } },
      { time: KEY_TIMES[1], shape: { points: [[-0.92, -0.45], [-0.64, -0.51], [-0.28, -0.5], [0.12, -0.43], [0.5, -0.2], [0.68, 0.08], [0.53, 0.38], [0.15, 0.48]], width: 0.24, opacity: 0.9 } },
      { time: KEY_TIMES[2], shape: { points: [[-0.92, -0.45], [-0.68, -0.48], [-0.43, -0.48], [-0.12, -0.42], [0.18, -0.33], [0.44, -0.27], [0.68, -0.28], [0.92, -0.32]], width: 0.16, opacity: 0.64 } },
    ],
    side: 1,
    z: 0.15,
    bend: 0.26,
    phase: 0.1,
    color: "#0a5936",
    attenuation: "#004d2d",
  },
  {
    keys: [
      { time: KEY_TIMES[0], shape: { points: [[-0.92, 0.68], [-0.72, 0.65], [-0.52, 0.55], [-0.34, 0.39], [-0.15, 0.31], [0.06, 0.28], [0.3, 0.34], [0.52, 0.39]], width: 0.08, opacity: 0.1 } },
      { time: KEY_TIMES[1], shape: { points: [[-0.92, 0.22], [-0.69, 0.46], [-0.43, 0.56], [-0.14, 0.43], [0.16, 0.2], [0.45, 0.18], [0.72, 0.38], [0.92, 0.47]], width: 0.27, opacity: 0.93 } },
      { time: KEY_TIMES[2], shape: { points: [[-0.92, 0.68], [-0.68, 0.64], [-0.43, 0.56], [-0.2, 0.54], [0.04, 0.59], [0.3, 0.65], [0.6, 0.61], [0.92, 0.49]], width: 0.16, opacity: 0.18 } },
    ],
    side: 1,
    z: 0.09,
    bend: 0.28,
    phase: 1.7,
    color: "#106744",
    attenuation: "#005a34",
  },
  {
    keys: [
      { time: KEY_TIMES[0], shape: { points: [[-0.9, 0.34], [-0.75, 0.3], [-0.57, 0.22], [-0.39, 0.16], [-0.2, 0.15], [0.02, 0.16], [0.24, 0.16], [0.45, 0.14]], width: 0.045, opacity: 0.012 } },
      { time: KEY_TIMES[1], shape: { points: [[-0.72, -0.32], [-0.88, -0.08], [-0.84, 0.2], [-0.63, 0.43], [-0.36, 0.55], [-0.12, 0.48], [0.12, 0.22], [0.34, 0.02]], width: 0.2, opacity: 0.9 } },
      { time: KEY_TIMES[2], shape: { points: [[-0.92, 0.56], [-0.7, 0.52], [-0.49, 0.54], [-0.3, 0.6], [-0.1, 0.68], [0.13, 0.68], [0.34, 0.61], [0.54, 0.58]], width: 0.06, opacity: 0.015 } },
    ],
    side: 1,
    z: 0.22,
    bend: 0.32,
    phase: 3.2,
    color: "#16784d",
    attenuation: "#006c3d",
  },
  {
    keys: [
      { time: KEY_TIMES[0], shape: { points: [[0.02, -0.61], [0.2, -0.59], [0.38, -0.54], [0.56, -0.45], [0.73, -0.37], [0.88, -0.34], [1.0, -0.34], [1.1, -0.37]], width: 0.06, opacity: 0.018 } },
      { time: KEY_TIMES[1], shape: { points: [[-0.02, -0.52], [0.18, -0.61], [0.4, -0.62], [0.58, -0.5], [0.7, -0.29], [0.76, -0.05], [0.66, 0.15], [0.47, 0.23]], width: 0.14, opacity: 0.65 } },
      { time: KEY_TIMES[2], shape: { points: [[-0.02, -0.52], [0.18, -0.62], [0.4, -0.64], [0.58, -0.51], [0.7, -0.31], [0.8, -0.12], [0.95, -0.17], [1.12, -0.3]], width: 0.12, opacity: 0.68 } },
    ],
    side: 1,
    z: 0.25,
    bend: 0.3,
    phase: 4.8,
    color: "#1a8050",
    attenuation: "#007344",
  },
];

function smoothstep(edge0: number, edge1: number, value: number): number {
  const x = Math.max(0, Math.min(1, (value - edge0) / (edge1 - edge0)));
  return x * x * (3 - 2 * x);
}

function lerp(a: number, b: number, amount: number): number {
  return a + (b - a) * amount;
}

function lerpPoint(a: Point, b: Point, amount: number): Point {
  return [lerp(a[0], b[0], amount), lerp(a[1], b[1], amount)];
}

function getShapeAt(definition: RibbonDefinition, time: number): RibbonShape {
  const [first, middle, last] = definition.keys;
  const segment = time <= middle.time
    ? [first, middle, smoothstep(first.time, middle.time, time)] as const
    : [middle, last, smoothstep(middle.time, last.time, time)] as const;
  const [from, to, blend] = segment;
  return {
    points: from.shape.points.map((point, index) => lerpPoint(point, to.shape.points[index], blend)) as RibbonShape["points"],
    width: lerp(from.shape.width, to.shape.width, blend),
    opacity: lerp(from.shape.opacity, to.shape.opacity, blend),
  };
}

function splinePoint(points: Point[], t: number): Point {
  const scaled = Math.max(0, Math.min(0.999999, t)) * (points.length - 1);
  const segment = Math.floor(scaled);
  const local = scaled - segment;
  const p0 = points[Math.max(0, segment - 1)];
  const p1 = points[segment];
  const p2 = points[segment + 1];
  const p3 = points[Math.min(points.length - 1, segment + 2)];
  const local2 = local * local;
  const local3 = local2 * local;
  return [
    0.5 * ((2 * p1[0]) + (-p0[0] + p2[0]) * local + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * local2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * local3),
    0.5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * local + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * local2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * local3),
  ];
}

function splineTangent(points: Point[], t: number): Point {
  const before = splinePoint(points, Math.max(0, t - 0.002));
  const after = splinePoint(points, Math.min(1, t + 0.002));
  return [after[0] - before[0], after[1] - before[1]];
}

function createRibbonGeometry(THREE: typeof import("three")) {
  const geometry = new THREE.BufferGeometry();
  const vertexCount = (SEGMENTS + 1) * (WIDTH_SEGMENTS + 1);
  const positions = new Float32Array(vertexCount * 3);
  const sheetUv = new Float32Array(vertexCount * 2);
  const indices: number[] = [];
  for (let y = 0; y <= WIDTH_SEGMENTS; y += 1) {
    for (let x = 0; x <= SEGMENTS; x += 1) {
      const index = y * (SEGMENTS + 1) + x;
      sheetUv[index * 2] = x / SEGMENTS;
      sheetUv[index * 2 + 1] = y / WIDTH_SEGMENTS;
      if (x < SEGMENTS && y < WIDTH_SEGMENTS) {
        indices.push(index, index + SEGMENTS + 1, index + 1);
        indices.push(index + 1, index + SEGMENTS + 1, index + SEGMENTS + 2);
      }
    }
  }
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("sheetUv", new THREE.BufferAttribute(sheetUv, 2));
  geometry.setIndex(indices);
  return { geometry, positions, sheetUv };
}

function updateRibbon(ribbon: Ribbon, time: number): void {
  const { definition, positions, geometry, material, mesh } = ribbon;
  const shape = getShapeAt(definition, time);
  const timeWave = Math.sin(time * 1.1 + definition.phase);
  const lateWave = smoothstep(0.8, 2.5, time);
  const earlyVisibility = smoothstep(0.02, 0.5, time);
  const lateVisibility = 1 - 0.88 * smoothstep(2.3, 2.88, time);
  material.opacity = shape.opacity * (definition === ribbonDefinitions[0] ? 0.38 + 0.62 * earlyVisibility : 1) * (definition === ribbonDefinitions[1] ? lateVisibility : 1);
  mesh.visible = material.opacity > 0.008;
  if (!mesh.visible) return;

  // The reference reads as a broad, folded sheet. A modestly wider cross
  // section gives the membrane a visible interior without turning it into a
  // solid tube; the alpha taper keeps its silhouette soft and open.
  const depth = shape.width * BASE_SQUARE_SIZE * 0.9;
  for (let y = 0; y <= WIDTH_SEGMENTS; y += 1) {
    const v = y / WIDTH_SEGMENTS;
    const widthProfile = Math.sin(Math.PI * v) * (0.76 + 0.24 * Math.sin(Math.PI * v));
    for (let x = 0; x <= SEGMENTS; x += 1) {
      const u = x / SEGMENTS;
      const point = splinePoint(shape.points, u);
      const tangent = splineTangent(shape.points, u);
      const tangentLength = Math.max(0.001, Math.hypot(tangent[0], tangent[1]));
      const normalX = -tangent[1] / tangentLength * definition.side;
      const normalY = tangent[0] / tangentLength * definition.side;
      const widthWave = 1 + 0.24 * Math.sin(u * Math.PI * 2.2 + time * 0.62 + definition.phase)
        + 0.1 * Math.sin(u * Math.PI * 4.1 - time * 0.36 + definition.phase * 1.5);
      const sideDistance = v * depth * widthWave;
      const crease = Math.sin(u * Math.PI * (3.2 + lateWave) + definition.phase + timeWave * 0.42);
      const crossFold = Math.sin(v * Math.PI * 2.2 + u * 4.8 + definition.phase);
      const broadFold = Math.sin(v * Math.PI) * definition.bend;
      const longitudinalFold = Math.sin(u * Math.PI * 3.4 + time * 0.64 + definition.phase) * 1.02
        + Math.sin(u * Math.PI * 6.8 - time * 0.42 + definition.phase * 1.4) * 0.42;
      const x3 = (point[0] * BASE_SQUARE_SIZE + normalX * sideDistance) + 0.035 * crossFold * widthProfile;
      const y3 = (point[1] * BASE_SQUARE_SIZE + normalY * sideDistance) + 0.035 * Math.cos(u * 5.1 + timeWave) * widthProfile;
      const z3 = definition.z + broadFold * longitudinalFold + 0.12 * crossFold * widthProfile + 0.055 * crease * widthProfile;
      const index = (y * (SEGMENTS + 1) + x) * 3;
      positions[index] = x3;
      positions[index + 1] = y3;
      positions[index + 2] = z3;
    }
  }
  const positionAttribute = geometry.getAttribute("position");
  positionAttribute.needsUpdate = true;
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
}

function addSoftEdgeShading(material: MeshPhysicalMaterial): void {
  material.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader.replace(
      "void main() {",
      "attribute vec2 sheetUv;\nvarying float vSheetFade;\nvarying float vSheetVolume;\nvoid main() {",
    ).replace(
      "#include <begin_vertex>",
      "#include <begin_vertex>\nvSheetFade = smoothstep(0.0, 0.035, sheetUv.y) * (1.0 - smoothstep(0.88, 1.0, sheetUv.y)) * smoothstep(0.0, 0.055, sheetUv.x) * (1.0 - smoothstep(0.94, 1.0, sheetUv.x));\nvSheetVolume = sin(3.14159265 * sheetUv.y);",
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      "void main() {",
      "varying float vSheetFade;\nvarying float vSheetVolume;\nvoid main() {",
    ).replace(
      "#include <color_fragment>",
      "#include <color_fragment>\ndiffuseColor.a *= vSheetFade;\ndiffuseColor.rgb *= mix(0.52, 1.0, vSheetVolume);",
    );
  };
}

function createStudioEnvironment(THREE: typeof import("three")): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = 768;
  canvas.height = 384;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas environment is unavailable");
  const background = context.createLinearGradient(0, 0, 0, canvas.height);
  background.addColorStop(0, "#0b1711");
  background.addColorStop(0.46, "#030806");
  background.addColorStop(1, "#07140d");
  context.fillStyle = background;
  context.fillRect(0, 0, canvas.width, canvas.height);

  const drawSoftbox = (x: number, y: number, width: number, height: number, rotation: number, tint: string, alpha: number) => {
    context.save();
    context.translate(x, y);
    context.rotate(rotation);
    context.filter = "blur(30px)";
    context.globalAlpha = alpha;
    const gradient = context.createLinearGradient(-width / 2, 0, width / 2, 0);
    gradient.addColorStop(0, "rgba(255,255,255,0)");
    gradient.addColorStop(0.2, tint);
    gradient.addColorStop(0.8, tint);
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    context.fillStyle = gradient;
    context.fillRect(-width / 2, -height / 2, width, height);
    context.restore();
  };
  drawSoftbox(210, 94, 460, 94, -0.12, "rgba(242,255,248,0.94)", 0.9);
  drawSoftbox(558, 150, 320, 78, 0.17, "rgba(190,255,218,0.82)", 0.78);
  drawSoftbox(285, 294, 490, 84, -0.04, "rgba(218,255,233,0.78)", 0.78);
  drawSoftbox(46, 216, 226, 22, 0.72, "rgba(228,255,238,0.52)", 0.45);
  context.filter = "none";
  context.globalAlpha = 0.14;
  context.fillStyle = "#dffff0";
  context.fillRect(105, 91, 314, 2);
  context.fillRect(470, 148, 205, 2);
  context.fillRect(106, 294, 346, 2);
  context.globalAlpha = 1;
  return canvas;
}

export default function LiquidIntroCanvas({ enabledRef, onReady, onFailure, previewTime }: LiquidIntroCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const callbacksRef = useRef({ onReady, onFailure });
  const previewTimeRef = useRef(previewTime);
  useEffect(() => { callbacksRef.current = { onReady, onFailure }; }, [onFailure, onReady]);
  useEffect(() => { previewTimeRef.current = previewTime; }, [previewTime]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let disposed = false;
    let failed = false;
    let renderer: WebGLRenderer | null = null;
    let scene: Scene | null = null;
    let camera: OrthographicCamera | null = null;
    let ribbons: Ribbon[] = [];
    let resizeObserver: ResizeObserver | null = null;
    let environmentTarget: WebGLRenderTarget | null = null;
    let environmentGenerator: { dispose: () => void } | null = null;
    const progressUniform = { value: 0 };
    const fail = () => {
      if (disposed || failed) return;
      failed = true;
      callbacksRef.current.onFailure?.();
    };
    const resize = () => {
      if (!renderer || !camera || disposed) return;
      const bounds = canvas.getBoundingClientRect();
      const width = bounds.width || window.innerWidth;
      const height = bounds.height || window.innerHeight;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, width < 620 ? 1.2 : 1.5);
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(width, height, false);
      const aspect = Math.max(0.01, width / height);
      const halfHeight = BASE_SQUARE_SIZE / 2;
      camera.left = -halfHeight * aspect;
      camera.right = halfHeight * aspect;
      camera.top = halfHeight;
      camera.bottom = -halfHeight;
      camera.updateProjectionMatrix();
      if (previewTimeRef.current !== undefined) renderAt(previewTimeRef.current);
    };
    const renderAt = (time: number) => {
      if (!renderer || !scene || !camera || disposed) return;
      const clampedTime = Math.max(0, Math.min(2.88, time));
      ribbons.forEach((ribbon) => updateRibbon(ribbon, clampedTime));
      renderer.render(scene, camera);
    };
    const renderFrame = () => {
      if (previewTimeRef.current !== undefined) return;
      renderAt(progressUniform.value * 2.88);
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!scene) return;
      const motion = scene.userData.pointer as { x: number; y: number };
      motion.x = event.clientX / Math.max(window.innerWidth, 1) - 0.5;
      motion.y = 0.5 - event.clientY / Math.max(window.innerHeight, 1);
    };
    const onVisibilityChange = () => renderer?.setAnimationLoop(document.visibilityState === "visible" && previewTimeRef.current === undefined ? renderFrame : null);
    const onContextLost = (event: Event) => { event.preventDefault(); renderer?.setAnimationLoop(null); fail(); };
    const frame = requestAnimationFrame(() => {
      if (!enabledRef.current && previewTimeRef.current === undefined) return;
      import("three").then((THREE) => {
        if (disposed) return;
        try {
          renderer = new THREE.WebGLRenderer({ canvas, alpha: false, antialias: true, depth: true, stencil: false, preserveDrawingBuffer: previewTimeRef.current !== undefined, powerPreference: "high-performance" });
          renderer.outputColorSpace = THREE.SRGBColorSpace;
          renderer.toneMapping = THREE.ACESFilmicToneMapping;
          renderer.toneMappingExposure = 0.76;
          renderer.setClearColor("#010705", 1);
          renderer.transmissionResolutionScale = 0.65;
          scene = new THREE.Scene();
          scene.background = new THREE.Color("#010705");
          scene.environmentIntensity = 1.2;
          const fillLight = new THREE.HemisphereLight(0xe4fff0, 0x00180b, 1.18);
          const keyLight = new THREE.DirectionalLight(0xf4fff8, 1.05);
          const rimLight = new THREE.DirectionalLight(0x9affc7, 0.24);
          keyLight.position.set(-0.55, 0.82, 1.8);
          rimLight.position.set(1.2, -0.55, 0.9);
          scene.add(fillLight, keyLight, rimLight);
          scene.userData.pointer = { x: 0, y: 0 };
          camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.05, 10);
          camera.position.z = 2.2;
          const pmrem = new THREE.PMREMGenerator(renderer);
          pmrem.compileEquirectangularShader();
          const environmentSource = new THREE.CanvasTexture(createStudioEnvironment(THREE));
          environmentSource.mapping = THREE.EquirectangularReflectionMapping;
          environmentSource.colorSpace = THREE.SRGBColorSpace;
          environmentTarget = pmrem.fromEquirectangular(environmentSource);
          environmentSource.dispose();
          environmentGenerator = pmrem;
          scene.environment = environmentTarget.texture;

          ribbons = ribbonDefinitions.map((definition) => {
            const { geometry, positions, sheetUv } = createRibbonGeometry(THREE);
            const material = new THREE.MeshPhysicalMaterial({
              color: definition.color,
              metalness: 0.015,
              roughness: 0.22,
              transmission: 0.14,
              thickness: 0.9,
              ior: 1.34,
              attenuationColor: definition.attenuation,
              attenuationDistance: 0.35,
              emissive: "#00351f",
              emissiveIntensity: 0.1,
              clearcoat: 0.78,
              clearcoatRoughness: 0.15,
              envMapIntensity: 1.9,
              transparent: true,
              opacity: 0.58,
              side: THREE.DoubleSide,
              depthWrite: false,
            });
            addSoftEdgeShading(material);
            const mesh = new THREE.Mesh(geometry, material);
            mesh.frustumCulled = false;
            mesh.renderOrder = Math.round(definition.z * 100);
            scene?.add(mesh);
            const ribbon: Ribbon = { geometry, mesh, material, definition, positions };
            updateRibbon(ribbon, previewTimeRef.current ?? 0);
            return ribbon;
          });
          resize();
          renderAt(previewTimeRef.current ?? 0);
          if (previewTimeRef.current === undefined) renderer.setAnimationLoop(renderFrame);
          resizeObserver = new ResizeObserver(resize);
          resizeObserver.observe(canvas);
          window.addEventListener("resize", resize, { passive: true });
          window.addEventListener("pointermove", onPointerMove, { passive: true });
          document.addEventListener("visibilitychange", onVisibilityChange);
          canvas.addEventListener("webglcontextlost", onContextLost);
          callbacksRef.current.onReady?.(progressUniform);
        } catch {
          fail();
        }
      }).catch(fail);
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      renderer?.setAnimationLoop(null);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      resizeObserver?.disconnect();
      canvas.removeEventListener("webglcontextlost", onContextLost);
      ribbons.forEach(({ geometry, material }) => { geometry.dispose(); material.dispose(); });
      environmentTarget?.dispose();
      environmentGenerator?.dispose();
      renderer?.dispose();
    };
  }, [enabledRef]);

  return <canvas ref={canvasRef} className="intro-shader-canvas absolute inset-0 z-[1] block h-full w-full touch-none" aria-hidden="true" />;
}
