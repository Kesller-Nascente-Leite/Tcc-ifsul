import { createContext, useContext, useState, type ReactNode } from "react";

export interface ProfileData {
  fullName: string;
  email: string;
  bio: string;
  avatar: string | null;
}

export interface NotificationData {
  emailDigest: boolean;
  examAlerts: boolean;
  newFollowers: boolean;
  securityAlerts: boolean;
}

export interface PreferencesContextType {
  profileData: ProfileData;
  setProfileData: (
    data: ProfileData | ((prev: ProfileData) => ProfileData),
  ) => void;
  notificationData: NotificationData;
  setNotificationData: (
    data: NotificationData | ((prev: NotificationData) => NotificationData),
  ) => void;
  isLoading: boolean;
  savePreferences: () => Promise<void>;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(
  undefined,
);

const DEFAULT_PROFILE: ProfileData = {
  fullName: "",
  email: "",
  bio: "",
  avatar: null,
};

const DEFAULT_NOTIFICATIONS: NotificationData = {
  emailDigest: true,
  examAlerts: true,
  newFollowers: false,
  securityAlerts: true,
};

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [profileData, setProfileDataState] = useState<ProfileData>(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });

  const [notificationData, setNotificationDataState] =
    useState<NotificationData>(() => {
      const saved = localStorage.getItem("userNotifications");
      return saved ? JSON.parse(saved) : DEFAULT_NOTIFICATIONS;
    });

  const [isLoading, setIsLoading] = useState(false);

  const setProfileData = (
    data: ProfileData | ((prev: ProfileData) => ProfileData),
  ) => {
    setProfileDataState((prev) => {
      const newData = typeof data === "function" ? data(prev) : data;
      localStorage.setItem("user", JSON.stringify(newData));
      return newData;
    });
  };

  const setNotificationData = (
    data: NotificationData | ((prev: NotificationData) => NotificationData),
  ) => {
    setNotificationDataState((prev) => {
      const newData = typeof data === "function" ? data(prev) : data;
      localStorage.setItem("userNotifications", JSON.stringify(newData));
      return newData;
    });
  };

  const savePreferences = async () => {
    setIsLoading(true);
    try {
      // Simula chamada API
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // Em produção, fazer chamada real para backend
      console.log("Preferências salvas:", { profileData, notificationData });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PreferencesContext.Provider
      value={{
        profileData,
        setProfileData,
        notificationData,
        setNotificationData,
        isLoading,
        savePreferences,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error("usePreferences must be used within a PreferencesProvider");
  }
  return context;
}
