"use client";

import { useEffect } from "react";
import Link from "next/link";

interface DashboardErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardError({ error, reset }: DashboardErrorProps) {
  useEffect(() => {
    console.error("[Dashboard Error]", error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
      <div className="max-w-sm">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <span className="text-3xl">⚠️</span>
        </div>

        <h2 className="text-xl font-bold text-gray-900">
          Une erreur est survenue
        </h2>
        <p className="mt-2 text-sm text-gray-500 leading-relaxed">
          Impossible de charger cette page. Réessayez ou revenez au tableau de
          bord.
        </p>

        {error.digest && (
          <p className="mt-2 text-xs text-gray-400 font-mono">
            Réf. : {error.digest}
          </p>
        )}

        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="inline-block rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-800 transition"
          >
            Réessayer
          </button>
          <Link
            href="/dashboard"
            className="inline-block rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition"
          >
            Tableau de bord
          </Link>
        </div>
      </div>
    </div>
  );
}
