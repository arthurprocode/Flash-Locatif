"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CurrencyInput } from "@/components/ui/currency-input";
import { TooltipLabel } from "@/components/ui/tooltip-label";

interface Expenses {
  mortgageInterest: number;
  propertyManagementFees: number;
  landlordInsurance: number;
  propertyTax: number;
  maintenanceWorks: number;
  condoFees: number;
  accountingFees: number;
  otherDeductible: number;
}

interface Property {
  id: string;
  name: string;
  expenses: Expenses | null;
}

interface Declaration {
  id: string;
  taxYear: number;
  properties: Property[];
}

interface Props {
  declaration: Declaration;
}

const EMPTY_EXPENSES: Expenses = {
  mortgageInterest: 0,
  propertyManagementFees: 0,
  landlordInsurance: 0,
  propertyTax: 0,
  maintenanceWorks: 0,
  condoFees: 0,
  accountingFees: 0,
  otherDeductible: 0,
};

type ExpenseField = keyof Expenses;

const EXPENSE_FIELDS: { field: ExpenseField; label: string; tooltip: string }[] = [
  {
    field: "mortgageInterest",
    label: "Intérêts d'emprunt",
    tooltip:
      "Uniquement la part intérêts de votre mensualité, pas le capital remboursé. Consultez votre tableau d'amortissement.",
  },
  {
    field: "propertyManagementFees",
    label: "Frais de gestion locative",
    tooltip:
      "Honoraires d'agence si vous avez délégué la gestion. Généralement 7 à 10 % des loyers.",
  },
  {
    field: "landlordInsurance",
    label: "Assurance propriétaire non-occupant (PNO)",
    tooltip:
      "Assurance obligatoire couvrant le logement quand il est occupé par un locataire.",
  },
  {
    field: "propertyTax",
    label: "Taxe foncière (hors TEOM)",
    tooltip:
      "Taxe foncière hors taxe d'enlèvement des ordures ménagères (TEOM). La TEOM est récupérable sur le locataire et ne se déduit pas.",
  },
  {
    field: "maintenanceWorks",
    label: "Travaux d'entretien et de réparation",
    tooltip:
      "Travaux visant à maintenir ou remettre en état le bien (peinture, plomberie, toiture…). Les travaux d'amélioration ou d'agrandissement ne sont PAS déductibles.",
  },
  {
    field: "condoFees",
    label: "Charges de copropriété (part propriétaire)",
    tooltip:
      "Uniquement la part à votre charge (charges non récupérables). Les charges refacturées au locataire ne se déduisent pas.",
  },
  {
    field: "accountingFees",
    label: "Frais de comptabilité",
    tooltip: "Si vous avez fait appel à un comptable pour cette déclaration.",
  },
  {
    field: "otherDeductible",
    label: "Autres charges déductibles",
    tooltip:
      "Toute autre charge réellement déductible non listée ci-dessus (ex. frais de procédure).",
  },
];

export function StepThreeForm({ declaration }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [expenses, setExpenses] = useState<Record<string, Expenses>>(
    Object.fromEntries(
      declaration.properties.map((p) => [
        p.id,
        p.expenses ? { ...p.expenses } : { ...EMPTY_EXPENSES },
      ])
    )
  );

  function updateExpense(propertyId: string, field: ExpenseField, value: number) {
    setExpenses((prev) => ({
      ...prev,
      [propertyId]: { ...prev[propertyId], [field]: value },
    }));
  }

  function totalForProperty(propertyId: string): number {
    const e = expenses[propertyId];
    return Object.values(e).reduce((s, v) => s + v, 0);
  }

  async function handleSave() {
    setError(null);

    const body = {
      expenses: Object.entries(expenses).map(([propertyId, exp]) => ({
        propertyId,
        ...exp,
      })),
    };

    const res = await fetch(`/api/declaration/${declaration.id}/step-3`, {
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
      router.push(`/declaration/${declaration.id}/step-4`);
    });
  }

  return (
    <div className="space-y-6">
      {declaration.properties.map((property) => (
        <Card key={property.id}>
          <CardHeader>
            <CardTitle className="text-base">{property.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {EXPENSE_FIELDS.map(({ field, label, tooltip }) => (
              <div key={field} className="space-y-1.5">
                <TooltipLabel htmlFor={`${field}-${property.id}`} label={label} tooltip={tooltip} />
                <CurrencyInput
                  id={`${field}-${property.id}`}
                  value={expenses[property.id][field]}
                  onChange={(v) => updateExpense(property.id, field, v)}
                />
              </div>
            ))}

            {/* Property subtotal */}
            <div className="mt-2 flex items-center justify-between rounded-lg border border-border bg-gray-50 px-4 py-3 text-sm">
              <span className="text-gray-600">Total charges — {property.name}</span>
              <span className="font-bold text-gray-900">
                {totalForProperty(property.id).toLocaleString("fr-FR", {
                  style: "currency",
                  currency: "EUR",
                })}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}

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
          {isPending ? "Enregistrement…" : "Suivant : Simulation →"}
        </Button>
      </div>
    </div>
  );
}
