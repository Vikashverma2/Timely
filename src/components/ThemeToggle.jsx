import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

const ThemeToggle = () => {
    const [theme, setTheme] = useState("dark");

    useEffect(() => {
        // Check local storage or system preference
        const storedTheme = localStorage.getItem("theme");
        const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

        // Default to DARK if no preference is stored, or if system prefers dark
        // This ensures the user's "original" experience is preserved by default
        if (storedTheme === "dark" || (!storedTheme && (systemPrefersDark || true))) {
            setTheme("dark");
            document.documentElement.classList.add("dark");
        } else {
            setTheme("light");
            document.documentElement.classList.remove("dark");
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);

        if (newTheme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full w-10 h-10 hover:bg-secondary transition-colors"
            aria-label="Toggle theme"
        >
            {theme === "light" ? (
                <Sun className="h-5 w-5 text-amber-500 transition-all" />
            ) : (
                <Moon className="h-5 w-5 text-amber-400 transition-all" />
            )}
        </Button>
    );
};

export default ThemeToggle;
