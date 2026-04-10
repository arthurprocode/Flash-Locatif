import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/api-helpers";

const bodySchema = z.object({
  incomes: z.array(
    z.object({
      propertyId: z.string(),
      grossRent: z.number().min(0),
      rentChargesRecovered: z.number().min(0),
    })
  ),
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
      for (const inc of parsed.data.incomes) {
        if (!ownedPropertyIds.has(inc.propertyId)) continue;

        await tx.income.upsert({
          where: { propertyId: inc.propertyId },
          create: {
            propertyId: inc.propertyId,
            grossRent: inc.grossRent,
            rentChargesRecovered: inc.rentChargesRecovered,
          },
          update: {
            grossRent: inc.grossRent,
            rentChargesRecovered: inc.rentChargesRecovered,
          },
        });
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[PUT /api/declaration/[id]/step-2]", error);
    return NextResponse.json(
      { success: false, error: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}
