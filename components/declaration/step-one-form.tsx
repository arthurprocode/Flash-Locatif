"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CurrencyInput } from "@/components/ui/currency-input";

interface Property {
  id: string;
  name: string;
  order: number;
}

interface PreviousDeficit {
  id: string;
  year: number;
  interestPortion: number;
  otherPortion: number;
}

interface Declaration {
  id: string;
  taxYear: number;
  properties: Property[];
  previousDeficits: PreviousDeficit[];
}

interface Props {
  declaration: Declaration;
}

export function StepOneForm({ declaration }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Properties state (local edits before save)
  const [properties, setProperties] = useState<{ id: string | null; name: string }[]>(
    declaration.properties.length > 0
      ? declaration.properties.map((p) => ({ id: p.id, name: p.name }))
      : [{ id: null, name: "" }]
  );

  // Previous deficits state
  const [deficits, setDeficits] = useState<
    { id: string | null; year: number | ""; interestPortion: number; otherPortion: number }[]
  >(
    declaration.previousDeficits.map((d) => ({
      id: d.id,
      year: d.year,
      interestPortion: d.interestPortion,
      otherPortion: d.otherPortion,
    }))
  );

  const [hasDeficits, setHasDeficits] = useState(declaration.previousDeficits.length > 0);
  const [error, setError] = useState<string | null>(null);

  function addProperty() {
    setProperties((prev) => [...prev, { id: null, name: "" }]);
  }

  function removeProperty(idx: number) {
    setProperties((prev) => prev.filter((_, i) => i !== idx));
  }

  function updatePropertyName(idx: number, name: string) {
    setProperties((prev) => prev.map((p, i) => (i === idx ? { ...p, name } : p)));
  }

  function addDeficit() {
    setDeficits((prev) => [
      ...prev,
      { id: null, year: declaration.taxYear - 1, interestPortion: 0, otherPortion: 0 },
    ]);
  }

  function removeDeficit(idx: number) {
    setDeficits((prev) => prev.filter((_, i) => i !== idx));
  }

  function updateDeficit(
    idx: number,
    field: "year" | "interestPortion" | "otherPortion",
    value: number | ""
  ) {
    setDeficits((prev) =>
      prev.map((d, i) => (i === idx ? { ...d, [field]: value } : d))
    );
  }

  async function handleSave() {
    setError(null);

    // Validate
    for (const p of properties) {
      if (!p.name.trim()) {
        setError("Veuillez donner un nom à chaque bien immobilier.");
        return;
      }
    }

    const body = {
      properties: properties.map((p, i) => ({ id: p.id, name: p.name.trim(), order: i })),
      previousDeficits: hasDeficits
        ? deficits.map((d) => ({
            id: d.id,
            year: Number(d.year),
            interestPortion: d.interestPortion,
            otherPortion: d.otherPortion,
          }))
        : [],
    };

    const res = await fetch(`/api/declaration/${declaration.id}/step-1`, {
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
      router.push(`/declaration/${declaration.id}/step-2`);
    });
  }

  return (
    <div className="space-y-6">
      {/* Properties */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Vos biens immobiliers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {properties.map((property, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-700">
                {idx + 1}
              </div>
              <div className="flex-1">
                <Input
                  placeholder='ex : "Appartement Paris 11e"'
                  value={property.name}
                  onChange={(e) => updatePropertyName(idx, e.target.value)}
                  aria-label={`Nom du bien ${idx + 1}`}
                />
              </div>
              {properties.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeProperty(idx)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  aria-label={`Supprimer le bien ${idx + 1}`}
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addProperty}
            className="mt-2"
          >
            + Ajouter un bien
          </Button>
        </CardContent>
      </Card>

      {/* Previous deficits */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Déficits fonciers antérieurs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              id="has-deficits"
              type="checkbox"
              checked={hasDeficits}
              onChange={(e) => {
                setHasDeficits(e.target.checked);
                if (e.target.checked && deficits.length === 0) addDeficit();
              }}
              className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-600"
            />
            <Label htmlFor="has-deficits" className="cursor-pointer">
              J&apos;ai des déficits fonciers non imputés des années précédentes
            </Label>
          </div>

          {hasDeficits && (
            <div className="space-y-3">
              <div className="grid grid-cols-[80px_1fr_1fr_32px] gap-2 text-xs font-medium text-gray-500">
                <span>Année</span>
                <span>Part intérêts (€)</span>
                <span>Part autres charges (€)</span>
                <span />
              </div>

              {deficits.map((deficit, idx) => (
                <div key={idx} className="grid grid-cols-[80px_1fr_1fr_32px] items-center gap-2">
                  <Input
                    type="number"
                    min={declaration.taxYear - 10}
                    max={declaration.taxYear - 1}
                    value={deficit.year}
                    onChange={(e) =>
                      updateDeficit(idx, "year", e.target.value === "" ? "" : parseInt(e.target.value, 10))
                    }
                    aria-label="Année du déficit"
                  />
                  <CurrencyInput
                    value={deficit.interestPortion}
                    onChange={(v) => updateDeficit(idx, "interestPortion", v)}
                    aria-label="Part intérêts"
                  />
                  <CurrencyInput
                    value={deficit.otherPortion}
                    onChange={(v) => updateDeficit(idx, "otherPortion", v)}
                    aria-label="Part autres charges"
                  />
                  <button
                    type="button"
                    onClick={() => removeDeficit(idx)}
                    className="flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="Supprimer ce déficit"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}

              <Button type="button" variant="outline" size="sm" onClick={addDeficit}>
                + Ajouter une année
              </Button>

              <p className="text-xs text-gray-400">
                Indiquez les déficits non encore imputés, jusqu&apos;à 10 ans en arrière.
                La part &quot;intérêts&quot; s&apos;impute uniquement sur les revenus fonciers futurs.
                La part &quot;autres charges&quot; s&apos;est imputée sur le revenu global (max 10 750 €/an).
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {error && (
        <p role="alert" className="text-sm text-error">
          {error}
        </p>
      )}

      {/* Navigation */}
      <div className="flex justify-end gap-3 border-t border-border pt-4">
        <Button
          onClick={handleSave}
          disabled={isPending}
          className="bg-brand-600 hover:bg-brand-700 text-white"
        >
          {isPending ? "Enregistrement…" : "Suivant : Revenus →"}
        </Button>
      </div>
    </div>
  );
}
