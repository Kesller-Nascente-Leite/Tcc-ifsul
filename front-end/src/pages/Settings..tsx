/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import {
  User,
  Bell,
  Lock,
  Palette,
  Save,
  LogOut,
  Moon,
  Sun,
  Check,
  Shield,
  Smartphone,
  Mail,
  Camera,
  Loader2,
  X,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { usePreferences } from "../context/PreferencesContext";
import { InputComponent } from "../components/ui/InputComponent";
import { PasswordInput } from "../components/ui/PasswordInput";

const ToggleSwitch = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) => (
  <button
    onClick={onChange}
    className={`w-12 h-7 rounded-full transition-colors relative focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-800 ${
      checked ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-600"
    }`}
  >
    <div
      className={`w-5 h-5 bg-white rounded-full shadow-md absolute top-1 transition-transform ${
        checked ? "translate-x-6" : "translate-x-1"
      }`}
    />
  </button>
);

function ColorOption({
  color,
  active = false,
  onClick,
}: {
  color: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-10 h-10 rounded-full cursor-pointer transition-all hover:scale-110 active:scale-95 flex items-center justify-center ${
        active
          ? "ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-800 ring-blue-500 shadow-lg"
          : "hover:ring-2 ring-slate-200 dark:ring-slate-700"
      }`}
      style={{ backgroundColor: color }}
    >
      {active && <Check size={16} className="text-white drop-shadow-md" />}
    </button>
  );
}

export default function Settings() {
  const { isDark, toggleTheme, accentColor, setAccentColor } = useTheme();
  const {
    profileData,
    setProfileData,
    notificationData,
    setNotificationData,
    isLoading,
    savePreferences,
  } = usePreferences();

  const [activeTab, setActiveTab] = useState("profile");
  const [hasChanges, setHasChanges] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(
    "Suas alterações foram salvas.",
  );
  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const savedProfileData = localStorage.getItem("user");
    if (savedProfileData) {
      try {
        const parseProfileData = JSON.parse(savedProfileData);
        setProfileData(parseProfileData);
      } catch (error) {
        console.error(
          "Ouve um erro ao pegar as informações do usuário:",
          error,
        );
      }
    }
  },[]);

  const handleProfileChange = (field: string, value: unknown) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleNotificationChange = (field: string, value: unknown) => {
    setNotificationData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSecurityChange = (field: string, value: string) => {
    setSecurityData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      await savePreferences();
      setHasChanges(false);
      setShowToast(true);
      setToastMessage("Suas alterações foram salvas com sucesso!");

      if (securityData.newPassword) {
        if (securityData.newPassword !== securityData.confirmPassword) {
          setToastMessage("As senhas não coincidem!");
          return;
        }

        setSecurityData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }

      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      setToastMessage("Erro ao salvar alterações. " + error);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleDiscard = () => {
    setHasChanges(false);
    setSecurityData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const menuItems = [
    {
      id: "profile",
      label: "Perfil",
      icon: User,
      description: "Gerencie suas informações pessoais",
    },
    {
      id: "notifications",
      label: "Notificações",
      icon: Bell,
      description: "Escolha como quer ser avisado",
    },
    {
      id: "security",
      label: "Segurança",
      icon: Lock,
      description: "Proteja sua conta e dados",
    },
    {
      id: "appearance",
      label: "Aparência",
      icon: Palette,
      description: "Personalize a interface",
    },
  ];

  return (
    <div
      className={`min-h-screen p-4 md:p-8 flex justify-center transition-colors duration-300 ${
        isDark ? "bg-slate-900 text-slate-100" : "bg-slate-50 text-slate-800"
      }`}
    >
      {showToast && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-5 z-50">
          <div className="bg-white/20 p-1 rounded-full">
            <Check size={16} />
          </div>
          <div>
            <p className="font-bold text-sm">Sucesso!</p>
            <p className="text-xs opacity-90">{toastMessage}</p>
          </div>
          <button
            onClick={() => setShowToast(false)}
            className="ml-2 hover:bg-white/20 rounded p-1"
          >
            <X size={14} />
          </button>
        </div>
      )}

      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8">
        <aside className="space-y-6">
          <div className="px-2">
            <h1
              className={`text-2xl font-bold uppercase tracking-tight ${isDark ? "text-white" : "text-slate-800"}`}
            >
              Ajustes
            </h1>
            <p
              className={`text-xs font-medium mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}
            >
              GERENCIE SUA CONTA
            </p>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left group ${
                  activeTab === item.id
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : isDark
                      ? "text-slate-400 hover:bg-slate-800"
                      : "text-slate-600 hover:bg-slate-200"
                }`}
              >
                <item.icon
                  size={20}
                  className={
                    activeTab === item.id
                      ? "text-white"
                      : "group-hover:text-blue-600 transition-colors"
                  }
                />
                <div>
                  <span className="font-semibold block text-sm">
                    {item.label}
                  </span>
                </div>
              </button>
            ))}
          </nav>

          <div
            className={`pt-8 border-t ${isDark ? "border-slate-800" : "border-slate-200"}`}
          >
            <button
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm text-red-500 ${
                isDark ? "hover:bg-red-900/10" : "hover:bg-red-50"
              }`}
            >
              <LogOut size={20} />
              <span>Sair da conta</span>
            </button>
          </div>
        </aside>

        <main
          className={`border rounded-3xl shadow-sm overflow-hidden flex flex-col transition-colors duration-300 min-h-150 ${
            isDark
              ? "bg-slate-800 border-slate-700"
              : "bg-white border-slate-200"
          }`}
        >
          <div
            className={`p-6 md:p-8 border-b ${isDark ? "border-slate-700" : "border-slate-100"}`}
          >
            {menuItems.map(
              (item) =>
                item.id === activeTab && (
                  <div
                    key={item.id}
                    className="animate-in fade-in duration-300"
                  >
                    <h2
                      className={`text-2xl font-bold flex items-center gap-3 ${isDark ? "text-white" : "text-slate-800"}`}
                    >
                      <item.icon className="text-blue-600" size={28} />
                      {item.label}
                    </h2>
                    <p
                      className={`mt-1 text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}
                    >
                      {item.description}
                    </p>
                  </div>
                ),
            )}
          </div>

          <div className="p-6 md:p-10 flex-1 overflow-y-auto">
            {activeTab === "profile" && (
              <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl">
                <div
                  className={`flex flex-col sm:flex-row items-center gap-8 pb-8 border-b ${isDark ? "border-slate-700" : "border-slate-100"}`}
                >
                  <div className="relative group cursor-pointer">
                    <div className="w-28 h-28 rounded-3xl bg-linear-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white text-4xl font-bold shadow-xl ring-4 ring-white dark:ring-slate-800 overflow-hidden">
                      {profileData.avatar ? (
                        <img
                          src={profileData.avatar}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        profileData.fullName.charAt(0).toUpperCase() || "?"
                      )}
                    </div>
                    <div className="absolute inset-0 bg-black/40 rounded-3xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="text-white" />
                    </div>
                  </div>

                  <div className="space-y-3 text-center sm:text-left flex-1">
                    <h3
                      className={`font-bold text-lg ${isDark ? "text-white" : "text-slate-800"}`}
                    >
                      Foto de Perfil
                    </h3>
                    <p
                      className={`text-xs max-w-xs mx-auto sm:mx-0 ${isDark ? "text-slate-400" : "text-slate-500"}`}
                    >
                      Recomendamos uma imagem de pelo menos 400x400px.
                    </p>
                    <div className="flex gap-2 justify-center sm:justify-start pt-2">
                      <button
                        className={`text-xs font-bold px-4 py-2 rounded-lg hover:opacity-80 transition-all uppercase tracking-wider ${
                          isDark
                            ? "bg-slate-700 text-slate-200"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        Remover
                      </button>
                      <button className="text-xs font-bold px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all uppercase tracking-wider shadow-lg shadow-blue-500/20">
                        Alterar
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label
                        className={`text-sm font-bold ml-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}
                      >
                        Nome Completo
                      </label>
                      <InputComponent
                        type="text"
                        value={profileData.fullName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleProfileChange("fullName", e.target.value)
                        }
                        className={`rounded-xl border outline-none transition-all px-4 py-3 w-full ${
                          isDark
                            ? "bg-slate-900 border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-100"
                            : "bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-800"
                        }`}
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        className={`text-sm font-bold ml-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}
                      >
                        E-mail Acadêmico
                      </label>
                      <InputComponent
                        type="email"
                        value={profileData.email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleProfileChange("email", e.target.value)
                        }
                        className={`rounded-xl border outline-none transition-all px-4 py-3 w-full ${
                          isDark
                            ? "bg-slate-900 border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-100"
                            : "bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-800"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </section>
            )}

            {activeTab === "notifications" && (
              <section className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 max-w-2xl">
                <div
                  className={`p-4 rounded-xl flex gap-3 border ${
                    isDark
                      ? "bg-blue-900/20 border-blue-800/30"
                      : "bg-blue-50 border-blue-100"
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg h-fit ${
                      isDark
                        ? "bg-blue-800 text-blue-300"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    <Mail size={20} />
                  </div>
                  <div>
                    <h4
                      className={`font-bold text-sm ${isDark ? "text-blue-100" : "text-blue-900"}`}
                    >
                      Resumo Semanal
                    </h4>
                    <p
                      className={`text-xs mt-1 ${isDark ? "text-blue-300" : "text-blue-700"}`}
                    >
                      Receba um e-mail toda segunda-feira com seu progresso e
                      tarefas pendentes.
                    </p>
                  </div>
                  <div className="ml-auto">
                    <ToggleSwitch
                      checked={notificationData.emailDigest}
                      onChange={() =>
                        handleNotificationChange(
                          "emailDigest",
                          !notificationData.emailDigest,
                        )
                      }
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3
                    className={`text-sm font-bold uppercase tracking-wider ml-1 ${isDark ? "text-slate-500" : "text-slate-400"}`}
                  >
                    Alertas da Plataforma
                  </h3>

                  {[
                    {
                      key: "examAlerts",
                      label: "Lembretes de Provas",
                      icon: Bell,
                      desc: "Notificar 24h antes de datas importantes.",
                    },
                    {
                      key: "newFollowers",
                      label: "Novos Seguidores",
                      icon: User,
                      desc: "Quando alguém começar a seguir seu perfil.",
                    },
                    {
                      key: "securityAlerts",
                      label: "Alertas de Segurança",
                      icon: Shield,
                      desc: "Avisos sobre logins em novos dispositivos.",
                    },
                  ].map((item) => (
                    <div
                      key={item.key}
                      className={`flex items-center justify-between p-4 border rounded-xl transition-colors ${
                        isDark
                          ? "border-slate-700 hover:bg-slate-700/50"
                          : "border-slate-100 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${isDark ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-400"}`}
                        >
                          <item.icon size={18} />
                        </div>
                        <div>
                          <p
                            className={`font-bold text-sm ${isDark ? "text-slate-200" : "text-slate-700"}`}
                          >
                            {item.label}
                          </p>
                          <p
                            className={`text-xs ${isDark ? "text-slate-500" : "text-slate-500"}`}
                          >
                            {item.desc}
                          </p>
                        </div>
                      </div>
                      <ToggleSwitch
                        checked={
                          (
                            notificationData as unknown as Record<
                              string,
                              unknown
                            >
                          )[item.key] as boolean
                        }
                        onChange={() =>
                          handleNotificationChange(
                            item.key,
                            !(
                              notificationData as unknown as Record<
                                string,
                                unknown
                              >
                            )[item.key],
                          )
                        }
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeTab === "security" && (
              <section className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 max-w-2xl">
                <div
                  className={`p-6 rounded-2xl border ${isDark ? "bg-slate-900 border-slate-700" : "bg-slate-50 border-slate-200"}`}
                >
                  <h3
                    className={`font-bold mb-4 flex items-center gap-2 ${isDark ? "text-white" : "text-slate-800"}`}
                  >
                    <Lock size={18} className="text-blue-600" />
                    Alterar Senha
                  </h3>

                  <div className="space-y-4">
                    <PasswordInput
                      autoComplete="off"
                      label="Senha Atual"
                      value={securityData.currentPassword}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleSecurityChange("currentPassword", e.target.value)
                      }
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <PasswordInput
                        autoComplete="off"
                        label="Nova Senha"
                        value={securityData.newPassword}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleSecurityChange("newPassword", e.target.value)
                        }
                      />
                      <PasswordInput
                        autoComplete="off"
                        label="Confirmar Senha"
                        value={securityData.confirmPassword}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleSecurityChange(
                            "confirmPassword",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                  </div>
                </div>

                <div
                  className={`flex items-center justify-between p-6 border rounded-2xl ${isDark ? "border-slate-700" : "border-slate-200"}`}
                >
                  <div className="flex gap-4">
                    <div
                      className={`p-3 rounded-xl h-fit ${isDark ? "bg-green-900/30 text-green-400" : "bg-green-100 text-green-600"}`}
                    >
                      <Smartphone size={24} />
                    </div>
                    <div>
                      <h4
                        className={`font-bold ${isDark ? "text-white" : "text-slate-800"}`}
                      >
                        Autenticação de Dois Fatores (2FA)
                      </h4>
                      <p
                        className={`text-sm mt-1 max-w-md ${isDark ? "text-slate-400" : "text-slate-500"}`}
                      >
                        Adicione uma camada extra de segurança à sua conta
                        exigindo um código do seu celular.
                      </p>
                    </div>
                  </div>
                  <button
                    className={`px-4 py-2 border-2 font-bold rounded-xl text-sm transition-all ${
                      isDark
                        ? "border-slate-700 text-slate-300 hover:border-blue-500 hover:text-blue-400"
                        : "border-slate-200 text-slate-600 hover:border-blue-500 hover:text-blue-600"
                    }`}
                  >
                    Configurar
                  </button>
                </div>
              </section>
            )}

            {activeTab === "appearance" && (
              <section className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 max-w-2xl">
                <div>
                  <h3
                    className={`font-bold mb-4 ${isDark ? "text-white" : "text-slate-800"}`}
                  >
                    Modo de Tema
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => !isDark && toggleTheme()}
                      className={`p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all relative ${
                        isDark
                          ? "border-blue-600 bg-blue-50/10"
                          : "border-slate-200 dark:border-slate-700 hover:border-blue-300"
                      }`}
                    >
                      <div className="w-full h-24 bg-slate-900 rounded-lg relative overflow-hidden shadow-inner">
                        <div className="absolute top-2 left-2 w-16 h-2 bg-slate-700 rounded-full"></div>
                        <div className="absolute top-6 left-2 w-10 h-2 bg-slate-700 rounded-full"></div>
                        <div className="absolute bottom-0 right-0 w-20 h-20 bg-blue-600/20 rounded-tl-full"></div>
                      </div>
                      <div
                        className={`flex items-center gap-2 font-bold ${isDark ? "text-slate-300" : "text-slate-700"}`}
                      >
                        <Moon size={18} /> Modo Escuro
                      </div>
                      {isDark && (
                        <div className="absolute top-3 right-3 text-blue-600">
                          <Check size={20} />
                        </div>
                      )}
                    </button>

                    <button
                      onClick={() => isDark && toggleTheme()}
                      className={`p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all relative ${
                        !isDark
                          ? "border-blue-600 bg-blue-50"
                          : "border-slate-200 dark:border-slate-700 hover:border-blue-300"
                      }`}
                    >
                      <div className="w-full h-24 bg-white border border-slate-200 rounded-lg relative overflow-hidden shadow-inner">
                        <div className="absolute top-2 left-2 w-16 h-2 bg-slate-200 rounded-full"></div>
                        <div className="absolute top-6 left-2 w-10 h-2 bg-slate-200 rounded-full"></div>
                        <div className="absolute bottom-0 right-0 w-20 h-20 bg-blue-100 rounded-tl-full"></div>
                      </div>
                      <div
                        className={`flex items-center gap-2 font-bold ${isDark ? "text-slate-300" : "text-slate-700"}`}
                      >
                        <Sun size={18} /> Modo Claro
                      </div>
                      {!isDark && (
                        <div className="absolute top-3 right-3 text-blue-600">
                          <Check size={20} />
                        </div>
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3
                    className={`font-bold ${isDark ? "text-white" : "text-slate-800"}`}
                  >
                    Cores de Destaque
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    {[
                      "#2563eb",
                      "#059669",
                      "#7c3aed",
                      "#db2777",
                      "#ea580c",
                    ].map((color) => (
                      <ColorOption
                        key={color}
                        color={color}
                        active={accentColor === color}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        onClick={() => setAccentColor(color as any)}
                      />
                    ))}
                  </div>
                </div>
              </section>
            )}
          </div>

          <div
            className={`p-6 border-t flex flex-col sm:flex-row justify-between items-center gap-4 transition-all ${
              isDark
                ? "bg-slate-900/50 border-slate-700"
                : "bg-slate-50 border-slate-200"
            }`}
          >
            <p
              className={`text-sm font-medium italic transition-opacity ${
                hasChanges ? "opacity-100 text-amber-600" : "opacity-0"
              }`}
            >
              Você tem alterações não salvas.
            </p>
            <div className="flex gap-3 w-full sm:w-auto">
              <button
                onClick={handleDiscard}
                disabled={!hasChanges || isLoading}
                className={`flex-1 sm:flex-none px-6 py-2.5 font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  isDark
                    ? "text-slate-400 hover:text-white"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Descartar
              </button>
              <button
                onClick={handleSave}
                disabled={!hasChanges || isLoading}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-2.5 rounded-xl shadow-lg transition-all font-bold text-white ${
                  hasChanges
                    ? "bg-blue-600 hover:bg-blue-700 hover:scale-105 shadow-blue-500/30"
                    : "bg-slate-300 dark:bg-slate-700 cursor-not-allowed text-slate-500"
                }`}
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Save size={18} />
                )}
                {isLoading ? "Salvando..." : "Salvar Alterações"}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}