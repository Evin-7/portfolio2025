"use client";

import { useEffect, useRef } from "react";

const vertexShaderSource = `#version 300 es
in vec2 aPosition;
out vec2 vUv;

void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

const fragmentShaderSource = `#version 300 es
precision highp float;

uniform sampler2D uTexture;
uniform vec2 uResolution;
uniform vec2 uImageResolution;
uniform vec2 uPointer;
uniform float uTime;
uniform float uIntroProgress;
uniform float uHeroMode;
uniform float uScroll;
uniform float uMobile;

in vec2 vUv;
out vec4 outColor;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 3; i++) {
    value += amplitude * noise(p);
    p = p * 2.03 + vec2(13.7, 7.1);
    amplitude *= 0.5;
  }
  return value;
}

vec2 coverUv(vec2 uv, float screenAspect, float imageAspect) {
  if (uMobile > 0.5) {
    float imageHeight = clamp(screenAspect / imageAspect, 0.0, 1.0);
    return vec2(uv.x, (uv.y - (1.0 - imageHeight)) / max(imageHeight, 0.001));
  }

  if (screenAspect > imageAspect) {
    uv.y = (uv.y - 0.5) * (imageAspect / screenAspect) + 0.5;
  } else {
    uv.x = (uv.x - 0.5) * (screenAspect / imageAspect) + 0.5;
  }
  return uv;
}

vec3 glassVortex(vec3 baseColor, vec2 p, float progress, float time) {
  float radius = length(p);
  float angle = atan(p.y, p.x);
  float formation = smoothstep(0.24, 0.5, progress) * (1.0 - smoothstep(0.74, 0.9, progress));
  float organic = fbm(vec2(angle * 1.7 + 4.0, time * 0.07 + radius * 2.2));
  float wave = 0.058 * sin(angle * 2.0 + time * 0.21)
    + 0.036 * sin(angle * 3.0 - time * 0.14)
    + 0.022 * sin(angle * 5.0 + time * 0.11)
    + (organic - 0.5) * 0.085;
  float ringRadius = 0.36 + wave;
  float distance = radius - ringRadius;
  float absoluteDistance = abs(distance);
  float aa = max(fwidth(radius) * 1.8, 0.0025);
  float thickness = 0.102 + 0.018 * sin(angle * 3.0 + time * 0.25);
  float body = 1.0 - smoothstep(thickness - aa, thickness + aa, absoluteDistance);
  float innerRim = 1.0 - smoothstep(aa * 0.8, aa * 3.6, abs(distance + thickness * 0.77));
  float outerRim = 1.0 - smoothstep(aa * 0.8, aa * 3.6, abs(distance - thickness * 0.73));
  float travelingLight = pow(max(0.0, cos(angle - time * 0.42 + organic * 1.7)), 28.0);
  float longReflection = pow(max(0.0, cos(angle + time * 0.23 + 1.7)), 48.0);
  float causticTrack = exp(-pow((distance - sin(angle * 2.0 + time * 0.35 + organic) * thickness * 0.22) * 28.0, 2.0));
  float curvedSurface = sqrt(max(0.0, 1.0 - pow(distance / thickness, 2.0)));
  float surfaceShade = 0.5 + 0.5 * curvedSurface + 0.12 * sin(angle * 2.0 - time * 0.16 + organic * 4.0);
  float hole = 1.0 - smoothstep(ringRadius - thickness * 0.98, ringRadius - thickness * 0.76, radius);
  vec3 darkCenter = vec3(0.0015, 0.006, 0.0045);
  vec3 glassTint = baseColor * vec3(0.44, 0.79, 0.59) + vec3(0.002, 0.025, 0.013);
  vec3 imageUnderGlass = mix(baseColor, glassTint, 0.72);
  vec3 color = mix(baseColor, darkCenter, formation * hole * 0.9);
  color = mix(color, imageUnderGlass * surfaceShade, formation * body * 0.88);
  float specular = formation * (innerRim * (0.3 + 0.7 * travelingLight) + outerRim * (0.18 + 0.56 * longReflection) + causticTrack * (0.1 + 0.2 * travelingLight));
  vec3 highlight = mix(vec3(0.28, 0.9, 0.55), vec3(0.95, 1.0, 0.97), clamp(travelingLight + longReflection * 0.32, 0.0, 1.0));
  return color + highlight * specular * surfaceShade * 0.78;
}

