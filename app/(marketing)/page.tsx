import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PricingCard } from "@/components/marketing/pricing-card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/* ─────────────────────────────────────────────
   SEO — Task 5.7
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
  alternates: {
    canonical: "https://flashlocatif.fr",
  },
};

/* ─────────────────────────────────────────────
   Structured data — JSON-LD
───────────────────────────────────────────── */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Flash Locatif",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    priceCurrency: "EUR",
    price: "49",
  },
  description:
    "Outil SaaS français pour automatiser la déclaration fiscale annuelle des propriétaires bailleurs.",
  url: "https://flashlocatif.fr",
};

/* ─────────────────────────────────────────────
   Data
───────────────────────────────────────────── */
const PAIN_POINTS = [
  {
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
      </svg>
    ),
    title: "Des heures perdues chaque année",
    body: "Retrouver les relevés, comparer les régimes, remplir le formulaire 2044… sans filet de sécurité.",
  },
  {
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: "Un formulaire incompréhensible",
    body: "Le formulaire 2044 compte 4 pages et une notice de 20 pages. Une case mal remplie coûte cher.",
  },
  {
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Un régime fiscal mal choisi",
    body: "Micro-foncier ou régime réel ? Un mauvais choix peut vous coûter plusieurs centaines d'euros par an.",
  },
];

const BENEFITS = [
  {
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "10 minutes chrono",
    body: "Répondez à nos questions guidées, Flash Locatif fait le calcul et génère votre formulaire à votre place.",
  },
  {
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Régime optimal garanti",
    body: "Notre moteur de calcul compare micro-foncier et régime réel et vous montre combien vous économisez.",
  },
  {
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    title: "PDF 2044 pré-rempli",
    body: "Téléchargez votre formulaire 2044 prêt à reporter sur impots.gouv.fr, accompagné d'un guide pas à pas.",
  },
];

const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Saisissez vos données",
    body: "Revenus locatifs, charges déductibles, intérêts d'emprunt, taxe foncière… Notre formulaire intelligent vous guide.",
  },
  {
    step: "2",
    title: "Visualisez votre simulation",
    body: "Flash Locatif compare les deux régimes et vous recommande celui qui minimise votre impôt foncier.",
  },
  {
    step: "3",
    title: "Téléchargez vos documents",
    body: "Recevez votre formulaire 2044 pré-rempli et un guide étape par étape pour le reporter sur impots.gouv.fr.",
  },
];

const PLANS = [
  {
    name: "Solo",
    price: 49,
    features: [
      "1 bien immobilier",
      "Calcul micro-foncier vs régime réel",
      "Formulaire 2044 pré-rempli",
      "Guide de déclaration PDF",
      "Support par email",
    ],
    recommended: false,
    ctaHref: "/register?plan=solo",
  },
  {
    name: "Multi",
    price: 89,
    features: [
      "Jusqu'à 5 biens immobiliers",
      "Calcul micro-foncier vs régime réel",
      "Formulaire 2044 pré-rempli",
      "Guide de déclaration PDF",
      "Gestion du déficit foncier",
      "Support prioritaire",
    ],
    recommended: true,
    ctaHref: "/register?plan=multi",
  },
  {
    name: "Pro",
    price: 149,
    features: [
      "Biens illimités",
      "Calcul micro-foncier vs régime réel",
      "Formulaire 2044 pré-rempli",
      "Guide de déclaration PDF",
      "Gestion du déficit foncier",
      "Export comptable CSV",
      "Support dédié",
    ],
    recommended: false,
    ctaHref: "/register?plan=pro",
  },
];

const FAQS = [
  {
    question: "Flash Locatif est-il adapté au régime réel ?",
    answer:
      "Oui, c'est même son point fort. Flash Locatif calcule précisément votre revenu net foncier au régime réel en déduisant toutes vos charges déductibles : intérêts d'emprunt, taxe foncière (hors TEOM), travaux d'entretien, frais de gestion, assurance PNO, charges de copropriété. Il gère également le déficit foncier.",
  },
  {
    question: "Quelle est la différence entre micro-foncier et régime réel ?",
    answer:
      "Le micro-foncier applique un abattement forfaitaire de 30 % sur vos loyers bruts. Le régime réel déduit vos charges réelles. Si vos charges dépassent 30 % de vos loyers, le régime réel est plus avantageux. Flash Locatif fait ce calcul pour vous et vous recommande le meilleur régime.",
  },
  {
    question: "Puis-je utiliser Flash Locatif si j'ai plusieurs biens ?",
    answer:
      "Oui, avec les plans Multi et Pro. Le régime réel est global : tous vos biens sont regroupés dans un seul calcul. Flash Locatif consolide automatiquement revenus et charges de l'ensemble de votre patrimoine locatif.",
  },
  {
    question: "Flash Locatif remplace-t-il un comptable ?",
    answer:
      "Flash Locatif est un outil d'aide à la déclaration et non un cabinet comptable. Pour des situations complexes (SCI, LMNP, démembrement), nous recommandons de consulter un professionnel. Pour la grande majorité des propriétaires bailleurs en direct, Flash Locatif suffit.",
  },
  {
    question: "Mes données sont-elles sécurisées ?",
    answer:
      "Vos données sont chiffrées en transit (HTTPS) et au repos dans notre base de données hébergée en Europe. Nous ne revendons jamais vos données à des tiers. Consultez notre politique de confidentialité pour plus de détails.",
  },
];

