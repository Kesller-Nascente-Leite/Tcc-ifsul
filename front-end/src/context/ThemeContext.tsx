import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type AccentColor =
  | "#2563eb"
  | "#059669"
  | "#7c3aed"
  | "#db2777"
  | "#ea580c";

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
    // eslint-disable-next-line react-hooks/immutability
    const rgb = hexToRgb(color);
    if (rgb) {
      document.documentElement.style.setProperty(
        "--accent-rgb",
        `${rgb.r}, ${rgb.g}, ${rgb.b}`,
      );
    }
    // also update theme variables used across the app
    document.documentElement.style.setProperty("--color-primary", color);
    document.documentElement.style.setProperty(
      "--color-primary-hover",
      // eslint-disable-next-line react-hooks/immutability
      shadeHex(color, -12),
    );
    document.documentElement.style.setProperty(
      "--color-primary-50",
      shadeHex(color, 70),
    );
  };

  useEffect(() => {
    document.documentElement.style.setProperty("--accent-color", accentColor);
    const rgb = hexToRgb(accentColor);
    if (rgb) {
      document.documentElement.style.setProperty(
        "--accent-rgb",
        `${rgb.r}, ${rgb.g}, ${rgb.b}`,
      );
    }
    document.documentElement.style.setProperty("--color-primary", accentColor);
    document.documentElement.style.setProperty(
      "--color-primary-hover",
      shadeHex(accentColor, -12),
    );
    document.documentElement.style.setProperty(
      "--color-primary-50",
      shadeHex(accentColor, 70),
    );
  }, [accentColor]);

  function hexToRgb(hex: string) {
    const sanitized = hex.replace("#", "");
    if (sanitized.length !== 6) return null;
    const r = parseInt(sanitized.substring(0, 2), 16);
    const g = parseInt(sanitized.substring(2, 4), 16);
    const b = parseInt(sanitized.substring(4, 6), 16);
    return { r, g, b };
  }

  function shadeHex(hex: string, percent: number) {
    const c = hex.replace("#", "");
    if (c.length !== 6) return hex;
    const num = parseInt(c, 16);
    let r = (num >> 16) & 0xff;
    let g = (num >> 8) & 0xff;
    let b = num & 0xff;
    r = Math.min(255, Math.max(0, Math.round(r + (percent / 100) * 255)));
    g = Math.min(255, Math.max(0, Math.round(g + (percent / 100) * 255)));
    b = Math.min(255, Math.max(0, Math.round(b + (percent / 100) * 255)));
    const rr = r.toString(16).padStart(2, "0");
    const gg = g.toString(16).padStart(2, "0");
    const bb = b.toString(16).padStart(2, "0");
    return `#${rr}${gg}${bb}`;
  }

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  return (
    <ThemeContext.Provider
      value={{ isDark, toggleTheme, accentColor, setAccentColor }}
    >
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
