import FlipDigit from "./FlipDigit";
import { cn } from "@/lib/utils";

interface FlipUnitProps {
  value: number;
  label: string;
  size?: "sm" | "md" | "lg" | "xl";
  showLabel?: boolean;
}

const FlipUnit = ({ value, label, size = "xl", showLabel = true }: FlipUnitProps) => {
  const displayValue = value.toString().padStart(2, "0");
  const digits = displayValue.split("");

  const gapClasses = {
    sm: "gap-1",
    md: "gap-2",
    lg: "gap-2 md:gap-3",
    xl: "gap-2 md:gap-3 lg:gap-4",
  };

  const labelClasses = {
    sm: "text-[10px] mt-2",
    md: "text-xs mt-3",
    lg: "text-xs md:text-sm mt-4",
    xl: "text-sm md:text-base lg:text-lg mt-4 md:mt-6",
  };

  return (
    <div className="flex flex-col items-center">
      <div className={cn("flex", gapClasses[size])}>
        {digits.map((digit, index) => (
          <FlipDigit key={`${label}-${index}`} value={digit} size={size} />
        ))}
      </div>
      {showLabel && (
        <span className={cn(
          "text-muted-foreground uppercase tracking-[0.3em] font-medium",
          labelClasses[size]
        )}>
          {label}
        </span>
      )}
    </div>
  );
};

export default FlipUnit;
