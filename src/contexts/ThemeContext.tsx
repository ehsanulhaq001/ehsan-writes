import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { ThemeContextType } from "../types";
import {
  themes,
  defaultTheme,
  loadTheme,
  getStoredTheme,
  setStoredTheme,
} from "../utils/themes";

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [currentTheme, setCurrentTheme] = useState<string>(defaultTheme);
  const [loading, setLoading] = useState(true);

  const setTheme = async (themeId: string) => {
    if (themeId === currentTheme) return;

    setLoading(true);
    try {
      await loadTheme(themeId);
      setCurrentTheme(themeId);
      setStoredTheme(themeId);
    } catch (error) {
      console.error("Failed to load theme:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeTheme = async () => {
      const storedTheme = getStoredTheme();
      try {
        await loadTheme(storedTheme);
        setCurrentTheme(storedTheme);
      } catch (error) {
        console.error(
          "Failed to load stored theme, falling back to default:",
          error
        );
        await loadTheme(defaultTheme);
        setCurrentTheme(defaultTheme);
      } finally {
        setLoading(false);
      }
    };

    initializeTheme();
  }, []);

  const value: ThemeContextType = {
    currentTheme,
    themes,
    setTheme,
    loading,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
