import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface TooltipLabelProps {
  label: string;
  tooltip: string;
  htmlFor?: string;
  className?: string;
  required?: boolean;
}

/**
 * Form label with an inline info-icon tooltip for tax explanations.
 */
export function TooltipLabel({
  label,
  tooltip,
  htmlFor,
  className,
  required,
}: TooltipLabelProps) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <label
        htmlFor={htmlFor}
        className="text-sm font-medium leading-none text-gray-700"
      >
        {label}
        {required && <span className="ml-0.5 text-error">*</span>}
      </label>

      <Tooltip>
        <TooltipTrigger
          aria-label={`En savoir plus : ${label}`}
          className="inline-flex h-4 w-4 items-center justify-center rounded-full text-gray-400 hover:text-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-4 w-4"
            aria-hidden
          >
            <path
              fillRule="evenodd"
              d="M2.25 12a9.75 9.75 0 1119.5 0 9.75 9.75 0 01-19.5 0zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
              clipRule="evenodd"
            />
          </svg>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="max-w-xs text-sm leading-relaxed"
        >
          {tooltip}
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
