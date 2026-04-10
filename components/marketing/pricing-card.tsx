import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface PricingCardProps {
  name: string;
  price: number; // in euros per year
  features: string[];
  recommended?: boolean;
  ctaLabel?: string;
  ctaHref?: string;
  onCtaClick?: () => void;
  className?: string;
}

/**
 * Pricing plan card for the landing page and payment step.
 * Highlighted with a blue border and "Recommandé" badge when recommended=true.
 * When onCtaClick is provided, renders a button instead of an anchor.
 */
export function PricingCard({
  name,
  price,
  features,
  recommended = false,
  ctaLabel = "Commencer",
  ctaHref = "/register",
  onCtaClick,
  className,
}: PricingCardProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl border bg-white p-8 shadow-sm transition-shadow hover:shadow-md",
        recommended
          ? "border-brand-600 ring-2 ring-brand-600"
          : "border-border",
        className
      )}
    >
      {/* Recommended badge */}
      {recommended && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white shadow-sm">
            Recommandé
          </span>
        </div>
      )}

      {/* Plan name */}
      <h3 className="text-lg font-bold text-gray-900">{name}</h3>

      {/* Price */}
      <div className="mt-4 flex items-baseline gap-1">
        <span className="text-4xl font-extrabold text-gray-900">{price}€</span>
        <span className="text-sm text-gray-500">/an</span>
      </div>

      {/* Features */}
      <ul className="mt-6 flex flex-col gap-3 flex-1">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-gray-600">
            <svg
              className="mt-0.5 h-4 w-4 shrink-0 text-brand-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            {feature}
          </li>
        ))}
      </ul>

      {/* CTA */}
      {onCtaClick ? (
        <Button
          type="button"
          onClick={onCtaClick}
          className={cn(
            "mt-8 w-full",
            recommended
              ? "bg-brand-600 hover:bg-brand-700 text-white"
              : "bg-white border border-brand-600 text-brand-600 hover:bg-brand-50"
          )}
        >
          {ctaLabel}
        </Button>
      ) : (
        <a href={ctaHref} className="mt-8 block">
          <Button
            className={cn(
              "w-full",
              recommended
                ? "bg-brand-600 hover:bg-brand-700 text-white"
                : "bg-white border border-brand-600 text-brand-600 hover:bg-brand-50"
            )}
          >
            {ctaLabel}
          </Button>
        </a>
      )}
    </div>
  );
}
