"use client";

import { useEffect, useRef } from "react";

/**
 * Le seul acte épinglé du site.
 *
 * La scène colle pendant quatre hauteurs d'écran et publie sa progression en
 * `--p` sur son propre nœud. Tout ce qui bouge — les routes qui s'effacent, les
 * croix qui apparaissent, la voie du proxy qui se trace, les quatre phrases qui
 * se relaient — est du CSS qui lit `--p`. Le JavaScript ne pilote qu'une chose,
 * le paquet, parce qu'il suit le pointeur et qu'aucune propriété CSS ne le fait.
 *
 * Le moteur `scrollcraft` a été retiré au profit de ces quarante lignes : sa
 * feuille de style redéfinissait `html` et `body`, ce qui se battait avec
 * Tailwind pour un seul dispositif.
 */

type Conf = {
  box: string;
  /** Coordonnée du mur sur l'axe qu'il barre. */
  wall: number;
  /** Bornes de la porte, sur l'axe perpendiculaire. */
  gate: readonly [number, number];
  start: readonly [number, number];
  path: ReadonlyArray<readonly [number, number]>;
  axis: "x" | "y";
};

/** Cadrage paysage : le schéma dans la colonne de lecture. */
const D: Conf = {
  box: "0 0 740 430",
  wall: 500,
  gate: [326, 358],
  start: [190, 200],
  /* Le paquet tente chaque route coupée, puis la seule ouverte. */
  path: [
    [190, 200],
    [545, 96],
    [190, 200],
    [545, 200],
    [190, 200],
    [545, 300],
    [190, 200],
    [430, 342],
    [600, 342],
  ],
  axis: "x",
};

/** Cadrage portrait : sur un téléphone, le paysage rendait ses libellés à 8 px. */
const M: Conf = {
  box: "0 0 400 660",
  wall: 395,
  gate: [70, 140],
  start: [105, 166],
  path: [
    [105, 166],
    [300, 370],
    [105, 166],
    [260, 370],
    [105, 166],
    [220, 370],
    [105, 166],
    [105, 344],
    [105, 500],
  ],
  axis: "y",
};

/**
 * Les deux langues de l'acte. Les noms techniques — `net_internal`,
 * `open-webui`, `egress-proxy`, `FilterDefaultDeny` — ne se traduisent pas :
 * ce sont les identifiants réels du dépôt, et les traduire ferait mentir le
 * schéma. Seule la prose change.
 */
const COPY = {
  fr: {
    chapter: "Chapitre II",
    title: "Sécurité par la topologie",
    inference: "inférence",
    anywhere: "n\u2019importe où",
    sealed: "OK : étanchéité confirmée",
    noteIdlePointer: "votre curseur est un paquet",
    noteIdleTouch: "votre doigt est un paquet",
    noteTryPointer: "essayez de sortir",
    noteTryTouch: "le paquet cherche une sortie",
    noteDenied: "refusé : aucune route",
    noteAllowed: "autorisé : api.mistral.ai",
    cues: [
      <>
        Un agent IA chez un client. Le modèle, l’interface, l’outil
        d’inférence : chacun a, par défaut, une route vers Internet.{" "}
        <strong className="font-medium text-foreground">
          Votre curseur est un paquet : essayez de sortir.
        </strong>
      </>,
      <>
        Je ne fais pas confiance au modèle,{" "}
        <strong className="font-medium text-foreground">
          je lui retire les routes
        </strong>. Le réseau interne n’a plus aucune passerelle.
      </>,
      <>
        Il reste un proxy, seul à toucher l’extérieur, avec une{" "}
        <strong className="font-medium text-foreground">
          liste blanche courte
        </strong>. Tout domaine qui n’y figure pas est refusé par défaut.
      </>,
      <>
        Et un test qui rejoue l’étanchéité à chaque livraison, chez le client.
      </>,
    ],
  },
  en: {
    chapter: "Chapter II",
    title: "Security by topology",
    inference: "inference",
    anywhere: "anywhere",
    sealed: "OK: sealed, confirmed",
    noteIdlePointer: "your cursor is a packet",
    noteIdleTouch: "your finger is a packet",
    noteTryPointer: "try to get out",
    noteTryTouch: "the packet is looking for a way out",
    noteDenied: "denied: no route",
    noteAllowed: "allowed: api.mistral.ai",
    cues: [
      <>
        An AI agent on a client site. The model, the interface, the inference
        engine: each one has, by default, a route to the internet.{" "}
        <strong className="font-medium text-foreground">
          Your cursor is a packet. Try to get out.
        </strong>
      </>,
      <>
        I do not trust the model,{" "}
        <strong className="font-medium text-foreground">
          I take its routes away
        </strong>. The internal network no longer has a gateway at all.
      </>,
      <>
        One proxy is left, alone in touching the outside, with a{" "}
        <strong className="font-medium text-foreground">
          short allow-list
        </strong>. Any domain not on it is denied by default.
      </>,
      <>
        And a test that replays the seal on every delivery, on the client’s own
        machines.
      </>,
    ],
  },
} as const;

