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
  setTime: (days: number, hours: number, minutes: number, seconds: number) => void;
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

  const [totalSeconds, setTotalSeconds] = useState(
    calculateTotalSeconds(initialDays, initialHours, initialMinutes, initialSeconds)
  );
  const [initialTotalSeconds, setInitialTotalSeconds] = useState(
    calculateTotalSeconds(initialDays, initialHours, initialMinutes, initialSeconds)
  );
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    setIsRunning(true);
    setIsPaused(false);
    setIsComplete(false);
  }, []);

  const pause = useCallback(() => {
    setIsPaused(true);
    clearTimer();
  }, [clearTimer]);

  const resume = useCallback(() => {
    setIsPaused(false);
  }, []);

  const reset = useCallback(() => {
    clearTimer();
    setTotalSeconds(initialTotalSeconds);
    setIsRunning(false);
    setIsPaused(false);
    setIsComplete(false);
  }, [clearTimer, initialTotalSeconds]);

  const setTime = useCallback(
    (d: number, h: number, m: number, s: number) => {
      const total = calculateTotalSeconds(d, h, m, s);
      setTotalSeconds(total);
      setInitialTotalSeconds(total);
      setIsComplete(false);
    },
    [calculateTotalSeconds]
  );

  useEffect(() => {
    if (isRunning && !isPaused && totalSeconds > 0) {
      intervalRef.current = setInterval(() => {
        setTotalSeconds((prev) => {
          if (prev <= 1) {
            clearTimer();
            setIsRunning(false);
            setIsComplete(true);
            onComplete?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return clearTimer;
  }, [isRunning, isPaused, clearTimer, onComplete, totalSeconds]);

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
