"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap cursor-pointer rounded-3xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/80",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 dark:bg-destructive dark:text-destructive-foreground dark:hover:bg-destructive/80",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-200",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-slate-800 dark:hover:text-slate-200",
        link: "text-primary underline-offset-4 hover:underline dark:text-blue-400 dark:hover:text-blue-300",
        gradient:
          "text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 dark:from-blue-600 dark:to-purple-700 dark:hover:from-blue-700 dark:hover:to-purple-800",
        animated:
          "text-slate-900 dark:text-white relative overflow-hidden before:absolute before:left-0 before:bottom-0 before:h-[2px] before:w-0 before:bg-blue-500 before:transition-all before:duration-300 hover:before:w-full focus:before:w-full dark:before:bg-blue-400",
        ripple:
          "text-slate-900 dark:text-white relative overflow-hidden before:absolute before:inset-0 before:z-[-1] before:translate-x-[-100%] before:translate-y-0 before:bg-slate-100 before:opacity-0 dark:before:bg-slate-800 hover:before:translate-x-0 hover:before:opacity-100 before:transition-all before:duration-500 before:ease-out",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
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
      // TODO: improve this
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
