import { useState, useEffect } from "react";
import {
  User,
  Bell,
  Lock,
  Palette,
  Save,
  LogOut,
  Moon,
  Sun,
  Laptop,
  Check,
} from "lucide-react";
import { InputComponent } from "../components/InputComponent";
import type { AuthUser } from "../api/auth.api";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [theme, setTheme] = useState<"light" | "dark" | "system">(() => {
    if (typeof window !== "undefined") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (localStorage.getItem("theme") as any) || "system";
    }
    return "system";
  });
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parseUser = JSON.parse(savedUser) as AuthUser;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUser(parseUser);
      } catch (error) {
        console.error("Ouve um erro ao processar os dados do usuário:", error);
      }
    }
  }, []);
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as
      | "light"
      | "dark"
      | "system"
      | null;
    if (savedTheme) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTheme(savedTheme);
    }
    setMounted(true);
  }, []);

  // Aplicar o tema no elemento HTML
  useEffect(() => {
    if (!mounted) return;

    const root = window.document.documentElement;

    const applyTheme = () => {
      if (theme === "dark") {
        root.classList.add("dark");
      } else if (theme === "light") {
        root.classList.remove("dark");
      } else {
        // Se for "system", checamos a preferência do navegador
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)",
        ).matches;
        root.classList.toggle("dark", prefersDark);
      }
    };

    applyTheme();
    localStorage.setItem("theme", theme);
  }, [theme,mounted]);

  // Listener para mudanças no tema do sistema
  useEffect(() => {
    if (theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const root = window.document.documentElement;
      const prefersDark = mediaQuery.matches;
      root.classList.toggle("dark", prefersDark);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  const menuItems = [
    { id: "profile", label: "Perfil", icon: User },
    { id: "notifications", label: "Notificações", icon: Bell },
    { id: "security", label: "Segurança", icon: Lock },
    { id: "appearance", label: "Aparência", icon: Palette },
  ];

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen p-4 md:p-8 flex justify-center bg-bg-main text-text-primary transition-colors duration-300">
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8">
        {/* Sidebar de Navegação */}
        <aside className="space-y-2">
          <h1 className="text-2xl font-bold mb-6 px-4 text-text-primary uppercase tracking-tight">
            Configurações
          </h1>
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeTab === item.id
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "text-text-secondary hover:bg-border/20"
                }`}
              >
                <item.icon size={20} />
                <span className="font-semibold">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="pt-8 mt-8 border-t border-border">
            <button className="w-full flex items-center gap-3 px-4 py-3 text-error hover:bg-error/10 rounded-xl transition-all font-semibold">
              <LogOut size={20} />
              <span>Sair da conta</span>
            </button>
          </div>
        </aside>

        {/* Painel de Conteúdo Principal */}
        <main className="bg-surface border border-border rounded-3xl shadow-sm overflow-hidden flex flex-col transition-colors duration-300">
          <div className="p-6 md:p-10 flex-1">
            {/* Aba de Perfil */}
            {activeTab === "profile" && (
              <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <h2 className="text-2xl font-bold text-text-primary">
                    Meu Perfil
                  </h2>
                  <p className="text-text-secondary mt-1">
                    Gerencie suas informações pessoais e foto.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-8 pb-8 border-b border-border">
                  <div className="w-28 h-28 rounded-3xl bg-primary flex items-center justify-center text-white text-4xl font-bold shadow-xl ring-4 ring-bg-main">
                    {user ? user.fullName.charAt(0).toUpperCase() : null}
                  </div>
                  <div className="space-y-3 text-center sm:text-left">
                    <h3 className="font-bold text-lg text-text-primary">
                      Foto de Perfil
                    </h3>
                    <div className="flex gap-2 justify-center sm:justify-start">
                      <button className="text-xs font-bold px-4 py-2 bg-border/30 rounded-lg hover:bg-border/50 transition-all uppercase tracking-wider">
                        Remover
                      </button>
                      <button className="text-xs font-bold px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-all uppercase tracking-wider">
                        Alterar Foto
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text-secondary ml-1">
                      Nome Completo
                    </label>
                    <InputComponent
                      type="text"
                      defaultValue="Kesller Silva"
                      className="w-full px-4 py-3 rounded-xl bg-bg-main border border-border text-text-primary focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium placeholder:text-text-secondary/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text-secondary ml-1">
                      E-mail Acadêmico
                    </label>
                    <InputComponent
                      type="email"
                      defaultValue="kesller@exemplo.com"
                      className="w-full px-4 py-3 rounded-xl bg-bg-main border border-border text-text-primary focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
                    />
                  </div>
                </div>
              </section>
            )}

            {/* Aba de Aparência */}
            {activeTab === "appearance" && (
              <section className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div>
                  <h2 className="text-2xl font-bold text-text-primary">
                    Aparência
                  </h2>
                  <p className="text-text-secondary mt-1">
                    Personalize como o ambiente de gestão de estudos aparece
                    para você.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <ThemeCard
                    active={theme === "light"}
                    onClick={() => setTheme("light")}
                    label="Modo Claro"
                    icon={<Sun size={20} />}
                    previewClass="bg-[#f7fafc] border-slate-200"
                  />
                  <ThemeCard
                    active={theme === "dark"}
                    onClick={() => setTheme("dark")}
                    label="Modo Escuro"
                    icon={<Moon size={20} />}
                    previewClass="bg-[#1a202c] border-slate-700"
                  />
                  <ThemeCard
                    active={theme === "system"}
                    onClick={() => setTheme("system")}
                    label="Sistema"
                    icon={<Laptop size={20} />}
                    previewClass="bg-gradient-to-br from-[#f7fafc] to-[#1a202c] border-slate-400"
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-text-primary">
                    Cores de Destaque
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    <ColorOption color="#2b6cb0" active />
                    <ColorOption color="#2c7a7b" />
                    <ColorOption color="#ed8936" />
                    <ColorOption color="#38a169" />
                    <ColorOption color="#e53e3e" />
                  </div>
                </div>
              </section>
            )}

            {/* Outras abas (Placeholder) */}
            {activeTab !== "profile" && activeTab !== "appearance" && (
              <div className="h-full flex flex-col items-center justify-center text-text-secondary space-y-4">
                <div className="w-16 h-16 rounded-full bg-border/20 flex items-center justify-center">
                  {menuItems
                    .find((i) => i.id === activeTab)
                    ?.icon({ size: 32 })}
                </div>
                <p className="font-medium uppercase tracking-widest text-xs">
                  Página em desenvolvimento
                </p>
              </div>
            )}
          </div>

          {/* Rodapé de Ações */}
          <div className="p-6 bg-bg-main/50 dark:bg-black/10 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-text-secondary font-medium italic">
              Alterações não salvas serão perdidas.
            </p>
            <div className="flex gap-3 w-full sm:w-auto">
              <button className="flex-1 sm:flex-none px-6 py-2.5 font-bold text-text-secondary hover:text-text-primary transition-all">
                Descartar
              </button>
              <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl shadow-lg shadow-primary/30 transition-all font-bold">
                <Save size={18} />
                Salvar Alterações
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Sub-componente de Card de Tema
function ThemeCard({
  active,
  onClick,
  label,
  icon,
  previewClass,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
  previewClass: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-2xl border-2 transition-all duration-200 flex flex-col gap-3 items-start text-left group ${
        active
          ? "border-primary bg-primary/5 ring-4 ring-primary/10"
          : "border-border bg-surface hover:border-primary/50"
      }`}
    >
      <div
        className={`w-full h-20 rounded-lg border ${previewClass} mb-1 transition-transform group-hover:scale-[1.02]`}
      ></div>
      <div
        className={`flex items-center gap-2 font-bold text-sm ${active ? "text-primary" : "text-text-secondary"}`}
      >
        {icon}
        {label}
        {active && <Check size={14} className="ml-auto" />}
      </div>
    </button>
  );
}

// Sub-componente de Círculo de Cor
function ColorOption({
  color,
  active = false,
}: {
  color: string;
  active?: boolean;
}) {
  return (
    <div
      className={`w-12 h-12 rounded-2xl cursor-pointer transition-all hover:scale-110 active:scale-95 flex items-center justify-center border-4 ${
        active
          ? "border-white dark:border-slate-800 ring-2 ring-primary shadow-lg shadow-primary/20"
          : "border-transparent"
      }`}
      style={{ backgroundColor: color }}
    >
      {active && <Check size={20} className="text-white" />}
    </div>
  );
}
