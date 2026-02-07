import { useState, useEffect, useCallback, useRef } from "react";

const STORAGE_KEY = "flip-timer-state";

export const useTimer = ({
    initialDays = 0,
    initialHours = 0,
    initialMinutes = 0,
    initialSeconds = 0,
    onComplete,
} = {}) => {
    const calculateTotalSeconds = useCallback(
        (d, h, m, s) => {
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
                status: "idle",
            };
        }

        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const state = JSON.parse(saved);
                const now = Date.now();

                if (state.status === "running" && state.targetTime) {
                    const remaining = Math.ceil((state.targetTime - now) / 1000);
                    if (remaining > 0) {
                        return {
                            totalSeconds: remaining,
                            initialTotalSeconds: state.initialTotalSeconds,
                            status: "running",
                        };
                    } else {
                        return {
                            totalSeconds: 0,
                            initialTotalSeconds: state.initialTotalSeconds,
                            status: "complete",
                        };
                    }
                } else if (state.status === "paused") {
                    return {
                        totalSeconds: state.remainingTime,
                        initialTotalSeconds: state.initialTotalSeconds,
                        status: "paused",
                    };
                } else if (state.status === "complete") {
                    return {
                        totalSeconds: 0,
                        initialTotalSeconds: state.initialTotalSeconds,
                        status: "complete",
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
            status: "idle",
        };
    };

    const [state] = useState(initializeState);

    const [totalSeconds, setTotalSeconds] = useState(state.totalSeconds);
    const [initialTotalSeconds, setInitialTotalSeconds] = useState(state.initialTotalSeconds);
    const [status, setStatus] = useState(state.status);

    const isRunning = status === "running";
    const isPaused = status === "paused";
    const isComplete = status === "complete";

    const intervalRef = useRef(null);

    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const saveState = useCallback(
        (newStatus, newTotal, newInitial) => {
            const newState = {
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
        (d, h, m, s, autoStart = false) => {
            const total = calculateTotalSeconds(d, h, m, s);
            setTotalSeconds(total);
            setInitialTotalSeconds(total);

            if (autoStart) {
                setStatus("running");
                const newState = {
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
                        const newState = {
                            status: "complete",
                            initialTotalSeconds: initialTotalSeconds,
                            remainingTime: 0,
                            targetTime: null,
                        };
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));

                        onComplete && onComplete();
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
