import { z } from "zod";
import { db } from "@/lib/db";
import { ok, err, requireAuth } from "@/lib/api-helpers";

const createDeclarationSchema = z.object({
  taxYear: z.number().int().min(2020).max(2030),
});

/** POST /api/declaration — create a new declaration */
export async function POST(request: Request) {
  const { session, response } = await requireAuth();
  if (!session) return response;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return err("Corps de requête invalide", 400);
  }

  const parsed = createDeclarationSchema.safeParse(body);
  if (!parsed.success) {
    return err(parsed.error.issues[0]?.message ?? "Données invalides", 400);
  }

  const { taxYear } = parsed.data;

  // Check for existing declaration for this year
  const existing = await db.declaration.findUnique({
    where: { userId_taxYear: { userId: session.user.id, taxYear } },
  });
  if (existing) {
    return err(`Une déclaration pour ${taxYear} existe déjà`, 409);
  }

  const declaration = await db.declaration.create({
    data: { userId: session.user.id, taxYear },
  });

  return ok(declaration, 201);
}
