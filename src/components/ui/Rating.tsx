import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  className?: string;
}

export function Rating({ value, max = 5, size = "md", showValue = true, className }: RatingProps) {
  const sizes = { sm: "w-3 h-3", md: "w-4 h-4", lg: "w-5 h-5" };
  const textSizes = { sm: "text-xs", md: "text-sm", lg: "text-base" };
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex gap-0.5">
        {Array.from({ length: max }).map((_, i) => (
          <Star key={i} className={cn(sizes[size], i < Math.round(value) ? "fill-amber-400 text-amber-400" : "fill-muted text-muted")} />
        ))}
      </div>
      {showValue && <span className={cn("font-semibold text-foreground", textSizes[size])}>{value.toFixed(1)}</span>}
    </div>
  );
}
