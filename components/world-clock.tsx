"use client";

import { useEffect, useState } from "react";

/**
 * Horloge double : l’heure du visiteur, dans le fuseau que son navigateur
 * annonce, à côté de celle de Paris, plus la plage 9 h – 18 h de Paris
 * convertie chez lui. Remplace la table figée de six fuseaux, qui mentait une
 * moitié de l’année (heure d’été) et ne couvrait pas les autres.
 *
 * Idée reprise du composant Framer « World Clock » (Soyeb), réécrite sans
 * `framer` : `Intl` fait tout. Avant le montage, « --:-- » partout, pour que
 * le HTML exporté et le premier rendu client soient identiques.
 */
const PARIS = "Europe/Paris";

const time = (zone: string, at = new Date()) =>
  new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: zone }).format(at);

/** Décalage de Paris en minutes à cet instant (+60 l’hiver, +120 l’été). */
function parisOffset(at: Date): number {
  const name = new Intl.DateTimeFormat("en-US", { timeZone: PARIS, timeZoneName: "longOffset" })
    .formatToParts(at)
    .find((part) => part.type === "timeZoneName")?.value;
  const [, sign, h, m] = /GMT([+-])(\d\d):(\d\d)/.exec(name ?? "") ?? [, "+", "01", "00"];
  return (sign === "-" ? -1 : 1) * (Number(h) * 60 + Number(m));
}

/** Instant où il est `hour` h à Paris aujourd’hui. */
function parisHour(hour: number, now: Date): Date {
  const utc = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), hour);
  return new Date(utc - parisOffset(now) * 60_000);
}

type Copy = { you: string; paris: string; range: string };

export function WorldClock({ copy }: { copy: Copy }) {
  const [now, setNow] = useState<Date | null>(null);
  const [zone, setZone] = useState("");

  useEffect(() => {
    setZone(Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC");
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const city = zone.split("/").pop()?.replace(/_/g, " ") ?? "";
  const show = (value: () => string) => (now && zone ? value() : "--:--");
  const clocks = [
    { label: city ? `${copy.you} · ${city}` : copy.you, value: show(() => time(zone, now!)) },
    { label: copy.paris, value: show(() => time(PARIS, now!)) },
  ];

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card px-5 py-4 sm:px-6">
      <div className="grid grid-cols-2 gap-4">
        {clocks.map((clock) => (
          <div key={clock.label} className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">{clock.label}</span>
            <span className="num text-3xl font-medium tracking-tight">{clock.value}</span>
          </div>
        ))}
      </div>
      <p className="text-sm text-muted-foreground">
        {copy.range}{" "}
        <span className="num font-medium text-foreground">
          {show(() => `${time(zone, parisHour(9, now!))}–${time(zone, parisHour(18, now!))}`)}
        </span>
      </p>
    </div>
  );
}
