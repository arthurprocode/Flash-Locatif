import { cn } from "@/lib/utils";
import { RegimeBadge } from "@/components/ui/regime-badge";
import type { TaxCalculationResult } from "@/lib/tax-calculator";

interface RegimeComparisonProps {
  result: TaxCalculationResult;
  className?: string;
}

function formatEuro(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Side-by-side comparison table: Micro-Foncier vs Régime Réel.
 * Highlights the recommended column in green.
 * Displays déficit explanation if applicable.
 */
export function RegimeComparison({ result, className }: RegimeComparisonProps) {
  const { microResult, reelResult, recommendation, savingsWithOptimalRegime } =
    result;

  const microWins = recommendation === "micro";
  const reelWins = recommendation === "reel";

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {/* Recommended badge */}
      <div className="flex flex-col items-center gap-2 text-center">
        <RegimeBadge regime={recommendation} />
        {savingsWithOptimalRegime > 0 && (
          <p className="text-sm text-gray-600">
            Vous économisez{" "}
            <span className="font-semibold text-success">
              {formatEuro(savingsWithOptimalRegime)}
            </span>{" "}
            de revenu imposable par rapport à l&apos;autre régime
          </p>
        )}
      </div>

      {/* Comparison table */}
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="w-1/3 bg-gray-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500" />
              <th
                className={cn(
                  "w-1/3 px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider",
                  microWins
                    ? "bg-green-50 text-green-700"
                    : "bg-gray-50 text-gray-500"
                )}
              >
                Micro-Foncier
                {microWins && (
                  <span className="ml-1 text-green-600">✓</span>
                )}
                {!microResult.eligibleForMicro && (
                  <span className="ml-1 text-xs font-normal text-gray-400">
                    (non éligible)
                  </span>
                )}
              </th>
              <th
                className={cn(
                  "w-1/3 px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider",
                  reelWins
                    ? "bg-green-50 text-green-700"
                    : "bg-gray-50 text-gray-500"
                )}
              >
                Régime Réel
                {reelWins && <span className="ml-1 text-green-600">✓</span>}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <Row
              label="Revenu brut"
              micro={formatEuro(microResult.grossIncome)}
              reel={formatEuro(reelResult.grossIncome)}
              microHighlight={microWins}
              reelHighlight={reelWins}
            />
            <Row
              label="Déductions"
              micro={`-30% (${formatEuro(microResult.abatement)})`}
              reel={`-${formatEuro(reelResult.totalDeductibleExpenses)}`}
              microHighlight={microWins}
              reelHighlight={reelWins}
            />
            {reelResult.deficitApplied > 0 && (
              <Row
                label="Déficits antérieurs"
                micro="—"
                reel={`-${formatEuro(reelResult.deficitApplied)}`}
                microHighlight={microWins}
                reelHighlight={reelWins}
              />
            )}
            <Row
              label="Revenu imposable"
              micro={
                microResult.eligibleForMicro
                  ? formatEuro(microResult.taxableIncome)
                  : "Non éligible"
              }
              reel={formatEuro(reelResult.netFoncierFinal)}
              microHighlight={microWins}
              reelHighlight={reelWins}
              isTotal
            />
          </tbody>
        </table>
      </div>

      {/* Déficit foncier explanation */}
      {reelResult.deficitGeneratedThisYear > 0 && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
          <p className="font-semibold">Déficit foncier généré cette année</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {reelResult.deficitImputableOnRevenuGlobal > 0 && (
              <li>
                <strong>
                  {formatEuro(reelResult.deficitImputableOnRevenuGlobal)}
                </strong>{" "}
                imputable sur votre revenu global (autres revenus), dans la
                limite de 10&nbsp;750&nbsp;€/an.
              </li>
            )}
            {reelResult.deficitCarriedForward > 0 && (
              <li>
                <strong>{formatEuro(reelResult.deficitCarriedForward)}</strong>{" "}
                reportable sur vos revenus fonciers des 10 prochaines années
                (lié aux intérêts d&apos;emprunt).
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

interface RowProps {
  label: string;
  micro: string;
  reel: string;
  microHighlight: boolean;
  reelHighlight: boolean;
  isTotal?: boolean;
}

function Row({
  label,
  micro,
  reel,
  microHighlight,
  reelHighlight,
  isTotal,
}: RowProps) {
  return (
    <tr>
      <td
        className={cn(
          "px-4 py-3 text-gray-600",
          isTotal && "font-semibold text-gray-900"
        )}
      >
        {label}
      </td>
      <td
        className={cn(
          "px-4 py-3 text-center tabular-nums",
          microHighlight ? "bg-green-50 font-semibold text-green-800" : "text-gray-700",
          isTotal && "text-base"
        )}
      >
        {micro}
      </td>
      <td
        className={cn(
          "px-4 py-3 text-center tabular-nums",
          reelHighlight ? "bg-green-50 font-semibold text-green-800" : "text-gray-700",
          isTotal && "text-base"
        )}
      >
        {reel}
      </td>
    </tr>
  );
}
