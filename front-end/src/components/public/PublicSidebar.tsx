import { useEffect } from "react";
import { X, Info, Home } from "lucide-react";
import navData from "./nav.public.json";

export function PublicSidebar({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
}) {
  // Fecha a sidebar ao pressionar a tecla Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) =>
      e.key === "Escape" && setIsOpen(false);
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [setIsOpen]);

  return (
    <div>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        id="sidebar"
        role="complementary"
        aria-label="Menu lateral"
        className={`fixed left-0 top-0 h-full w-64 bg-(--color-surface) border-r border-(--color-border) z-50 transform transition-transform duration-300 ease-in-out 
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-10">
            <span className="font-bold text-(--color-text-primary)">
              Navegação
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="md:hidden p-1 text-(--color-text-secondary) hover:bg-(--color-bg-main) rounded transition-colors"
              aria-label="Fechar menu"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 space-y-2">
            {navData.menuItems.map((item) => (
              <a
                key={item.id}
                href={item.path}
                tabIndex={isOpen ? 0 : -1}
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-(--color-text-secondary) hover:bg-(--color-primary)/10 hover:text-(--color-primary) rounded-xl transition-all"
              >
                <Home size={18} /> {item.label}
              </a>
            ))}
          </nav>

          <div className="pt-6 border-t border-(--color-border) mt-auto">
            <p className="text-[10px] text-(--color-text-secondary) uppercase font-bold tracking-widest opacity-80">
              Suporte
            </p>
            <button className="flex items-center gap-3 mt-4 text-sm text-(--color-text-secondary) hover:text-(--color-primary) w-full text-left transition-colors">
              <Info size={18} /> Central de Ajuda
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
