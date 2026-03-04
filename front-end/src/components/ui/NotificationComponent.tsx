import { CheckCircle, XCircle, Info, X } from "lucide-react";
import { useEffect } from "react";
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
      bg: "bg-sky-50 dark:bg-sky-900/40",
      border: "border-sky-200 dark:border-sky-800",
      text: "text-sky-900 dark:text-sky-200",
      icon: <Info size={20} className="text-sky-600 dark:text-sky-400" />,
    },
  };
  const styles = NOTIFICATION_VARIANTS[type] || NOTIFICATION_VARIANTS.info;

  return (
    <div
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
