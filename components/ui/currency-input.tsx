"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface CurrencyInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  value: number;
  onChange: (value: number) => void;
  label?: string;
}

/**
 * Euro-formatted numeric input.
 * Displays the value formatted as "1 240,00 €" and emits raw numbers.
 */
export function CurrencyInput({
  value,
  onChange,
  label,
  className,
  id,
  ...props
}: CurrencyInputProps) {
  const [focused, setFocused] = React.useState(false);
  const [raw, setRaw] = React.useState(value === 0 ? "" : String(value));

  // Keep raw in sync when value changes from outside while not focused
  React.useEffect(() => {
    if (!focused) {
      setRaw(value === 0 ? "" : String(value));
    }
  }, [value, focused]);

  const formatted = React.useMemo(
    () =>
      new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 2,
      }).format(value),
    [value]
  );

  function handleFocus() {
    setFocused(true);
    setRaw(value === 0 ? "" : String(value));
  }

  function handleBlur() {
    setFocused(false);
    const parsed = parseFloat(raw.replace(",", "."));
    const next = isNaN(parsed) ? 0 : Math.max(0, parsed);
    setRaw(next === 0 ? "" : String(next));
    onChange(next);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    // Allow digits, comma, dot, and minus
    const clean = e.target.value.replace(/[^\d,.-]/g, "");
    setRaw(clean);
  }

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          {...props}
          id={id}
          type="text"
          inputMode="decimal"
          value={focused ? raw : formatted}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          className={cn(
            "w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
            "text-right tabular-nums",
            "ring-offset-background placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
        />
      </div>
    </div>
  );
}
