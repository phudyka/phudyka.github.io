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
uniform vec4 rect;     // bloc : x0, y0, x1, y1 en fraction du canvas (y vers le haut)

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

// Bloc vectoriel, vu par l'arête : deux faces noires laquées, arête du haut en
// chevron, fente rouge au milieu. Renvoie l'albédo et le masque ; spec : ce que
// les bords renvoient de la lumière des anneaux (arête haute, arête centrale,
// flancs) ; emis : la fente.
vec4 block(vec2 t, out float spec, out float emis, out float gloss) {
  spec = 0.0; emis = 0.0; gloss = 0.0;
  float ax = abs(t.x - 0.5);
  float d = clamp(1.0 - ax / 0.49, 0.0, 1.0);
  float top = 0.865 + 0.125 * d, bot = 0.058 - 0.048 * d;
  float v = clamp((t.y - bot) / (top - bot), 0.0, 1.0);
  float aa = 0.003;
  float a = smoothstep(0.49, 0.49 - aa, ax) * smoothstep(-aa, 0.0, t.y - bot) * smoothstep(aa, 0.0, t.y - top);
  if (a <= 0.0) return vec4(0.0);
  float right = step(0.5, t.x);
  vec3 alb = vec3(mix(0.034, 0.024, right)) * (0.75 + 0.5 * v) + vec3(0.018) * noise(t * vec2(5.0, 8.0));
  float sy = t.y - (0.47 + 0.034 * d);
  alb *= 1.0 - 0.85 * exp(-pow(sy / 0.013, 2.0));
  emis = exp(-pow(sy / 0.0045, 2.0)) * smoothstep(0.49, 0.44, ax);
  float rimTop = exp(-pow((top - t.y) / 0.006, 2.0));
  float rimMid = exp(-pow(ax / 0.0025, 2.0)) * (1.0 - exp(-pow(sy / 0.02, 2.0)));
  spec = rimTop * 0.9 + rimMid * 0.3 + pow(1.0 - d, 5.0) * 0.55 + 0.06 * v;
  // Coque façon vaisseau impérial : panneaux décalés (joints creusés, arête
  // basse qui accroche la lumière), canal autour de la fente avec voyants,
  // grilles d'aération en bas, trappe inscrite en haut.
  float u = 1.0 - d, w = 0.0035;
  float groove = 0.0, lip = 0.0;
  for (int k = 0; k < 2; k++) {
    float at = k == 0 ? 0.2 : 0.8;
    groove += exp(-pow((v - at) / w, 2.0));
    lip += exp(-pow((v - at + 2.6 * w) / w, 2.0));
  }
  float vs = step(0.53, v) * step(v, 0.8) * exp(-pow((u - 0.62) / w, 2.0)) + step(0.2, v) * step(v, 0.47) * exp(-pow((u - 0.38) / w, 2.0));
  groove += vs;
  float vent = step(0.5, u) * step(u, 0.86) * step(0.06, v) * step(v, 0.15);
  float slat = fract(u * 64.0);
  groove += vent * step(0.5, slat);
  spec += vent * step(slat, 0.18) * 0.3;
  float hx = step(0.7, u) * step(u, 0.86), hy = step(0.84, v) * step(v, 0.93);
  groove += hx * (exp(-pow((v - 0.84) / w, 2.0)) + exp(-pow((v - 0.93) / w, 2.0))) + hy * (exp(-pow((u - 0.7) / w, 2.0)) + exp(-pow((u - 0.86) / w, 2.0)));
  float chan = smoothstep(0.032, 0.027, abs(sy));
  alb *= (1.0 - 0.75 * clamp(groove, 0.0, 1.0)) * (1.0 - 0.55 * chan);
  spec += lip * 0.45 + exp(-pow((sy - 0.032) / 0.003, 2.0)) * 0.6;
  // Voyants dans le canal, sous la fente : chacun clignote à son rythme.
  float cell = u * 8.0, idx = floor(cell) + right * 8.0;
  float lamp = step(0.1, fract(cell)) * step(fract(cell), 0.32) * step(0.06, u) * step(u, 0.9) * step(abs(sy + 0.019), 0.0035);
  emis += lamp * (0.25 + 0.75 * step(0.4, fract(time * 0.12 + idx * 0.618)));
  // Laque : reflets larges et nuageux, plus forts vers les flancs et le haut (face gauche plus exposée).
  gloss = (0.3 + 0.7 * pow(1.0 - d, 1.5)) * (0.45 + 0.55 * noise(t * vec2(2.5, 4.0) + vec2(right * 7.0, 0.0))) * (0.45 + 0.55 * v) * mix(1.0, 0.7, right);
  return vec4(alb, a);
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

  {
    vec2 tuv = (q - rect.xy) / (rect.zw - rect.xy);
    float inX = step(0.0, tuv.x) * step(tuv.x, 1.0);
    float sp, em, gs;
    // Halo de la fente, visible même dans le noir complet (avant la révélation).
    float slit = rect.y + 0.49 * (rect.w - rect.y);
    vec2 sd = vec2((q.x - 0.5) * res.x, (q.y - slit) * res.y) / min(res.x, res.y);
    outc += red * 0.3 * exp(-length(vec2(sd.x * 1.7, sd.y * 9.0)));
    // Ombre de contact au pied du bloc, et le sol juste devant reste dans son ombre :
    // la lumière des anneaux, derrière, ne passe pas sous le bloc.
    outc *= 1.0 - 0.85 * inX * exp(-pow((q.y - rect.y) / 0.02, 2.0));
    if (tuv.y < 0.0) outc *= 1.0 - 0.9 * inX * exp(tuv.y * 10.0);
    // Reflet du bloc dans le marbre, qui s'efface en s'éloignant.
    if (tuv.y < 0.0 && tuv.y > -1.0) {
      vec4 r = block(vec2(tuv.x, -tuv.y), sp, em, gs);
      outc += (red * em * 0.55 + (r.rgb + sp * 0.04) * 0.3 * reveal) * r.a * exp(tuv.y * 7.0);
    }
    // Le bloc : noir laqué au repos ; les anneaux qui passent derrière allument
    // ses arêtes et ses flancs (clair-obscur), la fente rouge brille toujours.
    if (tuv.y >= -0.01 && tuv.y <= 1.0) {
      vec4 c = block(tuv, sp, em, gs);
      vec2 w = uv - src;
      float lit = 1.0 - exp(-(rings(w * 1.12) + rings(w * 0.88)) * 0.9);
      vec3 tint = vec3(1.0, 0.42, 0.47);
      vec3 surf = c.rgb * (0.3 + lit * 1.3 * reveal) * tint + sp * (0.02 + lit * reveal * 1.1) * tint;
      vec3 glow = red * em * (1.35 + 0.15 * sin(time * 0.8)) + vec3(1.0, 0.55, 0.55) * pow(em, 3.0) * 0.45;
      // Au pic de lumière, le noir laqué renvoie un blanc à peine rosé, comme la photo d'origine.
      float peak = reveal * reveal * (0.4 + 0.6 * lit);
      surf += (gs * 0.16 + sp * 0.4) * peak * vec3(1.0, 0.86, 0.88);
      outc = mix(outc, surf + glow, c.a);
    }
  }
  // Fond de page ajouté : le cadre du canvas disparaît dans la page.
  gl_FragColor = vec4(vec3(0.0196, 0.0196, 0.0235) + outc, 1.0);
}
`;

/**
 * Scène du 100 % local : anneaux WebGL derrière le bloc (dessiné en vectoriel dans le shader), posé sur un
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
      const dpr = Math.min(devicePixelRatio, "lite" in document.documentElement.dataset ? 0.75 : 1.5);
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
      // Anneaux qui s'ouvrent vers l'extérieur, lentement (un cycle ≈ 13 s). L'éclairage suit
      // le cycle en ease-in-out : noir complet, la scène s'illumine, puis retombe au noir
      // juste avant que les anneaux ne repartent du centre (le saut reste invisible).
      // Départ à 26 (et non 20, noir complet) : la lumière est déjà en train de monter.
      const time = still ? 26 : 26 + t * 1.5;
      const phase = (time * 0.05) % 1;
      gl.uniform1f(uTime, time);
      gl.uniform1f(uReveal, still ? 1 : Math.sin(Math.PI * phase) ** 2);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      // Première onde à son apogée : le titre peut révéler son mot rouge.
      if ((still || t >= 1.5) && !("lit" in root.dataset)) root.dataset.lit = "";
      if (!still && visible) raf = requestAnimationFrame(draw);
    };

    // Le bloc est dessiné par le shader : les calques HTML de repli s'effacent.
    root.dataset.gl = "";

    size();
    const ro = new ResizeObserver(() => { size(); if (still) draw(0); });
    const onLite = () => size();
    window.addEventListener("hr-lite", onLite);
    ro.observe(root);
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting === visible) return;
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) { start = performance.now(); raf = requestAnimationFrame(draw); }
    }, { threshold: 0.25 });
    io.observe(root);
    return () => { ro.disconnect(); io.disconnect(); cancelAnimationFrame(raf); window.removeEventListener("hr-lite", onLite); };
  }, []);

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
