import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-[44px] items-center justify-center rounded border px-5 py-2.5 font-orbitron text-[10px] font-bold uppercase tracking-[0.14em] transition disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-[rgba(0,255,65,0.8)] bg-[#00FF41] text-[#003907] hover:shadow-[0_0_28px_rgba(0,255,65,0.45)]",
        outline: "border-[rgba(0,255,65,0.38)] bg-transparent text-[#00FF41] hover:bg-[rgba(0,255,65,0.08)]",
        ghost: "border-transparent bg-transparent text-[#DDFEEB] hover:bg-[rgba(221,254,235,0.06)]",
        danger: "border-[rgba(255,0,119,0.42)] bg-[rgba(255,0,119,0.10)] text-[#FFD0E2] hover:bg-[rgba(255,0,119,0.16)]",
      },
      size: {
        default: "h-11",
        sm: "h-9 px-3 text-[9px]",
        lg: "h-12 px-6 text-[11px]",
        icon: "h-10 w-10 px-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, ...props }, ref) => (
  <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
));
Button.displayName = "Button";

export { Button, buttonVariants };