import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { createElement, type ReactElement } from "react";
import type { DocumentProps } from "@react-pdf/renderer";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/api-helpers";
import { runFullCalculation } from "@/lib/tax-calculator";
import { Form2044Document } from "@/lib/pdf/form-2044";
import { DeclarationGuideDocument } from "@/lib/pdf/declaration-guide";
import type { Form2044Data } from "@/lib/pdf/form-2044";
import type { TaxInputData } from "@/lib/tax-calculator";

async function buildPdfData(
  declarationId: string,
  userId: string
): Promise<Form2044Data | null> {
  const declaration = await db.declaration.findUnique({
    where: { id: declarationId },
    include: {
      user: { select: { email: true } },
      properties: {
        orderBy: { order: "asc" },
        include: { income: true, expenses: true },
      },
      previousDeficits: { orderBy: { year: "asc" } },
    },
  });

  if (!declaration || declaration.userId !== userId || !declaration.paidAt) {
    return null;
  }

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

  return {
    taxYear: declaration.taxYear,
    userEmail: declaration.user.email,
    properties: declaration.properties.map((p) => ({
      name: p.name,
      grossRent: p.income?.grossRent ?? 0,
      rentChargesRecovered: p.income?.rentChargesRecovered ?? 0,
      mortgageInterest: p.expenses?.mortgageInterest ?? 0,
      propertyManagementFees: p.expenses?.propertyManagementFees ?? 0,
      landlordInsurance: p.expenses?.landlordInsurance ?? 0,
      propertyTax: p.expenses?.propertyTax ?? 0,
      maintenanceWorks: p.expenses?.maintenanceWorks ?? 0,
      condoFees: p.expenses?.condoFees ?? 0,
      accountingFees: p.expenses?.accountingFees ?? 0,
      otherDeductible: p.expenses?.otherDeductible ?? 0,
    })),
    previousDeficits: declaration.previousDeficits.map((d) => ({
      year: d.year,
      interestPortion: d.interestPortion,
      otherPortion: d.otherPortion,
    })),
    totalGrossIncome: result.reelResult.grossIncome,
    totalDeductibleExpenses: result.reelResult.totalDeductibleExpenses,
    netFoncierBeforeDeficit: result.reelResult.netFoncierBeforeDeficit,
    deficitApplied: result.reelResult.deficitApplied,
    netFoncierFinal: result.reelResult.netFoncierFinal,
    deficitGeneratedThisYear: result.reelResult.deficitGeneratedThisYear,
    deficitImputableOnRevenuGlobal: result.reelResult.deficitImputableOnRevenuGlobal,
    deficitCarriedForward: result.reelResult.deficitCarriedForward,
  };
}

// GET /api/declaration/[id]/generate-pdf?type=form|guide
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, response } = await requireAuth();
  if (response) return response;

  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") ?? "form";

  try {
    const data = await buildPdfData(id, session.user.id);

    if (!data) {
      return NextResponse.json(
        { success: false, error: "Déclaration introuvable ou paiement requis." },
        { status: 404 }
      );
    }

    const docElement = (
      type === "guide"
        ? createElement(DeclarationGuideDocument, { data })
        : createElement(Form2044Document, { data })
    ) as ReactElement<DocumentProps>;

    const buffer = await renderToBuffer(docElement);
    // NextResponse body requires BodyInit (Uint8Array), not Node Buffer
    const uint8 = new Uint8Array(buffer);

    const filename =
      type === "guide"
        ? `flash-locatif-guide-${data.taxYear}.pdf`
        : `flash-locatif-2044-${data.taxYear}.pdf`;

    return new NextResponse(uint8, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("[GET /api/declaration/[id]/generate-pdf]", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de la génération du PDF." },
      { status: 500 }
    );
  }
}

// POST kept for Stripe webhook compatibility (marks doc as generated)
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, response } = await requireAuth();
  if (response) return response;

  const { id } = await params;

  try {
    const declaration = await db.declaration.findUnique({
      where: { id },
      select: { userId: true, paidAt: true },
    });

    if (!declaration || declaration.userId !== session.user.id) {
      return NextResponse.json({ success: false, error: "Non trouvé" }, { status: 404 });
    }
    if (!declaration.paidAt) {
      return NextResponse.json(
        { success: false, error: "Paiement requis pour générer les documents." },
        { status: 402 }
      );
    }

    return NextResponse.json({ success: true, data: { status: "ready" } });
  } catch (error) {
    console.error("[POST /api/declaration/[id]/generate-pdf]", error);
    return NextResponse.json({ success: false, error: "Erreur serveur." }, { status: 500 });
  }
}
