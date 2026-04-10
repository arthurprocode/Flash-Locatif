import { cn } from "@/lib/utils";

interface RegimeBadgeProps {
  regime: "micro" | "reel";
  className?: string;
}

const LABELS: Record<RegimeBadgeProps["regime"], string> = {
  micro: "Micro-Foncier Recommandé",
  reel: "Régime Réel Recommandé",
};

/**
 * Large badge indicating the recommended tax regime.
 * Green for the recommended regime.
 */
export function RegimeBadge({ regime, className }: RegimeBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-5 py-2 text-base font-semibold",
        "bg-green-100 text-green-800 ring-1 ring-inset ring-green-200",
        className
      )}
    >
      <svg
        className="h-5 w-5 text-green-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
        aria-hidden
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      {LABELS[regime]}
    </span>
  );
}
