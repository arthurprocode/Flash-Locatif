import type { ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* ── Navigation ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1">
            <span className="text-xl font-extrabold tracking-tight text-brand-600">Flash</span>
            <span className="text-xl font-extrabold tracking-tight text-gray-900">Locatif</span>
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
                className="bg-brand-600 text-sm font-semibold text-white hover:bg-brand-700"
              >
                Commencer gratuitement
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer className="border-t border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {/* Brand */}
            <div>
              <Link href="/" className="flex items-center gap-1">
                <span className="text-base font-extrabold tracking-tight text-brand-600">Flash</span>
                <span className="text-base font-extrabold tracking-tight text-gray-900">Locatif</span>
              </Link>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-gray-500">
                La déclaration foncière simplifiée pour les propriétaires
                bailleurs français.
              </p>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Légal
              </h4>
              <ul className="mt-4 space-y-2 text-sm text-gray-500">
                <li>
                  <Link href="/mentions-legales" className="transition-colors hover:text-brand-600">
                    Mentions légales
                  </Link>
                </li>
                <li>
                  <Link href="/cgv" className="transition-colors hover:text-brand-600">
                    CGV
                  </Link>
                </li>
                <li>
                  <Link href="/confidentialite" className="transition-colors hover:text-brand-600">
                    Confidentialité
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Support
              </h4>
              <ul className="mt-4 space-y-2 text-sm text-gray-500">
                <li>
                  <Link href="/blog" className="transition-colors hover:text-brand-600">
                    Blog fiscal
                  </Link>
                </li>
                <li>
                  <a
                    href="mailto:contact@flashlocatif.fr"
                    className="transition-colors hover:text-brand-600"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 border-t border-gray-200 pt-6 text-center text-xs text-gray-400">
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
