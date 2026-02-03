import { useState, useCallback, useEffect } from "react";
import TimerDisplay from "@/components/TimerDisplay";
import TimerSetup from "@/components/TimerSetup";
import { useTimer } from "@/hooks/useTimer";
import { Button } from "@/components/ui/button";
import { Pause, Play, RotateCcw, Settings, X } from "lucide-react";
import { cn } from "@/lib/utils";

import ThemeToggle from "@/components/ThemeToggle";

const Index = () => {
  const [isFullPage, setIsFullPage] = useState(false);
  const [showDays, setShowDays] = useState(false);

  const handleComplete = useCallback(() => {
    // Play a sound or show notification
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification("Timer Complete!", {
          body: "Your countdown has finished!",
          icon: "/favicon.ico",
        });
      }
    }
  }, []);

  const timer = useTimer({ onComplete: handleComplete });

  useEffect(() => {
    if (timer.isRunning || timer.isPaused || (timer.isComplete && timer.totalSeconds === 0)) {
      setIsFullPage(true);
      setShowDays(timer.days > 0);
    }
  }, []); // Run once on mount to restore view state

  const handleStart = (days: number, hours: number, minutes: number, seconds: number) => {
    timer.setTime(days, hours, minutes, seconds, true);
    setShowDays(days > 0);
    setIsFullPage(true);
  };

  const handleExit = () => {
    timer.reset();
    setIsFullPage(false);
  };

  const handleRestart = () => {
    timer.reset();
    timer.start();
  };
  if (isFullPage) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden w-full">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/3 rounded-full blur-[150px]" />
        </div>

        {/* Exit button */}
        <div className="absolute top-6 right-6 md:top-8 md:right-8 z-10 flex items-center gap-3">
          <ThemeToggle />
          <button
            onClick={handleExit}
            className="p-3 md:p-4 rounded-full bg-secondary/50 hover:bg-secondary border border-border/30 transition-all duration-300 group"
          >
            <X className="w-5 h-5 md:w-6 md:h-6 text-muted-foreground group-hover:text-foreground transition-colors" />
          </button>
        </div>

        {/* Timer status */}
        {timer.isComplete ? (
          <div className="text-center mb-6 md:mb-10 animate-fade-in-up relative z-10">
            <div className="inline-flex items-center gap-3 px-6 py-3 md:px-8 md:py-4 rounded-full bg-primary/20 border border-primary/30">
              <span className="text-2xl md:text-3xl">🎉</span>
              <span className="text-lg md:text-2xl text-primary font-semibold tracking-wide">Time's Up!</span>
            </div>
          </div>
        ) : timer.isPaused ? (
          <div className="text-center mb-6 md:mb-10 relative z-10">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary/50 border border-border/30">
              <Pause className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
              <span className="text-sm md:text-base text-muted-foreground font-medium">Paused</span>
            </div>
          </div>
        ) : null}

        {/* Main timer display - HUGE */}
        <div className={cn(
          "transition-all duration-500 relative z-10 w-full flex justify-center px-1 md:px-4", // Added padding control
          timer.isComplete && "pulse-glow"
        )}>
          <TimerDisplay
            days={timer.days}
            hours={timer.hours}
            minutes={timer.minutes}
            seconds={timer.seconds}
            showDays={showDays}
            size="xl"
            className="max-w-full scale-75 md:scale-90 lg:scale-100 origin-center" // Scaling fix for smaller screens
          />
        </div>

        {/* Controls */}
        <div className="mt-10 md:mt-16 flex items-center justify-center gap-4 md:gap-6 relative z-10 w-full px-4">
          {!timer.isComplete && (
            <>
              {timer.isPaused ? (
                <Button
                  onClick={timer.resume}
                  size="lg"
                  className="h-14 md:h-16 px-8 md:px-10 text-base md:text-lg btn-timer rounded-2xl gap-2 md:gap-3"
                >
                  <Play className="w-5 h-5 md:w-6 md:h-6" />
                  Resume
                </Button>
              ) : (
                <Button
                  onClick={timer.pause}
                  size="lg"
                  variant="secondary"
                  className="h-14 md:h-16 px-8 md:px-10 text-base md:text-lg rounded-2xl gap-2 md:gap-3 border border-border/50"
                >
                  <Pause className="w-5 h-5 md:w-6 md:h-6" />
                  Pause
                </Button>
              )}
            </>
          )}
          <Button
            onClick={handleRestart}
            size="lg"
            variant="outline"
            className="h-14 md:h-16 px-8 md:px-10 text-base md:text-lg rounded-2xl gap-2 md:gap-3 border-border/50 hover:bg-secondary/50"
          >
            <RotateCcw className="w-5 h-5 md:w-6 md:h-6" />
            Reset Timer
          </Button>
        </div>
      </div>
    );
  }

  // Split page view
  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row overflow-hidden">
      {/* Left side - Timer Preview */}
      <div className="w-full lg:w-1/2 min-h-[50vh] lg:min-h-screen flex flex-col items-center justify-center p-8 relative">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 text-center space-y-8">
          {/* Logo/Title */}
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-4">
              <Settings className="w-8 h-8 text-primary animate-spin-slow" style={{ animationDuration: "8s" }} />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Flip<span className="text-primary">Timer</span>
            </h1>
            <p className="text-muted-foreground max-w-sm mx-auto">
              Beautiful countdown timer for focus, productivity, and more
            </p>
          </div>

          {/* Preview timer */}
          <div className="opacity-40">
            <TimerDisplay
              days={0}
              hours={0}
              minutes={25}
              seconds={0}
              showDays={false}
              size="md"
            />
          </div>
        </div>
      </div>

      {/* Right side - Setup */}
      <div className="w-full lg:w-1/2 min-h-[50vh] lg:min-h-screen flex items-center justify-center p-8 bg-card/50 border-t lg:border-t-0 lg:border-l border-border/30">
        <TimerSetup onStart={handleStart} />
      </div>
    </div>
  );
};

export default Index;
