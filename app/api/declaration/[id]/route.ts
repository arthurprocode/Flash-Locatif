import { z } from "zod";
import { db } from "@/lib/db";
import { ok, err, requireAuth } from "@/lib/api-helpers";

const updateDeclarationSchema = z.object({
  taxYear: z.number().int().min(2020).max(2030).optional(),
  status: z.enum(["DRAFT", "COMPLETED", "PAID"]).optional(),
});

/** Helper: fetch a declaration and verify ownership */
async function getOwnedDeclaration(id: string, userId: string) {
  const declaration = await db.declaration.findUnique({
    where: { id },
    include: {
      properties: { include: { income: true, expenses: true } },
      previousDeficits: true,
      documents: true,
    },
  });
  if (!declaration) return { declaration: null, forbidden: false };
  if (declaration.userId !== userId) return { declaration: null, forbidden: true };
  return { declaration, forbidden: false };
}

/** GET /api/declaration/[id] */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, response } = await requireAuth();
  if (!session) return response;

  const { id } = await params;

  try {
    const { declaration, forbidden } = await getOwnedDeclaration(
      id,
      session.user.id
    );
    if (forbidden) return err("Accès refusé", 403);
    if (!declaration) return err("Déclaration introuvable", 404);

    return ok(declaration);
  } catch (e) {
    console.error("[GET /api/declaration/[id]]", e);
    return err("Erreur serveur", 500);
  }
}

/** PUT /api/declaration/[id] */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, response } = await requireAuth();
  if (!session) return response;

  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return err("Corps de requête invalide", 400);
  }

  const parsed = updateDeclarationSchema.safeParse(body);
  if (!parsed.success) {
    return err(parsed.error.issues[0]?.message ?? "Données invalides", 400);
  }

  try {
    const { declaration, forbidden } = await getOwnedDeclaration(
      id,
      session.user.id
    );
    if (forbidden) return err("Accès refusé", 403);
    if (!declaration) return err("Déclaration introuvable", 404);

    const updated = await db.declaration.update({
      where: { id },
      data: parsed.data,
    });
    return ok(updated);
  } catch (e) {
    console.error("[PUT /api/declaration/[id]]", e);
    return err("Erreur serveur", 500);
  }
}
