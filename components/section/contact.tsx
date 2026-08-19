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
import { IDENTITY } from "@/data/content";

const ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT ?? "";

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent" }
  | { kind: "failed"; message: string };

const field =
  "w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 transition-colors focus:border-ring focus:outline-none disabled:cursor-not-allowed disabled:opacity-60";

const chip =
  "group inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-3.5 text-sm font-medium transition-colors hover:bg-accent";

export default function Contact() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const configured = ENDPOINT.length > 0;

  /**
   * Sans service d’envoi, le formulaire reste utilisable : il compose le message
   * dans le client mail du visiteur. L’action primaire de la page fonctionne dans
   * les deux cas, ce qu’un export statique sans backend permet.
   */
  function composeMail(form: HTMLFormElement) {
    const data = new FormData(form);
    const name = String(data.get("name") ?? "");
    const company = String(data.get("company") ?? "");
    const email = String(data.get("email") ?? "");
    const message = String(data.get("message") ?? "");
    const subject = `Demande de devis — ${company || name}`;
    const body = [
      `Nom : ${name}`,
      company ? `Entreprise : ${company}` : null,
      `Email : ${email}`,
      "",
      message,
    ]
      .filter(Boolean)
      .join("\n");
    window.location.href = `mailto:${IDENTITY.email}?subject=${
      encodeURIComponent(
        subject,
      )
    }&body=${encodeURIComponent(body)}`;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    if (!configured) {
      composeMail(form);
      setStatus({ kind: "sent" });
      return;
    }

    setStatus({ kind: "sending" });
    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });
      if (!response.ok) throw new Error(String(response.status));
      form.reset();
      setStatus({ kind: "sent" });
    } catch {
      setStatus({
        kind: "failed",
        message:
          `L’envoi n’a pas abouti. Écrivez directement à ${IDENTITY.email}, le message arrivera au même endroit.`,
      });
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2">
        <a href={`mailto:${IDENTITY.email}`} className={chip}>
          <Mail className="size-4 text-muted-foreground" aria-hidden />
          {IDENTITY.email}
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

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
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
              disabled={status.kind === "sending"}
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
              disabled={status.kind === "sending"}
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
            disabled={status.kind === "sending"}
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
            disabled={status.kind === "sending"}
            placeholder="Ce que vos équipes refont à la main chaque semaine, et ce que ça représente en heures."
            className={`${field} resize-y`}
          />
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <button
            type="submit"
            disabled={status.kind === "sending"}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-[0_1px_2px_rgba(0,0,0,0.25)] transition-[background-color,box-shadow,transform] duration-150 hover:bg-primary/88 hover:shadow-[0_3px_12px_-3px_color-mix(in_oklch,var(--primary)_60%,transparent)] active:translate-y-px active:shadow-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status.kind === "sending"
              ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  Envoi…
                </>
              )
              : (
                "Demander un devis"
              )}
          </button>

          {!configured
            ? (
              <p className="text-sm text-muted-foreground">
                Ouvre votre messagerie, le message déjà rédigé.
              </p>
            )
            : null}
        </div>

        <p aria-live="polite" className="min-h-5 text-sm">
          {status.kind === "sent"
            ? (
              <span className="inline-flex items-center gap-1.5 text-success">
                <Check className="size-4" aria-hidden />
                {configured
                  ? "Message reçu. Réponse sous 48 heures ouvrées."
                  : "Message préparé dans votre messagerie. Réponse sous 48 heures ouvrées."}
              </span>
            )
            : null}
          {status.kind === "failed"
            ? <span className="text-destructive">{status.message}</span>
            : null}
        </p>
      </form>
    </div>
  );
}
