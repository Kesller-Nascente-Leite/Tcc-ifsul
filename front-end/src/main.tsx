import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/index.css";
import { AppRoutes } from "@/app/routes/AppRoutes";
import { ThemeProvider } from "@/app/providers/ThemeContext";
import { PreferencesProvider } from "@/app/providers/PreferencesContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <PreferencesProvider>
        <AppRoutes />
      </PreferencesProvider>
    </ThemeProvider>
  </StrictMode>,
);
