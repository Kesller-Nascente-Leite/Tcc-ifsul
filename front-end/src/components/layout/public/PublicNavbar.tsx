import { useState } from "react";
import { Menu, X, Moon, Sun } from "lucide-react";
import Logo from "../../../assets/Logo.png";
import { useTheme } from "../../../context/ThemeContext";
import { Button } from "react-aria-components";
import { useNavigate } from "react-router";

interface PublicNavbarProps {
  onMenuClick?: () => void;
}

export default function PublicNavbar({ onMenuClick }: PublicNavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <nav
      // Adicionado left-0 e right-0 para garantir que o fixed respeite as bordas da tela
      className="fixed top-0 left-0 right-0 z-50 w-full bg-surface/90 backdrop-blur-md border-b border-border"
      role="navigation"
    >
      {/* Adicionado w-full aqui também para garantir o limite do contêiner */}
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between h-16 items-center">
          {/* Esquerda - Logo (shrink-0 impede que ele seja esmagado) */}
          <div className="flex items-center gap-2 text-primary font-bold text-xl shrink-0">
            <img src={Logo} className="max-w-14 h-auto" alt="Logo" />
            <span className="text-text-primary whitespace-nowrap">
              Estuda Fácil
            </span>
          </div>

          {/* Direita - Desktop (gap flexível e shrink-0) */}
          <div className="hidden md:flex gap-4 lg:gap-8 items-center shrink-0">
            <Button
              onClick={toggleTheme}
              className="p-2 text-text-secondary hover:bg-primary/10 rounded-lg transition-colors outline-none cursor-pointer"
              aria-label={isDark ? "Modo claro" : "Modo escuro"}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </Button>
            <Button
              className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-primary-hover transition-all shadow-md shadow-primary/20 outline-none cursor-pointer"
              onClick={() => {
                navigate("/login");
              }}
            >
              Começar
            </Button>
          </div>

          {/* Direita - Mobile (Isolado na própria div para evitar conflitos de flex) */}
          <div className="flex md:hidden items-center shrink-0">
            <Button
              className="p-2 text-text-secondary hover:bg-bg-main rounded-md transition-colors outline-none cursor-pointer"
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
            </Button>
          </div>
        </div>
      </div>

      {/* Menu Mobile */}
      <div
        className={`${
          isOpen ? "block" : "hidden"
        } md:hidden bg-surface border-b border-border animate-in slide-in-from-top duration-300 w-full`}
        id="mobile-menu"
      >
        <div className="px-4 pt-2 pb-6 space-y-1">
          <div className="pt-4 space-y-3">
            <Button
              onClick={toggleTheme}
              className="w-full flex items-center justify-center gap-2 bg-surface border border-border text-text-primary px-5 py-3 rounded-lg text-base font-semibold hover:bg-primary/10 transition-colors outline-none cursor-pointer"
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
            </Button>
            <Button className="w-full bg-primary text-white px-5 py-3 rounded-lg text-base font-semibold outline-none cursor-pointer">
              Começar agora
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
