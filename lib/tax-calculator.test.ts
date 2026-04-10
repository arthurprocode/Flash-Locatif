/**
 * Unit tests for lib/tax-calculator.ts
 * All four scenarios from SPEC.md Section 4.4 must pass exactly.
 */
import { describe, it, expect } from "vitest";
import {
  calculateMicroFoncier,
  calculateRegimeReel,
  recommendRegime,
  calculateTaxSavings,
  runFullCalculation,
  MICRO_FONCIER_THRESHOLD,
  type Property,
  type PreviousDeficit,
} from "./tax-calculator";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeProperty(
  id: string,
  grossRent: number,
  expenses: Partial<{
    mortgageInterest: number;
    propertyManagementFees: number;
    landlordInsurance: number;
    propertyTax: number;
    maintenanceWorks: number;
    condoFees: number;
    accountingFees: number;
    otherDeductible: number;
  }> = {}
): Property {
  return {
    id,
    name: `Property ${id}`,
    income: { grossRent, rentChargesRecovered: 0 },
    expenses: {
      mortgageInterest: 0,
      propertyManagementFees: 0,
      landlordInsurance: 0,
      propertyTax: 0,
      maintenanceWorks: 0,
      condoFees: 0,
      accountingFees: 0,
      otherDeductible: 0,
      ...expenses,
    },
  };
}

// ─── calculateMicroFoncier ────────────────────────────────────────────────────

describe("calculateMicroFoncier", () => {
  it("Scenario A — applies 30% abatement and returns 70% as taxable income", () => {
    const props = [makeProperty("1", 6_000)];
    const result = calculateMicroFoncier(props);

    expect(result.grossIncome).toBe(6_000);
    expect(result.abatement).toBe(1_800); // 6000 * 0.30
    expect(result.taxableIncome).toBe(4_200); // 6000 * 0.70
    expect(result.eligibleForMicro).toBe(true);
  });

  it("marks ineligible when gross income >= 15,000€", () => {
    const props = [makeProperty("1", 15_000)];
    const result = calculateMicroFoncier(props);
    expect(result.eligibleForMicro).toBe(false);
  });

  it("marks eligible when gross income is just under 15,000€", () => {
    const props = [makeProperty("1", 14_999)];
    const result = calculateMicroFoncier(props);
    expect(result.eligibleForMicro).toBe(true);
  });

  it("pools income across multiple properties", () => {
    const props = [makeProperty("1", 5_000), makeProperty("2", 4_000)];
    const result = calculateMicroFoncier(props);
    expect(result.grossIncome).toBe(9_000);
    expect(result.taxableIncome).toBe(6_300); // 9000 * 0.70
  });
});

// ─── calculateRegimeReel ──────────────────────────────────────────────────────

