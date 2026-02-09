import { useEffect } from "react";
import {
  type LucideIcon,
  LayoutDashboard,
  BookOpen,
  CheckSquare,
  Calendar,
  Timer,
  BarChart2,
  Settings,
  HelpCircle,
} from "lucide-react";
import navData from "./nav.student.json";
import Logo from "../../../assets/Logo.png";
import { Link } from "react-router";

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  BookOpen,
  CheckSquare,
  Calendar,
  Timer,
  BarChart2,
};

interface StudentSidebarProps {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
}

export function StudentSidebar({ isOpen, setIsOpen }: StudentSidebarProps) {
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
          className=" fixed inset-0 bg-black/50 backdrop-blur-xs z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-(--color-surface) border-r border-(--color-border) z-50 transition-transform duration-300 ease-in-out flex flex-col
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 pt-16 md:pt-0`}
      >
        <div className="hidden md:flex items-center gap-2 px-6 h-16 border-b border-(--color-border)">
          <img src={Logo} className="max-w-10 h-auto" alt="Estuda Fácil" />
          <span className="font-bold text-lg text-(--color-text-primary)">
            Estuda Fácil
          </span>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <p className="px-2 mb-2 text-xs font-bold text-(--color-text-secondary) uppercase tracking-wider">
            Menu Principal
          </p>

          {navData.menuItems.map((item) => {
            const IconComponent = iconMap[item.icon] || LayoutDashboard;
            const isActive = window.location.pathname === item.path;

            return (
              <a
                key={item.id}
                href={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group
                  ${
                    isActive
                      ? "bg-(--color-primary)/10 text-(--color-primary)"
                      : "text-(--color-text-secondary) hover:bg-(--color-bg-main) hover:text-(--color-text-primary)"
                  }`}
              >
                <IconComponent
                  size={20}
                  className={
                    isActive
                      ? "text-(--color-primary)"
                      : "text-(--color-text-secondary) group-hover:text-(--color-primary)"
                  }
                />
                {item.label}
              </a>
            );
          })}

          <div className="pt-6 mt-6 border-t border-(--color-border)">
            <p className="px-2 mb-2 text-xs font-bold text-(--color-text-secondary) uppercase tracking-wider">
              Sistema
            </p>
            <a
              href="/student/settings"
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-(--color-text-secondary) hover:bg-(--color-bg-main) hover:text-(--color-text-primary) rounded-lg transition-colors"
            >
              <Settings size={20} />

              <Link to={"/setting"}>Configurações</Link>
            </a>
            <a
              href="/help"
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-(--color-text-secondary) hover:bg-(--color-bg-main) hover:text-(--color-text-primary) rounded-lg transition-colors"
            >
              <HelpCircle size={20} /> Ajuda
            </a>
          </div>
        </div>
      </aside>
    </div>
  );
}
