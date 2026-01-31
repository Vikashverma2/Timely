import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface FlipDigitProps {
  value: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const FlipDigit = ({ value, size = "xl" }: FlipDigitProps) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [previousValue, setPreviousValue] = useState(value);
  const [isFlipping, setIsFlipping] = useState(false);
  const flipKey = useRef(0);

  useEffect(() => {
    if (value !== displayValue) {
      setPreviousValue(displayValue);
      setIsFlipping(true);
      flipKey.current += 1;
      
      const timer = setTimeout(() => {
        setDisplayValue(value);
      }, 300);

      const resetTimer = setTimeout(() => {
        setIsFlipping(false);
      }, 600);

      return () => {
        clearTimeout(timer);
        clearTimeout(resetTimer);
      };
    }
  }, [value, displayValue]);

  const sizeClasses = {
    sm: "w-14 h-20 text-4xl",
    md: "w-20 h-28 text-6xl md:w-24 md:h-36 md:text-7xl",
    lg: "w-24 h-36 text-7xl md:w-32 md:h-48 md:text-8xl lg:w-40 lg:h-56 lg:text-9xl",
    xl: "w-28 h-40 text-8xl md:w-40 md:h-56 md:text-9xl lg:w-52 lg:h-72 lg:text-[10rem] xl:w-60 xl:h-80 xl:text-[12rem]",
  };

  const textOffsets = {
    sm: "leading-[1.15]",
    md: "leading-[1.15]",
    lg: "leading-[1.15]",
    xl: "leading-[1.15]",
  };

  return (
    <div className={cn("flip-card relative", sizeClasses[size])}>
      <div className="flip-digit w-full h-full">
        {/* Static top half showing current value */}
        <div className="flip-half flip-half-top">
          <span className={cn("flip-digit-text", textOffsets[size])} style={{ transform: "translateY(50%)" }}>
            {displayValue}
          </span>
        </div>

        {/* Static bottom half showing current value */}
        <div className="flip-half flip-half-bottom">
          <span className={cn("flip-digit-text", textOffsets[size])} style={{ transform: "translateY(-50%)" }}>
            {displayValue}
          </span>
        </div>

        {/* Animated flip panels */}
        {isFlipping && (
          <>
            {/* Top panel flipping down (showing old value) */}
            <div
              key={`top-${flipKey.current}`}
              className="flip-panel flip-panel-top animate-flip-top flex items-end justify-center"
            >
              <span className={cn("flip-digit-text", textOffsets[size])} style={{ transform: "translateY(50%)" }}>
                {previousValue}
              </span>
            </div>

            {/* Bottom panel flipping down (showing new value) */}
            <div
              key={`bottom-${flipKey.current}`}
              className="flip-panel flip-panel-bottom animate-flip-bottom flex items-start justify-center"
            >
              <span className={cn("flip-digit-text", textOffsets[size])} style={{ transform: "translateY(-50%)" }}>
                {displayValue}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FlipDigit;
