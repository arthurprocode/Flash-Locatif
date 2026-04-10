import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { StepProgress } from "@/components/ui/step-progress";
import { StepTwoForm } from "@/components/declaration/step-two-form";

const STEP_LABELS = ["Biens", "Revenus", "Charges", "Simulation", "Paiement"];

interface Props {
  params: Promise<{ id: string }>;
}

export default async function StepTwoPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const declaration = await db.declaration.findUnique({
    where: { id },
    include: {
      properties: {
        orderBy: { order: "asc" },
        include: { income: true },
      },
    },
  });

  if (!declaration || declaration.userId !== session.user.id) notFound();

  // Guard: must have properties set up first
  if (declaration.properties.length === 0) {
    redirect(`/declaration/${id}/step-1`);
  }

  return (
    <div className="space-y-6">
      <StepProgress current={2} total={5} labels={STEP_LABELS} />
      <div className="flex items-center justify-between">
        <Link href={`/declaration/${id}/step-1`} className="text-sm text-gray-500 hover:text-brand-600">
          ← Retour
        </Link>
      </div>
      <StepTwoForm declaration={declaration} />
    </div>
  );
}
