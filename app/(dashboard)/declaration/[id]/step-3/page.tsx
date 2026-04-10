import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { StepProgress } from "@/components/ui/step-progress";
import { StepThreeForm } from "@/components/declaration/step-three-form";

const STEP_LABELS = ["Biens", "Revenus", "Charges", "Simulation", "Paiement"];

interface Props {
  params: Promise<{ id: string }>;
}

export default async function StepThreePage({ params }: Props) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const declaration = await db.declaration.findUnique({
    where: { id },
    include: {
      properties: {
        orderBy: { order: "asc" },
        include: { expenses: true },
      },
    },
  });

  if (!declaration || declaration.userId !== session.user.id) notFound();
  if (declaration.properties.length === 0) redirect(`/declaration/${id}/step-1`);

  return (
    <div className="space-y-6">
      <StepProgress current={3} total={5} labels={STEP_LABELS} />
      <div className="flex items-center justify-between">
        <Link href={`/declaration/${id}/step-2`} className="text-sm text-gray-500 hover:text-brand-600">
          ← Retour
        </Link>
      </div>
      <StepThreeForm declaration={declaration} />
    </div>
  );
}
