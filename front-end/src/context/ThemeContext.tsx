import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type AccentColor = "#2563eb" | "#059669" | "#7c3aed" | "#db2777" | "#ea580c";

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  accentColor: AccentColor;
  setAccentColor: (color: AccentColor) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const DEFAULT_ACCENT_COLOR: AccentColor = "#2563eb";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(() => {
    // Check localStorage first
    const saved = localStorage.getItem("theme");
    if (saved) {
      return saved === "dark";
    }
    // Otherwise check system preference
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const [accentColor, setAccentColorState] = useState<AccentColor>(() => {
    const saved = localStorage.getItem("accentColor") as AccentColor | null;
    return saved || DEFAULT_ACCENT_COLOR;
  });

  useEffect(() => {
    const htmlElement = document.documentElement;
    if (isDark) {
      htmlElement.classList.add("dark");
    } else {
      htmlElement.classList.remove("dark");
    }
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const setAccentColor = (color: AccentColor) => {
    setAccentColorState(color);
    localStorage.setItem("accentColor", color);
    document.documentElement.style.setProperty("--accent-color", color);
  };

  useEffect(() => {
    document.documentElement.style.setProperty("--accent-color", accentColor);
  }, [accentColor]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, accentColor, setAccentColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
