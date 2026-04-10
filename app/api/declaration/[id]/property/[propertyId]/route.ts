import { z } from "zod";
import { db } from "@/lib/db";
import { ok, err, requireAuth } from "@/lib/api-helpers";

const updatePropertySchema = z.object({
  name: z.string().min(1).max(100).optional(),
  order: z.number().int().min(0).optional(),
  income: z
    .object({
      grossRent: z.number().min(0).optional(),
      rentChargesRecovered: z.number().min(0).optional(),
    })
    .optional(),
  expenses: z
    .object({
      mortgageInterest: z.number().min(0).optional(),
      propertyManagementFees: z.number().min(0).optional(),
      landlordInsurance: z.number().min(0).optional(),
      propertyTax: z.number().min(0).optional(),
      maintenanceWorks: z.number().min(0).optional(),
      condoFees: z.number().min(0).optional(),
      accountingFees: z.number().min(0).optional(),
      otherDeductible: z.number().min(0).optional(),
    })
    .optional(),
});

/** Helper: fetch a property and verify ownership via declaration */
async function getOwnedProperty(
  propertyId: string,
  declarationId: string,
  userId: string
) {
  const property = await db.property.findUnique({
    where: { id: propertyId },
    include: { declaration: true, income: true, expenses: true },
  });
  if (!property) return { property: null, forbidden: false };
  if (
    property.declarationId !== declarationId ||
    property.declaration.userId !== userId
  ) {
    return { property: null, forbidden: true };
  }
  return { property, forbidden: false };
}

/** PUT /api/declaration/[id]/property/[propertyId] */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string; propertyId: string }> }
) {
  const { session, response } = await requireAuth();
  if (!session) return response;

  const { id: declarationId, propertyId } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return err("Corps de requête invalide", 400);
  }

  const parsed = updatePropertySchema.safeParse(body);
  if (!parsed.success) {
    return err(parsed.error.issues[0]?.message ?? "Données invalides", 400);
  }

  try {
    const { property, forbidden } = await getOwnedProperty(
      propertyId,
      declarationId,
      session.user.id
    );
    if (forbidden) return err("Accès refusé", 403);
    if (!property) return err("Propriété introuvable", 404);

    const { name, order, income, expenses } = parsed.data;

    const updated = await db.property.update({
      where: { id: propertyId },
      data: {
        ...(name !== undefined && { name }),
        ...(order !== undefined && { order }),
        ...(income && { income: { update: income } }),
        ...(expenses && { expenses: { update: expenses } }),
      },
      include: { income: true, expenses: true },
    });

    return ok(updated);
  } catch (e) {
    console.error("[PUT /api/declaration/[id]/property/[propertyId]]", e);
    return err("Erreur serveur", 500);
  }
}

/** DELETE /api/declaration/[id]/property/[propertyId] */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; propertyId: string }> }
) {
  const { session, response } = await requireAuth();
  if (!session) return response;

  const { id: declarationId, propertyId } = await params;

  try {
    const { property, forbidden } = await getOwnedProperty(
      propertyId,
      declarationId,
      session.user.id
    );
    if (forbidden) return err("Accès refusé", 403);
    if (!property) return err("Propriété introuvable", 404);

    await db.property.delete({ where: { id: propertyId } });
    return ok({ deleted: true });
  } catch (e) {
    console.error("[DELETE /api/declaration/[id]/property/[propertyId]]", e);
    return err("Erreur serveur", 500);
  }
}
