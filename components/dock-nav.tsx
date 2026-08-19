"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Bot, Github, Home, Linkedin, Mail, Route, Waves } from "lucide-react";
import { Dock, DockIcon } from "@/components/magicui/dock";
import { AnimatedThemeToggler } from "@/components/magicui/animated-theme-toggler";
import { IDENTITY, NAV } from "@/data/content";

const NAV_ICONS = {
  "/": Home,
  "/halfred/": Bot,
  "/poolcenter/": Waves,
  "/parcours/": Route,
} as const;

const target =
  "grid size-full place-items-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground";

/**
 * Étiquette au survol. Un composant Radix pour une infobulle de dock coûterait
 * deux dépendances : l’attribut aria porte déjà le nom accessible, cette bulle
 * n’est qu’un rappel visuel.
 */
function Label({ children }: { children: React.ReactNode }) {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-foreground opacity-0 shadow-md transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
    >
      {children}
    </span>
  );
}

function Divider() {
  return <span className="mx-1 h-6 w-px shrink-0 bg-border" aria-hidden />;
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Avant l’hydratation, le thème réel est inconnu : rendre une pastille inerte
  // évite de mentir sur l’icône et d’écrire dans le DOM une valeur fausse.
  if (!mounted) {
    return <span className={target} aria-hidden />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <AnimatedThemeToggler
      theme={isDark ? "dark" : "light"}
      onThemeChange={setTheme}
      variant="circle"
      aria-label={`Passer en thème ${isDark ? "clair" : "sombre"}`}
      className={`${target} [&>svg]:size-4`}
    />
  );
}

export default function DockNav() {
  const pathname = usePathname();

  const socials = [
    { href: IDENTITY.github, label: "GitHub", icon: Github, external: true },
    IDENTITY.linkedin
      ? {
        href: IDENTITY.linkedin,
        label: "LinkedIn",
        icon: Linkedin,
        external: true,
      }
      : null,
    {
      href: `mailto:${IDENTITY.email}`,
      label: "Écrire un mail",
      icon: Mail,
      external: false,
    },
  ].filter((item) => item !== null);

  return (
    // Le dock flotte au-dessus du texte : un dégradé vers le fond assume
    // l’occultation au lieu de laisser la copie transparaître sous une barre
    // translucide.
    <nav
      aria-label="Navigation principale"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center bg-gradient-to-t from-background via-background/92 to-transparent pt-12 pb-[max(1rem,env(safe-area-inset-bottom))]"
    >
      <Dock
        direction="middle"
        iconSize={40}
        iconMagnification={56}
        iconDistance={130}
        className="pointer-events-auto shadow-[0_2px_8px_-2px_rgba(0,0,0,0.14),0_14px_36px_-14px_rgba(0,0,0,0.45)]"
      >
        {NAV.map((item) => {
          const Icon = NAV_ICONS[item.href as keyof typeof NAV_ICONS];
          const active = item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);
          return (
            <DockIcon key={item.href} className="group relative">
              <Link
                href={item.href}
                aria-label={item.label}
                aria-current={active ? "page" : undefined}
                className={`${target} ${
                  active ? "bg-accent text-foreground" : ""
                }`}
              >
                <Icon className="size-[45%] min-h-4 min-w-4" aria-hidden />
              </Link>
              <Label>{item.label}</Label>
            </DockIcon>
          );
        })}

        <Divider />

        {socials.map((social) => (
          <DockIcon key={social.label} className="group relative">
            <a
              href={social.href}
              aria-label={social.label}
              {...(social.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className={target}
            >
              <social.icon className="size-[45%] min-h-4 min-w-4" aria-hidden />
            </a>
            <Label>{social.label}</Label>
          </DockIcon>
        ))}

        <Divider />

        <DockIcon className="group relative">
          <ThemeToggle />
          <Label>Thème</Label>
        </DockIcon>
      </Dock>
    </nav>
  );
}
