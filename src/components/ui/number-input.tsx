"use client";

import * as React from "react";
import { Input } from "./input";
import { formatNumberWithCommas, parseFormattedNumber } from "@/lib/utils";
import { cn } from "@/lib/utils";

export interface NumberInputProps
  extends Omit<
    React.ComponentProps<"input">,
    "value" | "onChange" | "type" | "prefix"
  > {
  value: number | undefined;
  onChange: (value: number) => void;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

function NumberInput({
  value,
  onChange,
  prefix,
  suffix,
  className,
  ...props
}: NumberInputProps) {
  const [displayValue, setDisplayValue] = React.useState(() =>
    value !== undefined ? formatNumberWithCommas(value) : ""
  );

  React.useEffect(() => {
    setDisplayValue(value !== undefined ? formatNumberWithCommas(value) : "");
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, "");
    setDisplayValue(rawValue ? formatNumberWithCommas(rawValue) : "");
    onChange(parseFormattedNumber(rawValue));
  };

  const hasAdornment = prefix || suffix;

  if (!hasAdornment) {
    return (
      <Input
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        className={className}
        {...props}
      />
    );
  }

  return (
    <div className="relative flex items-center">
      {prefix && (
        <span className="absolute left-3 text-muted-foreground pointer-events-none">
          {prefix}
        </span>
      )}
      <Input
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        className={cn(prefix && "pl-8", suffix && "pr-8", className)}
        {...props}
      />
      {suffix && (
        <span className="absolute right-3 text-muted-foreground pointer-events-none">
          {suffix}
        </span>
      )}
    </div>
  );
}

export { NumberInput };
