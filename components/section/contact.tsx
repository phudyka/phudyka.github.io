"use client";

import { type FormEvent, useState } from "react";
import {
  ArrowUpRight,
  Check,
  FileText,
  Github,
  Linkedin,
  Loader2,
  TriangleAlert,
} from "lucide-react";
import { ParticleButton } from "@/components/magicui/particle-button";
import { IDENTITY } from "@/data/content";

/**
 * Web3Forms relaie le formulaire vers la boîte mail associée à la clé. La clé
 * est publique par conception — elle vit dans le bundle client, comme chez
 * tous les relais de formulaire sans serveur — et n'ouvre rien d'autre que
 * l'envoi vers cette boîte. Elle vient d'une variable de dépôt renseignée au
 * build, jamais d'un secret : la masquer ne masquerait rien.
 */
const ACCESS_KEY = process.env.NEXT_PUBLIC_CONTACT_KEY ?? "";
const ENDPOINT = "https://api.web3forms.com/submit";

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent" }
  | { kind: "failed" };

// Pas de `focus:outline-none` : le contour global `:focus-visible` (2px) est la
// garantie clavier du site, et l'écraser ici laissait le seul chemin de
// conversion avec l'indication de focus la plus faible de toutes les pages. Le
// passage de bordure à la couleur d'anneau vient en plus, pas à la place.
const field =
  "w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-ring disabled:cursor-not-allowed disabled:opacity-60";

const chip =
  "group inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-3.5 text-sm font-medium transition-colors hover:bg-accent";

/**
 * Le formulaire est le seul canal de contact : aucune adresse n’est exposée en
 * clair, c’est l’arbitrage retenu. Conséquence assumée — sans
 * `NEXT_PUBLIC_CONTACT_KEY`, il n’y a pas de repli silencieux vers la
 * messagerie du visiteur. Le bloc dit alors franchement qu’il est indisponible
 * plutôt que d’ouvrir un client mail que personne n’a demandé.
 *
 * La variable est figée au moment du build : la renseigner exige un nouveau
 * déploiement, pas un rechargement.
 */
export default function Contact() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const configured = ACCESS_KEY.length > 0;
  const busy = status.kind === "sending";

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    setStatus({ kind: "sending" });
    try {
      const body = new FormData(form);
      body.append("access_key", ACCESS_KEY);
      body.append("subject", "Demande de devis — phudyka.github.io");

      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body,
      });
      // Web3Forms répond 200 avec `success: false` quand la clé est refusée ou
      // que le piège à robots a été rempli : le code HTTP seul ne suffit pas.
      const result = await response.json().catch(() => ({ success: false }));
      if (!response.ok || !result.success) {
        throw new Error(String(response.status));
      }
      form.reset();
      setStatus({ kind: "sent" });
    } catch {
      setStatus({ kind: "failed" });
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2">
        <a
          href={IDENTITY.github}
          target="_blank"
          rel="noopener noreferrer"
          className={chip}
        >
          <Github className="size-4 text-muted-foreground" aria-hidden />
          GitHub
          <ArrowUpRight
            className="size-3.5 text-muted-foreground transition-transform group-hover:-translate-y-px group-hover:translate-x-px"
            aria-hidden
          />
        </a>
        {IDENTITY.linkedin
          ? (
            <a
              href={IDENTITY.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={chip}
            >
              <Linkedin className="size-4 text-muted-foreground" aria-hidden />
              LinkedIn
              <ArrowUpRight
                className="size-3.5 text-muted-foreground transition-transform group-hover:-translate-y-px group-hover:translate-x-px"
                aria-hidden
              />
            </a>
          )
          : null}
        {IDENTITY.cv
          ? (
            <a href={IDENTITY.cv} download className={chip}>
              <FileText className="size-4 text-muted-foreground" aria-hidden />
              CV (PDF)
            </a>
          )
          : null}
      </div>

      {!configured
        ? (
          <p
            role="status"
            className="measure flex items-start gap-2 border-l border-destructive/60 pl-4 text-sm leading-relaxed text-muted-foreground"
          >
            <TriangleAlert
              className="mt-0.5 size-4 shrink-0 text-destructive"
              aria-hidden
            />
            <span>
              Le formulaire n’est pas encore relié à son service d’envoi : rien
              ne partirait. En attendant, passez par GitHub — je réponds au même
              endroit.
            </span>
          </p>
        )
        : null}

      <form
        onSubmit={onSubmit}
        className={`flex flex-col gap-4 ${configured ? "" : "opacity-50"}`}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-sm font-medium">
              Nom
            </label>
            <input
              id="name"
              name="name"
              required
              autoComplete="name"
              disabled={busy || !configured}
              className={field}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="company" className="text-sm font-medium">
              Entreprise
            </label>
            <input
              id="company"
              name="company"
              autoComplete="organization"
              disabled={busy || !configured}
              className={field}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            disabled={busy || !configured}
            className={field}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="message" className="text-sm font-medium">
            Le process qui vous coûte du temps
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            disabled={busy || !configured}
            placeholder="Ce que vos équipes refont à la main chaque semaine, et ce que ça représente en heures."
            className={`${field} resize-y`}
          />
        </div>

        {
          /* Piège à robots de Web3Forms : hors flux, hors tabulation, hors
            lecture d'écran. Un automate qui remplit tout coche celle-ci, et
            l'envoi est rejeté côté service. */
        }
        <input
          type="checkbox"
          name="botcheck"
          tabIndex={-1}
          aria-hidden
          className="hidden"
        />

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {
            /* Même bouton que l'ancre « Demander un devis » en tête de page :
              un seul traitement pour un seul libellé. La pastille de curseur
              cède la place à l'indicateur d'envoi pendant la requête. */
          }
          <ParticleButton
            type="submit"
            disabled={busy || !configured}
            icon={busy
              ? <Loader2 className="size-4 animate-spin" aria-hidden />
              : undefined}
          >
            {busy ? "Envoi…" : "Demander un devis"}
          </ParticleButton>
        </div>

        {
          /* Art. 13 RGPD : la finalité manquait, sur le site qui vend
            précisément la maîtrise des données. Coût de composition nul,
            preuve de plus au lieu d'une lacune. */
        }
        <p className="max-w-[62ch] text-xs leading-relaxed text-muted-foreground">
          Ces informations ne servent qu’à répondre à votre demande. Elles ne
          sont ni revendues, ni réutilisées pour autre chose.
        </p>

        <p aria-live="polite" className="min-h-5 text-sm">
          {status.kind === "sent"
            ? (
              <span className="inline-flex items-center gap-1.5 text-success">
                <Check className="size-4" aria-hidden />
                Message reçu. Réponse sous 48 heures ouvrées.
              </span>
            )
            : null}
          {status.kind === "failed"
            ? (
              <span className="text-destructive">
                L’envoi n’a pas abouti. Réessayez — si ça recommence, le
                problème est de mon côté, pas du vôtre.
              </span>
            )
            : null}
        </p>
      </form>
    </div>
  );
}
