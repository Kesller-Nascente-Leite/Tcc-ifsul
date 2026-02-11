/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { Menu, X, Moon, Sun } from "lucide-react";
import navData from "./nav.public.json";
import Logo from "../../../assets/Logo.png";
import { useTheme } from "../../../context/ThemeContext";

interface NavItem {
  id: number;
  label: string;
  path: string;
}

interface PublicNavbarProps {
  onMenuClick?: () => void;
}

export default function PublicNavbar({ onMenuClick }: PublicNavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<NavItem[]>([]);
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    setItems(navData.menuItems);
  }, []);

  return (
    <nav
      className="fixed top-0 z-50 w-full bg-surface/90 backdrop-blur-md border-b border-border"
      role="navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2 text-primary font-bold text-xl">
            <img src={Logo} className="max-w-14 h-auto" alt="Logo" />
            <span className="text-text-primary">Estuda Fácil</span>
          </div>

          <div className="hidden md:flex gap-8 items-center">
            {items.map((item) => (
              <a
                key={item.id}
                href={item.path}
                className="text-sm font-medium text-text-secondary hover:text-primary transition-colors"
              >
                {item.label}
              </a>
            ))}
            <button
              onClick={toggleTheme}
              className="p-2 text-text-secondary hover:bg-primary/10 rounded-lg transition-colors"
              aria-label={isDark ? "Modo claro" : "Modo escuro"}
              title={isDark ? "Modo claro" : "Modo escuro"}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-primary-hover transition-all shadow-md shadow-primary/20">
              Começar
            </button>
          </div>

          <button
            className="md:hidden p-2 text-text-secondary hover:bg-bg-main rounded-md transition-colors"
            onClick={() => {
              if (onMenuClick) {
                onMenuClick();
              } else {
                setIsOpen(!isOpen);
              }
            }}
            aria-expanded={isOpen}
            aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <div
        className={`${
          isOpen ? "block" : "hidden"
        } md:hidden bg-surface border-b border-border animate-in slide-in-from-top duration-300`}
        id="mobile-menu"
      >
        <div className="px-4 pt-2 pb-6 space-y-1">
          {items.map((item) => (
            <a
              key={item.id}
              href={item.path}
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 text-base font-medium text-text-secondary hover:bg-primary/10 hover:text-primary rounded-md transition-colors"
            >
              {item.label}
            </a>
          ))}
          <div className="pt-4 space-y-3">
            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-center gap-2 bg-surface border border-border text-text-primary px-5 py-3 rounded-lg text-base font-semibold hover:bg-primary/10 transition-colors"
            >
              {isDark ? (
                <>
                  <Sun size={18} />
                  Modo claro
                </>
              ) : (
                <>
                  <Moon size={18} />
                  Modo escuro
                </>
              )}
            </button>
            <button className="w-full bg-primary text-white px-5 py-3 rounded-lg text-base font-semibold">
              Começar agora
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
