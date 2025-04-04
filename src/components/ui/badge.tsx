import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
  "inline-flex items-center rounded-full text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-gray-100/80 text-gray-800 hover:bg-gray-200/90 dark:bg-gray-800/70 dark:text-gray-200 backdrop-blur-sm",
        primary:
          "bg-blue-50/80 text-blue-800 hover:bg-blue-100/90 dark:bg-blue-900/30 dark:text-blue-300 backdrop-blur-sm",
        secondary:
          "bg-purple-50/80 text-purple-800 hover:bg-purple-100/90 dark:bg-purple-900/30 dark:text-purple-300 backdrop-blur-sm",
        success:
          "bg-green-50/80 text-green-800 hover:bg-green-100/90 dark:bg-green-900/30 dark:text-green-300 backdrop-blur-sm",
        destructive:
          "bg-red-50/80 text-red-800 hover:bg-red-100/90 dark:bg-red-900/30 dark:text-red-300 backdrop-blur-sm",
        outline:
          "border border-gray-200/70 bg-white/50 text-gray-900 hover:bg-gray-100/60 dark:border-gray-800 dark:bg-gray-950/30 dark:text-gray-50 backdrop-blur-sm",
        subtle:
          "bg-white/30 text-gray-900 hover:bg-white/50 dark:bg-gray-800/30 dark:text-gray-50 backdrop-blur-sm",
        ghost:
          "bg-transparent text-gray-800 hover:bg-gray-100/50 dark:text-gray-200 dark:hover:bg-gray-800/30 backdrop-blur-sm",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-0.5 text-sm",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <span className={badgeVariants({ variant, size, className })} {...props} />
  );
}
