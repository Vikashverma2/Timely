import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface FlipDigitProps {
  value: string;
  size?: "sm" | "md" | "lg";
}

const FlipDigit = ({ value, size = "lg" }: FlipDigitProps) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [previousValue, setPreviousValue] = useState(value);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (value !== displayValue) {
      setPreviousValue(displayValue);
      setIsFlipping(true);
      
      const timer = setTimeout(() => {
        setDisplayValue(value);
        setIsFlipping(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [value, displayValue]);

  const sizeClasses = {
    sm: "w-12 h-16 text-3xl",
    md: "w-16 h-24 text-5xl md:w-20 md:h-28 md:text-6xl",
    lg: "w-20 h-28 text-6xl md:w-28 md:h-40 md:text-8xl lg:w-36 lg:h-52 lg:text-9xl",
  };

  return (
    <div className={cn("flip-card", sizeClasses[size])}>
      <div className="flip-digit w-full h-full flex flex-col">
        {/* Upper half */}
        <div className="flip-upper h-1/2 flex items-end justify-center overflow-hidden">
          <span 
            className={cn(
              "flip-digit-text translate-y-1/2 leading-none",
              isFlipping && "flip-animate-top"
            )}
          >
            {isFlipping ? previousValue : displayValue}
          </span>
        </div>
        
        {/* Lower half */}
        <div className="flip-lower h-1/2 flex items-start justify-center overflow-hidden">
          <span 
            className={cn(
              "flip-digit-text -translate-y-1/2 leading-none",
              isFlipping && "flip-animate-bottom"
            )}
          >
            {displayValue}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FlipDigit;
