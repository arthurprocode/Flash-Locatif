/**
 * lib/tax-calculator.ts
 * Core French tax calculation logic for Flash Locatif.
 *
 * All functions are pure (no side effects, no DB calls).
 * All monetary values are numbers (floats) in euros — never strings.
 * See SPEC.md Section 4 for full business rules.
 */

// ─── Input types ─────────────────────────────────────────────────────────────

export interface TaxInputData {
  taxYear: number; // e.g. 2024
  properties: Property[];
  previousDeficits: PreviousDeficit[]; // from prior years, sorted oldest first
}

export interface Property {
  id: string;
  name: string; // e.g. "Appartement Paris 11e"
  income: PropertyIncome;
  expenses: PropertyExpenses;
}

export interface PropertyIncome {
  grossRent: number; // Total rent collected (charges incluses)
  rentChargesRecovered: number; // Charges locatives récupérées sur locataire
}

export interface PropertyExpenses {
  mortgageInterest: number; // Intérêts d'emprunt (NOT capital repayment)
  propertyManagementFees: number; // Frais d'agence / gestion locative
  landlordInsurance: number; // Assurance PNO
  propertyTax: number; // Taxe foncière (hors TEOM)
  maintenanceWorks: number; // Travaux d'entretien/réparation (NOT amélioration)
  condoFees: number; // Charges de copropriété (part propriétaire)
  accountingFees: number; // Frais de comptabilité
  otherDeductible: number; // Autres charges déductibles
}

export interface PreviousDeficit {
  year: number;
  interestPortion: number; // Déficit lié aux intérêts (reportable sur foncier only)
  otherPortion: number; // Déficit lié aux autres charges (peut réduire revenu global)
}

// ─── Output types ────────────────────────────────────────────────────────────

export interface TaxCalculationResult {
  regime: "micro" | "reel";
  recommendation: "micro" | "reel"; // which regime we recommend
  microResult: MicroResult;
  reelResult: ReelResult;
  savingsWithOptimalRegime: number; // euros saved vs the other regime (always >= 0)
}

export interface MicroResult {
  grossIncome: number;
  abatement: number; // 30% flat deduction
  taxableIncome: number;
  eligibleForMicro: boolean; // false if gross income >= 15,000€
}

export interface ReelResult {
  grossIncome: number;
  totalDeductibleExpenses: number;
  netFoncierBeforeDeficit: number; // grossIncome - totalDeductibleExpenses
  deficitApplied: number; // Sum of previous-year deficits applied this year
  netFoncierFinal: number; // Can be negative (new déficit)
  deficitGeneratedThisYear: number; // 0 if netFoncierFinal >= 0
  deficitImputableOnRevenuGlobal: number; // Max 10,750€, from non-interest expenses only
  deficitCarriedForward: number; // Remaining deficit to carry forward (interest + excess other)
  breakdownPerProperty: PropertyResult[];
}

export interface PropertyResult {
  propertyId: string;
  propertyName: string;
  grossIncome: number;
  totalExpenses: number;
  netIncome: number; // Can be negative
}

// ─── Constants ───────────────────────────────────────────────────────────────

/** Gross income threshold above which micro-foncier is not available */
export const MICRO_FONCIER_THRESHOLD = 15_000;

/** Flat abatement rate for micro-foncier */
export const MICRO_FONCIER_ABATEMENT_RATE = 0.3;

/** Maximum déficit imputable on revenu global per year */
export const MAX_DEFICIT_IMPUTABLE_ON_REVENU_GLOBAL = 10_750;

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Sum all deductible expenses for a single property. */
function sumDeductibleExpenses(expenses: PropertyExpenses): number {
  return (
    expenses.mortgageInterest +
    expenses.propertyManagementFees +
    expenses.landlordInsurance +
    expenses.propertyTax +
    expenses.maintenanceWorks +
    expenses.condoFees +
    expenses.accountingFees +
    expenses.otherDeductible
  );
}

/** Sum all non-interest deductible expenses for a single property. */
function sumNonInterestExpenses(expenses: PropertyExpenses): number {
  return (
    expenses.propertyManagementFees +
    expenses.landlordInsurance +
    expenses.propertyTax +
    expenses.maintenanceWorks +
    expenses.condoFees +
    expenses.accountingFees +
    expenses.otherDeductible
  );
}

/** Total gross rent across all properties. */
function totalGrossRent(properties: Property[]): number {
  return properties.reduce((sum, p) => sum + p.income.grossRent, 0);
}

// ─── calculateMicroFoncier ────────────────────────────────────────────────────

/**
 * Calculates the micro-foncier taxable income.
 * Applies a flat 30% abatement on gross rental income.
 * Not available if total gross income >= 15,000€.
 */
export function calculateMicroFoncier(properties: Property[]): MicroResult {
  const grossIncome = totalGrossRent(properties);
  const eligibleForMicro = grossIncome < MICRO_FONCIER_THRESHOLD;
  const abatement = grossIncome * MICRO_FONCIER_ABATEMENT_RATE;
  const taxableIncome = grossIncome - abatement; // = grossIncome * 0.70

  return {
    grossIncome,
    abatement,
    taxableIncome,
    eligibleForMicro,
  };
}

// ─── calculateRegimeReel ──────────────────────────────────────────────────────

