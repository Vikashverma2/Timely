import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

const FlipDigit = ({ value, size = "xl" }) => {
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
        sm: "w-12 h-16 text-3xl",
        md: "w-16 h-24 text-5xl md:w-20 md:h-28 md:text-6xl",
        lg: "w-20 h-28 text-6xl md:w-28 md:h-40 md:text-7xl lg:w-32 lg:h-48 lg:text-8xl",
        xl: "w-20 h-28 text-6xl md:w-28 md:h-40 md:text-7xl lg:w-36 lg:h-52 lg:text-8xl xl:w-36 xl:h-52 xl:text-8xl 2xl:w-44 2xl:h-64 2xl:text-9xl",
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
