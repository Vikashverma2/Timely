import FlipUnit from "./FlipUnit";
import { cn } from "@/lib/utils";

interface TimerDisplayProps {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  showDays?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const Separator = ({ size = "xl" }: { size?: "sm" | "md" | "lg" | "xl" }) => {
  const sizeClasses = {
    sm: "h-16 gap-1.5",
    md: "h-24 md:h-28 gap-2",
    lg: "h-28 md:h-40 lg:h-48 gap-3",
    xl: "h-28 md:h-40 lg:h-52 xl:h-64 gap-3 md:gap-4",
  };

  const dotClasses = {
    sm: "w-1.5 h-1.5",
    md: "w-2 h-2 md:w-2.5 md:h-2.5",
    lg: "w-2.5 h-2.5 md:w-3 md:h-3",
    xl: "w-2.5 h-2.5 md:w-3 md:h-3 lg:w-4 lg:h-4",
  };

  return (
    <div className={cn("flex flex-col justify-center items-center", sizeClasses[size])}>
      <div className={cn("rounded-full bg-primary/70 shadow-lg shadow-primary/30", dotClasses[size])} />
      <div className={cn("rounded-full bg-primary/70 shadow-lg shadow-primary/30", dotClasses[size])} />
    </div>
  );
};

const TimerDisplay = ({ 
  days, 
  hours, 
  minutes, 
  seconds, 
  showDays = false,
  size = "xl",
  className 
}: TimerDisplayProps) => {
  const gapClasses = {
    sm: "gap-3",
    md: "gap-4 md:gap-6",
    lg: "gap-4 md:gap-6 lg:gap-8",
    xl: "gap-4 md:gap-6 lg:gap-8 xl:gap-10",
  };

  return (
    <div className={cn(
      "flex items-start justify-center timer-glow",
      gapClasses[size],
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
