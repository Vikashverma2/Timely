import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Clock, Timer, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

import ThemeToggle from "./ThemeToggle";

interface TimerSetupProps {
  onStart: (days: number, hours: number, minutes: number, seconds: number) => void;
}

const TimerSetup = ({ onStart }: TimerSetupProps) => {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);

  const handleStart = () => {
    if (days > 0 || hours > 0 || minutes > 0 || seconds > 0) {
      onStart(days, hours, minutes, seconds);
    }
  };

  const quickTimers = [
    { label: "5 min", minutes: 5, icon: "⚡" },
    { label: "15 min", minutes: 15, icon: "☕" },
    { label: "25 min", minutes: 25, icon: "🎯" },
    { label: "1 hour", minutes: 60, icon: "💪" },
  ];

  const inputClass = cn(
    "bg-secondary/50 border-border/50 text-center text-2xl font-display h-16",
    "text-foreground placeholder:text-muted-foreground",
    "focus:ring-2 focus:ring-primary/50 focus:border-primary",
    "transition-all duration-200"
  );

  return (
    <div className="w-full max-w-md mx-auto space-y-8 animate-fade-in-up relative">
      <div className="absolute -top-12 right-0 md:top-0 md:right-0">
        <ThemeToggle />
      </div>
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
          <Timer className="w-4 h-4 text-primary" />
          <span className="text-sm text-primary font-medium">Set Your Timer</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">
          How long do you need?
        </h2>
        <p className="text-muted-foreground text-sm">
          Set your countdown and stay focused
        </p>
      </div>

      {/* Quick timers */}
      <div className="grid grid-cols-4 gap-2">
        {quickTimers.map((timer) => (
          <button
            key={timer.label}
            onClick={() => {
              setDays(0);
              setHours(Math.floor(timer.minutes / 60));
              setMinutes(timer.minutes % 60);
              setSeconds(0);
            }}
            className={cn(
              "flex flex-col items-center gap-1 p-3 rounded-xl",
              "bg-secondary/30 border border-border/30",
              "hover:bg-secondary/50 hover:border-primary/30",
              // Selected state styles
              days === 0 &&
              hours === Math.floor(timer.minutes / 60) &&
              minutes === (timer.minutes % 60) &&
              seconds === 0 &&
              "border-primary bg-secondary/80 shadow-[0_0_15px_rgba(var(--primary),0.15)]",
              "transition-all duration-200 group"
            )}
          >
            <span className={cn(
              "text-lg transition-transform",
              days === 0 &&
                hours === Math.floor(timer.minutes / 60) &&
                minutes === (timer.minutes % 60) &&
                seconds === 0 ? "scale-110" : "group-hover:scale-110"
            )}>
              {timer.icon}
            </span>
            <span className={cn(
              "text-xs transition-colors",
              days === 0 &&
                hours === Math.floor(timer.minutes / 60) &&
                minutes === (timer.minutes % 60) &&
                seconds === 0 ? "text-foreground font-medium" : "text-muted-foreground group-hover:text-foreground"
            )}>
              {timer.label}
            </span>
          </button>
        ))}
      </div>

      {/* Time inputs */}
      <div className="grid grid-cols-4 gap-3">
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground uppercase tracking-wider text-center block">
            Days
          </Label>
          <Input
            type="number"
            min="0"
            max="99"
            value={days}
            onChange={(e) => setDays(Math.max(0, parseInt(e.target.value) || 0))}
            className={inputClass}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground uppercase tracking-wider text-center block">
            Hours
          </Label>
          <Input
            type="number"
            min="0"
            max="23"
            value={hours}
            onChange={(e) => setHours(Math.min(23, Math.max(0, parseInt(e.target.value) || 0)))}
            className={inputClass}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground uppercase tracking-wider text-center block">
            Min
          </Label>
          <Input
            type="number"
            min="0"
            max="59"
            value={minutes}
            onChange={(e) => setMinutes(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))}
            className={inputClass}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground uppercase tracking-wider text-center block">
            Sec
          </Label>
          <Input
            type="number"
            min="0"
            max="59"
            value={seconds}
            onChange={(e) => setSeconds(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))}
            className={inputClass}
          />
        </div>
      </div>

      {/* Start button */}
      <Button
        onClick={handleStart}
        className="w-full h-14 text-lg font-semibold btn-timer rounded-xl"
        disabled={days === 0 && hours === 0 && minutes === 0 && seconds === 0}
      >
        <Sparkles className="w-5 h-5 mr-2" />
        Start Timer
      </Button>

      {/* Tip */}
      <p className="text-center text-xs text-muted-foreground">
        <Clock className="w-3 h-3 inline mr-1" />
        Tip: Use the Pomodoro technique (25 min work, 5 min break)
      </p>
    </div>
  );
};

export default TimerSetup;
