import { z } from "zod";
import { db } from "@/lib/db";
import { ok, err, requireAuth } from "@/lib/api-helpers";

const createPropertySchema = z.object({
  name: z.string().min(1).max(100),
  order: z.number().int().min(0).optional(),
  income: z.object({
    grossRent: z.number().min(0),
    rentChargesRecovered: z.number().min(0).default(0),
  }),
  expenses: z.object({
    mortgageInterest: z.number().min(0).default(0),
    propertyManagementFees: z.number().min(0).default(0),
    landlordInsurance: z.number().min(0).default(0),
    propertyTax: z.number().min(0).default(0),
    maintenanceWorks: z.number().min(0).default(0),
    condoFees: z.number().min(0).default(0),
    accountingFees: z.number().min(0).default(0),
    otherDeductible: z.number().min(0).default(0),
  }),
});

/** POST /api/declaration/[id]/property */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, response } = await requireAuth();
  if (!session) return response;

  const { id: declarationId } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return err("Corps de requête invalide", 400);
  }

  const parsed = createPropertySchema.safeParse(body);
  if (!parsed.success) {
    return err(parsed.error.issues[0]?.message ?? "Données invalides", 400);
  }

  try {
    // Verify ownership
    const declaration = await db.declaration.findUnique({
      where: { id: declarationId },
    });
    if (!declaration) return err("Déclaration introuvable", 404);
    if (declaration.userId !== session.user.id) return err("Accès refusé", 403);

    const { name, order, income, expenses } = parsed.data;

    const property = await db.property.create({
      data: {
        declarationId,
        name,
        order: order ?? 0,
        income: { create: income },
        expenses: { create: expenses },
      },
      include: { income: true, expenses: true },
    });

    return ok(property, 201);
  } catch (e) {
    console.error("[POST /api/declaration/[id]/property]", e);
    return err("Erreur serveur", 500);
  }
}
