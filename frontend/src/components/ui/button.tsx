import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

// shadcn/ui-style button, with variants taken from the SK palette.
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-purple text-cream",
        red: "bg-red text-cream",
        blue: "bg-blue text-cream",
        yellow: "bg-yellow text-ink",
        outline: "border border-purple bg-transparent text-purple",
        ghost: "bg-transparent text-ink hover:bg-cream",
      },
      size: { default: "", sm: "px-3 py-1.5 text-xs" },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
  },
);
Button.displayName = "Button";
