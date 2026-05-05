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
import {
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Button,
  Switch,
} from "react-aria-components";
import { useTheme } from "@/app/providers/ThemeContext";
import { usePreferences } from "@/app/providers/PreferencesContext";
import { InputComponent } from "@/shared/components/ui/InputComponent";
import { PasswordInput } from "@/shared/components/ui/PasswordInput";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: () => void;
  label?: string;
}

const ToggleSwitch = ({ checked, onChange, label }: ToggleSwitchProps) => (
  <Switch
    isSelected={checked}
    onChange={onChange}
    className="group inline-flex items-center gap-2"
  >
    <div
      className="w-12 h-7 rounded-full transition-all relative focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
      style={{
        backgroundColor: checked
          ? "var(--accent-color)"
          : "var(--color-border-hover)",
      }}
    >
      <div
        className={`w-5 h-5 rounded-full shadow-md absolute top-1 transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
        style={{ backgroundColor: "white" }}
      />
    </div>
    {label && (
      <span className="text-sm" style={{ color: "var(--color-text-primary)" }}>
        {label}
      </span>
    )}
  </Switch>
);

interface ColorOptionProps {
  color: string;
  active?: boolean;
  onClick: () => void;
}

function ColorOption({ color, active = false, onClick }: ColorOptionProps) {
  return (
    <Button
      onPress={onClick}
      className="w-10 h-10 rounded-full cursor-pointer transition-all hover:scale-110 pressed:scale-95 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
      style={{
        backgroundColor: color,
        border: active ? `2px solid var(--accent-color)` : "none",
        boxShadow: active ? "var(--shadow-lg)" : "var(--shadow-sm)",
      }}
    >
      {active && <Check size={16} className="text-white drop-shadow-md" />}
    </Button>
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
          "Houve um erro ao pegar as informações do usuário:",
          error,
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleProfileChange = (field: string, value: unknown) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleLogoult = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  }

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
      if (securityData.newPassword) {
        if (securityData.newPassword !== securityData.confirmPassword) {
          setToastMessage("As senhas não coincidem!");
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
          return;
        }
      }

      await savePreferences();
      setHasChanges(false);
      setShowToast(true);
      setToastMessage("Suas alterações foram salvas com sucesso!");

      setSecurityData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      setToastMessage("Erro ao salvar alterações. " + error);
      setShowToast(true);
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
      className="min-h-screen p-4 md:p-8 flex justify-center transition-colors duration-300"
      style={{
        backgroundColor: "var(--color-bg-main)",
        color: "var(--color-text-primary)",
      }}
    >
      {/* Toast Notification */}
      {showToast && (
        <div
          className="fixed top-4 right-4 text-white px-6 py-3 rounded-xl flex items-center gap-3 z-50"
          style={{
            backgroundColor: "var(--color-success)",
            boxShadow: "var(--shadow-xl)",
          }}
        >
          <div
            className="p-1 rounded-full"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
          >
            <Check size={16} />
          </div>
          <div>
            <p className="font-bold text-sm">Sucesso!</p>
            <p className="text-xs opacity-90">{toastMessage}</p>
          </div>
          <Button
            onPress={() => setShowToast(false)}
            className="ml-2 rounded p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 hover:bg-white/20 transition-colors"
          >
            <X size={14} />
          </Button>
        </div>
      )}

      <div className="max-w-6xl w-full">
        <Tabs defaultSelectedKey="profile">
          <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8">
            {/* Sidebar */}
            <aside className="space-y-6">
              <div className="px-2">
                <h1
                  className="text-2xl font-bold uppercase tracking-tight"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  Ajustes
                </h1>
                <p
                  className="text-xs font-medium mt-1"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  GERENCIE SUA CONTA
                </p>
              </div>

              <TabList className="space-y-2" aria-label="Configurações">
                {menuItems.map((item) => (
                  <Tab
                    key={item.id}
                    id={item.id}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary data-selected:text-white"
                    style={{
                      color: "var(--color-text-secondary)",
                      backgroundColor: "transparent",
                    }}
                    data-selected-style={{
                      backgroundColor: "var(--accent-color)",
                      boxShadow: "var(--shadow-md)",
                    }}
                  >
                    {({ isSelected }) => (
                      <div
                        className="w-full flex items-center gap-3"
                        style={{
                          backgroundColor: isSelected
                            ? "var(--accent-color)"
                            : "transparent",
                          color: isSelected
                            ? "white"
                            : "var(--color-text-secondary)",
                          padding: "inherit",
                          borderRadius: "inherit",
                        }}
                      >
                        <item.icon size={20} />
                        <span className="font-semibold text-sm">
                          {item.label}
                        </span>
                      </div>
                    )}
                  </Tab>
                ))}
              </TabList>

              <div
                className="pt-8 border-t"
                style={{ borderColor: "var(--color-border)" }}
              >
                <Button
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm focus:outline-none focus-visible:ring-2"
                  style={{
                    color: "var(--color-error)",
                    backgroundColor: "transparent",
                  }}
                  onHoverStart={(e) => {
                    (e.target as HTMLElement).style.backgroundColor =
                      "var(--color-error-light)";
                  }}
                  onHoverEnd={(e) => {
                    (e.target as HTMLElement).style.backgroundColor =
                      "transparent";
                  }}
                  onPress={handleLogoult}
                >
                  <LogOut size={20} />
                  <span>Sair da conta</span>
                </Button>
              </div>
            </aside>

            {/* Main Content */}
            <div
              className="border rounded-3xl overflow-hidden transition-colors duration-300"
              style={{
                backgroundColor: "var(--color-surface)",
                borderColor: "var(--color-border)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              {/* Profile TabPanel */}
              <TabPanel id="profile" className="flex flex-col h-full">
                <TabPanelContent
                  title="Perfil"
                  description="Gerencie suas informações pessoais"
                  icon={User}
                >
                  <section className="space-y-8 max-w-2xl">
                    {/* Avatar Section */}
                    <div
                      className="flex flex-col sm:flex-row items-center gap-8 pb-8 border-b"
                      style={{ borderColor: "var(--color-border)" }}
                    >
                      <div className="relative group cursor-pointer">
                        <div
                          className="w-28 h-28 rounded-3xl flex items-center justify-center text-white text-4xl font-bold overflow-hidden"
                          style={{
                            background: `linear-gradient(135deg, var(--accent-color), var(--color-primary-hover))`,
                            boxShadow: "var(--shadow-lg)",
                          }}
                        >
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
                          className="font-bold text-lg"
                          style={{ color: "var(--color-text-primary)" }}
                        >
                          Foto de Perfil
                        </h3>
                        <p
                          className="text-xs max-w-xs mx-auto sm:mx-0"
                          style={{ color: "var(--color-text-secondary)" }}
                        >
                          Recomendamos uma imagem de pelo menos 400x400px.
                        </p>
                        <div className="flex gap-2 justify-center sm:justify-start pt-2">
                          <Button
                            className="text-xs font-bold px-4 py-2 rounded-lg hover:opacity-80 transition-all uppercase tracking-wider"
                            style={{
                              backgroundColor: "var(--color-surface-hover)",
                              color: "var(--color-text-secondary)",
                            }}
                          >
                            Remover
                          </Button>
                          <Button
                            className="text-xs font-bold px-4 py-2 rounded-lg hover:opacity-90 transition-all uppercase tracking-wider text-white"
                            style={{
                              backgroundColor: "var(--accent-color)",
                              boxShadow: "var(--shadow-md)",
                            }}
                          >
                            Alterar
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label
                          className="text-sm font-bold ml-1"
                          style={{ color: "var(--color-text-secondary)" }}
                        >
                          Nome Completo
                        </label>
                        <InputComponent
                          type="text"
                          value={profileData.fullName}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleProfileChange("fullName", e.target.value)
                          }
                          className="rounded-xl border outline-none transition-all px-4 py-3 w-full focus:ring-2"
                          style={{
                            backgroundColor: "var(--color-surface-secondary)",
                            borderColor: "var(--color-border)",
                            color: "var(--color-text-primary)",
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          className="text-sm font-bold ml-1"
                          style={{ color: "var(--color-text-secondary)" }}
                        >
                          E-mail Acadêmico
                        </label>
                        <InputComponent
                          type="email"
                          value={profileData.email}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleProfileChange("email", e.target.value)
                          }
                          className="rounded-xl border outline-none transition-all px-4 py-3 w-full focus:ring-2"
                          style={{
                            backgroundColor: "var(--color-surface-secondary)",
                            borderColor: "var(--color-border)",
                            color: "var(--color-text-primary)",
                          }}
                        />
                      </div>
                    </div>
                  </section>
                </TabPanelContent>

                <FooterActions
                  hasChanges={hasChanges}
                  isLoading={isLoading}
                  onSave={handleSave}
                  onDiscard={handleDiscard}
                />
              </TabPanel>

              {/* Notifications TabPanel */}
              <TabPanel id="notifications" className="flex flex-col h-full">
                <TabPanelContent
                  title="Notificações"
                  description="Escolha como quer ser avisado"
                  icon={Bell}
                >
                  <section className="space-y-6 max-w-2xl">
                    {/* Email Digest Card */}
                    <div
                      className="p-4 rounded-xl flex gap-3 border"
                      style={{
                        backgroundColor: "var(--color-info-light)",
                        borderColor: "rgba(var(--accent-rgb), 0.3)",
                      }}
                    >
                      <div
                        className="p-2 rounded-lg h-fit"
                        style={{
                          backgroundColor: "var(--accent-color)",
                          color: "white",
                        }}
                      >
                        <Mail size={20} />
                      </div>
                      <div className="flex-1">
                        <h4
                          className="font-bold text-sm"
                          style={{ color: "var(--color-text-primary)" }}
                        >
                          Resumo Semanal
                        </h4>
                        <p
                          className="text-xs mt-1"
                          style={{ color: "var(--color-text-secondary)" }}
                        >
                          Receba um e-mail toda segunda-feira com seu progresso
                          e tarefas pendentes.
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

                    {/* Platform Alerts */}
                    <div className="space-y-4">
                      <h3
                        className="text-sm font-bold uppercase tracking-wider ml-1"
                        style={{ color: "var(--color-text-tertiary)" }}
                      >
                        Alertas da Plataforma
                      </h3>

                      {[
                        {
                          key: "examAlerts",
                          label: "Lembretes de Atividades",
                          icon: Bell,
                          desc: "Notificar 24h antes da atividade expirar.",
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
                          className="flex items-center justify-between p-4 border rounded-xl transition-all hover:shadow-sm"
                          style={{
                            borderColor: "var(--color-border)",
                            backgroundColor: "transparent",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "var(--color-surface-hover)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "transparent";
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="p-2 rounded-lg"
                              style={{
                                backgroundColor: "var(--color-surface-hover)",
                                color: "var(--color-text-tertiary)",
                              }}
                            >
                              <item.icon size={18} />
                            </div>
                            <div>
                              <p
                                className="font-bold text-sm"
                                style={{ color: "var(--color-text-primary)" }}
                              >
                                {item.label}
                              </p>
                              <p
                                className="text-xs"
                                style={{ color: "var(--color-text-secondary)" }}
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
                </TabPanelContent>

                <FooterActions
                  hasChanges={hasChanges}
                  isLoading={isLoading}
                  onSave={handleSave}
                  onDiscard={handleDiscard}
                />
              </TabPanel>

              {/* Security TabPanel */}
              <TabPanel id="security" className="flex flex-col h-full">
                <TabPanelContent
                  title="Segurança"
                  description="Proteja sua conta e dados"
                  icon={Lock}
                >
                  <section className="space-y-8 max-w-2xl">
                    {/* Change Password */}
                    <div
                      className="p-6 rounded-2xl border"
                      style={{
                        backgroundColor: "var(--color-surface-secondary)",
                        borderColor: "var(--color-border)",
                      }}
                    >
                      <h3
                        className="font-bold mb-4 flex items-center gap-2"
                        style={{ color: "var(--color-text-primary)" }}
                      >
                        <Lock
                          size={18}
                          style={{ color: "var(--accent-color)" }}
                        />
                        Alterar Senha
                      </h3>

                      <div className="space-y-4">
                        <PasswordInput
                          autoComplete="off"
                          label="Senha Atual"
                          placeholder="Digite sua senha atual"
                          value={securityData.currentPassword}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleSecurityChange(
                              "currentPassword",
                              e.target.value,
                            )
                          }
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <PasswordInput
                            autoComplete="off"
                            label="Nova Senha"
                            placeholder="Digite sua nova senha"
                            value={securityData.newPassword}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>,
                            ) =>
                              handleSecurityChange(
                                "newPassword",
                                e.target.value,
                              )
                            }
                          />
                          <PasswordInput
                            autoComplete="off"
                            label="Confirmar Senha"
                            placeholder="Confirme sua nova senha"
                            value={securityData.confirmPassword}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>,
                            ) =>
                              handleSecurityChange(
                                "confirmPassword",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>

                    {/* 2FA */}
                    <div
                      className="flex items-center justify-between p-6 border rounded-2xl"
                      style={{ borderColor: "var(--color-border)" }}
                    >
                      <div className="flex gap-4">
                        <div
                          className="p-3 rounded-xl h-fit"
                          style={{
                            backgroundColor: "var(--color-success-light)",
                            color: "var(--color-success)",
                          }}
                        >
                          <Smartphone size={24} />
                        </div>
                        <div>
                          <h4
                            className="font-bold"
                            style={{ color: "var(--color-text-primary)" }}
                          >
                            Autenticação de Dois Fatores (2FA)
                          </h4>
                          <p
                            className="text-sm mt-1 max-w-md"
                            style={{ color: "var(--color-text-secondary)" }}
                          >
                            Adicione uma camada extra de segurança à sua conta
                            exigindo um código do seu celular.
                          </p>
                        </div>
                      </div>
                      <Button
                        className="px-4 py-2 border-2 font-bold rounded-xl text-sm transition-all hover:opacity-80"
                        style={{
                          borderColor: "var(--color-border-hover)",
                          color: "var(--accent-color)",
                        }}
                      >
                        Configurar
                      </Button>
                    </div>
                  </section>
                </TabPanelContent>

                <FooterActions
                  hasChanges={hasChanges}
                  isLoading={isLoading}
                  onSave={handleSave}
                  onDiscard={handleDiscard}
                />
              </TabPanel>

              {/* Appearance TabPanel */}
              <TabPanel id="appearance" className="flex flex-col h-full">
                <TabPanelContent
                  title="Aparência"
                  description="Personalize a interface"
                  icon={Palette}
                >
                  <section className="space-y-8 max-w-2xl">
                    {/* Theme Mode */}
                    <div>
                      <h3
                        className="font-bold mb-4"
                        style={{ color: "var(--color-text-primary)" }}
                      >
                        Modo de Tema
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        {/* Dark Mode */}
                        <Button
                          onPress={() => !isDark && toggleTheme()}
                          className="p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all relative hover:scale-105"
                          style={{
                            borderColor: isDark
                              ? "var(--accent-color)"
                              : "var(--color-border)",
                            backgroundColor: isDark
                              ? "rgba(var(--accent-rgb), 0.1)"
                              : "transparent",
                          }}
                        >
                          <div
                            className="w-full h-24 rounded-lg relative overflow-hidden"
                            style={{
                              backgroundColor: "#18181b",
                              boxShadow: "var(--shadow-sm)",
                            }}
                          >
                            <div
                              className="absolute top-2 left-2 w-16 h-2 rounded-full"
                              style={{ backgroundColor: "#3f3f46" }}
                            />
                            <div
                              className="absolute top-6 left-2 w-10 h-2 rounded-full"
                              style={{ backgroundColor: "#3f3f46" }}
                            />
                            <div
                              className="absolute bottom-0 right-0 w-20 h-20 rounded-tl-full"
                              style={{
                                backgroundColor: "rgba(var(--accent-rgb), 0.2)",
                              }}
                            />
                          </div>
                          <div
                            className="flex items-center gap-2 font-bold"
                            style={{ color: "var(--color-text-primary)" }}
                          >
                            <Moon size={18} /> Modo Escuro
                          </div>
                          {isDark && (
                            <div
                              className="absolute top-3 right-3"
                              style={{ color: "var(--accent-color)" }}
                            >
                              <Check size={20} />
                            </div>
                          )}
                        </Button>

                        {/* Light Mode */}
                        <Button
                          onPress={() => isDark && toggleTheme()}
                          className="p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all relative hover:scale-105"
                          style={{
                            borderColor: !isDark
                              ? "var(--accent-color)"
                              : "var(--color-border)",
                            backgroundColor: !isDark
                              ? "rgba(var(--accent-rgb), 0.1)"
                              : "transparent",
                          }}
                        >
                          <div
                            className="w-full h-24 rounded-lg relative overflow-hidden"
                            style={{
                              backgroundColor: "white",
                              border: "1px solid var(--color-border)",
                              boxShadow: "var(--shadow-sm)",
                            }}
                          >
                            <div
                              className="absolute top-2 left-2 w-16 h-2 rounded-full"
                              style={{ backgroundColor: "#e4e4e7" }}
                            />
                            <div
                              className="absolute top-6 left-2 w-10 h-2 rounded-full"
                              style={{ backgroundColor: "#e4e4e7" }}
                            />
                            <div
                              className="absolute bottom-0 right-0 w-20 h-20 rounded-tl-full"
                              style={{
                                backgroundColor:
                                  "rgba(var(--accent-rgb), 0.15)",
                              }}
                            />
                          </div>
                          <div
                            className="flex items-center gap-2 font-bold"
                            style={{ color: "var(--color-text-primary)" }}
                          >
                            <Sun size={18} /> Modo Claro
                          </div>
                          {!isDark && (
                            <div
                              className="absolute top-3 right-3"
                              style={{ color: "var(--accent-color)" }}
                            >
                              <Check size={20} />
                            </div>
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Accent Colors */}
                    <div className="space-y-4">
                      <h3
                        className="font-bold"
                        style={{ color: "var(--color-text-primary)" }}
                      >
                        Cores de Destaque
                      </h3>
                      <div className="flex flex-wrap gap-4">
                        {[
                          "#3b82f6",
                          "#10b981",
                          "#8b5cf6",
                          "#ec4899",
                          "#f59e0b",
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
                </TabPanelContent>

                <FooterActions
                  hasChanges={hasChanges}
                  isLoading={isLoading}
                  onSave={handleSave}
                  onDiscard={handleDiscard}
                />
              </TabPanel>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
}

interface TabPanelContentProps {
  title: string;
  description: string;
  icon: React.ElementType;
  children: React.ReactNode;
}

function TabPanelContent({
  title,
  description,
  icon: Icon,
  children,
}: TabPanelContentProps) {
  return (
    <>
      <div
        className="p-6 md:p-8 border-b"
        style={{ borderColor: "var(--color-border)" }}
      >
        <h2
          className="text-2xl font-bold flex items-center gap-3"
          style={{ color: "var(--color-text-primary)" }}
        >
          <Icon style={{ color: "var(--accent-color)" }} size={28} />
          {title}
        </h2>
        <p
          className="mt-1 text-sm"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {description}
        </p>
      </div>
      <div className="p-6 md:p-10 flex-1 overflow-y-auto">{children}</div>
    </>
  );
}

interface FooterActionsProps {
  hasChanges: boolean;
  isLoading: boolean;
  onSave: () => void;
  onDiscard: () => void;
}

function FooterActions({
  hasChanges,
  isLoading,
  onSave,
  onDiscard,
}: FooterActionsProps) {
  return (
    <div
      className="p-6 border-t flex flex-col sm:flex-row justify-between items-center gap-4 transition-all"
      style={{
        backgroundColor: "var(--color-surface-secondary)",
        borderColor: "var(--color-border)",
      }}
    >
      <p
        className="text-sm font-medium italic transition-opacity"
        style={{
          opacity: hasChanges ? 1 : 0,
          color: "var(--color-warning)",
        }}
      >
        Você tem alterações não salvas.
      </p>
      <div className="flex gap-3 w-full sm:w-auto">
        <Button
          onPress={onDiscard}
          isDisabled={!hasChanges || isLoading}
          className="flex-1 sm:flex-none px-6 py-2.5 font-bold transition-all rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-80"
          style={{
            color: "var(--color-text-secondary)",
          }}
        >
          Descartar
        </Button>
        <Button
          onPress={onSave}
          isDisabled={!hasChanges || isLoading}
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-2.5 rounded-xl transition-all font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
          style={{
            backgroundColor: hasChanges
              ? "var(--accent-color)"
              : "var(--color-border-hover)",
            boxShadow: hasChanges ? "var(--shadow-lg)" : "none",
          }}
        >
          {isLoading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <Save size={18} />
          )}
          {isLoading ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>
    </div>
  );
}
