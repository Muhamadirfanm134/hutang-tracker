import React, { ReactNode } from "react";
import clsx from "clsx";

type DetailItemProps = {
  label: ReactNode;
  value?: ReactNode;
  className?: string;
  valueClassName?: string;
};

export function DetailItem({ label, value, className, valueClassName }: DetailItemProps) {
  return (
    <div className={clsx("flex justify-between gap-4", className)}>
      <div className="text-muted-foreground">{label}</div>

      <div className={clsx("text-right font-medium", valueClassName)}>{value ?? "-"}</div>
    </div>
  );
}
