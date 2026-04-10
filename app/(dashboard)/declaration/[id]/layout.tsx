import type { ReactNode } from "react";
import Link from "next/link";

export default function DeclarationLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl">
      {/* Back link */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-600 transition-colors mb-6"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Retour au tableau de bord
      </Link>

      {children}
    </div>
  );
}
