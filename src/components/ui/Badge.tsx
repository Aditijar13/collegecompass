import { cn } from "@/lib/utils";

const variants = {
  default: "bg-secondary text-secondary-foreground",
  brand: "bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300",
  accent: "bg-accent/15 text-accent-700 dark:text-accent-300",
  success: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  warning: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  destructive: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  outline: "border border-border text-muted-foreground",
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: keyof typeof variants;
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span className={cn("badge", variants[variant], className)}>{children}</span>
  );
}
