import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-medium transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-1 focus-visible:ring-primary uppercase tracking-wider font-mono",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:shadow-[0_0_20px_rgba(255,77,77,0.6)] hover:bg-primary/90 border border-transparent",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 hover:shadow-[0_0_20px_rgba(255,77,77,0.6)]",
        outline:
          "border border-white/20 bg-white/5 text-foreground hover:bg-white/10 hover:border-primary/50 hover:text-primary hover:shadow-[0_0_15px_rgba(255,77,77,0.3)] backdrop-blur-sm",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-white/10 hover:text-primary hover:shadow-[0_0_15px_rgba(255,77,77,0.2)]",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-6 py-2 has-[>svg]:px-4",
        sm: "h-9 rounded-sm gap-1.5 px-3 has-[>svg]:px-2.5 text-xs",
        lg: "h-12 rounded-sm px-8 has-[>svg]:px-6 text-base",
        icon: "size-10 rounded-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
