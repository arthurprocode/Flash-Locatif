"use client";

import { useEffect } from "react";
import Link from "next/link";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log to an error reporting service in production
    console.error("[Global Error]", error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <div className="max-w-md">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
          <span className="text-4xl">⚠️</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900">
          Une erreur est survenue
        </h1>
        <p className="mt-3 text-gray-500 leading-relaxed">
          Quelque chose s&apos;est mal passé. Vous pouvez réessayer ou revenir
          à l&apos;accueil.
        </p>

        {error.digest && (
          <p className="mt-2 text-xs text-gray-400 font-mono">
            Référence : {error.digest}
          </p>
        )}

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="inline-block rounded-lg bg-blue-700 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-blue-800 transition"
          >
            Réessayer
          </button>
          <Link
            href="/"
            className="inline-block rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </main>
  );
}
