import { CheckCircle, XCircle, Info, X } from "lucide-react";
import { useEffect, useRef } from "react"; // Adicionado useRef aqui
import { Button } from "react-aria-components";

interface NotificationProps {
  type: "success" | "error" | "info";
  message: string;
  onClose: () => void;
  duration?: number;
}

export function NotificationComponent({
  type,
  message,
  onClose,
  duration = 3000,
}: NotificationProps) {
  // 1. Criamos a referência para a div da notificação
  const notificationRef = useRef<HTMLDivElement>(null);

  // 2. Novo useEffect para rolar a página até a notificação quando ela aparecer
  useEffect(() => {
    if (notificationRef.current) {
      notificationRef.current.scrollIntoView({
        behavior: "smooth", // Faz a rolagem ser suave
        block: "center", // Tenta centralizar a notificação na tela
      });
    }
  }, []); // O array vazio garante que rode apenas quando o componente montar

  // Seu useEffect original para fechar a notificação
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const NOTIFICATION_VARIANTS = {
    success: {
      bg: "bg-green-50 dark:bg-green-900/40",
      border: "border-green-200 dark:border-green-800",
      text: "text-green-800 dark:text-green-200",
      icon: (
        <CheckCircle size={20} className="text-green-600 dark:text-green-400" />
      ),
    },
    error: {
      bg: "bg-red-50 dark:bg-red-900/40",
      border: "border-red-200 dark:border-red-800",
      text: "text-red-900 dark:text-red-200",
      icon: <XCircle size={20} className="text-red-600 dark:text-red-400" />,
    },
    info: {
      bg: "bg-blue-50 dark:bg-blue-900/40",
      border: "border-blue-200 dark:border-sky-800",
      text: "text-blue-900 dark:text-blue-200",
      icon: <Info size={20} className="text-blue-600 dark:text-blue-400" />,
    },
  };

  const styles = NOTIFICATION_VARIANTS[type] || NOTIFICATION_VARIANTS.info;

  return (
    <div
      ref={notificationRef} // 3. Anexamos a referência à div principal
      className={`p-4 rounded-xl border flex items-center gap-3 ${styles.bg} ${styles.border} animate-in slide-in-from-top-5 duration-300`}
    >
      {styles.icon}
      <p className={`text-sm font-medium flex-1  ${styles.text}`}>{message}</p>
      <Button
        onPress={onClose}
        className={`${styles.text} hover:opacity-70 transition-opacity`}
        aria-label="Fechar notificação"
      >
        <X size={18} />
      </Button>
    </div>
  );
}
