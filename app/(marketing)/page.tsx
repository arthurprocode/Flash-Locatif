import type { Metadata } from "next";
import { LandingContent } from "@/components/marketing/landing-content";

/* ─────────────────────────────────────────────
   SEO
───────────────────────────────────────────── */
export const metadata: Metadata = {
  title: "Flash Locatif — Déclaration foncière simplifiée pour propriétaires bailleurs",
  description:
    "Flash Locatif génère automatiquement votre formulaire 2044 et vous aide à choisir le meilleur régime fiscal. Gagnez du temps et optimisez votre impôt foncier.",
  keywords: [
    "déclaration revenus fonciers",
    "formulaire 2044",
    "régime réel",
    "micro foncier",
    "propriétaire bailleur",
    "déficit foncier",
    "impôt locatif",
  ],
  openGraph: {
    title: "Flash Locatif — Déclaration foncière en quelques clics",
    description:
      "Optimisez votre fiscalité locative et générez votre formulaire 2044 pré-rempli en moins de 10 minutes.",
    url: "https://flashlocatif.fr",
    siteName: "Flash Locatif",
    locale: "fr_FR",
    type: "website",
  },
  alternates: { canonical: "https://flashlocatif.fr" },
};

/* ─────────────────────────────────────────────
   Structured data
───────────────────────────────────────────── */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Flash Locatif",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", priceCurrency: "EUR", price: "49" },
  description:
    "Outil SaaS français pour automatiser la déclaration fiscale annuelle des propriétaires bailleurs.",
  url: "https://flashlocatif.fr",
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LandingContent />
    </>
  );
}
