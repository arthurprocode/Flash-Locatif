import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { StepProgress } from "@/components/ui/step-progress";
import { StepOneForm } from "@/components/declaration/step-one-form";

const STEP_LABELS = ["Biens", "Revenus", "Charges", "Simulation", "Paiement"];

interface Props {
  params: Promise<{ id: string }>;
}

export default async function StepOnePage({ params }: Props) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const declaration = await db.declaration.findUnique({
    where: { id },
    include: {
      properties: { orderBy: { order: "asc" }, select: { id: true, name: true, order: true } },
      previousDeficits: { orderBy: { year: "asc" }, select: { id: true, year: true, interestPortion: true, otherPortion: true } },
    },
  });

  if (!declaration || declaration.userId !== session.user.id) notFound();

  return (
    <div className="space-y-6">
      <StepProgress current={1} total={5} labels={STEP_LABELS} />
      <StepOneForm declaration={declaration} />
    </div>
  );
}
