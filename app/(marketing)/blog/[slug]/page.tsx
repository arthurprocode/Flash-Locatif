import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getArticleBySlug, getAllSlugs } from "@/lib/blog";

// ─── Static params for SSG ───────────────────────────────────────────────────

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

// ─── Metadata ────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};

  return {
    title: `${article.title} — Flash Locatif`,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      url: `https://flashlocatif.fr/blog/${article.slug}`,
      siteName: "Flash Locatif",
      locale: "fr_FR",
      type: "article",
      publishedTime: article.date,
    },
    alternates: {
      canonical: `https://flashlocatif.fr/blog/${article.slug}`,
    },
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    author: {
      "@type": "Organization",
      name: "Flash Locatif",
      url: "https://flashlocatif.fr",
    },
    publisher: {
      "@type": "Organization",
      name: "Flash Locatif",
      url: "https://flashlocatif.fr",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://flashlocatif.fr/blog/${article.slug}`,
    },
  };

  return (
    <>
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-white">
        {/* Hero */}
        <header className="bg-gradient-to-b from-blue-50 to-white py-14 px-4">
          <div className="mx-auto max-w-2xl">
            <Link
              href="/blog"
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mb-6 font-medium"
            >
              <svg
                className="mr-1 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Tous les articles
            </Link>

            <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
              <time dateTime={article.date}>{formatDate(article.date)}</time>
              <span>·</span>
              <span>{article.readingTime} min de lecture</span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl leading-tight">
              {article.title}
            </h1>

            <p className="mt-4 text-lg text-gray-600 leading-relaxed">
              {article.description}
            </p>
          </div>
        </header>

        {/* Content */}
        <article className="mx-auto max-w-2xl px-4 py-10">
          <div
            className="prose prose-blue prose-lg max-w-none
              prose-headings:font-bold prose-headings:text-gray-900
              prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
              prose-p:text-gray-700 prose-p:leading-relaxed
              prose-li:text-gray-700
              prose-strong:text-gray-900
              prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </article>

        {/* CTA */}
        <section className="border-t border-gray-100 bg-blue-50 py-12 px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Calculez votre optimisation fiscale en 10 minutes
          </h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Flash Locatif compare les deux régimes avec vos données réelles et
            génère votre formulaire 2044 pré-rempli.
          </p>
          <Link
            href="/register"
            className="inline-block rounded-lg bg-blue-700 px-6 py-3 font-semibold text-white shadow hover:bg-blue-800 transition"
          >
            Commencer gratuitement
          </Link>
          <p className="mt-3 text-sm text-gray-500">
            Sans engagement · Résultat immédiat
          </p>
        </section>

        {/* Back link */}
        <div className="mx-auto max-w-2xl px-4 py-8">
          <Link
            href="/blog"
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            <svg
              className="mr-1 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Retour au blog
          </Link>
        </div>
      </main>
    </>
  );
}
