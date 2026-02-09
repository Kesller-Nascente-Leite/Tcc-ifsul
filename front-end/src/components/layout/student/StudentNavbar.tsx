import { useEffect, useState } from "react";
import { Menu, X, Bell, Search, LogOut} from "lucide-react";
import { useNavigate } from "react-router";
import Logo from "../../../assets/Logo.png";
import { AuthApi, type AuthUser } from "../../../api/auth.api";

interface StudentNavbarProps {
  onMenuClick: () => void;
  isSidebarOpen: boolean;
}

export default function StudentNavbar({
  onMenuClick,
  isSidebarOpen,
}: StudentNavbarProps) {
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (e) {
        console.error("Erro ao fazer parse do usuário", e);
      }
    }
  }, []);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await AuthApi.logout();
    } catch (err: unknown) {
      console.error("Erro no logout", err);
    } finally {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setIsLoading(false);
      navigate("/", {
        state: { successMessage: "Você saiu com sucesso." },
      });
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "EF";
    const names = name.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name[0].toUpperCase();
  };

  return (
    <nav
      className="sticky top-0 z-40 w-full bg-(--color-surface)/80 backdrop-blur-md border-b border-(--color-border) transition-all duration-300"
      role="navigation"
    >
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden p-2 -ml-2 text-(--color-text-secondary) hover:text-(--color-primary) hover:bg-(--color-primary)/5 rounded-lg transition-colors focus:outline-hidden"
              onClick={onMenuClick}
              aria-label={isSidebarOpen ? "Fechar menu" : "Abrir menu"}
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <div className="flex items-center gap-2">
              <img src={Logo} className="w-8 h-8 object-contain" alt="Logo" />
              <span className="hidden md:block font-bold text-xl tracking-tight text-(--color-text-primary)">
                Estuda Fácil
              </span>
            </div>
          </div>

          <div className="hidden md:flex flex-1 max-w-lg mx-8 relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search
                size={18}
                className="text-(--color-text-secondary) group-focus-within:text-(--color-primary) transition-colors duration-200"
              />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-4 py-2 bg-(--color-bg-main) border border-transparent focus:bg-(--color-surface) rounded-full text-sm text-(--color-text-primary) placeholder-(--color-text-secondary) focus:outline-hidden focus:ring-2 focus:ring-(--color-primary)/20 focus:border-(--color-primary) transition-all duration-200 shadow-xs"
              placeholder="Buscar matérias, anotações..."
            />
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            <button className="relative p-2 text-(--color-text-secondary) hover:text-(--color-text-primary) hover:bg-(--color-bg-main) rounded-full transition-all duration-200">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border-2 border-(--color-surface)"></span>
              </span>
            </button>

            <div className="h-6 w-px bg-(--color-border)/60 hidden sm:block"></div>

            <div className="flex items-center gap-3 pl-1">
              <div className="hidden md:flex flex-col items-end">
                <p className="text-sm font-semibold text-(--color-text-primary) leading-none">
                  {user?.fullName || "Estudante"}
                </p>
                <p className="text-xs text-(--color-text-secondary) mt-1">
                  Online agora
                </p>
              </div>

              <div className="relative group cursor-pointer flex items-center gap-2">
                <div className="relative">
                  <div className="h-10 w-10 rounded-full bg-linear-to-br from-(--color-primary) to-purple-600 p-[2px] shadow-sm">
                    <div className="h-full w-full rounded-full bg-(--color-surface) flex items-center justify-center overflow-hidden">
                      {!imageError && user?.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt={user.fullName}
                          className="h-full w-full object-cover"
                          onError={() => setImageError(true)}
                        />
                      ) : (
                        <span className="text-(--color-primary) font-bold text-sm select-none">
                          {user?.fullName ? getInitials(user.fullName) : "EF"}
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-(--color-surface)"></span>
                </div>

                <button
                  onClick={handleLogout}
                  disabled={isLoading}
                  className="p-2 text-(--color-text-secondary) hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center"
                  title="Sair da conta"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
