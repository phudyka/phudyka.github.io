"use client";

import { type CSSProperties, useEffect, useRef } from "react";

/**
 * Repères en fraction de la hauteur, depuis le haut : l'horizon du sol passe
 * derrière le bloc, dont la base est posée plus bas, sur le sol lui-même.
 */
const HORIZON = 0.6;
const BASE = 0.82;
const CENTER = 0.52;

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
uniform float center;
uniform float base_;
uniform sampler2D tex;
uniform vec4 rect;     // bloc : x0, y0, x1, y1 en fraction du canvas (y vers le haut)
uniform float hasTex;

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
  vec2 src = vec2(0.0, (1.0 - 2.0 * center) * res.y / min(res.x, res.y)); // centre des anneaux : le cœur du bloc
  // Rouge pur, jamais blanchi : l'intensité est tonemappée seule, puis teinte
  // du rouge profond au rouge Halfred (pas de canal vert/bleu qui rosit).
  vec3 deep = vec3(0.30, 0.015, 0.035);
  vec3 red = vec3(0.82, 0.06, 0.11);
  float light;
  vec3 base = vec3(0.0);

  if (uv.y >= hy) {
    light = rings(uv - src) * exp(-length(uv - src) * 0.6);
  } else {
    float d = hy - uv.y;                         // distance sous l'horizon
    float z = 1.0 / (d + 0.08);                   // profondeur
    vec2 f = vec2(uv.x * z, z * 2.0);             // coordonnées sur le sol
    float m = fbm(f * 1.3);
    float vein = 1.0 - smoothstep(0.0, 0.06, abs(sin((f.x * 0.8 + m * 3.5) * 3.0)));
    // Reflet : les anneaux vus dans le sol, atténués avec la distance.
    vec2 mirror = vec2(uv.x, 2.0 * hy - uv.y) - src;
    float refl = rings(mirror) * exp(-d * 2.6) * 0.4;
    // Flaque de lumière au pied du bloc, qui respire avec les anneaux.
    float bd = uv.y - (1.0 - 2.0 * base_) * res.y / min(res.x, res.y);
    float pool = exp(-length(vec2(uv.x * 0.9, bd * 3.2))) * (0.14 + 0.05 * sin(time * 0.35));
    base = (vec3(0.006, 0.006, 0.007) + vec3(0.018) * vein + vec3(0.004) * m) * (1.0 + pool * 4.0);
    light = refl + pool;
  }
  float k = 1.0 - exp(-light * 1.5);
  vec3 col = base + mix(deep, red, k) * k * 0.95;

  // Vignette et bords fondus dans le noir de la page.
  vec2 q = gl_FragCoord.xy / res;
  float edge = 1.0 - smoothstep(0.3, 0.7, length((q - vec2(0.5, 0.48)) * vec2(1.0, 1.25)));
  vec3 outc = col * reveal * edge;

  if (hasTex > 0.5) {
    vec2 tuv = (q - rect.xy) / (rect.zw - rect.xy);
    float inX = step(0.0, tuv.x) * step(tuv.x, 1.0);
    // Halo de la fente, visible même dans le noir complet (avant la révélation).
    float slit = rect.y + 0.52 * (rect.w - rect.y);
    vec2 sd = vec2((q.x - 0.5) * res.x, (q.y - slit) * res.y) / min(res.x, res.y);
    outc += red * 0.3 * exp(-length(vec2(sd.x * 1.7, sd.y * 9.0)));
    // Ombre de contact au pied du bloc.
    outc *= 1.0 - 0.85 * inX * exp(-pow((q.y - rect.y) / 0.02, 2.0));
    // Reflet du bloc dans le marbre, qui s'efface en s'éloignant.
    if (tuv.y < 0.0 && tuv.y > -1.0) {
      vec4 r = texture2D(tex, vec2(tuv.x, 1.0 + tuv.y));
      float re = clamp((r.r - max(r.g, r.b)) * 2.2, 0.0, 1.0);
      outc += (r.rgb * re * 0.5 + r.rgb * 0.15 * reveal) * r.a * inX * exp(tuv.y * 7.0);
    }
    // Le bloc : noir mat au repos, éclairé par les anneaux qui passent derrière ;
    // la fente rouge est émissive et brille toujours.
    if (tuv.y >= 0.0 && tuv.y <= 1.0) {
      vec4 c = texture2D(tex, vec2(tuv.x, 1.0 - tuv.y));
      float e = clamp((c.r - max(c.g, c.b)) * 2.2, 0.0, 1.0);
      vec2 w = uv - src;
      float lit = 1.0 - exp(-(rings(w * 1.12) + rings(w * 0.88)) * 0.9);
      vec3 surf = c.rgb * (0.04 + lit * 2.6 * reveal) * vec3(1.0, 0.5, 0.55);
      vec3 emis = c.rgb * e * (1.15 + 0.15 * sin(time * 0.8));
      outc = mix(outc, surf * (1.0 - e) + emis, c.a * inX);
    }
  }
  // Fond de page ajouté : le cadre du canvas disparaît dans la page.
  gl_FragColor = vec4(vec3(0.0196, 0.0196, 0.0235) + outc, 1.0);
}
`;

/**
 * Scène du 100 % local : anneaux WebGL derrière le bloc découpé, posé sur un
 * sol de marbre noir. Au départ, noir complet : seule la fente du bloc
 * brille. Les anneaux s'allument à l'arrivée sur la section (1 s de noir, puis 3 s) et
 * éclairent le bloc en passant ; ils s'arrêtent hors écran. Sans WebGL : le bloc seul,
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
    gl.uniform1f(u("center"), CENTER);
    gl.uniform1f(u("base_"), BASE);
    const uRect = u("rect");

    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0, start = 0, visible = false;

    const size = () => {
      const dpr = Math.min(devicePixelRatio, 1.5);
      cv.width = Math.round(root.clientWidth * dpr);
      cv.height = Math.round(root.clientHeight * dpr);
      gl.viewport(0, 0, cv.width, cv.height);
      gl.uniform2f(uRes, cv.width, cv.height);
      // Même placement que le bloc HTML de repli : 40 % de large, centré, posé sur BASE.
      const hFrac = (0.4 * cv.width / cv.height) * (924 / 900);
      gl.uniform4f(uRect, 0.3, 1 - BASE, 0.7, 1 - BASE + hFrac);
    };
    const draw = (now: number) => {
      const t = still ? 2.5 : (now - start) / 1000;
      gl.uniform1f(uTime, 20 + t * 3);
      // Une seconde de noir (seule la fente brille), puis 3 s d'allumage.
      gl.uniform1f(uReveal, still ? 1 : 1 - (1 - Math.min(1, Math.max(0, t - 1) / 3)) ** 3);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      if (!still && visible) raf = requestAnimationFrame(draw);
    };

    // Le bloc passe dans le shader (éclairage par les anneaux) dès que sa texture est prête.
    const img = new Image();
    img.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.uniform1f(u("hasTex"), 1);
      root.dataset.gl = "";
      if (still || !visible) draw(performance.now());
    };
    img.src = src;

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
  }, [src]);

  return (
    <div ref={box} className="hr-vault" style={{ "--base": `${BASE * 100}%` } as CSSProperties}>
      <canvas ref={canvas} className="hr-vault__fx" aria-hidden />
      <span className="hr-vault__shadow" aria-hidden />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" aria-hidden className="hr-vault__reflect" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="hr-vault__block" />
    </div>
  );
}
