import type { ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5">
            <span className="text-xl font-extrabold text-brand-600">Flash</span>
            <span className="text-xl font-extrabold text-gray-900">Locatif</span>
          </Link>

          {/* Nav links */}
          <nav className="hidden items-center gap-6 text-sm font-medium text-gray-600 sm:flex">
            <Link href="/#comment-ca-marche" className="hover:text-brand-600 transition-colors">
              Comment ça marche
            </Link>
            <Link href="/#tarifs" className="hover:text-brand-600 transition-colors">
              Tarifs
            </Link>
            <Link href="/blog" className="hover:text-brand-600 transition-colors">
              Blog
            </Link>
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden text-sm font-medium text-gray-600 hover:text-brand-600 sm:block transition-colors">
              Connexion
            </Link>
            <Link href="/register">
              <Button className="bg-brand-600 hover:bg-brand-700 text-white text-sm">
                Commencer gratuitement
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {/* Brand */}
            <div>
              <Link href="/" className="flex items-center gap-1.5">
                <span className="text-lg font-extrabold text-brand-600">Flash</span>
                <span className="text-lg font-extrabold text-gray-900">Locatif</span>
              </Link>
              <p className="mt-3 text-sm text-gray-500 max-w-xs">
                La déclaration foncière simplifiée pour les propriétaires bailleurs français.
              </p>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Légal</h4>
              <ul className="mt-4 space-y-2 text-sm text-gray-500">
                <li><Link href="/mentions-legales" className="hover:text-brand-600 transition-colors">Mentions légales</Link></li>
                <li><Link href="/cgv" className="hover:text-brand-600 transition-colors">CGV</Link></li>
                <li><Link href="/confidentialite" className="hover:text-brand-600 transition-colors">Confidentialité</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Support</h4>
              <ul className="mt-4 space-y-2 text-sm text-gray-500">
                <li><Link href="/blog" className="hover:text-brand-600 transition-colors">Blog fiscal</Link></li>
                <li><a href="mailto:contact@flashlocatif.fr" className="hover:text-brand-600 transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-10 border-t border-border pt-6 text-center text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Flash Locatif — Tous droits réservés.{" "}
            <span className="italic">Flash Locatif n&apos;est pas un cabinet comptable. Les résultats fournis sont indicatifs.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