describe("calculateRegimeReel", () => {
  it("Scenario B — deducts real expenses; réel taxable income < micro", () => {
    const props = [
      makeProperty("1", 12_000, {
        mortgageInterest: 3_000,
        maintenanceWorks: 2_000,
        propertyTax: 1_200,
        landlordInsurance: 600,
      }),
    ];
    const result = calculateRegimeReel(props, []);

    expect(result.grossIncome).toBe(12_000);
    expect(result.totalDeductibleExpenses).toBe(6_800);
    expect(result.netFoncierBeforeDeficit).toBe(5_200); // 12000 - 6800
    expect(result.netFoncierFinal).toBe(5_200);
    expect(result.deficitGeneratedThisYear).toBe(0);
    expect(result.deficitImputableOnRevenuGlobal).toBe(0);
    expect(result.deficitCarriedForward).toBe(0);
  });

  it("Scenario C — déficit comes entirely from interest → carry-forward only, 0€ on revenu global", () => {
    // grossRent=8000, interest=5000, works=6000
    // netWithoutInterest = 8000 - 6000 = +2000 (positive)
    // netFoncierBeforeDeficit = 2000 - 5000 = -3000
    // otherPortion deficit = 0 (netWithoutInterest > 0)
    // interestPortion deficit = 3000
    const props = [
      makeProperty("1", 8_000, {
        mortgageInterest: 5_000,
        maintenanceWorks: 6_000,
      }),
    ];
    const result = calculateRegimeReel(props, []);

    expect(result.grossIncome).toBe(8_000);
    expect(result.totalDeductibleExpenses).toBe(11_000);
    expect(result.netFoncierBeforeDeficit).toBe(-3_000);
    expect(result.netFoncierFinal).toBe(-3_000);
    expect(result.deficitGeneratedThisYear).toBe(3_000);
    expect(result.deficitImputableOnRevenuGlobal).toBe(0);
    expect(result.deficitCarriedForward).toBe(3_000);
  });

  it("Scenario D — déficit partly from non-interest → 4,000€ imputable on revenu global", () => {
    // grossRent=8000, interest=1000, works=12000
    // netWithoutInterest = 8000 - 12000 = -4000  → otherPortion = 4000
    // netFoncierBeforeDeficit = -4000 - 1000 = -5000
    // interestPortion = 5000 - 4000 = 1000
    const props = [
      makeProperty("1", 8_000, {
        mortgageInterest: 1_000,
        maintenanceWorks: 12_000,
      }),
    ];
    const result = calculateRegimeReel(props, []);

    expect(result.grossIncome).toBe(8_000);
    expect(result.totalDeductibleExpenses).toBe(13_000);
    expect(result.netFoncierBeforeDeficit).toBe(-5_000);
    expect(result.netFoncierFinal).toBe(-5_000);
    expect(result.deficitGeneratedThisYear).toBe(5_000);
    expect(result.deficitImputableOnRevenuGlobal).toBe(4_000);
    expect(result.deficitCarriedForward).toBe(1_000);
  });

  it("caps déficit imputable on revenu global at 10,750€", () => {
    // grossRent=5000, works=20000 → netWithoutInterest = -15000
    // otherDeficit capped at 10750
    const props = [makeProperty("1", 5_000, { maintenanceWorks: 20_000 })];
    const result = calculateRegimeReel(props, []);

    expect(result.deficitImputableOnRevenuGlobal).toBe(10_750);
    expect(result.deficitCarriedForward).toBe(15_000 - 10_750); // 4250
  });

  it("applies previous-year deficits to reduce positive net income", () => {
    const props = [makeProperty("1", 10_000, { maintenanceWorks: 2_000 })];
    const previous: PreviousDeficit[] = [
      { year: 2022, interestPortion: 1_000, otherPortion: 2_000 },
    ];
    const result = calculateRegimeReel(props, previous);

    // netFoncierBeforeDeficit = 10000 - 2000 = 8000
    // apply 3000 from previous → netFoncierFinal = 5000
    expect(result.netFoncierBeforeDeficit).toBe(8_000);
    expect(result.deficitApplied).toBe(3_000);
    expect(result.netFoncierFinal).toBe(5_000);
  });

  it("applies previous-year deficits oldest first and stops when income reaches 0", () => {
    const props = [makeProperty("1", 5_000)];
    const previous: PreviousDeficit[] = [
      { year: 2021, interestPortion: 0, otherPortion: 3_000 },
      { year: 2022, interestPortion: 0, otherPortion: 4_000 },
    ];
    const result = calculateRegimeReel(props, previous);

    // netFoncierBeforeDeficit = 5000
    // apply 3000 (2021) → 2000 remaining
    // apply 2000 of 4000 (2022) → 0
    expect(result.deficitApplied).toBe(5_000);
    expect(result.netFoncierFinal).toBe(0);
  });

  it("per-property breakdown sums correctly", () => {
    const props = [
      makeProperty("A", 6_000, { maintenanceWorks: 1_000 }),
      makeProperty("B", 8_000, { mortgageInterest: 2_000 }),
    ];
    const result = calculateRegimeReel(props, []);

    expect(result.breakdownPerProperty).toHaveLength(2);
    expect(result.breakdownPerProperty[0]).toMatchObject({
      propertyId: "A",
      grossIncome: 6_000,
      totalExpenses: 1_000,
      netIncome: 5_000,
    });
    expect(result.breakdownPerProperty[1]).toMatchObject({
      propertyId: "B",
      grossIncome: 8_000,
      totalExpenses: 2_000,
      netIncome: 6_000,
    });
  });
});

// ─── recommendRegime ─────────────────────────────────────────────────────────

describe("recommendRegime", () => {
  it("recommends micro when its taxable income is lower", () => {
    const micro = {
      grossIncome: 6_000,
      abatement: 1_800,
      taxableIncome: 4_200,
      eligibleForMicro: true,
    };
    const reel = {
      grossIncome: 6_000,
      totalDeductibleExpenses: 500,
      netFoncierBeforeDeficit: 5_500,
      deficitApplied: 0,
      netFoncierFinal: 5_500,
      deficitGeneratedThisYear: 0,
      deficitImputableOnRevenuGlobal: 0,
      deficitCarriedForward: 0,
      breakdownPerProperty: [],
    };
    expect(recommendRegime(micro, reel)).toBe("micro");
  });

  it("recommends réel when its taxable income is lower — Scenario B", () => {
    const micro = {
      grossIncome: 12_000,
      abatement: 3_600,
      taxableIncome: 8_400,
      eligibleForMicro: true,
    };
    const reel = {
      grossIncome: 12_000,
      totalDeductibleExpenses: 6_800,
      netFoncierBeforeDeficit: 5_200,
      deficitApplied: 0,
      netFoncierFinal: 5_200,
      deficitGeneratedThisYear: 0,
      deficitImputableOnRevenuGlobal: 0,
      deficitCarriedForward: 0,
      breakdownPerProperty: [],
    };
    expect(recommendRegime(micro, reel)).toBe("reel");
  });

  it("always recommends réel when micro is ineligible", () => {
    const micro = {
      grossIncome: 15_000,
      abatement: 4_500,
      taxableIncome: 10_500,
      eligibleForMicro: false,
    };
    const reel = {
      grossIncome: 15_000,
      totalDeductibleExpenses: 1_000,
      netFoncierBeforeDeficit: 14_000,
      deficitApplied: 0,
      netFoncierFinal: 14_000,
      deficitGeneratedThisYear: 0,
      deficitImputableOnRevenuGlobal: 0,
      deficitCarriedForward: 0,
      breakdownPerProperty: [],
    };
    expect(recommendRegime(micro, reel)).toBe("reel");
  });
});

