"use client";

import { useWeb3Form } from "@/components/section/contact";
import type { HalfredCopy } from "@/data/content";

/**
 * Formulaire Halfred : même envoi que le hub (`useWeb3Form`, boîte `business`),
 * habillé dans le monde Half-red. Sans clé Web3Forms au build, seul l'e-mail
 * reste : un formulaire qui ne partirait nulle part coûte plus qu'il ne rapporte.
 */
export default function HalfredContact({ c }: { c: HalfredCopy["contact"] }) {
  const { status, onSubmit, address, configured, busy } = useWeb3Form("business", c.subject);

  const direct = (
    <a href={`mailto:${address}`} className="hr-mail">
      <span className="text-sm text-muted-foreground">{c.direct}</span>
      <span className="hr-display text-lg font-medium">{address}</span>
    </a>
  );

  if (!configured) return <div className="hr-panel">{direct}</div>;

  if (status.kind === "sent") {
    return (
      <div className="hr-panel hr-sent" aria-live="polite">
        <span className="hr-sent__mark" aria-hidden="true" />
        <p className="hr-display text-3xl font-semibold tracking-tight">{c.sentTitle}</p>
        <p className="hr-lead max-w-[40ch]">{c.sent}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="hr-panel hr-form">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="hr-field">
          <span>{c.name}</span>
          <input name="name" required autoComplete="name" disabled={busy} />
        </label>
        <label className="hr-field">
          <span>{c.company}</span>
          <input name="company" autoComplete="organization" disabled={busy} />
        </label>
        <label className="hr-field">
          <span>{c.email}</span>
          <input name="email" type="email" required autoComplete="email" disabled={busy} />
        </label>
        <label className="hr-field">
          <span>{c.phone}</span>
          <input name="phone" type="tel" autoComplete="tel" disabled={busy} />
        </label>
      </div>

      <fieldset className="hr-needs" disabled={busy}>
        <legend>{c.need}</legend>
        {c.needs.map((need, i) => (
          <label key={need}>
            <input type="radio" name="need" value={need} defaultChecked={i === 0} />
            <span>{need}</span>
          </label>
        ))}
      </fieldset>

      <label className="hr-field">
        <span>{c.message}</span>
        <textarea name="message" rows={5} required disabled={busy} placeholder={c.placeholder} />
      </label>

      {/* Piège à robots Web3Forms : hors flux, hors tabulation, hors lecture d'écran. */}
      <input type="checkbox" name="botcheck" tabIndex={-1} aria-hidden className="hidden" />

      <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
        <button type="submit" disabled={busy} className="hr-btn hr-btn--half">
          <span className="hr-btn__label">{busy ? c.submitting : c.submit}</span>
        </button>
        {direct}
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">{c.privacy}</p>
      <p aria-live="polite" className="text-sm text-[var(--hr-glow)] empty:hidden">
        {status.kind === "failed" ? c.failed : null}
      </p>
    </form>
  );
}
