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
   Icons
───────────────────────────────────────────── */
const CheckIcon = () => (
  <svg className="h-5 w-5 shrink-0 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

/* ─────────────────────────────────────────────
   Data
───────────────────────────────────────────── */
const PAIN_POINTS = [
  {
    number: "01",
    title: "Des heures perdues chaque année",
    body: "Retrouver les relevés, comparer les régimes, remplir le formulaire 2044… sans filet de sécurité.",
  },
  {
    number: "02",
    title: "Un formulaire incompréhensible",
    body: "Le formulaire 2044 compte 4 pages et une notice de 20 pages. Une case mal remplie coûte cher.",
  },
  {
    number: "03",
    title: "Un régime fiscal mal choisi",
    body: "Micro-foncier ou régime réel ? Un mauvais choix peut vous coûter plusieurs centaines d'euros par an.",
  },
];

const BENEFITS = [
  {
    title: "10 minutes chrono",
    body: "Répondez à nos questions guidées, Flash Locatif fait le calcul et génère votre formulaire à votre place.",
  },
  {
    title: "Régime optimal garanti",
    body: "Notre moteur compare micro-foncier et régime réel et vous montre exactement combien vous économisez.",
  },
  {
    title: "PDF 2044 pré-rempli",
    body: "Téléchargez votre formulaire prêt à reporter sur impots.gouv.fr, accompagné d'un guide pas à pas.",
  },
  {
    title: "Déficit foncier géré",
    body: "Calcul automatique du déficit imputable sur votre revenu global (jusqu'à 10 750 €) et du report sur 10 ans.",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Saisissez vos données",
    body: "Revenus locatifs, charges déductibles, intérêts d'emprunt, taxe foncière… Notre formulaire guidé vous accompagne bien à bien.",
  },
  {
    step: "02",
    title: "Visualisez la simulation",
    body: "Flash Locatif compare micro-foncier et régime réel en temps réel et vous recommande le régime qui minimise votre impôt.",
  },
  {
    step: "03",
    title: "Téléchargez vos documents",
    body: "Recevez votre formulaire 2044 pré-rempli et le guide étape par étape pour le reporter sur impots.gouv.fr.",
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
   Section label — plain text, no pill
───────────────────────────────────────────── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">
      {children}
    </p>
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
          — centered, max-w-4xl, px-6
      ══════════════════════════════════════ */}
      <section className="bg-gradient-to-b from-brand-50 to-white py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">

          {/* Badge */}
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white px-4 py-1.5 text-sm font-medium text-brand-700 shadow-sm">
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

          {/* Sub-headline — mt-6 after headline */}
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-500 sm:text-xl">
            Flash Locatif calcule votre régime fiscal optimal, génère votre
            formulaire 2044 pré-rempli et vous guide pas à pas sur
            impots.gouv.fr. Fini les tableurs, fini les erreurs.
          </p>

          {/* CTAs — mt-8 after subtitle */}
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
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

          {/* Tagline — mt-4 after CTAs */}
          <p className="mt-4 text-sm text-gray-400">
            Simulation gratuite · Paiement uniquement au téléchargement
          </p>

          {/* Stats bar — mt-12 above, py-6 inside each item */}
          <div className="mx-auto mt-12 grid max-w-2xl grid-cols-3 divide-x divide-gray-200 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            {STATS.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center px-4 py-6">
                <span
                  className="text-2xl font-extrabold text-brand-600 sm:text-3xl"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
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
          — numbered rows, no identical cards
      ══════════════════════════════════════ */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">

          {/* Header — centered, max-w-2xl */}
          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel>Le problème</SectionLabel>
            {/* mb-4 after label */}
            <h2 className="mb-4 mt-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              La déclaration foncière,{" "}
              <span className="text-brand-600">c&apos;est un calvaire</span>
            </h2>
            {/* mb-6 after title */}
            <p className="mb-6 text-base leading-relaxed text-gray-500">
              Chaque année, des milliers de propriétaires bailleurs passent des
              heures sur leur déclaration — et font encore des erreurs.
            </p>
          </div>

          {/* Pain points — numbered divider layout, no card boxes */}
          {/* mb-12 before content */}
          <div className="mb-12 mt-0 grid grid-cols-1 divide-y divide-gray-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {PAIN_POINTS.map((point) => (
              <div key={point.number} className="p-6">
                <span className="block text-5xl font-extrabold leading-none text-gray-100">
                  {point.number}
                </span>
                {/* mb-3 after number */}
                <h3 className="mb-2 mt-3 text-base font-semibold text-gray-900">
                  {point.title}
                </h3>
                {/* mb-2 after title */}
                <p className="text-sm leading-relaxed text-gray-500">
                  {point.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SOLUTION
          — two-col feature layout
      ══════════════════════════════════════ */}
      {/* OKLCH tinted background: hint of brand blue in the neutral */}
      <section className="py-20" style={{ backgroundColor: "oklch(97% 0.008 250)" }}>
        <div className="mx-auto max-w-6xl px-6">

          {/* Header */}
          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel>La solution</SectionLabel>
            {/* mb-4 after label */}
            <h2 className="mb-4 mt-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Flash Locatif fait{" "}
              <span className="text-brand-600">tout ça pour vous</span>
            </h2>
            {/* mb-6 after title */}
            <p className="mb-6 text-base leading-relaxed text-gray-500">
              Pensé pour les propriétaires bailleurs non-comptables qui veulent
              bien déclarer sans y passer la journée.
            </p>
          </div>

          {/* Features — 2-col grid: left wide card + right stacked items */}
          {/* mb-12 before content */}
          <div className="mb-12 mt-0 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Large feature card */}
            <div className="flex flex-col justify-between rounded-2xl bg-brand-600 p-8 text-white">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-brand-200">
                  Fonctionnalité clé
                </p>
                <h3 className="mt-3 text-2xl font-extrabold leading-snug">
                  Calcul automatique du régime optimal
                </h3>
                <p className="mt-4 text-base leading-relaxed text-brand-100">
                  Notre moteur fiscal compare micro-foncier et régime réel avec
                  vos données réelles et vous montre en euros combien vous
                  économisez. Zéro supposition.
                </p>
              </div>
              <Link href="/register" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-brand-100">
                Essayer gratuitement <ArrowRightIcon />
              </Link>
            </div>

            {/* Right column: stacked benefit items */}
            <div className="flex flex-col gap-4">
              {BENEFITS.map((b) => (
                <div
                  key={b.title}
                  className="flex items-start gap-4 rounded-2xl bg-white p-6 shadow-sm"
                >
                  <CheckIcon />
                  <div>
                    {/* mb-3 after icon (handled via gap-4 on parent + mt-0) */}
                    <h3 className="mb-2 text-sm font-semibold text-gray-900">
                      {b.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-gray-500">
                      {b.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          HOW IT WORKS
          — large typographic step numbers
      ══════════════════════════════════════ */}
      <section id="comment-ca-marche" className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">

          {/* Header */}
          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel>Comment ça marche</SectionLabel>
            {/* mb-4 after label */}
            <h2 className="mb-4 mt-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Trois étapes, moins de 10 minutes
            </h2>
            {/* mb-6 after title */}
            <p className="mb-6 text-base leading-relaxed text-gray-500">
              Un formulaire 2044 prêt à l&apos;emploi au bout du tunnel.
            </p>
          </div>

          {/* Steps — editorial: large decorative numbers */}
          {/* mb-12 before content */}
          <div className="mb-12 mt-0 grid grid-cols-1 gap-0 divide-y divide-gray-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {HOW_IT_WORKS.map((item) => (
              <div key={item.step} className="p-6">
                <span
                  className="block select-none text-6xl font-extrabold leading-none"
                  style={{ color: "oklch(92% 0.015 250)" }}
                >
                  {item.step}
                </span>
                {/* mb-3 after step number */}
                <h3 className="mb-2 mt-3 text-base font-semibold text-gray-900">
                  {item.title}
                </h3>
                {/* mb-2 after title */}
                <p className="text-sm leading-relaxed text-gray-500">
                  {item.body}
                </p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
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
      <section id="tarifs" className="py-20" style={{ backgroundColor: "oklch(97% 0.005 250)" }}>
        <div className="mx-auto max-w-6xl px-6">

          {/* Header */}
          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel>Tarifs</SectionLabel>
            {/* mb-4 after label */}
            <h2 className="mb-4 mt-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Des tarifs transparents
            </h2>
            {/* mb-6 after title */}
            <p className="mb-6 text-base leading-relaxed text-gray-500">
              Simulez gratuitement. Payez uniquement pour télécharger votre
              formulaire final.
            </p>
          </div>

          {/* Pricing cards — mb-12 before */}
          <div className="mb-12 mt-0 grid grid-cols-1 items-start gap-6 sm:grid-cols-3">
            {PLANS.map((plan) => (
              <PricingCard key={plan.name} {...plan} />
            ))}
          </div>

          <p className="text-center text-xs text-gray-400">
            Tarifs HT — TVA 20 % applicable · Paiement unique par année fiscale
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FAQ
      ══════════════════════════════════════ */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">

          {/* Header */}
          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel>FAQ</SectionLabel>
            {/* mb-4 after label */}
            <h2 className="mb-4 mt-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Questions fréquentes
            </h2>
          </div>

          {/* Accordion — mb-12 before, max-w-2xl centered */}
          <div className="mx-auto mb-12 mt-0 max-w-2xl">
            <Accordion type="single" collapsible className="w-full">
              {FAQS.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="border-b border-gray-200"
                >
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
        </div>
      </section>

      {/* ══════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════ */}
      <section className="bg-brand-600 py-20">
        <div className="mx-auto max-w-6xl px-6 text-center">
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