// ─── calculateTaxSavings ──────────────────────────────────────────────────────

describe("calculateTaxSavings", () => {
  it("returns absolute difference between micro and réel taxable incomes", () => {
    const micro = {
      grossIncome: 12_000,
      abatement: 3_600,
      taxableIncome: 8_400,
      eligibleForMicro: true,
    };
    const reel = {
      grossIncome: 12_000,
      totalDeductibleExpenses: 6_800,
      netFoncierBeforeDeficit: 5_200,
      deficitApplied: 0,
      netFoncierFinal: 5_200,
      deficitGeneratedThisYear: 0,
      deficitImputableOnRevenuGlobal: 0,
      deficitCarriedForward: 0,
      breakdownPerProperty: [],
    };
    expect(calculateTaxSavings(micro, reel)).toBe(3_200); // 8400 - 5200
  });

  it("returns 0 when micro is ineligible", () => {
    const micro = {
      grossIncome: 15_000,
      abatement: 4_500,
      taxableIncome: 10_500,
      eligibleForMicro: false,
    };
    const reel = {
      grossIncome: 15_000,
      totalDeductibleExpenses: 1_000,
      netFoncierBeforeDeficit: 14_000,
      deficitApplied: 0,
      netFoncierFinal: 14_000,
      deficitGeneratedThisYear: 0,
      deficitImputableOnRevenuGlobal: 0,
      deficitCarriedForward: 0,
      breakdownPerProperty: [],
    };
    expect(calculateTaxSavings(micro, reel)).toBe(0);
  });
});

// ─── runFullCalculation — end-to-end scenarios ────────────────────────────────

describe("runFullCalculation", () => {
  it("Scenario A — micro recommended, taxable income = 4,200€", () => {
    const result = runFullCalculation({
      taxYear: 2024,
      properties: [makeProperty("1", 6_000)],
      previousDeficits: [],
    });

    expect(result.microResult.taxableIncome).toBe(4_200);
    expect(result.microResult.eligibleForMicro).toBe(true);
    expect(result.recommendation).toBe("micro");
  });

  it("Scenario B — réel recommended, réel taxable = 5,200€ vs micro 8,400€", () => {
    const result = runFullCalculation({
      taxYear: 2024,
      properties: [
        makeProperty("1", 12_000, {
          mortgageInterest: 3_000,
          maintenanceWorks: 2_000,
          propertyTax: 1_200,
          landlordInsurance: 600,
        }),
      ],
      previousDeficits: [],
    });

    expect(result.microResult.taxableIncome).toBe(8_400);
    expect(result.reelResult.netFoncierFinal).toBe(5_200);
    expect(result.recommendation).toBe("reel");
    expect(result.savingsWithOptimalRegime).toBe(3_200);
  });

  it("Scenario C — déficit foncier, 0€ imputable on revenu global", () => {
    const result = runFullCalculation({
      taxYear: 2024,
      properties: [
        makeProperty("1", 8_000, {
          mortgageInterest: 5_000,
          maintenanceWorks: 6_000,
        }),
      ],
      previousDeficits: [],
    });

    expect(result.reelResult.netFoncierFinal).toBe(-3_000);
    expect(result.reelResult.deficitImputableOnRevenuGlobal).toBe(0);
    expect(result.reelResult.deficitCarriedForward).toBe(3_000);
  });

  it("Scenario D — 4,000€ imputable on revenu global, 1,000€ carry-forward", () => {
    const result = runFullCalculation({
      taxYear: 2024,
      properties: [
        makeProperty("1", 8_000, {
          mortgageInterest: 1_000,
          maintenanceWorks: 12_000,
        }),
      ],
      previousDeficits: [],
    });

    expect(result.reelResult.netFoncierFinal).toBe(-5_000);
    expect(result.reelResult.deficitImputableOnRevenuGlobal).toBe(4_000);
    expect(result.reelResult.deficitCarriedForward).toBe(1_000);
  });

  it("ineligible for micro when income >= 15,000€ — réel always recommended", () => {
    const result = runFullCalculation({
      taxYear: 2024,
      properties: [makeProperty("1", MICRO_FONCIER_THRESHOLD)],
      previousDeficits: [],
    });
    expect(result.microResult.eligibleForMicro).toBe(false);
    expect(result.recommendation).toBe("reel");
  });
});
