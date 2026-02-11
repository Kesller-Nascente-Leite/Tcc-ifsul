import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AppRoutes } from "./routes/AppRoutes";
import { ThemeProvider } from "./context/ThemeContext";
import { PreferencesProvider } from "./context/PreferencesContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <PreferencesProvider>
        <AppRoutes />
      </PreferencesProvider>
    </ThemeProvider>
  </StrictMode>,
);
