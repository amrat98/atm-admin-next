"use client"

import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  const handleValueChange = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  };

  return (
    <Button size="icon" variant="outline" onClick={handleValueChange}>
      {theme === "dark" ? <Sun /> : <Moon />}
    </Button>
  );
}
