import {
  Dialog,
  Modal,
  ModalOverlay,
  Button,
  Heading,
} from "react-aria-components";
import { AlertTriangle, CheckCircle, Info, XCircle, X } from "lucide-react";
import { useState, type ReactNode } from "react";
interface ConfirmDialogProps {
  // Controle do dialog
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;

  // Conteúdo
  title?: string;
  message?: string | ReactNode;

  // Botões
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;

  // Variantes
  variant?: "info" | "success" | "warning" | "danger";

  // Opções
  showCancelButton?: boolean;
  isLoading?: boolean;
  isDark?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onOpenChange,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
  variant = "info",
  showCancelButton = true,
  isLoading = false,
  isDark = false,
}: ConfirmDialogProps) {
  const handleConfirm = async () => {
    if (onConfirm) {
      await onConfirm();
    }
    if (onOpenChange) {
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    if (onOpenChange) {
      onOpenChange(false);
    }
  };

  // Configuração de variantes
  const variantConfig = {
    info: {
      icon: Info,
      iconBg: isDark ? "bg-blue-900/30" : "bg-blue-100",
      iconColor: isDark ? "text-blue-400" : "text-blue-600",
      confirmBg: "bg-blue-600 hover:bg-blue-700",
    },
    success: {
      icon: CheckCircle,
      iconBg: isDark ? "bg-green-900/30" : "bg-green-100",
      iconColor: isDark ? "text-green-400" : "text-green-600",
      confirmBg: "bg-green-600 hover:bg-green-700",
    },
    warning: {
      icon: AlertTriangle,
      iconBg: isDark ? "bg-amber-900/30" : "bg-amber-100",
      iconColor: isDark ? "text-amber-400" : "text-amber-600",
      confirmBg: "bg-amber-600 hover:bg-amber-700",
    },
    danger: {
      icon: XCircle,
      iconBg: isDark ? "bg-red-900/30" : "bg-red-100",
      iconColor: isDark ? "text-red-400" : "text-red-600",
      confirmBg: "bg-red-600 hover:bg-red-700",
    },
  };

  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <ModalOverlay
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm data-entering:animate-in data-[entering]:fade-in data-exiting:animate-out data-[exiting]:fade-out"
      isDismissable={!isLoading}
    >
      <Modal
        className={`w-full max-w-md rounded-2xl shadow-2xl data-entering:animate-in data-[entering]:zoom-in-95 data-exiting:animate-out data-[exiting]:zoom-out-95 ${
          isDark
            ? "bg-slate-800 border border-slate-700"
            : "bg-white border border-slate-200"
        }`}
      >
        <Dialog className="outline-none">
          {({ close }) => (
            <>
              {/* Header com ícone */}
              <div className="p-6 pb-4">
                <div className="flex items-start gap-4">
                  {/* Ícone */}
                  <div
                    className={`p-3 rounded-xl shrink-0 ${config.iconBg} ${config.iconColor}`}
                  >
                    <Icon size={24} />
                  </div>

                  {/* Título e botão fechar */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <Heading
                        slot="title"
                        className={`text-lg font-bold ${
                          isDark ? "text-white" : "text-slate-900"
                        }`}
                      >
                        {title}
                      </Heading>

                      {!isLoading && (
                        <Button
                          onPress={close}
                          className={`p-1 rounded-lg transition-colors shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
                            isDark
                              ? "text-slate-400 hover:text-white hover:bg-slate-700"
                              : "text-slate-400 hover:text-slate-900 hover:bg-slate-100"
                          }`}
                        >
                          <X size={20} />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Mensagem */}
              <div className="px-6 pb-6">
                <div
                  className={`text-sm leading-relaxed ${
                    isDark ? "text-slate-300" : "text-slate-600"
                  }`}
                >
                  {typeof message === "string" ? <p>{message}</p> : message}
                </div>
              </div>

              {/* Botões de ação */}
              <div
                className={`p-6 pt-4 border-t flex gap-3 justify-end ${
                  isDark ? "border-slate-700" : "border-slate-200"
                }`}
              >
                {showCancelButton && (
                  <Button
                    onPress={handleCancel}
                    isDisabled={isLoading}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed ${
                      isDark
                        ? "text-slate-300 hover:bg-slate-700"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {cancelText}
                  </Button>
                )}

                <Button
                  onPress={handleConfirm}
                  isDisabled={isLoading}
                  className={`px-6 py-2 rounded-lg font-semibold text-sm text-white transition-all shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary disabled:opacity-50 disabled:cursor-not-allowed ${config.confirmBg}`}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span>Processando...</span>
                    </div>
                  ) : (
                    confirmText
                  )}
                </Button>
              </div>
            </>
          )}
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useConfirmDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogConfig, setDialogConfig] = useState<Partial<ConfirmDialogProps>>(
    {},
  );

  const confirm = (config: Partial<ConfirmDialogProps>) => {
    return new Promise<boolean>((resolve) => {
      setDialogConfig({
        ...config,
        onConfirm: async () => {
          if (config.onConfirm) {
            await config.onConfirm();
          }
          setIsOpen(false);
          resolve(true);
        },
        onCancel: () => {
          if (config.onCancel) {
            config.onCancel();
          }
          setIsOpen(false);
          resolve(false);
        },
      });
      setIsOpen(true);
    });
  };

  return {
    isOpen,
    setIsOpen,
    confirm,
    dialogConfig,
  };
}
