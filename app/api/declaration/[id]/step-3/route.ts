import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/api-helpers";

const expensesSchema = z.object({
  propertyId: z.string(),
  mortgageInterest: z.number().min(0),
  propertyManagementFees: z.number().min(0),
  landlordInsurance: z.number().min(0),
  propertyTax: z.number().min(0),
  maintenanceWorks: z.number().min(0),
  condoFees: z.number().min(0),
  accountingFees: z.number().min(0),
  otherDeductible: z.number().min(0),
});

const bodySchema = z.object({
  expenses: z.array(expensesSchema),
});

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, response } = await requireAuth();
  if (response) return response;

  const { id } = await params;

  try {
    const body: unknown = await request.json();
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    // Verify ownership
    const declaration = await db.declaration.findUnique({
      where: { id },
      select: { userId: true, properties: { select: { id: true } } },
    });
    if (!declaration || declaration.userId !== session.user.id) {
      return NextResponse.json({ success: false, error: "Non trouvé" }, { status: 404 });
    }

    const ownedPropertyIds = new Set(declaration.properties.map((p) => p.id));

    await db.$transaction(async (tx) => {
      for (const exp of parsed.data.expenses) {
        if (!ownedPropertyIds.has(exp.propertyId)) continue;
        const { propertyId, ...data } = exp;
        await tx.expenses.upsert({
          where: { propertyId },
          create: { propertyId, ...data },
          update: data,
        });
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[PUT /api/declaration/[id]/step-3]", error);
    return NextResponse.json(
      { success: false, error: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}
