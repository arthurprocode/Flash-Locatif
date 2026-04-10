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

/* ─────────────────────────────────────────────
   SVG icons (inline for zero-bundle overhead)
───────────────────────────────────────────── */
const ClockIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
  </svg>
);
const DocumentIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);
const EuroIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const BoltIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);
const CheckCircleIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const PdfIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

/* ─────────────────────────────────────────────
   Data
───────────────────────────────────────────── */
const PAIN_POINTS = [
  {
    icon: <ClockIcon />,
    title: "Des heures perdues chaque année",
    body: "Retrouver les relevés, comparer les régimes, remplir le formulaire 2044… sans filet de sécurité.",
  },
  {
    icon: <DocumentIcon />,
    title: "Un formulaire incompréhensible",
    body: "Le formulaire 2044 compte 4 pages et une notice de 20 pages. Une case mal remplie coûte cher.",
  },
  {
    icon: <EuroIcon />,
    title: "Un régime fiscal mal choisi",
    body: "Micro-foncier ou régime réel ? Un mauvais choix peut vous coûter plusieurs centaines d'euros par an.",
  },
];

const BENEFITS = [
  {
    icon: <BoltIcon />,
    title: "10 minutes chrono",
    body: "Répondez à nos questions guidées, Flash Locatif fait le calcul et génère votre formulaire à votre place.",
  },
  {
    icon: <CheckCircleIcon />,
    title: "Régime optimal garanti",
    body: "Notre moteur compare micro-foncier et régime réel et vous montre exactement combien vous économisez.",
  },
  {
    icon: <PdfIcon />,
    title: "PDF 2044 pré-rempli",
    body: "Téléchargez votre formulaire prêt à reporter sur impots.gouv.fr, accompagné d'un guide pas à pas.",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Saisissez vos données",
    body: "Revenus locatifs, charges déductibles, intérêts d'emprunt, taxe foncière… Notre formulaire vous guide.",
  },
  {
    step: "02",
    title: "Visualisez la simulation",
    body: "Flash Locatif compare les deux régimes et vous recommande celui qui minimise votre impôt foncier.",
  },
  {
    step: "03",
    title: "Téléchargez vos documents",
    body: "Recevez votre formulaire 2044 pré-rempli et le guide pour le reporter sur impots.gouv.fr.",
  },
];

const STATS = [
  { value: "10 min", label: "pour déclarer" },
  { value: "2 régimes", label: "comparés automatiquement" },
  { value: "100 %", label: "conforme cerfa 2044" },
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
   Section label component
───────────────────────────────────────────── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-full bg-brand-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand-700">
      {children}
    </span>
  );
}

/* ─────────────────────────────────────────────
   Page
───────────────────────────────────────────── */
export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-white to-white pt-20 pb-24 sm:pt-28 sm:pb-32">
        {/* Subtle background grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#1E5FA8 1px, transparent 1px), linear-gradient(to right, #1E5FA8 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          {/* Badge */}
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-4 py-1.5 text-sm font-medium text-brand-700 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Déclaration 2025 disponible
            </span>
          </div>

          {/* Headline */}
          <h1 className="mt-8 text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Votre déclaration foncière
            <br />
            <span className="text-brand-600">en 10 minutes chrono</span>
          </h1>

          {/* Sub-headline */}
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-500 sm:text-xl">
            Flash Locatif calcule votre régime fiscal optimal, génère votre
            formulaire 2044 pré-rempli et vous guide pas à pas sur
            impots.gouv.fr. Fini les tableurs, fini les erreurs.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/register">
              <Button
                size="lg"
                className="w-full bg-brand-600 px-8 text-base font-semibold text-white shadow-md hover:bg-brand-700 sm:w-auto"
              >
                Commencer ma déclaration →
              </Button>
            </Link>
            <Link href="#comment-ca-marche">
              <Button
                size="lg"
                variant="outline"
                className="w-full border-gray-300 px-8 text-base font-medium text-gray-700 hover:border-brand-600 hover:text-brand-600 sm:w-auto"
              >
                Voir comment ça marche
              </Button>
            </Link>
          </div>

          <p className="mt-5 text-sm text-gray-400">
            Simulation gratuite · Paiement uniquement au téléchargement
          </p>

          {/* Stats bar */}
          <div className="mx-auto mt-14 grid max-w-2xl grid-cols-3 divide-x divide-gray-200 rounded-2xl border border-gray-200 bg-white shadow-sm">
            {STATS.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center px-4 py-5">
                <span className="text-2xl font-extrabold text-brand-600 sm:text-3xl">
                  {stat.value}
                </span>
                <span className="mt-1 text-center text-xs font-medium text-gray-500">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          PROBLEM
      ══════════════════════════════════════ */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {/* Header */}
          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel>Le problème</SectionLabel>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              La déclaration foncière,{" "}
              <span className="text-red-600">c&apos;est un calvaire</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-gray-500">
              Chaque année, des milliers de propriétaires bailleurs passent des
              heures sur leur déclaration — et font encore des erreurs.
            </p>
          </div>

          {/* Cards */}
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {PAIN_POINTS.map((point) => (
              <div
                key={point.title}
                className="rounded-2xl border border-red-100 bg-red-50 p-6"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-red-500">
                  {point.icon}
                </div>
                <h3 className="mt-4 text-base font-semibold text-gray-900">
                  {point.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  {point.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SOLUTION
      ══════════════════════════════════════ */}
      <section className="bg-brand-50 py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {/* Header */}
          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel>La solution</SectionLabel>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Flash Locatif fait{" "}
              <span className="text-brand-600">tout ça pour vous</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-gray-500">
              Un outil pensé pour les propriétaires bailleurs non-comptables qui
              veulent bien faire leur déclaration sans y passer la journée.
            </p>
          </div>

          {/* Cards */}
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {BENEFITS.map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-100 text-brand-600">
                  {benefit.icon}
                </div>
                <h3 className="mt-4 text-base font-semibold text-gray-900">
                  {benefit.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  {benefit.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════ */}
      <section id="comment-ca-marche" className="bg-white py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          {/* Header */}
          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel>Comment ça marche</SectionLabel>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Trois étapes, moins de 10 minutes
            </h2>
            <p className="mt-4 text-base leading-relaxed text-gray-500">
              Un formulaire 2044 prêt à l&apos;emploi au bout du tunnel.
            </p>
          </div>

          {/* Steps */}
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {HOW_IT_WORKS.map((item) => (
              <div key={item.step} className="relative text-center">
                {/* Step number */}
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-600 shadow-md">
                  <span className="text-lg font-extrabold text-white">
                    {item.step}
                  </span>
                </div>
                {/* Content */}
                <h3 className="mt-5 text-base font-semibold text-gray-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  {item.body}
                </p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-14 text-center">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-brand-600 px-10 text-base font-semibold text-white shadow-md hover:bg-brand-700"
              >
                Essayer maintenant — c&apos;est gratuit
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          PRICING
      ══════════════════════════════════════ */}
      <section id="tarifs" className="bg-gray-50 py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {/* Header */}
          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel>Tarifs</SectionLabel>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Des tarifs transparents
            </h2>
            <p className="mt-4 text-base leading-relaxed text-gray-500">
              Simulez gratuitement. Payez uniquement pour télécharger votre
              formulaire final.
            </p>
          </div>

          {/* Cards */}
          <div className="mt-14 grid grid-cols-1 items-start gap-6 sm:grid-cols-3">
            {PLANS.map((plan) => (
              <PricingCard key={plan.name} {...plan} />
            ))}
          </div>

          <p className="mt-8 text-center text-xs text-gray-400">
            Tarifs HT — TVA 20 % applicable · Paiement unique par année fiscale
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FAQ
      ══════════════════════════════════════ */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          {/* Header */}
          <div className="text-center">
            <SectionLabel>FAQ</SectionLabel>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Questions fréquentes
            </h2>
          </div>

          <Accordion type="single" collapsible className="mt-12 w-full">
            {FAQS.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border-b border-gray-200">
                <AccordionTrigger className="py-5 text-left text-sm font-semibold text-gray-900 hover:text-brand-600 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-sm leading-relaxed text-gray-500">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════ */}
      <section className="bg-brand-600 py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Prêt à simplifier votre déclaration ?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-brand-100">
            Rejoignez les propriétaires bailleurs qui gagnent du temps et
            optimisent leur fiscalité avec Flash Locatif.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-white px-10 text-base font-bold text-brand-600 shadow-md hover:bg-brand-50"
              >
                Commencer ma déclaration →
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="ghost"
                className="text-base font-medium text-brand-100 hover:bg-brand-700 hover:text-white"
              >
                Déjà un compte ? Se connecter
              </Button>
            </Link>
          </div>
          <p className="mt-5 text-sm text-brand-200">
            Simulation gratuite · Sans engagement · Paiement sécurisé
          </p>
        </div>
      </section>
    </>
  );
}
