import { useState, useCallback } from "react";
import TimerDisplay from "@/components/TimerDisplay";
import TimerSetup from "@/components/TimerSetup";
import { useTimer } from "@/hooks/useTimer";
import { Button } from "@/components/ui/button";
import { Pause, Play, RotateCcw, Settings, X } from "lucide-react";
import { cn } from "@/lib/utils";

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

  const handleStart = (days: number, hours: number, minutes: number, seconds: number) => {
    timer.setTime(days, hours, minutes, seconds);
    setShowDays(days > 0);
    setTimeout(() => {
      timer.start();
      setIsFullPage(true);
    }, 100);
  };

  const handleReset = () => {
    timer.reset();
    setIsFullPage(false);
  };

  // Request notification permission
  if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
    Notification.requestPermission();
  }

  // Full page timer view
  if (isFullPage) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        </div>

        {/* Exit button */}
        <button
          onClick={handleReset}
          className="absolute top-6 right-6 p-3 rounded-full bg-secondary/50 hover:bg-secondary transition-colors group"
        >
          <X className="w-5 h-5 text-muted-foreground group-hover:text-foreground" />
        </button>

        {/* Timer status */}
        {timer.isComplete ? (
          <div className="text-center mb-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/20 border border-primary/30 mb-4">
              <span className="text-2xl">🎉</span>
              <span className="text-lg text-primary font-semibold">Time's Up!</span>
            </div>
          </div>
        ) : timer.isPaused ? (
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/30">
              <Pause className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Paused</span>
            </div>
          </div>
        ) : null}

        {/* Main timer display */}
        <div className={cn(
          "transition-all duration-500",
          timer.isComplete && "pulse-glow"
        )}>
          <TimerDisplay
            days={timer.days}
            hours={timer.hours}
            minutes={timer.minutes}
            seconds={timer.seconds}
            showDays={showDays}
            size="lg"
          />
        </div>

        {/* Controls */}
        <div className="mt-12 flex items-center gap-4">
          {!timer.isComplete && (
            <>
              {timer.isPaused ? (
                <Button
                  onClick={timer.resume}
                  size="lg"
                  className="h-14 px-8 btn-timer rounded-xl gap-2"
                >
                  <Play className="w-5 h-5" />
                  Resume
                </Button>
              ) : (
                <Button
                  onClick={timer.pause}
                  size="lg"
                  variant="secondary"
                  className="h-14 px-8 rounded-xl gap-2"
                >
                  <Pause className="w-5 h-5" />
                  Pause
                </Button>
              )}
            </>
          )}
          <Button
            onClick={handleReset}
            size="lg"
            variant="outline"
            className="h-14 px-8 rounded-xl gap-2 border-border/50 hover:bg-secondary/50"
          >
            <RotateCcw className="w-5 h-5" />
            New Timer
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
