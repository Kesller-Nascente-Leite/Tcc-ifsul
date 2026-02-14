/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import {
  type LucideIcon,
  LayoutDashboard,
  Book,
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
import { NavLink } from "react-router";

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  Book,
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
          className=" fixed inset-0 bg-black/50 dark:bg-black/60 backdrop-blur-xs z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-surface border-r border-border z-50 transition-transform duration-300 ease-in-out flex flex-col
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 pt-16 md:pt-0`}
      >
        <div className="hidden md:flex items-center gap-2 px-6 h-16 border-b border-border">
          <img src={Logo} className="max-w-10 h-auto" alt="Estuda Fácil" />
          <span className="font-bold text-lg text-text-primary">
            Estuda Fácil
          </span>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <p className="px-2 mb-2 text-xs font-bold text-text-secondary uppercase tracking-wider">
            Menu Principal
          </p>

          {navData.menuItems.map((item: any) => {
            const IconComponent = iconMap[item.icon] || LayoutDashboard;

            return (
              <NavLink
                key={item.id}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({
                  isActive,
                }) => `flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group
                  ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-text-secondary hover:bg-bg-main hover:text-text-primary"
                  }`}
              >
                {({ isActive }) => (
                  <>
                    <IconComponent
                      size={20}
                      className={
                        isActive
                          ? "text-primary"
                          : "text-text-secondary group-hover:text-primary"
                      }
                    />
                    <span>{item.label}</span>
                    {item.cta && (
                      <span className="ml-auto text-xs font-semibold text-primary">
                        {item.cta}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}

          <div className="pt-6 mt-6 border-t border-border">
            <p className="px-2 mb-2 text-xs font-bold text-text-secondary uppercase tracking-wider">
              Sistema
            </p>
            <NavLink
              to="/student/settings"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-text-secondary hover:bg-bg-main hover:text-text-primary"
                }`
              }
            >
              <Settings size={20} />
              Configurações
            </NavLink>
            <NavLink
              to="/help"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-text-secondary hover:bg-bg-main hover:text-text-primary"
                }`
              }
            >
              <HelpCircle size={20} /> Ajuda
            </NavLink>
          </div>
        </div>
      </aside>
    </div>
  );
}
