import type { Metadata } from "next";
import Link from "next/link";
import { ARTICLES } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog Flash Locatif — Conseils pour propriétaires bailleurs",
  description:
    "Retrouvez tous nos conseils pour optimiser votre déclaration de revenus fonciers : micro-foncier, régime réel, formulaire 2044, déficit foncier et charges déductibles.",
  openGraph: {
    title: "Blog Flash Locatif — Conseils pour propriétaires bailleurs",
    description:
      "Retrouvez tous nos conseils pour optimiser votre déclaration de revenus fonciers.",
    url: "https://flashlocatif.fr/blog",
    siteName: "Flash Locatif",
    locale: "fr_FR",
    type: "website",
  },
  alternates: {
    canonical: "https://flashlocatif.fr/blog",
  },
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BlogIndexPage() {
  const sorted = [...ARTICLES].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16 px-4">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600 mb-3">
            Le blog
          </p>
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Conseils pour propriétaires bailleurs
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Tout ce que vous devez savoir pour optimiser votre déclaration de
            revenus fonciers — expliqué simplement.
          </p>
        </div>
      </section>

      {/* Articles grid */}
      <section className="mx-auto max-w-4xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2">
          {sorted.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md hover:border-blue-200"
            >
              {/* Meta */}
              <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
                <time dateTime={article.date}>{formatDate(article.date)}</time>
                <span>·</span>
                <span>{article.readingTime} min de lecture</span>
              </div>

              {/* Title */}
              <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors leading-snug mb-3">
                {article.title}
              </h2>

              {/* Description */}
              <p className="text-sm text-gray-600 leading-relaxed flex-1">
                {article.description}
              </p>

              {/* CTA */}
              <div className="mt-5 flex items-center text-sm font-semibold text-blue-600 group-hover:text-blue-800">
                Lire l&apos;article
                <svg
                  className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA banner */}
      <section className="bg-blue-700 py-12 px-4 text-center">
        <h2 className="text-2xl font-bold text-white mb-3">
          Prêt à optimiser votre déclaration ?
        </h2>
        <p className="text-blue-200 mb-6 max-w-md mx-auto">
          Flash Locatif calcule automatiquement le meilleur régime et génère
          votre formulaire 2044 pré-rempli.
        </p>
        <Link
          href="/register"
          className="inline-block rounded-lg bg-white px-6 py-3 font-semibold text-blue-700 shadow hover:bg-blue-50 transition"
        >
          Commencer gratuitement
        </Link>
      </section>
    </main>
  );
}
