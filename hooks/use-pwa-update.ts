import { useState, useEffect } from "react";

interface UsePWAUpdateReturn {
  updateAvailable: boolean;
  isChecking: boolean;
  isUpdating: boolean;
  checkForUpdate: () => Promise<void>;
  applyUpdate: () => Promise<void>;
  lastChecked: Date | null;
}

export function usePWAUpdate(): UsePWAUpdateReturn {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  useEffect(() => {
    const handleUpdateAvailable = () => {
      setUpdateAvailable(true);
    };

    const handleNoUpdate = () => {
      setIsChecking(false);
      setLastChecked(new Date());
    };

    const handleUpdateError = () => {
      setIsChecking(false);
    };

    // Listen for PWA update events
    window.addEventListener("pwa-update-available", handleUpdateAvailable);
    window.addEventListener("pwa-no-update-available", handleNoUpdate);
    window.addEventListener("pwa-update-error", handleUpdateError);

    return () => {
      window.removeEventListener("pwa-update-available", handleUpdateAvailable);
      window.removeEventListener("pwa-no-update-available", handleNoUpdate);
      window.removeEventListener("pwa-update-error", handleUpdateError);
    };
  }, []);

  const checkForUpdate = async () => {
    if (typeof window !== "undefined" && (window as any).checkPWAUpdate) {
      setIsChecking(true);
      try {
        await (window as any).checkPWAUpdate();
      } catch (error) {
        console.error("Error checking for update:", error);
        setIsChecking(false);
      }
    }
  };

  const applyUpdate = async () => {
    if (typeof window !== "undefined" && (window as any).applyPWAUpdate) {
      setIsUpdating(true);
      try {
        await (window as any).applyPWAUpdate();
      } catch (error) {
        console.error("Error applying update:", error);
        setIsUpdating(false);
      }
    }
  };

  return {
    updateAvailable,
    isChecking,
    isUpdating,
    checkForUpdate,
    applyUpdate,
    lastChecked,
  };
}