/**
 * Calculates the régime réel result including déficit foncier logic.
 *
 * Déficit foncier rules (SPEC.md §4.3):
 *
 * Step 1 — net without interest = grossIncome - nonInterestExpenses
 *   • If >= 0: the full interest is applied next; any remaining deficit comes
 *     entirely from interest and is carry-forward only.
 *   • If < 0: the deficit already comes from non-interest charges before interest
 *     is even applied.
 *
 * Step 2 — apply mortgage interest to the step-1 result:
 *   netFoncierBeforeDeficit = step1 - totalInterest
 *
 * Splitting the deficit:
 *   otherPortion  = max(0, -step1)          capped at MAX_DEFICIT_IMPUTABLE_ON_REVENU_GLOBAL
 *   interestPortion = max(0, -netFoncierBeforeDeficit) - otherPortion
 *
 * Step 3 — apply previous-year deficits (oldest first) to netFoncierBeforeDeficit.
 */
export function calculateRegimeReel(
  properties: Property[],
  previousDeficits: PreviousDeficit[]
): ReelResult {
  // ── Per-property breakdown ──────────────────────────────────────────────
  const breakdownPerProperty: PropertyResult[] = properties.map((p) => {
    const grossIncome = p.income.grossRent;
    const totalExpenses = sumDeductibleExpenses(p.expenses);
    return {
      propertyId: p.id,
      propertyName: p.name,
      grossIncome,
      totalExpenses,
      netIncome: grossIncome - totalExpenses,
    };
  });

  // ── Pooled totals ───────────────────────────────────────────────────────
  const grossIncome = breakdownPerProperty.reduce(
    (s, r) => s + r.grossIncome,
    0
  );
  const totalDeductibleExpenses = breakdownPerProperty.reduce(
    (s, r) => s + r.totalExpenses,
    0
  );
  const totalInterest = properties.reduce(
    (s, p) => s + p.expenses.mortgageInterest,
    0
  );
  const totalNonInterest = properties.reduce(
    (s, p) => s + sumNonInterestExpenses(p.expenses),
    0
  );

  // ── Step 1: net without interest ────────────────────────────────────────
  const netWithoutInterest = grossIncome - totalNonInterest;

  // ── Step 2: apply interest ──────────────────────────────────────────────
  const netFoncierBeforeDeficit = netWithoutInterest - totalInterest;

  // ── Déficit generated this year ─────────────────────────────────────────
  const deficitGeneratedThisYear = Math.max(0, -netFoncierBeforeDeficit);

  // otherPortion: deficit from non-interest charges only (imputable on revenu global)
  const rawOtherDeficit = Math.max(0, -netWithoutInterest);
  const deficitImputableOnRevenuGlobal = Math.min(
    rawOtherDeficit,
    MAX_DEFICIT_IMPUTABLE_ON_REVENU_GLOBAL
  );
  // interestPortion: remainder of the deficit (carry-forward foncier only)
  const deficitCarriedForward =
    deficitGeneratedThisYear - deficitImputableOnRevenuGlobal;

  // ── Step 3: apply previous-year deficits (oldest first) ─────────────────
  let netFoncierFinal = netFoncierBeforeDeficit;
  let deficitApplied = 0;

  // Sort oldest first so we consume them in order
  const sortedPrevious = [...previousDeficits].sort((a, b) => a.year - b.year);

  for (const prev of sortedPrevious) {
    if (netFoncierFinal <= 0) break; // nothing positive left to offset
    const available = prev.interestPortion + prev.otherPortion;
    const apply = Math.min(available, netFoncierFinal);
    deficitApplied += apply;
    netFoncierFinal -= apply;
  }

  return {
    grossIncome,
    totalDeductibleExpenses,
    netFoncierBeforeDeficit,
    deficitApplied,
    netFoncierFinal,
    deficitGeneratedThisYear,
    deficitImputableOnRevenuGlobal,
    deficitCarriedForward,
    breakdownPerProperty,
  };
}

// ─── recommendRegime ─────────────────────────────────────────────────────────

/**
 * Recommends the regime that produces the lower taxable income.
 * If micro is ineligible, always recommends réel.
 * Ties go to réel (more accurate reporting).
 */
export function recommendRegime(
  microResult: MicroResult,
  reelResult: ReelResult
): "micro" | "reel" {
  if (!microResult.eligibleForMicro) return "reel";
  return microResult.taxableIncome > reelResult.netFoncierFinal
    ? "reel"
    : "micro";
}

// ─── calculateTaxSavings ─────────────────────────────────────────────────────

/**
 * Returns the taxable income difference (in euros) between the two regimes.
 * Represents how much less taxable income the optimal regime produces.
 */
export function calculateTaxSavings(
  microResult: MicroResult,
  reelResult: ReelResult
): number {
  if (!microResult.eligibleForMicro) return 0;
  return Math.abs(microResult.taxableIncome - reelResult.netFoncierFinal);
}

// ─── runFullCalculation ───────────────────────────────────────────────────────

/**
 * Entry point: runs both regime calculations and returns the full result.
 */
export function runFullCalculation(input: TaxInputData): TaxCalculationResult {
  const microResult = calculateMicroFoncier(input.properties);
  const reelResult = calculateRegimeReel(
    input.properties,
    input.previousDeficits
  );
  const recommendation = recommendRegime(microResult, reelResult);
  const savingsWithOptimalRegime = calculateTaxSavings(microResult, reelResult);

  return {
    regime: recommendation,
    recommendation,
    microResult,
    reelResult,
    savingsWithOptimalRegime,
  };
}
