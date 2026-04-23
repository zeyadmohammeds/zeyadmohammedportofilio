import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-sm border-2 border-border px-2.5 py-0.5 text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-[2px_2px_0px_0px_var(--color-foreground)]",
        secondary:
          "bg-secondary text-secondary-foreground shadow-[2px_2px_0px_0px_var(--color-foreground)]",
        destructive:
          "bg-destructive text-destructive-foreground shadow-[2px_2px_0px_0px_var(--color-foreground)]",
        outline: "text-foreground bg-background shadow-[2px_2px_0px_0px_var(--color-foreground)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
