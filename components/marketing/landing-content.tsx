"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Clock,
  FileX,
  TrendingDown,
  Zap,
  Calculator,
  FileCheck,
  Check,
  Shield,
  Star,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PricingCard } from "@/components/marketing/pricing-card";

/* ─────────────────────────────────────────────
   Animation variants
───────────────────────────────────────────── */
const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const staggerSlow = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

/* ─────────────────────────────────────────────
   Data
───────────────────────────────────────────── */
const PAIN_POINTS = [
  {
    icon: Clock,
    title: "Des heures perdues chaque année",
    body: "Retrouver les relevés, comparer les régimes, remplir le formulaire 2044… sans filet de sécurité.",
  },
  {
    icon: FileX,
    title: "Un formulaire incompréhensible",
    body: "Le formulaire 2044 compte 4 pages et une notice de 20 pages. Une case mal remplie coûte cher.",
  },
  {
    icon: TrendingDown,
    title: "Un régime fiscal mal choisi",
    body: "Micro-foncier ou régime réel ? Un mauvais choix peut vous coûter plusieurs centaines d'euros par an.",
  },
];

const SOLUTIONS = [
  {
    icon: Zap,
    title: "10 minutes chrono",
    body: "Répondez à nos questions guidées, Flash Locatif fait le calcul et génère votre formulaire à votre place.",
  },
  {
    icon: Calculator,
    title: "Régime optimal garanti",
    body: "Notre moteur compare micro-foncier et régime réel et vous montre exactement combien vous économisez.",
  },
  {
    icon: FileCheck,
    title: "PDF 2044 pré-rempli",
    body: "Téléchargez votre formulaire prêt à reporter sur impots.gouv.fr, accompagné d'un guide pas à pas.",
  },
  {
    icon: Shield,
    title: "Déficit foncier géré",
    body: "Calcul automatique du déficit imputable sur votre revenu global (jusqu'à 10 750 €) et report sur 10 ans.",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Saisissez vos données",
    body: "Revenus locatifs, charges déductibles, intérêts d'emprunt, taxe foncière… Notre formulaire guidé vous accompagne pas à pas.",
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

const COMPARISON = [
  {
    feature: "Calcul automatique du régime",
    flash: true,
    comptable: true,
    tableur: false,
    manuel: false,
  },
  {
    feature: "Formulaire 2044 pré-rempli",
    flash: true,
    comptable: true,
    tableur: false,
    manuel: false,
  },
  {
    feature: "Gestion du déficit foncier",
    flash: true,
    comptable: true,
    tableur: false,
    manuel: false,
  },
  {
    feature: "Tarif abordable",
    flash: true,
    comptable: false,
    tableur: true,
    manuel: true,
  },
  {
    feature: "Disponible 24h/24",
    flash: true,
    comptable: false,
    tableur: true,
    manuel: true,
  },
  {
    feature: "Guide inclus",
    flash: true,
    comptable: false,
    tableur: false,
    manuel: false,
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

const MEDIA_LOGOS = [
  "Le Particulier",
  "Capital",
  "MoneyVox",
  "PAP.fr",
  "Bien'ici",
];

/* ─────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">
      {children}
    </p>
  );
}

function CheckMark({ active }: { active: boolean }) {
  return active ? (
    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-100">
      <Check className="h-3.5 w-3.5 text-brand-600" strokeWidth={2.5} />
    </span>
  ) : (
    <span className="flex h-6 w-6 items-center justify-center text-gray-300">
      <span className="h-0.5 w-4 rounded-full bg-gray-200" />
    </span>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-100">
      <button
        type="button"
        className="flex w-full items-center justify-between py-5 text-left"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-gray-900">{question}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="ml-4 shrink-0 text-gray-400"
        >
          <ChevronDown className="h-4 w-4" />
        </motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="overflow-hidden"
      >
        <p className="pb-5 text-sm leading-relaxed text-gray-500">{answer}</p>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main component
───────────────────────────────────────────── */
export function LandingContent() {
  return (
    <>
      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section className="w-full bg-gradient-to-b from-brand-50 to-white py-24">
        <div className="mx-auto max-w-4xl px-6">
          <motion.div
            className="flex flex-col items-center text-center"
            variants={stagger}
            initial="hidden"
            animate="show"
          >
            {/* Badge */}
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white px-4 py-1.5 text-sm font-medium text-brand-700 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                Déclaration 2025 disponible
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              className="mt-8 text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl"
            >
              Votre déclaration foncière
              <br />
              <span className="text-brand-600">en 10 minutes chrono</span>
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              variants={fadeUp}
              className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-500 sm:text-xl"
            >
              Flash Locatif calcule votre régime fiscal optimal, génère votre
              formulaire 2044 pré-rempli et vous guide pas à pas sur
              impots.gouv.fr. Fini les tableurs, fini les erreurs.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={fadeUp}
              className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
            >
              <Link href="/register">
                <Button
                  size="lg"
                  className="w-full bg-brand-600 px-8 text-base font-semibold text-white shadow-md hover:bg-brand-700 sm:w-auto"
                >
                  Commencer ma déclaration
                  <ArrowRight className="ml-2 h-4 w-4" />
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
            </motion.div>

            {/* Tagline */}
            <motion.p variants={fadeUp} className="mt-4 text-sm text-gray-400">
              Simulation gratuite · Paiement uniquement au téléchargement
            </motion.p>

            {/* Stats bar */}
            <motion.div
              variants={fadeUp}
              className="mx-auto mt-12 w-full max-w-2xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
            >
              <div className="grid grid-cols-1 divide-y divide-gray-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
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
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SOCIAL PROOF BAR
      ══════════════════════════════════════ */}
      <section className="w-full border-y border-gray-100 bg-gray-50 py-6">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              Mentionné dans
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {MEDIA_LOGOS.map((name) => (
                <span
                  key={name}
                  className="rounded-full border border-gray-200 bg-white px-4 py-1.5 text-xs font-semibold text-gray-500"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          PROBLEM
      ══════════════════════════════════════ */}
      <section className="w-full bg-white py-24">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            className="mx-auto max-w-2xl text-center"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
          >
            <motion.div variants={fadeUp}>
              <SectionLabel>Le problème</SectionLabel>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl"
            >
              La déclaration foncière,{" "}
              <span className="text-brand-600">c&apos;est un calvaire</span>
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="mt-4 text-base leading-relaxed text-gray-500"
            >
              Chaque année, des milliers de propriétaires bailleurs passent des
              heures sur leur déclaration — et font encore des erreurs.
            </motion.p>
          </motion.div>

          <motion.div
            className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3"
            variants={staggerSlow}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
          >
            {PAIN_POINTS.map((point) => {
              const Icon = point.icon;
              return (
                <motion.div
                  key={point.title}
                  variants={fadeUp}
                  className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-7 shadow-sm transition-shadow hover:shadow-md"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50">
                    <Icon className="h-5 w-5 text-red-500" strokeWidth={1.75} />
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">{point.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-500">{point.body}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SOLUTION
      ══════════════════════════════════════ */}
      <section className="w-full py-24" style={{ backgroundColor: "oklch(97% 0.008 250)" }}>
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            className="mx-auto max-w-2xl text-center"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
          >
            <motion.div variants={fadeUp}>
              <SectionLabel>La solution</SectionLabel>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl"
            >
              Flash Locatif fait{" "}
              <span className="text-brand-600">tout ça pour vous</span>
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="mt-4 text-base leading-relaxed text-gray-500"
            >
              Pensé pour les propriétaires bailleurs non-comptables qui veulent
              bien déclarer sans y passer la journée.
            </motion.p>
          </motion.div>

          <motion.div
            className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2"
            variants={staggerSlow}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
          >
            {/* Large feature card */}
            <motion.div
              variants={fadeUp}
              className="flex flex-col justify-between rounded-2xl bg-brand-600 p-8 text-white sm:col-span-2 sm:flex-row sm:items-end sm:gap-12"
            >
              <div className="max-w-xl">
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
              <Link
                href="/register"
                className="mt-6 inline-flex shrink-0 items-center gap-2 rounded-full bg-white/15 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/25 sm:mt-0"
              >
                Essayer gratuitement
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>

            {/* Solution cards */}
            {SOLUTIONS.map((sol) => {
              const Icon = sol.icon;
              return (
                <motion.div
                  key={sol.title}
                  variants={fadeUp}
                  className="flex items-start gap-4 rounded-2xl bg-white p-7 shadow-sm transition-shadow hover:shadow-md"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50">
                    <Icon className="h-5 w-5 text-brand-600" strokeWidth={1.75} />
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">{sol.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-500">{sol.body}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════ */}
      <section id="comment-ca-marche" className="w-full bg-white py-24">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            className="mx-auto max-w-2xl text-center"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
          >
            <motion.div variants={fadeUp}>
              <SectionLabel>Comment ça marche</SectionLabel>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl"
            >
              Trois étapes, moins de 10 minutes
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="mt-4 text-base leading-relaxed text-gray-500"
            >
              Un formulaire 2044 prêt à l&apos;emploi au bout du tunnel.
            </motion.p>
          </motion.div>

          <motion.div
            className="relative mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3"
            variants={staggerSlow}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
          >
            {HOW_IT_WORKS.map((item, i) => (
              <motion.div key={item.step} variants={fadeUp} className="relative">
                {/* Connector line between steps (desktop only) */}
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="absolute left-[calc(50%+28px)] top-6 hidden h-0.5 w-[calc(100%-56px)] bg-brand-100 sm:block" />
                )}
                <div className="flex flex-col items-center text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white shadow-md">
                    {item.step}
                  </span>
                  <h3 className="mt-5 text-base font-semibold text-gray-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">{item.body}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4, ease: EASE }}
          >
            <Link href="/register">
              <Button
                size="lg"
                className="bg-brand-600 px-10 text-base font-semibold text-white shadow-md hover:bg-brand-700"
              >
                Essayer maintenant — c&apos;est gratuit
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          COMPARISON TABLE
      ══════════════════════════════════════ */}
      <section className="w-full py-24" style={{ backgroundColor: "oklch(97% 0.005 250)" }}>
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            className="mx-auto max-w-2xl text-center"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
          >
            <motion.div variants={fadeUp}>
              <SectionLabel>Comparaison</SectionLabel>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl"
            >
              Pourquoi Flash Locatif ?
            </motion.h2>
          </motion.div>

          <motion.div
            className="mt-12 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="p-5 text-left font-medium text-gray-500">Fonctionnalité</th>
                    <th className="bg-brand-600 p-5 text-center font-semibold text-white">
                      Flash Locatif
                    </th>
                    <th className="p-5 text-center font-medium text-gray-500">Comptable</th>
                    <th className="p-5 text-center font-medium text-gray-500">Tableur</th>
                    <th className="p-5 text-center font-medium text-gray-500">Manuel</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON.map((row, i) => (
                    <tr key={row.feature} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                      <td className="p-5 font-medium text-gray-700">{row.feature}</td>
                      <td className="bg-brand-50/40 p-5 text-center">
                        <div className="flex justify-center">
                          <CheckMark active={row.flash} />
                        </div>
                      </td>
                      <td className="p-5 text-center">
                        <div className="flex justify-center">
                          <CheckMark active={row.comptable} />
                        </div>
                      </td>
                      <td className="p-5 text-center">
                        <div className="flex justify-center">
                          <CheckMark active={row.tableur} />
                        </div>
                      </td>
                      <td className="p-5 text-center">
                        <div className="flex justify-center">
                          <CheckMark active={row.manuel} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          PRICING
      ══════════════════════════════════════ */}
      <section id="tarifs" className="w-full bg-white py-24">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            className="mx-auto max-w-2xl text-center"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
          >
            <motion.div variants={fadeUp}>
              <SectionLabel>Tarifs</SectionLabel>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl"
            >
              Des tarifs transparents
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="mt-4 text-base leading-relaxed text-gray-500"
            >
              Simulez gratuitement. Payez uniquement pour télécharger votre
              formulaire final.
            </motion.p>
          </motion.div>

          <motion.div
            className="mt-12 grid grid-cols-1 items-start gap-6 sm:grid-cols-3"
            variants={staggerSlow}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
          >
            {PLANS.map((plan) => (
              <motion.div
                key={plan.name}
                variants={fadeUp}
                className={plan.recommended ? "sm:scale-105" : ""}
              >
                <PricingCard {...plan} />
              </motion.div>
            ))}
          </motion.div>

          <p className="mt-8 text-center text-xs text-gray-400">
            Tarifs HT — TVA 20 % applicable · Paiement unique par année fiscale
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════
          TESTIMONIAL
      ══════════════════════════════════════ */}
      <section className="w-full py-24" style={{ backgroundColor: "oklch(97% 0.008 250)" }}>
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            className="mx-auto max-w-2xl text-center"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            {/* Stars */}
            <div className="flex justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
              ))}
            </div>

            {/* Quote */}
            <blockquote className="mt-6 text-xl font-medium leading-relaxed text-gray-900 sm:text-2xl">
              &ldquo;J&apos;ai mis 12 minutes pour déclarer mes deux appartements. Le
              formulaire 2044 était pré-rempli, je n&apos;avais plus qu&apos;à le
              recopier sur impots.gouv.fr. Bluffant.&rdquo;
            </blockquote>

            {/* Author */}
            <div className="mt-6 flex flex-col items-center gap-1">
              <p className="text-sm font-semibold text-gray-900">Marc-Antoine B.</p>
              <p className="text-xs text-gray-500">Propriétaire de 2 appartements à Lyon</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FAQ
      ══════════════════════════════════════ */}
      <section className="w-full bg-white py-24">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            className="mx-auto max-w-2xl text-center"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
          >
            <motion.div variants={fadeUp}>
              <SectionLabel>FAQ</SectionLabel>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl"
            >
              Questions fréquentes
            </motion.h2>
          </motion.div>

          <motion.div
            className="mx-auto mt-12 max-w-2xl"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            {FAQS.map((faq) => (
              <FaqItem key={faq.question} {...faq} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════ */}
      <section className="w-full bg-brand-600 py-24">
        <motion.div
          className="mx-auto max-w-6xl px-6 text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: EASE }}
        >
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
                Commencer ma déclaration
                <ArrowRight className="ml-2 h-4 w-4" />
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
        </motion.div>
      </section>
    </>
  );
}
