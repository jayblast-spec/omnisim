import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center rounded border px-2.5 py-1 font-orbitron text-[8px] font-bold uppercase tracking-[0.14em]", {
  variants: {
    variant: {
      default: "border-[rgba(0,255,65,0.36)] bg-[rgba(0,255,65,0.10)] text-[#00FF41]",
      cyan: "border-[rgba(0,245,255,0.32)] bg-[rgba(0,245,255,0.08)] text-[#00F5FF]",
      pink: "border-[rgba(255,0,119,0.32)] bg-[rgba(255,0,119,0.08)] text-[#FF7DB5]",
      muted: "border-[rgba(221,254,235,0.12)] bg-[rgba(221,254,235,0.04)] text-[#B9CCB2]",
    },
  },
  defaultVariants: { variant: "default" },
});

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };