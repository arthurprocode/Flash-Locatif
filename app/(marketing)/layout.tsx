import type { ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      {/* ── Navigation ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 w-full">
        {/* Announcement bar */}
        <div className="w-full bg-brand-700 py-2 text-center text-sm font-medium text-white">
          🆕 Déclaration 2025 maintenant disponible —{" "}
          <Link href="/register" className="underline underline-offset-2 hover:text-brand-100">
            Commencer gratuitement
          </Link>
        </div>

        {/* Nav bar */}
        <div className="w-full border-b border-gray-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-0.5">
              <span className="text-xl font-extrabold tracking-tight text-gray-900">Flash</span>
              <span className="text-xl font-extrabold tracking-tight text-brand-600">Locatif</span>
            </Link>

            {/* Nav links */}
            <nav className="hidden items-center gap-8 text-sm font-medium text-gray-500 sm:flex">
              <Link href="/#comment-ca-marche" className="transition-colors hover:text-brand-600">
                Comment ça marche
              </Link>
              <Link href="/#tarifs" className="transition-colors hover:text-brand-600">
                Tarifs
              </Link>
              <Link href="/blog" className="transition-colors hover:text-brand-600">
                Blog
              </Link>
            </nav>

            {/* CTA */}
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="hidden text-sm font-medium text-gray-500 transition-colors hover:text-brand-600 sm:block"
              >
                Connexion
              </Link>
              <Link href="/register">
                <Button
                  size="sm"
                  className="rounded-full bg-brand-600 px-5 text-sm font-semibold text-white hover:bg-brand-700"
                >
                  Commencer gratuitement
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer className="w-full bg-gray-900">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-4">
            {/* Brand */}
            <div className="sm:col-span-1">
              <Link href="/" className="flex items-center gap-0.5">
                <span className="text-base font-extrabold tracking-tight text-white">Flash</span>
                <span className="text-base font-extrabold tracking-tight text-brand-400">Locatif</span>
              </Link>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-gray-400">
                La déclaration foncière simplifiée pour les propriétaires
                bailleurs français.
              </p>
            </div>

            {/* Produit */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Produit
              </h4>
              <ul className="mt-4 space-y-2.5 text-sm text-gray-400">
                <li>
                  <Link href="/#comment-ca-marche" className="transition-colors hover:text-white">
                    Comment ça marche
                  </Link>
                </li>
                <li>
                  <Link href="/#tarifs" className="transition-colors hover:text-white">
                    Tarifs
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="transition-colors hover:text-white">
                    Créer un compte
                  </Link>
                </li>
              </ul>
            </div>

            {/* Légal */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Légal
              </h4>
              <ul className="mt-4 space-y-2.5 text-sm text-gray-400">
                <li>
                  <Link href="/mentions-legales" className="transition-colors hover:text-white">
                    Mentions légales
                  </Link>
                </li>
                <li>
                  <Link href="/cgv" className="transition-colors hover:text-white">
                    CGV
                  </Link>
                </li>
                <li>
                  <Link href="/confidentialite" className="transition-colors hover:text-white">
                    Confidentialité
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Support
              </h4>
              <ul className="mt-4 space-y-2.5 text-sm text-gray-400">
                <li>
                  <Link href="/blog" className="transition-colors hover:text-white">
                    Blog fiscal
                  </Link>
                </li>
                <li>
                  <a
                    href="mailto:contact@flashlocatif.fr"
                    className="transition-colors hover:text-white"
                  >
                    contact@flashlocatif.fr
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-gray-800 pt-6 text-center text-xs text-gray-600">
            &copy; {new Date().getFullYear()} Flash Locatif — Tous droits réservés.{" "}
            <span className="italic">
              Flash Locatif n&apos;est pas un cabinet comptable. Les résultats
              fournis sont indicatifs.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
