import { cn } from "@/lib/utils";

interface StepProgressProps {
  current: number; // 1-based
  total: number;
  labels?: string[];
  className?: string;
}

/**
 * Wizard step progress bar.
 * Shows numbered steps; completed steps are filled, current is highlighted.
 */
export function StepProgress({
  current,
  total,
  labels,
  className,
}: StepProgressProps) {
  return (
    <nav
      aria-label="Étapes de déclaration"
      className={cn("flex items-center gap-0", className)}
    >
      {Array.from({ length: total }, (_, i) => {
        const step = i + 1;
        const isCompleted = step < current;
        const isCurrent = step === current;

        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            {/* Circle */}
            <div className="flex flex-col items-center">
              <div
                aria-current={isCurrent ? "step" : undefined}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                  isCompleted &&
                    "bg-brand-600 text-white",
                  isCurrent &&
                    "bg-brand-600 text-white ring-4 ring-brand-100",
                  !isCompleted &&
                    !isCurrent &&
                    "bg-gray-200 text-gray-500"
                )}
              >
                {isCompleted ? (
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  step
                )}
              </div>
              {labels?.[i] && (
                <span
                  className={cn(
                    "mt-1 hidden text-xs sm:block",
                    isCurrent ? "font-semibold text-brand-600" : "text-gray-400"
                  )}
                >
                  {labels[i]}
                </span>
              )}
            </div>

            {/* Connector line (hidden after last step) */}
            {step < total && (
              <div
                className={cn(
                  "h-0.5 flex-1 mx-1 transition-colors",
                  isCompleted ? "bg-brand-600" : "bg-gray-200"
                )}
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}
