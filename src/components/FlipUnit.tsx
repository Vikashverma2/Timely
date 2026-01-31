import FlipDigit from "./FlipDigit";
import { cn } from "@/lib/utils";

interface FlipUnitProps {
  value: number;
  label: string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const FlipUnit = ({ value, label, size = "lg", showLabel = true }: FlipUnitProps) => {
  const displayValue = value.toString().padStart(2, "0");
  const digits = displayValue.split("");

  return (
    <div className="flex flex-col items-center gap-2 md:gap-4">
      <div className="flex gap-1 md:gap-2">
        {digits.map((digit, index) => (
          <FlipDigit key={`${label}-${index}`} value={digit} size={size} />
        ))}
      </div>
      {showLabel && (
        <span className={cn(
          "text-muted-foreground uppercase tracking-widest font-medium",
          size === "sm" && "text-[10px]",
          size === "md" && "text-xs",
          size === "lg" && "text-xs md:text-sm"
        )}>
          {label}
        </span>
      )}
    </div>
  );
};

export default FlipUnit;
