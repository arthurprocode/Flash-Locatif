import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/api-helpers";

const propertySchema = z.object({
  id: z.string().nullable(),
  name: z.string().min(1, "Le nom du bien est requis"),
  order: z.number().int(),
});

const deficitSchema = z.object({
  id: z.string().nullable(),
  year: z.number().int().min(2010).max(2030),
  interestPortion: z.number().min(0),
  otherPortion: z.number().min(0),
});

const bodySchema = z.object({
  properties: z.array(propertySchema).min(1, "Au moins un bien est requis"),
  previousDeficits: z.array(deficitSchema),
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
      select: { userId: true },
    });
    if (!declaration || declaration.userId !== session.user.id) {
      return NextResponse.json({ success: false, error: "Non trouvé" }, { status: 404 });
    }

    const { properties, previousDeficits } = parsed.data;

    // Upsert properties in a transaction
    await db.$transaction(async (tx) => {
      // Get existing property IDs
      const existing = await tx.property.findMany({
        where: { declarationId: id },
        select: { id: true },
      });
      const existingIds = new Set(existing.map((p) => p.id));
      const incomingIds = new Set(properties.filter((p) => p.id).map((p) => p.id!));

      // Delete removed properties
      const toDelete = [...existingIds].filter((pid) => !incomingIds.has(pid));
      if (toDelete.length > 0) {
        await tx.property.deleteMany({ where: { id: { in: toDelete } } });
      }

      // Upsert each property
      for (const prop of properties) {
        if (prop.id && existingIds.has(prop.id)) {
          await tx.property.update({
            where: { id: prop.id },
            data: { name: prop.name, order: prop.order },
          });
        } else {
          await tx.property.create({
            data: { declarationId: id, name: prop.name, order: prop.order },
          });
        }
      }

      // Replace previous deficits
      await tx.previousDeficit.deleteMany({ where: { declarationId: id } });
      if (previousDeficits.length > 0) {
        await tx.previousDeficit.createMany({
          data: previousDeficits.map((d) => ({
            declarationId: id,
            year: d.year,
            interestPortion: d.interestPortion,
            otherPortion: d.otherPortion,
          })),
        });
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[PUT /api/declaration/[id]/step-1]", error);
    return NextResponse.json(
      { success: false, error: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}
