import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { StepProgress } from "@/components/ui/step-progress";
import { RegimeComparison } from "@/components/declaration/regime-comparison";
import { Button } from "@/components/ui/button";
import { runFullCalculation } from "@/lib/tax-calculator";
import type { TaxInputData } from "@/lib/tax-calculator";

const STEP_LABELS = ["Biens", "Revenus", "Charges", "Simulation", "Paiement"];

interface Props {
  params: Promise<{ id: string }>;
}

export default async function StepFourPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const declaration = await db.declaration.findUnique({
    where: { id },
    include: {
      properties: {
        orderBy: { order: "asc" },
        include: { income: true, expenses: true },
      },
      previousDeficits: { orderBy: { year: "asc" } },
    },
  });

  if (!declaration || declaration.userId !== session.user.id) notFound();
  if (declaration.properties.length === 0) redirect(`/declaration/${id}/step-1`);

  // Build tax input from DB data
  const taxInput: TaxInputData = {
    taxYear: declaration.taxYear,
    properties: declaration.properties.map((p) => ({
      id: p.id,
      name: p.name,
      income: {
        grossRent: p.income?.grossRent ?? 0,
        rentChargesRecovered: p.income?.rentChargesRecovered ?? 0,
      },
      expenses: {
        mortgageInterest: p.expenses?.mortgageInterest ?? 0,
        propertyManagementFees: p.expenses?.propertyManagementFees ?? 0,
        landlordInsurance: p.expenses?.landlordInsurance ?? 0,
        propertyTax: p.expenses?.propertyTax ?? 0,
        maintenanceWorks: p.expenses?.maintenanceWorks ?? 0,
        condoFees: p.expenses?.condoFees ?? 0,
        accountingFees: p.expenses?.accountingFees ?? 0,
        otherDeductible: p.expenses?.otherDeductible ?? 0,
      },
    })),
    previousDeficits: declaration.previousDeficits.map((d) => ({
      year: d.year,
      interestPortion: d.interestPortion,
      otherPortion: d.otherPortion,
    })),
  };

  const result = runFullCalculation(taxInput);

  // Mark declaration as completed once simulation is viewed
  if (declaration.status === "DRAFT") {
    await db.declaration.update({
      where: { id },
      data: { status: "COMPLETED" },
    });
  }

  return (
    <div className="space-y-6">
      <StepProgress current={4} total={5} labels={STEP_LABELS} />
      <div>
        <Link href={`/declaration/${id}/step-3`} className="text-sm text-gray-500 hover:text-brand-600">
          ← Retour
        </Link>
      </div>

      <div>
        <h2 className="text-lg font-bold text-gray-900">Votre simulation fiscale {declaration.taxYear}</h2>
        <p className="mt-1 text-sm text-gray-500">
          Comparaison des deux régimes d&apos;imposition disponibles
        </p>
      </div>

      <RegimeComparison result={result} />

      {/* Déficit explanation */}
      {result.reelResult.deficitGeneratedThisYear > 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <p className="font-semibold">Déficit foncier constaté</p>
          <ul className="mt-2 space-y-1 text-amber-800">
            {result.reelResult.deficitImputableOnRevenuGlobal > 0 && (
              <li>
                • <strong>{result.reelResult.deficitImputableOnRevenuGlobal.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}</strong>{" "}
                imputables sur votre revenu global de {declaration.taxYear} (hors intérêts d&apos;emprunt)
              </li>
            )}
            {result.reelResult.deficitCarriedForward > 0 && (
              <li>
                • <strong>{result.reelResult.deficitCarriedForward.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}</strong>{" "}
                reportables sur vos revenus fonciers des 10 prochaines années
              </li>
            )}
          </ul>
        </div>
      )}

      {/* CTA to step 5 */}
      <div className="flex justify-end border-t border-border pt-4">
        <Link href={`/declaration/${id}/step-5`}>
          <Button className="bg-brand-600 hover:bg-brand-700 text-white">
            Générer mon formulaire 2044 →
          </Button>
        </Link>
      </div>
    </div>
  );
}
