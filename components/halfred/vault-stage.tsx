"use client";

import { type CSSProperties, useEffect, useRef } from "react";

/** Horizon du sol, en fraction de la hauteur depuis le haut (le bloc s'y pose). */
const HORIZON = 0.74;

const VERT = "attribute vec2 p; void main() { gl_Position = vec4(p, 0.0, 1.0); }";

/**
 * Anneaux lumineux (d'après « ShaderAnimation ») recolorés en rouge Halfred,
 * émis derrière le bloc, et un sol de marbre noir en perspective qui en reçoit
 * la lumière : reflet miroir des anneaux, flaque rouge au pied du bloc.
 */
const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 res;
uniform float time;
uniform float reveal;
uniform float horizon;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
  return v;
}

// Anneaux : même formule que l'original (rayon ramené dans le cadre), trois canaux fondus en une intensité.
float rings(vec2 uv) {
  float t = time * 0.05;
  float c = 0.0;
  for (int j = 0; j < 3; j++) {
    for (int i = 0; i < 5; i++) {
      c += 0.002 * float(i * i) / abs(fract(t - 0.01 * float(j) + float(i) * 0.01) * 2.4 - length(uv) + mod(uv.x + uv.y, 0.2));
    }
  }
  return c / 2.0;
}

void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - res) / min(res.x, res.y);
  float hy = (1.0 - 2.0 * horizon) * res.y / min(res.x, res.y); // horizon en coordonnées uv
  vec2 src = vec2(0.0, hy + 0.55);                              // centre des anneaux : le cœur du bloc
  vec3 red = vec3(0.82, 0.13, 0.20);
  vec3 glow = vec3(1.0, 0.23, 0.31);
  vec3 col;

  if (uv.y >= hy) {
    float r = rings(uv - src);
    float fade = exp(-length(uv - src) * 0.6);
    col = (red * r + glow * pow(r, 3.0) * 0.4) * fade;
  } else {
    float d = hy - uv.y;                         // distance sous l'horizon
    float z = 1.0 / (d + 0.08);                   // profondeur
    vec2 f = vec2(uv.x * z, z * 2.0);             // coordonnées sur le sol
    float m = fbm(f * 1.3);
    float vein = 1.0 - smoothstep(0.0, 0.06, abs(sin((f.x * 0.8 + m * 3.5) * 3.0)));
    vec3 marble = vec3(0.018, 0.017, 0.02) + vec3(0.05) * vein * 0.6 + vec3(0.012) * m;
    // Reflet : les anneaux vus dans le sol, flous et atténués avec la distance.
    vec2 mirror = vec2(uv.x, hy + d * 1.4) - src;
    float refl = rings(mirror) * exp(-d * 2.6) * 0.45;
    // Flaque de lumière au pied du bloc, qui respire avec les anneaux.
    float pool = exp(-length(vec2(uv.x * 0.9, d * 3.2))) * (0.16 + 0.06 * sin(time * 0.35));
    col = marble * (1.0 + pool * 6.0) + red * (refl + pool) + glow * pow(refl, 2.0) * 0.3;
  }

  // Vignette et bords fondus dans le noir de la page.
  vec2 q = gl_FragCoord.xy / res;
  float edge = smoothstep(0.0, 0.3, q.x) * (1.0 - smoothstep(0.7, 1.0, q.x)) * smoothstep(0.0, 0.15, q.y) * (1.0 - smoothstep(0.65, 1.0, q.y));
  // Tonemap doux : les crêtes des anneaux saturent en lueur, pas en aplat.
  col = 1.0 - exp(-col * 1.4);
  // Fond de page ajouté : le cadre du canvas disparaît dans la page.
  gl_FragColor = vec4(vec3(0.0196, 0.0196, 0.0235) + col * reveal * edge, 1.0);
}
`;

/**
 * Scène du 100 % local : anneaux WebGL derrière le bloc découpé, posé sur un
 * sol de marbre noir. Les anneaux s'allument à l'arrivée sur la section
 * (révélation sur 2,5 s) et s'arrêtent hors écran. Sans WebGL : le bloc seul,
 * sur son sol. Sous `prefers-reduced-motion` : une image fixe, déjà allumée.
 */
export default function VaultStage({ src, alt }: { src: string; alt: string }) {
  const box = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = box.current;
    const cv = canvas.current;
    const gl = cv?.getContext("webgl", { antialias: false, premultipliedAlpha: false });
    if (!root || !cv || !gl) return;

    const shader = (type: number, code: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, code);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, shader(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const u = (n: string) => gl.getUniformLocation(prog, n);
    const uRes = u("res"), uTime = u("time"), uReveal = u("reveal");
    gl.uniform1f(u("horizon"), HORIZON);

    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0, start = 0, visible = false;

    const size = () => {
      const dpr = Math.min(devicePixelRatio, 1.5);
      cv.width = Math.round(root.clientWidth * dpr);
      cv.height = Math.round(root.clientHeight * dpr);
      gl.viewport(0, 0, cv.width, cv.height);
      gl.uniform2f(uRes, cv.width, cv.height);
    };
    const draw = (now: number) => {
      const t = still ? 2.5 : (now - start) / 1000;
      gl.uniform1f(uTime, 20 + t * 3);
      gl.uniform1f(uReveal, still ? 1 : 1 - (1 - Math.min(1, t / 2.5)) ** 3);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      if (!still && visible) raf = requestAnimationFrame(draw);
    };

    size();
    const ro = new ResizeObserver(() => { size(); if (still) draw(0); });
    ro.observe(root);
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting === visible) return;
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) { start = performance.now(); raf = requestAnimationFrame(draw); }
    }, { threshold: 0.25 });
    io.observe(root);
    return () => { ro.disconnect(); io.disconnect(); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div ref={box} className="hr-vault" style={{ "--horizon": `${HORIZON * 100}%` } as CSSProperties}>
      <canvas ref={canvas} className="hr-vault__fx" aria-hidden />
      <span className="hr-vault__shadow" aria-hidden />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" aria-hidden className="hr-vault__reflect" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="hr-vault__block" />
    </div>
  );
}
