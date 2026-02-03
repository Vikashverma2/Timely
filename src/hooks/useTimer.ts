import { useState, useEffect, useCallback, useRef } from "react";

interface UseTimerProps {
  initialDays?: number;
  initialHours?: number;
  initialMinutes?: number;
  initialSeconds?: number;
  onComplete?: () => void;
}

interface UseTimerReturn {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  isRunning: boolean;
  isPaused: boolean;
  isComplete: boolean;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  setTime: (days: number, hours: number, minutes: number, seconds: number, autoStart?: boolean) => void;
}

const STORAGE_KEY = "flip-timer-state";

interface TimerState {
  status: "idle" | "running" | "paused" | "complete";
  targetTime: number | null; // Timestamp when timer ends (for running state)
  remainingTime: number; // Remaining seconds (for paused/idle state)
  initialTotalSeconds: number;
}

export const useTimer = ({
  initialDays = 0,
  initialHours = 0,
  initialMinutes = 0,
  initialSeconds = 0,
  onComplete,
}: UseTimerProps = {}): UseTimerReturn => {
  const calculateTotalSeconds = useCallback(
    (d: number, h: number, m: number, s: number) => {
      return d * 86400 + h * 3600 + m * 60 + s;
    },
    []
  );

  // Initialize state from local storage or props
  const initializeState = () => {
    if (typeof window === "undefined") {
      return {
        totalSeconds: calculateTotalSeconds(initialDays, initialHours, initialMinutes, initialSeconds),
        initialTotalSeconds: calculateTotalSeconds(initialDays, initialHours, initialMinutes, initialSeconds),
        status: "idle" as const,
      };
    }

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const state: TimerState = JSON.parse(saved);
        const now = Date.now();

        if (state.status === "running" && state.targetTime) {
          const remaining = Math.ceil((state.targetTime - now) / 1000);
          if (remaining > 0) {
            return {
              totalSeconds: remaining,
              initialTotalSeconds: state.initialTotalSeconds,
              status: "running" as const,
            };
          } else {
            return {
              totalSeconds: 0,
              initialTotalSeconds: state.initialTotalSeconds,
              status: "complete" as const,
            };
          }
        } else if (state.status === "paused") {
          return {
            totalSeconds: state.remainingTime,
            initialTotalSeconds: state.initialTotalSeconds,
            status: "paused" as const,
          };
        } else if (state.status === "complete") {
          return {
            totalSeconds: 0,
            initialTotalSeconds: state.initialTotalSeconds,
            status: "complete" as const,
          };
        }
      } catch (e) {
        console.error("Failed to parse timer state", e);
      }
    }

    const total = calculateTotalSeconds(initialDays, initialHours, initialMinutes, initialSeconds);
    return {
      totalSeconds: total,
      initialTotalSeconds: total,
      status: "idle" as const,
    };
  };

  const [state] = useState(initializeState);

  const [totalSeconds, setTotalSeconds] = useState(state.totalSeconds);
  const [initialTotalSeconds, setInitialTotalSeconds] = useState(state.initialTotalSeconds);
  const [status, setStatus] = useState<TimerState["status"]>(state.status);

  const isRunning = status === "running";
  const isPaused = status === "paused";
  const isComplete = status === "complete";

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const saveState = useCallback(
    (newStatus: TimerState["status"], newTotal: number, newInitial: number) => {
      const newState: TimerState = {
        status: newStatus,
        initialTotalSeconds: newInitial,
        remainingTime: newTotal,
        targetTime: newStatus === "running" ? Date.now() + newTotal * 1000 : null,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    },
    []
  );

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    setStatus("running");
    saveState("running", totalSeconds, initialTotalSeconds);
  }, [totalSeconds, initialTotalSeconds, saveState]);

  const pause = useCallback(() => {
    setStatus("paused");
    clearTimer();
    saveState("paused", totalSeconds, initialTotalSeconds);
  }, [clearTimer, saveState, totalSeconds, initialTotalSeconds]);

  const resume = useCallback(() => {
    setStatus("running");
    saveState("running", totalSeconds, initialTotalSeconds);
  }, [totalSeconds, initialTotalSeconds, saveState]);

  const reset = useCallback(() => {
    clearTimer();
    setTotalSeconds(initialTotalSeconds);
    setStatus("idle");
    localStorage.removeItem(STORAGE_KEY);
  }, [clearTimer, initialTotalSeconds]);

  const setTime = useCallback(
    (d: number, h: number, m: number, s: number, autoStart = false) => {
      const total = calculateTotalSeconds(d, h, m, s);
      setTotalSeconds(total);
      setInitialTotalSeconds(total);

      if (autoStart) {
        setStatus("running");
        const newState: TimerState = {
          status: "running",
          initialTotalSeconds: total,
          remainingTime: total,
          targetTime: Date.now() + total * 1000,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      } else {
        setStatus("idle");
        localStorage.removeItem(STORAGE_KEY);
      }
    },
    [calculateTotalSeconds]
  );

  useEffect(() => {
    if (isRunning && totalSeconds > 0) {
      intervalRef.current = setInterval(() => {
        setTotalSeconds((prev) => {
          const next = prev - 1;
          if (next <= 0) {
            clearTimer();
            setStatus("complete");
            // Save as complete
            const newState: TimerState = {
              status: "complete",
              initialTotalSeconds: initialTotalSeconds,
              remainingTime: 0,
              targetTime: null,
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));

            onComplete?.();
            return 0;
          }
          return next;
        });
      }, 1000);
    }

    return clearTimer;
  }, [isRunning, clearTimer, onComplete, initialTotalSeconds]);

  return {
    days,
    hours,
    minutes,
    seconds,
    totalSeconds,
    isRunning,
    isPaused,
    isComplete,
    start,
    pause,
    resume,
    reset,
    setTime,
  };
};