void main() {
  float screenAspect = uResolution.x / max(uResolution.y, 1.0);
  float imageAspect = uImageResolution.x / max(uImageResolution.y, 1.0);
  vec2 uv = coverUv(vUv, screenAspect, imageAspect);
  float imageHeight = screenAspect / imageAspect;

  float introWindow = (1.0 - uHeroMode) * smoothstep(0.08, 0.42, uIntroProgress) * (1.0 - smoothstep(0.74, 0.94, uIntroProgress));
  vec2 screenPoint = vec2(vUv.x - 0.5, vUv.y - 0.5);
  float radius = length(screenPoint);
  float angle = atan(screenPoint.y, screenPoint.x);
  float turbulence = fbm(uv * 5.2 + vec2(uTime * 0.025, -uTime * 0.018));

  float motionScale = 1.0 - uHeroMode + uHeroMode * 0.36;
  float flowX = sin(uv.y * 8.0 + uTime * 0.13 + turbulence * 2.2) * 0.0038;
  float flowY = cos(uv.x * 6.0 - uTime * 0.09 + turbulence * 1.8) * 0.0032;
  vec2 drift = vec2(flowX + uPointer.x * 0.003 + uScroll * 0.002, flowY + uPointer.y * 0.003) * motionScale;

  float vortexTwist = introWindow * (2.4 + 0.48 * sin(angle * 2.0 + uTime * 0.25)) * exp(-radius * 2.05);
  vec2 vortexPoint = vec2(cos(angle + vortexTwist), sin(angle + vortexTwist)) * radius;
  vec2 vortexUv = vUv + vec2(vortexPoint.x - screenPoint.x, vortexPoint.y - screenPoint.y);
  vec2 sampledScreenUv = mix(vUv, vortexUv, introWindow * 0.78);
  uv = mix(uv, coverUv(vortexUv, screenAspect, imageAspect), introWindow * 0.78) + drift;

  vec3 baseColor;
  if (uMobile > 0.5) {
    vec2 topUv = vec2(sampledScreenUv.x, sampledScreenUv.y / max(imageHeight, 0.001)) + drift;
    vec2 bottomUv = vec2(sampledScreenUv.x, 1.0 - (1.0 - sampledScreenUv.y) / max(imageHeight, 0.001)) + drift;
    vec3 dark = vec3(0.003, 0.008, 0.006);
    vec3 upperGlass = texture(uTexture, clamp(topUv, 0.001, 0.999)).rgb;
    vec3 lowerGlass = texture(uTexture, clamp(bottomUv, 0.001, 0.999)).rgb;
    float upperFade = 1.0 - smoothstep(imageHeight * 0.78, imageHeight, sampledScreenUv.y);
    float lowerFade = smoothstep(1.0 - imageHeight, 1.0 - imageHeight * 0.78, sampledScreenUv.y);
    baseColor = mix(dark, upperGlass, upperFade);
    baseColor = mix(baseColor, lowerGlass, lowerFade);
  } else {
    baseColor = texture(uTexture, clamp(uv, 0.001, 0.999)).rgb;
  }
  float luminance = dot(baseColor, vec3(0.2126, 0.7152, 0.0722));
  float reflectionMask = smoothstep(0.09, 0.58, luminance) * smoothstep(0.01, 0.12, baseColor.g - baseColor.r * 0.58);
  baseColor += vec3(0.2, 0.34, 0.27) * reflectionMask * 0.012;

  vec2 vortexPointForRim = vec2((vUv.x - 0.5) * max(screenAspect, 0.7), vUv.y - 0.5);
  vec3 color = glassVortex(baseColor, vortexPointForRim, uIntroProgress, uTime) * (1.0 - uHeroMode);
  color += baseColor * uHeroMode;

  outColor = vec4(color, 1.0);
}`;

function compileShader(gl, type, source) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export default function LiquidGlassBackground() {
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let gl = null;
    let program = null;
    let positions = null;
    let texture = null;
    let uniforms = null;
    let imageLoaded = false;
    let contextLost = false;

    if (!reducedMotion.matches) {
      gl = canvas.getContext("webgl2", {
        alpha: true,
        antialias: false,
        depth: false,
        powerPreference: "low-power",
        premultipliedAlpha: false,
        stencil: false,
      });

      if (gl) {
        const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
        if (vertexShader && fragmentShader) {
          program = gl.createProgram();
          if (program) {
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);
          }
        }
        if (vertexShader) gl.deleteShader(vertexShader);
        if (fragmentShader) gl.deleteShader(fragmentShader);
        if (!program || !gl.getProgramParameter(program, gl.LINK_STATUS)) {
          if (program) gl.deleteProgram(program);
          program = null;
          gl = null;
        }
      }
    }

    if (gl && program) {
      positions = gl.createBuffer();
      texture = gl.createTexture();
      if (!positions || !texture) {
        if (positions) gl.deleteBuffer(positions);
        if (texture) gl.deleteTexture(texture);
        gl.deleteProgram(program);
        gl = null;
        program = null;
        positions = null;
        texture = null;
      } else {
        gl.bindBuffer(gl.ARRAY_BUFFER, positions);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
        gl.useProgram(program);
        const positionLocation = gl.getAttribLocation(program, "aPosition");
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.uniform1i(gl.getUniformLocation(program, "uTexture"), 0);
        uniforms = {
          resolution: gl.getUniformLocation(program, "uResolution"),
          imageResolution: gl.getUniformLocation(program, "uImageResolution"),
          pointer: gl.getUniformLocation(program, "uPointer"),
          time: gl.getUniformLocation(program, "uTime"),
          introProgress: gl.getUniformLocation(program, "uIntroProgress"),
          heroMode: gl.getUniformLocation(program, "uHeroMode"),
          scroll: gl.getUniformLocation(program, "uScroll"),
          mobile: gl.getUniformLocation(program, "uMobile"),
        };
      }
    }

    const refs = {
      active: !document.documentElement.dataset.introComplete,
      introComplete: document.documentElement.dataset.introComplete === "true",
      progress: 0,
      pointerX: 0,
      pointerY: 0,
      targetX: 0,
      targetY: 0,
      scroll: 0,
      mobile: window.matchMedia("(max-width: 620px)").matches,
      running: false,
      ready: false,
    };
    const hero = document.querySelector(".hero-section");
    let frameId = 0;
    let startedAt = performance.now();
    const pixelRatio = () => Math.min(window.devicePixelRatio || 1, refs.mobile ? 0.8 : 1.25);

    const setActive = (active) => {
      refs.active = active;
      wrapper.dataset.active = String(active);
      syncRendering();
    };

    const setSize = () => {
      refs.mobile = window.matchMedia("(max-width: 620px)").matches;
      const ratio = pixelRatio();
      const width = Math.max(1, Math.round(window.innerWidth * ratio));
      const heroHeight = refs.introComplete && hero
        ? hero.getBoundingClientRect().height
        : window.innerHeight;
      const height = Math.max(1, Math.round(heroHeight * ratio));
      if (gl && (canvas.width !== width || canvas.height !== height)) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
      refs.scroll = Math.min(1, window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight));
    };

    const draw = (now) => {
      if (!refs.running || !imageLoaded || contextLost || !gl || !uniforms) return;
      const elapsed = (now - startedAt) / 1000;
      refs.pointerX += (refs.targetX - refs.pointerX) * 0.045;
      refs.pointerY += (refs.targetY - refs.pointerY) * 0.045;
      gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
      gl.uniform2f(uniforms.imageResolution, 1585, 992);
      gl.uniform2f(uniforms.pointer, refs.pointerX, refs.pointerY);
      gl.uniform1f(uniforms.time, elapsed);
      gl.uniform1f(uniforms.introProgress, refs.progress);
      gl.uniform1f(uniforms.heroMode, refs.introComplete ? 1 : 0);
      gl.uniform1f(uniforms.scroll, refs.scroll);
      gl.uniform1f(uniforms.mobile, refs.mobile ? 1 : 0);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      frameId = window.requestAnimationFrame(draw);
    };

    const syncRendering = () => {
      const shouldRun = Boolean(gl && refs.active && imageLoaded && document.visibilityState === "visible" && !contextLost);
      wrapper.dataset.active = String(refs.active);
      wrapper.dataset.webgl = String(Boolean(gl));
      if (shouldRun && !refs.running) {
        refs.running = true;
        startedAt = performance.now();
        setSize();
        frameId = window.requestAnimationFrame(draw);
      } else if (!shouldRun && refs.running) {
        refs.running = false;
        window.cancelAnimationFrame(frameId);
      }
    };

    let image = null;
    if (gl && texture) {
      image = new window.Image();
      image.decoding = "async";
      image.src = "/emerald-ribbons.webp";
      image.onload = () => {
        if (contextLost || !gl) return;
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
        imageLoaded = true;
        wrapper.dataset.webgl = "true";
        syncRendering();
      };
      image.onerror = () => { wrapper.dataset.webgl = "false"; };
    }

    const updateSceneBounds = () => {
      refs.scroll = Math.min(1, window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight));
      if (!hero || !refs.introComplete) {
        wrapper.style.top = "";
        wrapper.style.right = "";
        wrapper.style.bottom = "";
        wrapper.style.left = "";
        wrapper.style.height = "";
        wrapper.style.clipPath = "inset(0px)";
        setSize();
        setActive(true);
        return;
      }

      const rect = hero.getBoundingClientRect();
      const visible = rect.bottom > 0 && rect.top < window.innerHeight;
      wrapper.style.top = `${rect.top}px`;
      wrapper.style.right = "0";
      wrapper.style.bottom = "auto";
      wrapper.style.left = "0";
      wrapper.style.height = `${rect.height}px`;
      wrapper.style.clipPath = "none";
      setSize();
      setActive(visible);
    };
    const observer = hero ? new IntersectionObserver(updateSceneBounds, { rootMargin: "30px 0px" }) : null;
    if (hero) observer?.observe(hero);

    const onIntroProgress = (event) => {
      const value = Number(event.detail?.progress);
      if (Number.isFinite(value)) refs.progress = Math.max(0, Math.min(1, value));
    };
    const onIntroComplete = () => {
      refs.progress = 1;
      refs.introComplete = true;
      updateSceneBounds();
    };
    const onPointerMove = (event) => {
      if (event.pointerType && event.pointerType !== "mouse") return;
      refs.targetX = ((event.clientX / Math.max(1, window.innerWidth)) - 0.5) * 2;
      refs.targetY = -((event.clientY / Math.max(1, window.innerHeight)) - 0.5) * 2;
    };
    const onPointerLeave = () => { refs.targetX = 0; refs.targetY = 0; };
    const onScroll = () => updateSceneBounds();
    const onResize = () => {
      setSize();
      updateSceneBounds();
    };
    const onVisibilityChange = () => syncRendering();
    const onContextLost = (event) => {
      event.preventDefault();
      contextLost = true;
      refs.running = false;
      window.cancelAnimationFrame(frameId);
      wrapper.dataset.webgl = "false";
    };

    window.addEventListener("portfolio:intro-progress", onIntroProgress);
    window.addEventListener("portfolio:intro-complete", onIntroComplete);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    if (gl) canvas.addEventListener("webglcontextlost", onContextLost);

    setSize();
    updateSceneBounds();
    syncRendering();

    return () => {
      refs.running = false;
      window.cancelAnimationFrame(frameId);
      observer?.disconnect();
      window.removeEventListener("portfolio:intro-progress", onIntroProgress);
      window.removeEventListener("portfolio:intro-complete", onIntroComplete);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (gl) {
        canvas.removeEventListener("webglcontextlost", onContextLost);
        if (texture) gl.deleteTexture(texture);
        if (positions) gl.deleteBuffer(positions);
        if (program) gl.deleteProgram(program);
      }
      if (image) {
        image.onload = null;
        image.onerror = null;
      }
    };
  }, []);

  return (
    <div ref={wrapperRef} className="liquid-glass-background" data-active="true" data-webgl="false" aria-hidden="true">
      <canvas ref={canvasRef} className="liquid-glass-canvas" />
    </div>
  );
}
