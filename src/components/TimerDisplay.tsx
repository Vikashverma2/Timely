import FlipUnit from "./FlipUnit";
import { cn } from "@/lib/utils";

interface TimerDisplayProps {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  showDays?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const Separator = ({ size = "lg" }: { size?: "sm" | "md" | "lg" }) => {
  const sizeClasses = {
    sm: "text-xl h-16",
    md: "text-3xl h-24 md:h-28",
    lg: "text-4xl md:text-6xl lg:text-7xl h-28 md:h-40 lg:h-52",
  };

  return (
    <div className={cn("flex flex-col justify-center items-center gap-3", sizeClasses[size])}>
      <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-primary/60" />
      <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-primary/60" />
    </div>
  );
};

const TimerDisplay = ({ 
  days, 
  hours, 
  minutes, 
  seconds, 
  showDays = false,
  size = "lg",
  className 
}: TimerDisplayProps) => {
  return (
    <div className={cn(
      "flex items-start justify-center gap-2 md:gap-4 lg:gap-6 timer-glow",
      className
    )}>
      {showDays && days > 0 && (
        <>
          <FlipUnit value={days} label="Days" size={size} />
          <Separator size={size} />
        </>
      )}
      <FlipUnit value={hours} label="Hours" size={size} />
      <Separator size={size} />
      <FlipUnit value={minutes} label="Minutes" size={size} />
      <Separator size={size} />
      <FlipUnit value={seconds} label="Seconds" size={size} />
    </div>
  );
};

export default TimerDisplay;
