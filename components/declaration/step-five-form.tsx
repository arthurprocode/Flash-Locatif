"use client";

import { useState } from "react";
import { PricingCard } from "@/components/marketing/pricing-card";

interface Props {
  declarationId: string;
  taxYear: number;
}

const PLANS = [
  {
    id: "solo" as const,
    name: "Solo",
    price: 49,
    features: [
      "1 bien immobilier",
      "Formulaire 2044 pré-rempli",
      "Guide de déclaration PDF",
      "Support par email",
    ],
    recommended: false,
  },
  {
    id: "multi" as const,
    name: "Multi",
    price: 89,
    features: [
      "Jusqu'à 5 biens immobiliers",
      "Formulaire 2044 pré-rempli",
      "Guide de déclaration PDF",
      "Gestion du déficit foncier",
      "Support prioritaire",
    ],
    recommended: true,
  },
  {
    id: "pro" as const,
    name: "Pro",
    price: 149,
    features: [
      "Biens illimités",
      "Formulaire 2044 pré-rempli",
      "Guide de déclaration PDF",
      "Gestion du déficit foncier",
      "Export comptable CSV",
      "Support dédié",
    ],
    recommended: false,
  },
];

export function StepFiveForm({ declarationId, taxYear }: Props) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSelectPlan(plan: "solo" | "multi" | "pro") {
    setError(null);
    setLoading(plan);

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ declarationId, plan }),
      });

      const json = (await res.json()) as { success: boolean; data?: { url: string | null }; error?: string };

      if (!json.success || !json.data?.url) {
        setError(json.error ?? "Impossible de créer la session de paiement.");
        return;
      }

      window.location.href = json.data.url;
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900">
          Téléchargez vos documents — déclaration {taxYear}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Choisissez votre plan pour accéder à votre formulaire 2044 pré-rempli et au guide de déclaration.
        </p>
      </div>

      {error && (
        <div role="alert" className="rounded-md border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {PLANS.map((plan) => (
          <PricingCard
            key={plan.id}
            name={plan.name}
            price={plan.price}
            features={plan.features}
            recommended={plan.recommended}
            ctaLabel={loading === plan.id ? "Redirection…" : `Choisir ${plan.name}`}
            ctaHref="#"
            className={loading !== null && loading !== plan.id ? "opacity-50 pointer-events-none" : ""}
            onCtaClick={() => handleSelectPlan(plan.id)}
          />
        ))}
      </div>

      <p className="text-center text-xs text-gray-400">
        Paiement sécurisé par Stripe — CB, Visa, Mastercard. Paiement unique, sans abonnement.
      </p>
    </div>
  );
}
