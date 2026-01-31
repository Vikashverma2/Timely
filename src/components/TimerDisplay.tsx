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
    sm: "h-20 gap-2",
    md: "h-28 md:h-36 gap-3",
    lg: "h-36 md:h-48 lg:h-56 gap-4",
    xl: "h-40 md:h-56 lg:h-72 xl:h-80 gap-4 md:gap-5 lg:gap-6",
  };

  const dotClasses = {
    sm: "w-2 h-2",
    md: "w-2.5 h-2.5 md:w-3 md:h-3",
    lg: "w-3 h-3 md:w-4 md:h-4",
    xl: "w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5",
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