/* ─────────────────────────────────────────────
   Page
───────────────────────────────────────────── */
export default function HomePage() {
  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── HERO ─────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-white py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <span className="inline-flex items-center rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700 ring-1 ring-brand-600/20">
            Nouveau — Déclaration 2025 disponible
          </span>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Votre déclaration foncière{" "}
            <span className="text-brand-600">en 10 minutes</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            Flash Locatif calcule votre régime fiscal optimal, génère votre formulaire 2044 pré-rempli et vous guide pas à pas sur impots.gouv.fr. Fini les tableurs, fini les erreurs.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-brand-600 hover:bg-brand-700 text-white px-8 text-base font-semibold shadow-md"
              >
                Commencer ma déclaration →
              </Button>
            </Link>
            <Link href="/#comment-ca-marche">
              <Button
                size="lg"
                variant="outline"
                className="border-brand-600 text-brand-600 hover:bg-brand-50 px-8 text-base"
              >
                Voir comment ça marche
              </Button>
            </Link>
          </div>

          <p className="mt-4 text-sm text-gray-400">
            Sans engagement — paiement uniquement pour télécharger vos documents
          </p>
        </div>
      </section>

      {/* ── PROBLEM ──────────────────────────── */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              La déclaration foncière, c&apos;est un calvaire
            </h2>
            <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
              Chaque année, des milliers de propriétaires bailleurs passent des heures sur leur déclaration fiscale — et font encore des erreurs.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {PAIN_POINTS.map((point) => (
              <div
                key={point.title}
                className="flex flex-col items-start rounded-2xl border border-border bg-gray-50 p-6"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-500">
                  {point.icon}
                </div>
                <h3 className="mt-4 text-base font-semibold text-gray-900">
                  {point.title}
                </h3>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                  {point.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOLUTION ─────────────────────────── */}
      <section className="bg-brand-50 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Flash Locatif fait tout ça pour vous
            </h2>
            <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
              Un outil pensé pour les propriétaires bailleurs non-comptables qui veulent bien faire leur déclaration sans y passer la journée.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {BENEFITS.map((benefit) => (
              <div
                key={benefit.title}
                className="flex flex-col items-start rounded-2xl bg-white p-6 shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-600">
                  {benefit.icon}
                </div>
                <h3 className="mt-4 text-base font-semibold text-gray-900">
                  {benefit.title}
                </h3>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                  {benefit.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────── */}
      <section id="comment-ca-marche" className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Comment ça marche ?
            </h2>
            <p className="mt-4 text-gray-500 max-w-xl mx-auto">
              Trois étapes, moins de 10 minutes, un formulaire 2044 prêt à l&apos;emploi.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-0 sm:grid-cols-3">
            {HOW_IT_WORKS.map((item, i) => (
              <div key={item.step} className="relative flex flex-col items-center px-6 text-center">
                {/* Connector line between steps */}
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="absolute top-6 left-[calc(50%+2rem)] hidden h-0.5 w-[calc(100%-4rem)] bg-brand-100 sm:block" />
                )}
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-600 text-lg font-bold text-white shadow-md z-10">
                  {item.step}
                </div>
                <h3 className="mt-5 text-base font-semibold text-gray-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                  {item.body}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/register">
              <Button className="bg-brand-600 hover:bg-brand-700 text-white px-8 text-base font-semibold">
                Essayer maintenant — c&apos;est gratuit
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────── */}
      <section id="tarifs" className="bg-gray-50 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Des tarifs transparents
            </h2>
            <p className="mt-4 text-gray-500 max-w-xl mx-auto">
              Vous simulez gratuitement. Vous payez uniquement pour télécharger votre formulaire final.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-3 items-start">
            {PLANS.map((plan) => (
              <PricingCard key={plan.name} {...plan} />
            ))}
          </div>

          <p className="mt-8 text-center text-xs text-gray-400">
            Tarifs HT — TVA 20 % applicable. Paiement unique par année fiscale.
          </p>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────── */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Questions fréquentes
            </h2>
          </div>

          <Accordion type="single" collapsible className="mt-10 w-full">
            {FAQS.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-sm font-semibold text-gray-900">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────── */}
      <section className="bg-brand-600 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Prêt à simplifier votre déclaration ?
          </h2>
          <p className="mt-4 text-brand-100">
            Rejoignez les propriétaires bailleurs qui gagnent du temps et optimisent leur fiscalité avec Flash Locatif.
          </p>
          <Link href="/register" className="mt-8 inline-block">
            <Button
              size="lg"
              className="bg-white text-brand-600 hover:bg-brand-50 px-10 text-base font-bold shadow-md"
            >
              Commencer ma déclaration →
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
