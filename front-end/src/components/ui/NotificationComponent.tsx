import { CheckCircle, XCircle, Info, X } from "lucide-react";
import { useEffect } from "react";

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

  const getNotificationStyles = () => {
    switch (type) {
      case "success":
        return {
          bg: "bg-green-50 dark:bg-green-900/20",
          border: "border-green-200 dark:border-green-800",
          text: "text-green-800 dark:text-green-200",
          icon: (
            <CheckCircle
              size={20}
              className="text-green-600 dark:text-green-400"
            />
          ),
        };
      case "error":
        return {
          bg: "bg-red-50 dark:bg-red-900/20",
          border: "border-red-200 dark:border-red-800",
          text: "text-red-800 dark:text-red-200",
          icon: (
            <XCircle size={20} className="text-red-600 dark:text-red-400" />
          ),
        };
      case "info":
        return {
          bg: "bg-blue-50 dark:bg-blue-900/20",
          border: "border-blue-200 dark:border-blue-800",
          text: "text-blue-800 dark:text-blue-200",
          icon: <Info size={20} className="text-blue-600 dark:text-blue-400" />,
        };
    }
  };

  const styles = getNotificationStyles();

  return (
    <div
      className={`p-4 rounded-xl border flex items-center gap-3 ${styles.bg} ${styles.border} animate-in slide-in-from-top-5 duration-300`}
    >
      {styles.icon}
      <p className={`text-sm font-medium flex-1 ${styles.text}`}>{message}</p>
      <button
        onClick={onClose}
        className={`${styles.text} hover:opacity-70 transition-opacity`}
        aria-label="Fechar notificação"
      >
        <X size={18} />
      </button>
    </div>
  );
}