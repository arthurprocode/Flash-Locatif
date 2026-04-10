import type { ReactNode } from "react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Minimal header */}
      <header className="flex h-16 items-center border-b border-border bg-white px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-brand-600">Flash</span>
          <span className="text-xl font-bold text-gray-900">Locatif</span>
        </Link>
      </header>

      {/* Page content */}
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-white py-4 text-center text-xs text-gray-400">
        &copy; {new Date().getFullYear()} Flash Locatif — Tous droits réservés
      </footer>
    </div>
  );
}
