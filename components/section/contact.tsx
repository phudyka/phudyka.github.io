"use client";

import { type FormEvent, useState } from "react";
import {
  ArrowUpRight,
  Check,
  FileText,
  Github,
  Linkedin,
  Loader2,
  Mail,
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
// Une boîte et une clé par activité : Halfred, PoolCenter, recrutement. Les
// mélanger ferait répondre un prospect depuis l'adresse du CV, ou un client
// PoolCenter depuis celle du conseil.
const INBOX = {
  business: {
    key: process.env.NEXT_PUBLIC_CONTACT_KEY_HALFRED ?? "",
    address: "contact.halfred@gmail.com",
  },
  poolcenter: {
    key: process.env.NEXT_PUBLIC_CONTACT_KEY_POOLCENTER ?? "",
    address: "contact.poolcenter@gmail.com",
  },
  hiring: {
    key: process.env.NEXT_PUBLIC_CONTACT_KEY ?? "",
    address: "phudyka.dev@gmail.com",
  },
} as const;
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
 * L'adresse est toujours affichée, en puce à côté de GitHub : un prospect
 * qui arrive d'un e-mail à froid doit pouvoir répondre sans formulaire. Sans
 * clé Web3Forms pour la boîte concernée, le formulaire disparaît — un
 * formulaire grisé qui annonce « rien ne partirait » coûtait plus de
 * confiance qu'il n'en rapportait.
 *
 * Les variables sont figées au moment du build : les renseigner exige un
 * nouveau déploiement, pas un rechargement.
 */
/**
 * Libellés du formulaire. Le français est le défaut : la version anglaise
 * passe les siens, et le site commercial n'a rien à changer. Un composant
 * dupliqué aurait laissé les deux formulaires diverger sur le piège à robots,
 * la clé d'envoi ou la mention RGPD — trois endroits où une divergence ne se
 * voit qu'en panne.
 */
type ContactCopy = {
  inbox: keyof typeof INBOX;
  subject: string;
  name: string;
  company: string;
  email: string;
  messageLabel: string;
  messagePlaceholder: string;
  submit: string;
  submitting: string;
  privacy: string;
  sent: string;
  failed: string;
};

const COPY_FR: ContactCopy = {
  inbox: "business",
  subject: "Demande de devis — phudyka.github.io",
  name: "Nom",
  company: "Entreprise",
  email: "Email",
  messageLabel: "Le process qui vous coûte du temps",
  messagePlaceholder:
    "Ce que vos équipes refont à la main chaque semaine, et ce que ça représente en heures.",
  submit: "Demander un devis",
  submitting: "Envoi…",
  privacy:
    "Ces informations ne servent qu’à répondre à votre demande. Elles ne sont ni revendues, ni réutilisées pour autre chose.",
  sent: "Message reçu. Réponse sous 48 heures ouvrées.",
  failed:
    "L’envoi n’a pas abouti. Réessayez — si ça recommence, le problème est de mon côté, pas du vôtre.",
};

/**
 * Français côté embauche. L'accueil et le parcours ne demandent plus un devis :
 * y laisser « Le process qui vous coûte du temps » et un bouton « Demander un
 * devis » faisait répondre au visiteur à une question que la page ne posait
 * pas. `COPY_FR` reste sur /halfred/, où la question est bien celle-là.
 */
export const COPY_FR_EMPLOI: ContactCopy = {
  ...COPY_FR,
  inbox: "hiring",
  subject: "Contact recrutement — phudyka.github.io",
  messageLabel: "Le poste",
  messagePlaceholder:
    "L’équipe, la stack, et ce que vous cherchez à confier. Un lien vers l’annonce suffit.",
  submit: "Envoyer",
  sent: "Message reçu. Je réponds sous deux jours ouvrés.",
};

export const COPY_EN: ContactCopy = {
  inbox: "hiring",
  subject: "Message from phudyka.github.io",
  name: "Name",
  company: "Company",
  email: "Email",
  messageLabel: "What the role is",
  messagePlaceholder:
    "The team, the stack, and what you need someone to own. A link to the posting is plenty.",
  submit: "Send",
  submitting: "Sending…",
  privacy:
    "These details are used only to answer you. They are neither sold nor reused for anything else.",
  sent: "Message received. I answer within two working days.",
  failed:
    "That did not go through. Try again — if it keeps failing, the problem is on my side, not yours.",
};

/** PoolCenter : même question que le devis Halfred, autre boîte. */
export const COPY_FR_POOLCENTER: ContactCopy = {
  ...COPY_FR,
  inbox: "poolcenter",
  subject: "PoolCenter — phudyka.github.io",
  messageLabel: "Ce que vous gérez aujourd’hui",
  messagePlaceholder:
    "Le nombre de bassins, l’équipe, et l’outil ou le cahier que vous utilisez.",
  submit: "Envoyer",
};

/** Anglais de `/en/poolcenter/`, le pendant de `COPY_FR_POOLCENTER`. */
export const COPY_EN_POOLCENTER: ContactCopy = {
  ...COPY_EN,
  inbox: "poolcenter",
  subject: "PoolCenter — phudyka.github.io",
  messageLabel: "What you manage today",
  messagePlaceholder:
    "How many pools, the team, and the tool or notebook you use now.",
};

/**
 * Envoi Web3Forms partagé : le formulaire du hub et celui de /halfred/ passent
 * par ici, pour garder une seule vérification de réponse et un seul piège à
 * robots côté service.
 */
export function useWeb3Form(inbox: keyof typeof INBOX, subject: string) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const { key, address } = INBOX[inbox];

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    setStatus({ kind: "sending" });
    try {
      const body = new FormData(form);
      body.append("access_key", key);
      body.append("subject", subject);

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

  return { status, onSubmit, address, configured: key.length > 0, busy: status.kind === "sending" };
}

export default function Contact({ copy = COPY_FR }: { copy?: ContactCopy }) {
  const { status, onSubmit, address, configured, busy } = useWeb3Form(copy.inbox, copy.subject);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2">
        <a href={`mailto:${address}`} className={chip}>
          <Mail className="size-4 text-muted-foreground" aria-hidden />
          {address}
        </a>
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

      {configured
        ? (
      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-4"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-sm font-medium">
              {copy.name}
            </label>
            <input
              id="name"
              name="name"
              required
              autoComplete="name"
              disabled={busy}
              className={field}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="company" className="text-sm font-medium">
              {copy.company}
            </label>
            <input
              id="company"
              name="company"
              autoComplete="organization"
              disabled={busy}
              className={field}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium">
            {copy.email}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            disabled={busy}
            className={field}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="message" className="text-sm font-medium">
            {copy.messageLabel}
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            disabled={busy}
            placeholder={copy.messagePlaceholder}
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
            disabled={busy}
            icon={busy
              ? <Loader2 className="size-4 animate-spin" aria-hidden />
              : undefined}
          >
            {busy ? copy.submitting : copy.submit}
          </ParticleButton>
        </div>

        {
          /* Art. 13 RGPD : la finalité manquait, sur le site qui vend
            précisément la maîtrise des données. Coût de composition nul,
            preuve de plus au lieu d'une lacune. */
        }
        <p className="max-w-[62ch] text-xs leading-relaxed text-muted-foreground">
          {copy.privacy}
        </p>

        <p aria-live="polite" className="min-h-5 text-sm">
          {status.kind === "sent"
            ? (
              <span className="inline-flex items-center gap-1.5 text-success">
                <Check className="size-4" aria-hidden />
                {copy.sent}
              </span>
            )
            : null}
          {status.kind === "failed"
            ? <span className="text-destructive">{copy.failed}</span>
            : null}
        </p>
      </form>
        )
        : null}
    </div>
  );
}
