import { LEGAL } from "@/data/content";

const ENTRIES: ReadonlyArray<[string, string]> = [
  ["SIREN", LEGAL.siren],
  ["SIRET", LEGAL.siret],
  ["Code APE", LEGAL.ape],
  ["Immatriculation", LEGAL.since],
];

export default function LegalFooter() {
  return (
    <footer className="flex flex-col gap-4 border-t border-border pt-8 text-sm text-muted-foreground">
      <p className="font-medium text-foreground">{LEGAL.entity}</p>
      <dl className="flex flex-col">
        {ENTRIES.map(([label, value]) => (
          <div
            key={label}
            className="flex items-baseline justify-between gap-4"
          >
            <dt>{label}</dt>
            <dd className="num font-mono text-xs text-foreground">
              {value}
            </dd>
          </div>
        ))}
      </dl>
      <p className="measure text-xs leading-relaxed">
        {LEGAL.vat}. {LEGAL.quoteValidity}.{" "}
        {LEGAL.payment}. Pénalités de retard au taux légal minimum, majorées de
        l’indemnité forfaitaire de recouvrement de 40 €. Les livrables restent
        la propriété de Halfred jusqu’au paiement intégral.
      </p>
    </footer>
  );
}