export default function Topology({ lang = "fr" }: { lang?: "fr" | "en" }) {
  const t = COPY[lang];
  const wrap = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const board = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapEl = wrap.current;
    const stageEl = stage.current;
    const boardEl = board.current;
    if (!wrapEl || !stageEl || !boardEl) return;

    const fine = matchMedia("(hover: hover) and (pointer: fine)");
    const calm = matchMedia("(prefers-reduced-motion: reduce)");
    const small = matchMedia("(max-width: 767px)");

    let conf = small.matches ? M : D;
    let svg = boardEl.querySelector<SVGSVGElement>(
      small.matches ? ".is-sm" : ".is-lg",
    );
    let packet = svg?.querySelector<SVGCircleElement>(".packet") ?? null;
    let wall = svg?.querySelector<SVGLineElement>(".wall") ?? null;
    let note = svg?.querySelector<SVGTextElement>(".note") ?? null;

    let [tx, ty] = conf.start;
    let [x, y] = conf.start;
    let hit = 0;
    let p = 0;
    let last = 0;
    let raf = 0;
    let live = false;

    const pick = () => {
      conf = small.matches ? M : D;
      svg = boardEl.querySelector<SVGSVGElement>(
        small.matches ? ".is-sm" : ".is-lg",
      );
      packet = svg?.querySelector<SVGCircleElement>(".packet") ?? null;
      wall = svg?.querySelector<SVGLineElement>(".wall") ?? null;
      note = svg?.querySelector<SVGTextElement>(".note") ?? null;
      [tx, ty] = conf.start;
      [x, y] = conf.start;
    };

    /* Progression : 0 quand le haut du bloc touche le haut de l'écran, 1 quand
       son bas y arrive. Le reste du temps, la scène est simplement à sa place. */
    const readProgress = () => {
      const r = wrapEl.getBoundingClientRect();
      const travel = r.height - innerHeight;
      p = travel <= 0 ? 0 : Math.min(1, Math.max(0, -r.top / travel));
      stageEl.style.setProperty("--p", p.toFixed(4));
    };

    const drive = () => {
      const q = Math.min(1, Math.max(0, (p - 0.1) / 0.86)) *
        (conf.path.length - 1);
      const i = Math.floor(q);
      const f = q - i;
      const a = conf.path[i];
      const b = conf.path[Math.min(i + 1, conf.path.length - 1)];
      tx = a[0] + (b[0] - a[0]) * f;
      ty = a[1] + (b[1] - a[1]) * f;
    };

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
      last = now;
      readProgress();
      if (!fine.matches || calm.matches) drive();

      if (packet && wall && note) {
        const sealed = p > 0.5;
        const along = conf.axis === "x" ? tx : ty;
        const across = conf.axis === "x" ? ty : tx;
        const inGate = across >= conf.gate[0] && across <= conf.gate[1];
        let gx = tx;
        let gy = ty;

        if (sealed && along > conf.wall - 8 && !inGate) {
          if (conf.axis === "x") gx = conf.wall - 14;
          else gy = conf.wall - 14;
          hit = 1;
          wall.style.opacity = "1";
        }
        const carried = conf.axis === "x" ? x : y;
        const pass = sealed && inGate && carried > conf.wall - 8;

        const k = calm.matches ? 1 : 1 - Math.pow(1 - 0.14, dt * 60);
        x += (gx - x) * k;
        y += (gy - y) * k;
        packet.setAttribute("cx", x.toFixed(1));
        packet.setAttribute("cy", y.toFixed(1));
        packet.classList.toggle("is-hit", hit > 0);
        packet.classList.toggle("is-pass", pass);
        if (hit > 0) {
          hit -= dt / 0.6;
          if (hit <= 0) wall.style.opacity = "0";
        }
        note.textContent = pass
          ? t.noteAllowed
          : hit > 0
          ? t.noteDenied
          : sealed
          ? (fine.matches ? t.noteTryPointer : t.noteTryTouch)
          : (fine.matches ? t.noteIdlePointer : t.noteIdleTouch);
      }
      if (live) raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      if (!fine.matches || calm.matches || !svg) return;
      const m = svg.getScreenCTM();
      if (!m) return;
      const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(
        m.inverse(),
      );
      tx = pt.x;
      ty = pt.y;
    };
    stageEl.addEventListener("pointermove", onMove);

    /* Rien ne tourne quand l'acte n'est pas à l'écran. */
    const io = new IntersectionObserver((entries) => {
      const on = entries.some((e) => e.isIntersecting);
      if (on === live) return;
      live = on;
      if (on) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      } else cancelAnimationFrame(raf);
    }, { rootMargin: "20% 0px" });
    io.observe(wrapEl);

    readProgress();
    small.addEventListener("change", pick);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      stageEl.removeEventListener("pointermove", onMove);
      small.removeEventListener("change", pick);
    };
  }, [t]);

  return (
    <div ref={wrap} className="topo relative h-[400svh]">
      <div
        ref={stage}
        className="sticky top-0 flex h-svh flex-col justify-center gap-6 pb-28 pt-10 sm:pb-24"
      >
        {
          /* Le texte garde la colonne de lecture ; seul le schéma prend toute
            la largeur de la scène. */
        }
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-3">
          <span className="num text-xs uppercase tracking-wide text-primary">
            {t.chapter}
          </span>
          <h2 className="text-pretty text-3xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-4xl">
            {t.title}
          </h2>
          {
            /* Quatre états d'une même phrase : un seul est lisible à la fois,
              et la piste garde la hauteur du plus grand. */
          }
          <div className="topo-lines grid">
            {t.cues.map((cue, i) => (
              <p key={i} data-cue={i + 1}>{cue}</p>
            ))}
          </div>
        </div>

        {
          /* Le schéma répète la prose ci-dessus : il est décoratif pour un
            lecteur d'écran, ce qui évite une infobulle native et un piège au
            clavier. */
        }
        <div ref={board} className="topo-board" aria-hidden>
          <svg className="is-lg" viewBox={D.box}>
            <rect
              className="zone"
              x="14"
              y="24"
              width="300"
              height="330"
              rx="10"
            />
            <text className="soft" x="26" y="46">
              net_internal · internal: true
            </text>
            <rect
              className="zone"
              x="500"
              y="24"
              width="225"
              height="330"
              rx="10"
            />
            <text className="soft" x="512" y="46">Internet</text>

            <path className="route r1" d="M160 110 C 300 110, 380 84, 530 84" />
            <path
              className="route r2"
              d="M160 200 C 300 200, 380 182, 530 182"
            />
            <path
              className="route r3"
              d="M160 290 C 300 290, 380 278, 530 278"
            />
            <g className="cut c1">
              <line x1="352" y1="80" x2="368" y2="96" />
              <line x1="368" y1="80" x2="352" y2="96" />
            </g>
            <g className="cut c2">
              <line x1="352" y1="176" x2="368" y2="192" />
              <line x1="368" y1="176" x2="352" y2="192" />
            </g>
            <g className="cut c3">
              <line x1="352" y1="272" x2="368" y2="288" />
              <line x1="368" y1="272" x2="352" y2="288" />
            </g>

            <path
              className="allow"
              d="M160 200 C 250 200, 280 342, 430 342 C 480 342, 500 342, 530 342"
            />

            <g>
              <rect
                className="node"
                x="56"
                y="86"
                width="104"
                height="46"
                rx="8"
              />
              <text x="108" y="107" textAnchor="middle">open-webui</text>
              <text className="soft" x="108" y="123" textAnchor="middle">
                interface
              </text>
            </g>
            <g>
              <rect
                className="node"
                x="56"
                y="176"
                width="104"
                height="46"
                rx="8"
              />
              <text x="108" y="197" textAnchor="middle">hermes</text>
              <text className="soft" x="108" y="213" textAnchor="middle">
                agent
              </text>
            </g>
            <g>
              <rect
                className="node"
                x="56"
                y="266"
                width="104"
                height="46"
                rx="8"
              />
              <text x="108" y="287" textAnchor="middle">ollama</text>
              <text className="soft" x="108" y="303" textAnchor="middle">
                {t.inference}
              </text>
            </g>
            <g>
              <rect
                className="node is-allow"
                x="360"
                y="318"
                width="120"
                height="46"
                rx="8"
              />
              <text x="420" y="339" textAnchor="middle">egress-proxy</text>
              <text className="soft" x="420" y="355" textAnchor="middle">
                tinyproxy
              </text>
            </g>

            <circle className="dest" cx="530" cy="84" r="4.5" />
            <text className="soft" x="545" y="88">{t.anywhere}</text>
            <circle className="dest" cx="530" cy="182" r="4.5" />
            <text className="soft" x="545" y="186">{t.anywhere}</text>
            <circle className="dest" cx="530" cy="278" r="4.5" />
            <text className="soft" x="545" y="282">{t.anywhere}</text>
            <circle className="dest is-allow" cx="530" cy="342" r="4.5" />
            <text x="545" y="346">api.mistral.ai</text>

            <g className="filter">
              <text className="soft" x="512" y="66">FilterDefaultDeny Yes</text>
            </g>
            <g className="seal">
              <text x="26" y="410">{t.sealed}</text>
            </g>

            <line className="wall" x1="500" y1="34" x2="500" y2="352" />
            <circle className="packet" cx={D.start[0]} cy={D.start[1]} r="6" />
            <text className="note soft" x="26" y="386">
              {t.noteIdlePointer}
            </text>
          </svg>

          <svg className="is-sm" viewBox={M.box}>
            <rect
              className="zone"
              x="12"
              y="26"
              width="376"
              height="270"
              rx="10"
            />
            <text className="soft" x="24" y="50">
              net_internal · internal: true
            </text>
            <rect
              className="zone"
              x="12"
              y="430"
              width="376"
              height="170"
              rx="10"
            />
            <text className="soft" x="24" y="454">Internet</text>

            <path className="route r1" d="M180 96 C 290 96, 300 220, 300 470" />
            <path
              className="route r2"
              d="M180 166 C 250 166, 260 260, 260 470"
            />
            <path
              className="route r3"
              d="M180 236 C 215 236, 220 300, 220 470"
            />
            <g className="cut c1">
              <line x1="292" y1="352" x2="308" y2="368" />
              <line x1="308" y1="352" x2="292" y2="368" />
            </g>
            <g className="cut c2">
              <line x1="252" y1="352" x2="268" y2="368" />
              <line x1="268" y1="352" x2="252" y2="368" />
            </g>
            <g className="cut c3">
              <line x1="212" y1="352" x2="228" y2="368" />
              <line x1="228" y1="352" x2="212" y2="368" />
            </g>

            <path className="allow" d="M105 192 L 105 318 M105 370 L 105 470" />

            <g>
              <rect
                className="node"
                x="30"
                y="70"
                width="150"
                height="52"
                rx="8"
              />
              <text x="105" y="96" textAnchor="middle">open-webui</text>
              <text className="soft" x="105" y="114" textAnchor="middle">
                interface
              </text>
            </g>
            <g>
              <rect
                className="node"
                x="30"
                y="140"
                width="150"
                height="52"
                rx="8"
              />
              <text x="105" y="166" textAnchor="middle">hermes</text>
              <text className="soft" x="105" y="184" textAnchor="middle">
                agent
              </text>
            </g>
            <g>
              <rect
                className="node"
                x="30"
                y="210"
                width="150"
                height="52"
                rx="8"
              />
              <text x="105" y="236" textAnchor="middle">ollama</text>
              <text className="soft" x="105" y="254" textAnchor="middle">
                {t.inference}
              </text>
            </g>
            <g>
              <rect
                className="node is-allow"
                x="30"
                y="318"
                width="150"
                height="52"
                rx="8"
              />
              <text x="105" y="344" textAnchor="middle">egress-proxy</text>
              <text className="soft" x="105" y="362" textAnchor="middle">
                tinyproxy
              </text>
            </g>

            <circle className="dest" cx="300" cy="470" r="5" />
            <circle className="dest" cx="260" cy="470" r="5" />
            <circle className="dest" cx="220" cy="470" r="5" />
            <text className="soft" x="260" y="500" textAnchor="middle">
              {t.anywhere}
            </text>
            <circle className="dest is-allow" cx="105" cy="470" r="5" />
            <text x="105" y="500" textAnchor="middle">api.mistral.ai</text>

            <g className="filter">
              <text className="soft" x="24" y="560">FilterDefaultDeny Yes</text>
            </g>
            <g className="seal">
              <text x="24" y="640">{t.sealed}</text>
            </g>

            <line className="wall" x1="12" y1="395" x2="388" y2="395" />
            <circle className="packet" cx={M.start[0]} cy={M.start[1]} r="7" />
            <text className="note soft" x="24" y="612">
              {t.noteIdleTouch}
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
}
