"use client";

import { ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";
import { BRANDS } from "@/components/halfred/brands";
import { useWeb3Form } from "@/components/section/contact";
import type { HalfredCopy } from "@/data/content";

/**
 * Formulaire Halfred : même envoi que le hub (`useWeb3Form`, boîte `business`),
 * habillé dans le monde Half-red. Sans clé Web3Forms au build, seul l'e-mail
 * reste : un formulaire qui ne partirait nulle part coûte plus qu'il ne rapporte.
 */
export default function HalfredContact({ c }: { c: HalfredCopy["contact"] }) {
  const { status, onSubmit, address, configured, busy } = useWeb3Form("business", c.subject);
  // Le formulaire disparaît avec le bouton qui avait le focus : on le pose sur
  // la confirmation, que le lecteur d'écran lit alors.
  const sentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (status.kind === "sent") sentRef.current?.focus();
  }, [status.kind]);

  const direct = (
    <a href={`mailto:${address}`} className="hr-mail">
      <span className="text-sm text-muted-foreground">{c.direct}</span>
      <span className="hr-display text-lg font-medium">{address}</span>
    </a>
  );

  // Écrire directement : lien discret (icône Gmail et libellé) à côté du bouton d'envoi.
  const mail = (
    <a href={`mailto:${address}`} className="hr-mailbtn" title={address}>
      <svg viewBox="0 0 24 24" aria-hidden><path d={BRANDS.gmail} /></svg>
      <span>{c.mail}</span>
    </a>
  );

  if (!configured) return <div className="hr-panel">{direct}</div>;

  if (status.kind === "sent") {
    return (
      <div ref={sentRef} tabIndex={-1} className="hr-panel hr-sent">
        <span className="hr-sent__mark" aria-hidden="true" />
        <p className="hr-display text-3xl font-semibold tracking-tight">{c.sentTitle}</p>
        <p className="hr-lead max-w-[40ch]">{c.sent}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="hr-form">
      <div className="hr-form__fields">
        <div className="hr-form__row">
          <label className="hr-field">
            <span>{c.firstName}</span>
            <input name="firstname" required autoComplete="given-name" disabled={busy} />
          </label>
          <label className="hr-field">
            <span>{c.name}</span>
            <input name="name" required autoComplete="family-name" disabled={busy} />
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

        <label className="hr-field">
          <span>{c.message}</span>
          <textarea name="message" rows={2} required disabled={busy} placeholder={c.placeholder} />
        </label>
      </div>

      {/* Piège à robots Web3Forms : hors flux, hors tabulation, hors lecture d'écran. */}
      <input type="checkbox" name="botcheck" tabIndex={-1} aria-hidden className="hidden" />

      <div className="hr-form__actions">
        <button type="submit" disabled={busy} className="hr-cta">
          {busy ? c.submitting : c.submit}
          <ArrowRight className="hr-cta__icon size-4" aria-hidden />
        </button>
        {mail}
      </div>

      <p aria-live="polite" className="text-sm text-[var(--hr-glow)] empty:hidden">
        {status.kind === "failed" ? c.failed : null}
      </p>
    </form>
  );
}
