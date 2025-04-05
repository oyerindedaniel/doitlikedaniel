"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        gradient:
          "text-white overflow-hidden before:absolute before:inset-0 before:z-[-1] before:bg-gradient-to-r before:from-blue-500 before:to-purple-600 before:opacity-90 hover:before:opacity-100 transition-all duration-300",
        animated:
          "text-slate-900 dark:text-white relative overflow-hidden before:absolute before:left-0 before:bottom-0 before:h-[2px] before:w-0 before:bg-blue-500 before:transition-all before:duration-300 hover:before:w-full focus:before:w-full",
        ripple:
          "text-slate-900 dark:text-white relative overflow-hidden before:absolute before:inset-0 before:z-[-1] before:translate-x-[-100%] before:translate-y-0 before:bg-slate-100 before:opacity-0 dark:before:bg-slate-800 hover:before:translate-x-0 hover:before:opacity-100 before:transition-all before:duration-500 before:ease-out",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      asChild = false,
      leftElement,
      rightElement,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        {...props}
      >
        <span className="inline-flex items-center justify-center">
          {leftElement && <span className="mr-2">{leftElement}</span>}
          {children}
          {rightElement && <span className="ml-2">{rightElement}</span>}
        </span>
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
