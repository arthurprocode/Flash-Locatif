"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CurrencyInput } from "@/components/ui/currency-input";
import { TooltipLabel } from "@/components/ui/tooltip-label";

interface Income {
  grossRent: number;
  rentChargesRecovered: number;
}

interface Property {
  id: string;
  name: string;
  income: Income | null;
}

interface Declaration {
  id: string;
  taxYear: number;
  properties: Property[];
}

interface Props {
  declaration: Declaration;
}

export function StepTwoForm({ declaration }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [incomes, setIncomes] = useState<Record<string, Income>>(
    Object.fromEntries(
      declaration.properties.map((p) => [
        p.id,
        {
          grossRent: p.income?.grossRent ?? 0,
          rentChargesRecovered: p.income?.rentChargesRecovered ?? 0,
        },
      ])
    )
  );

  const totalGross = Object.values(incomes).reduce((sum, i) => sum + i.grossRent, 0);
  const isMicroEligible = totalGross < 15000;

  function updateIncome(propertyId: string, field: keyof Income, value: number) {
    setIncomes((prev) => ({
      ...prev,
      [propertyId]: { ...prev[propertyId], [field]: value },
    }));
  }

  async function handleSave() {
    setError(null);

    const body = {
      incomes: Object.entries(incomes).map(([propertyId, income]) => ({
        propertyId,
        ...income,
      })),
    };

    const res = await fetch(`/api/declaration/${declaration.id}/step-2`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const json = (await res.json()) as { success: boolean; error?: string };
    if (!json.success) {
      setError(json.error ?? "Une erreur est survenue.");
      return;
    }

    startTransition(() => {
      router.push(`/declaration/${declaration.id}/step-3`);
    });
  }

  return (
    <div className="space-y-6">
      {/* Micro-foncier eligibility banner */}
      {isMicroEligible && totalGross > 0 && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
          <span className="font-semibold">Micro-foncier accessible :</span> vos loyers annuels
          sont inférieurs à 15 000 €. Flash Locatif comparera automatiquement les deux régimes.
        </div>
      )}

      {/* Per-property income */}
      {declaration.properties.map((property) => (
        <Card key={property.id}>
          <CardHeader>
            <CardTitle className="text-base">{property.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <TooltipLabel
                htmlFor={`gross-${property.id}`}
                label={`Loyers bruts perçus ${declaration.taxYear}`}
                tooltip="Loyers bruts perçus sur l'année, hors charges récupérables sur le locataire."
              />
              <CurrencyInput
                id={`gross-${property.id}`}
                value={incomes[property.id].grossRent}
                onChange={(v) => updateIncome(property.id, "grossRent", v)}
              />
            </div>

            <div className="space-y-1.5">
              <TooltipLabel
                htmlFor={`charges-${property.id}`}
                label="Charges récupérées sur le locataire"
                tooltip="Charges récupérables que vous avez encaissées avec les loyers (eau, ordures ménagères, etc.)."
              />
              <CurrencyInput
                id={`charges-${property.id}`}
                value={incomes[property.id].rentChargesRecovered}
                onChange={(v) => updateIncome(property.id, "rentChargesRecovered", v)}
              />
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Running total */}
      <div className="rounded-lg border border-border bg-gray-50 px-4 py-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Total loyers bruts</span>
          <span className="font-bold text-gray-900">
            {totalGross.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
          </span>
        </div>
      </div>

      {error && (
        <p role="alert" className="text-sm text-error">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-3 border-t border-border pt-4">
        <Button
          onClick={handleSave}
          disabled={isPending}
          className="bg-brand-600 hover:bg-brand-700 text-white"
        >
          {isPending ? "Enregistrement…" : "Suivant : Charges →"}
        </Button>
      </div>
    </div>
  );
}
