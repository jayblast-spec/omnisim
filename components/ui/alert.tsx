import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const alertVariants = cva("rounded border p-4 text-sm leading-6", {
  variants: {
    variant: {
      default: "border-[rgba(0,255,65,0.22)] bg-[rgba(0,255,65,0.07)] text-[#DDFEEB]",
      warning: "border-[rgba(255,184,0,0.26)] bg-[rgba(255,184,0,0.08)] text-[#F3DFA0]",
      danger: "border-[rgba(255,0,119,0.28)] bg-[rgba(255,0,119,0.08)] text-[#FFD0E2]",
    },
  },
  defaultVariants: { variant: "default" },
});

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(({ className, variant, ...props }, ref) => (
  <div ref={ref} role="status" className={cn(alertVariants({ variant }), className)} {...props} />
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => (
  <h5 ref={ref} className={cn("mb-1 font-orbitron text-[10px] font-bold uppercase tracking-[0.16em] text-[#F6FFF9]", className)} {...props} />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("text-xs font-semibold leading-6 text-inherit", className)} {...props} />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };