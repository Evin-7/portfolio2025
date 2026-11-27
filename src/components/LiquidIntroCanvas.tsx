"use client";

import { useEffect, useRef } from "react";
import type { MutableRefObject } from "react";
import type { OrthographicCamera, PlaneGeometry, Scene, ShaderMaterial, WebGLRenderer } from "three";

type ProgressUniform = { value: number };
type LiquidIntroCanvasProps = {
  enabledRef: MutableRefObject<boolean>;
  onReady?: (uniform: ProgressUniform) => void;
  onFailure?: () => void;
  previewTime?: number;
};

const vertexShader = `
  void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

// Two open, domain-warped scalar fields define the membrane lips. There is no
// closed radial primitive, tube geometry, sampled reference image, or animated texture.
const fragmentShader = `
  precision highp float;
  uniform vec2 uResolution;
  uniform vec2 uPointer;
  uniform float uProgress;

  float bell(float x, float width) { return exp(-x*x / (width*width)); }
  float formation(float t) { return smoothstep(0.65, 1.28, t) * (1.0-smoothstep(2.25,2.75,t)); }

  float flowField(vec2 p, float t, float layer) {
    float fold = formation(t);
    float x = p.x + 0.055*sin(p.y*4.2+t*0.8+layer*2.0)
      + 0.022*sin(p.x*4.6-p.y*2.1-t*0.7);
    float rise = smoothstep(0.0,0.72,t);
    float wave = -0.65 + 0.30*rise + 0.21*tanh(x*3.0-0.55+t*0.30)
      + 0.065*sin(x*3.4-t*0.7);
    if(layer < 0.5) {
      float lip = -0.51 + 1.10*x*x + 0.10*x
        + 0.075*sin(x*5.1+t*0.9) + 0.035*sin(x*8.0-t*1.1);
      return p.y-mix(wave,lip,fold);
    }
    float upperWave = 0.78-0.18*x + 0.07*sin(x*3.3+t*0.65);
    float upperLip = 0.48 - 0.90*x*x - 0.13*x
      + 0.11*sin(x*4.2-t*0.8) + 0.045*sin(x*7.5+t*0.55);
    return mix(upperWave,upperLip,fold)-p.y;
  }

  float membraneHeight(vec2 p, float t, float layer) {
    float f=flowField(p,t,layer);
    float fold=formation(t);
    float width=0.055+0.055*fold+0.035*(0.5+0.5*sin(p.x*4.1-t*0.8+layer));
    // A sharp lip opens into an expansive, transparent sheet on one side.
    float lip=exp(-abs(f)/width);
    float sheet=exp(-max(f,0.0)/(width*2.8))*smoothstep(-0.012,0.06,f);
    return 0.055*lip+0.025*sheet*(0.65+0.35*sin(p.x*5.0+f*7.0-t*0.7));
  }

  vec3 membrane(vec2 p,float t,float layer) {
    float f=flowField(p,t,layer);
    float fold=formation(t);
    float width=0.055+0.055*fold+0.035*(0.5+0.5*sin(p.x*4.1-t*0.8+layer));
    float h=membraneHeight(p,t,layer);
    float e=0.002;
    vec2 gradient=vec2(membraneHeight(p+vec2(e,0.0),t,layer)-membraneHeight(p-vec2(e,0.0),t,layer),
      membraneHeight(p+vec2(0.0,e),t,layer)-membraneHeight(p-vec2(0.0,e),t,layer))/(2.0*e);
    vec3 n=normalize(vec3(-gradient*1.65,1.0));
    vec3 incident=vec3(0.0,0.0,-1.0);
    vec3 reflected=reflect(incident,n);
    vec3 refracted=refract(incident,n,1.0/1.48);
    float fresnel=0.04+0.96*pow(1.0-max(n.z,0.0),5.0);
    float sheet=exp(-max(f,0.0)/(width*2.5))*smoothstep(-0.025,0.025,f);
    float lip=bell(f,max(width*0.15,fwidth(f)*1.6));
    float rear=bell(f-width*(1.25+0.30*sin(p.x*5.0-t)),width*0.38);
    // Broad strip lights are reflected across deformed normals; their footprints
    // travel along the surface rather than becoming isolated point highlights.
    float travel=0.25+0.34*sin(t*1.05+layer*2.0);
    float envelope=0.025+0.975*bell(p.x-travel,0.32+0.09*fold);
    float strip=bell(reflected.y-(0.38+0.18*sin(p.x*2.3+t*0.45)),0.22);
    float fineStrip=bell(reflected.y+0.44,0.075);
    float broad=bell(f-width*0.38,width*0.32)*envelope;
    float opticalDepth=(0.25+sheet*0.75)*h*12.0;
    vec3 transmission=exp(-vec3(3.7,0.65,2.1)*opticalDepth);
    vec3 absorption=(vec3(1.0)-transmission)*vec3(0.007,0.11,0.048);
    float internal=sheet*(0.014+0.022*sin(refracted.x*6.0+p.x*4.0-t*0.4));
    vec3 color=absorption*sheet + vec3(0.008,0.10,0.045)*max(internal,0.0);
    color+=vec3(0.25,0.95,0.54)*broad*(0.55+0.65*strip);
    color+=vec3(0.65,1.0,0.79)*lip*envelope*(0.28+0.65*strip+0.35*fresnel);
    color+=vec3(0.13,0.53,0.32)*rear*envelope*0.26;
    color+=vec3(0.50,0.90,0.70)*fineStrip*sheet*envelope*0.07;
    float visibility=layer<0.5 ? mix(0.018,1.0,smoothstep(0.04,0.62,t))
      : smoothstep(0.52,1.02,t)*(1.0-0.94*smoothstep(2.25,2.78,t));
    return color*visibility;
  }

  void main() {
    float t=clamp(uProgress,0.0,1.0)*2.88;
    vec2 p=(gl_FragCoord.xy-uResolution*0.5)/min(uResolution.x,uResolution.y)*1.55;
    float twist=formation(t)*(-0.22+0.08*sin(t*0.7));
    p=mat2(cos(twist),-sin(twist),sin(twist),cos(twist))*p;
    p+=uPointer*0.004;
    vec3 color=vec3(0.00392,0.02745,0.01961);
    color+=membrane(p,t,0.0);
    color+=membrane(p,t,1.0);
    // A very thin rear skin shares the same flow, offset continuously, not capped.
    vec2 rearP=p+vec2(0.035*sin(t*0.65),0.065+0.025*sin(p.x*3.0+t));
    color+=membrane(rearP,t,0.0)*formation(t)*0.19;
    gl_FragColor=vec4(color,1.0);
  }
`;

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
    let renderer: WebGLRenderer | null = null;
    let geometry: PlaneGeometry | null = null;
    let scene: Scene | null = null;
    let camera: OrthographicCamera | null = null;
    let material: ShaderMaterial | null = null;
    let failed = false;
    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const progressUniform = { value: 0 };
    const fail = () => {
      if (disposed || failed) return;
      failed = true;
      callbacksRef.current.onFailure?.();
    };
    const resize = () => {
      if (!renderer || !material || disposed) return;
      const cap = window.innerWidth < 620 ? 1.25 : 1.5;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, cap));
      renderer.setSize(window.innerWidth, window.innerHeight, false);
      renderer.getDrawingBufferSize(material.uniforms.uResolution.value);
    };
    const renderFrame = () => {
      if (!renderer || !material || !scene || !camera || disposed) return;
      pointer.x += (pointer.targetX - pointer.x) * 0.035;
      pointer.y += (pointer.targetY - pointer.y) * 0.035;
      material.uniforms.uPointer.value.set(pointer.x, pointer.y);
      material.uniforms.uProgress.value = previewTimeRef.current === undefined
        ? progressUniform.value : Math.max(0, Math.min(1, previewTimeRef.current / 2.88));
      renderer.render(scene, camera);
    };
    const onPointerMove = (event: PointerEvent) => {
      pointer.targetX = event.clientX / Math.max(window.innerWidth, 1) - 0.5;
      pointer.targetY = 0.5 - event.clientY / Math.max(window.innerHeight, 1);
    };
    const onVisibilityChange = () => renderer?.setAnimationLoop(document.visibilityState === "visible" ? renderFrame : null);
    const onContextLost = (event: Event) => { event.preventDefault(); renderer?.setAnimationLoop(null); fail(); };
    const frame = requestAnimationFrame(() => {
      if (!enabledRef.current && previewTimeRef.current === undefined) return;
      import("three").then((THREE) => {
        if (disposed) return;
        try {
          renderer = new THREE.WebGLRenderer({ canvas, alpha: false, antialias: false, depth: false, stencil: false, preserveDrawingBuffer: previewTimeRef.current !== undefined, powerPreference: "low-power" });
          renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
          scene = new THREE.Scene();
          camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 2);
          camera.position.z = 1;
          geometry = new THREE.PlaneGeometry(2, 2);
          material = new THREE.ShaderMaterial({
            vertexShader, fragmentShader, depthTest: false, depthWrite: false, toneMapped: false,
            uniforms: {
              uResolution: { value: new THREE.Vector2(1, 1) },
              uPointer: { value: new THREE.Vector2() },
              uProgress: { value: 0 },
            },
          });
          const plane = new THREE.Mesh(geometry, material);
          plane.frustumCulled = false;
          scene.add(plane);
          resize();
          renderFrame();
          renderer.setAnimationLoop(renderFrame);
          window.addEventListener("resize", resize, { passive: true });
          window.addEventListener("pointermove", onPointerMove, { passive: true });
          document.addEventListener("visibilitychange", onVisibilityChange);
          canvas.addEventListener("webglcontextlost", onContextLost);
          callbacksRef.current.onReady?.(progressUniform);
        } catch { fail(); }
      }).catch(fail);
    });
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      renderer?.setAnimationLoop(null);
      material?.dispose();
      geometry?.dispose();
      renderer?.dispose();
    };
  }, [enabledRef]);

  return <canvas ref={canvasRef} className="intro-shader-canvas absolute inset-0 z-[1] block h-full w-full touch-none" aria-hidden="true" />;
}
