/**
 * GitHub Pages ne sait pas rediriger côté serveur : un script garde l'ancre
 * (`#tarifs`), le refresh HTML prend le relais sans JavaScript, et le lien sert
 * à qui a désactivé les deux.
 */
export default function Redirect({ to, label }: { to: string; label: string }) {
  return (
    <main id="contenu" className="mx-auto max-w-xl px-5 py-32 text-center">
      <meta httpEquiv="refresh" content={`0; url=${to}`} />
      <script
        dangerouslySetInnerHTML={{ __html: `location.replace(${JSON.stringify(to)}+location.hash)` }}
      />
      <p>
        <a href={to} className="underline underline-offset-4">{label}</a>
      </p>
    </main>
  );
}
