"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SubscriptionSectionProps {
  subscriptionStatus: string | null;
  hasStripeCustomer: boolean;
}

type PlanInfo = {
  label: string;
  tone: "free" | "active" | "trialing" | "inactive";
  description: string;
};

function getPlan(status: string | null): PlanInfo {
  if (status === "active") {
    return {
      label: "Actif",
      tone: "active",
      description: "Votre abonnement est actif. Merci de votre confiance.",
    };
  }
  if (status === "trialing") {
    return {
      label: "Période d’essai",
      tone: "trialing",
      description: "Vous bénéficiez d’un accès à toutes les fonctionnalités.",
    };
  }
  if (status === "past_due" || status === "canceled") {
    return {
      label: "Inactif",
      tone: "inactive",
      description: "Votre abonnement n’est plus actif.",
    };
  }
  return {
    label: "Gratuit",
    tone: "free",
    description:
      "Vous utilisez Flash Locatif en mode découverte. Passez au forfait complet pour générer votre formulaire 2044.",
  };
}

export function SubscriptionSection({
  subscriptionStatus,
  hasStripeCustomer,
}: SubscriptionSectionProps) {
  const plan = getPlan(subscriptionStatus);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function openPortal() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const json = (await res.json()) as {
        success: boolean;
        url?: string;
        error?: string;
      };
      if (json.success && json.url) {
        window.location.href = json.url;
      } else {
        setError(json.error ?? "Impossible d’ouvrir le portail de facturation.");
      }
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  }

  const badgeClass =
    plan.tone === "active"
      ? "border-success/30 bg-success/10 text-success"
      : plan.tone === "trialing"
        ? "border-brand-500/30 bg-brand-50 text-brand-700"
        : plan.tone === "inactive"
          ? "border-error/30 bg-error/10 text-error"
          : "border-gray-200 bg-gray-100 text-gray-700";

  return (
    <div className="space-y-4 text-sm">
      <div className="flex items-center gap-3">
        <Badge className={badgeClass}>{plan.label}</Badge>
      </div>

      <p className="text-gray-600">{plan.description}</p>

      {error && (
        <p className="text-xs text-error" role="alert">
          {error}
        </p>
      )}

      {hasStripeCustomer ? (
        <Button
          type="button"
          onClick={openPortal}
          disabled={loading}
          variant="outline"
        >
          {loading ? "Ouverture…" : "Gérer mon abonnement"}
        </Button>
      ) : (
        <Link href="/#tarifs">
          <Button className="bg-brand-600 text-white hover:bg-brand-700">
            Voir les forfaits
          </Button>
        </Link>
      )}
    </div>
  );
}
