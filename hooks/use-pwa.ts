import { useEffect, useState } from "react";

interface PWAHookReturn {
  isInstalled: boolean;
  canInstall: boolean;
  isOnline: boolean;
  installPWA: () => void;
  checkForUpdates: () => void;
  isUpdateAvailable: boolean;
}

export function usePWA(): PWAHookReturn {
  const [isInstalled, setIsInstalled] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);

  useEffect(() => {
    // Check if PWA is already installed
    const checkInstallStatus = () => {
      const isStandalone = window.matchMedia(
        "(display-mode: standalone)"
      ).matches;
      const isInWebAppiOS = (window.navigator as any).standalone === true;
      setIsInstalled(isStandalone || isInWebAppiOS);
    };

    checkInstallStatus();

    // Listen for PWA events
    const handleInstallAvailable = () => setCanInstall(true);
    const handleInstalled = () => {
      setIsInstalled(true);
      setCanInstall(false);
    };
    const handleAlreadyInstalled = () => setIsInstalled(true);
    const handleUpdateAvailable = () => setIsUpdateAvailable(true);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("pwa-install-available", handleInstallAvailable);
    window.addEventListener("pwa-installed", handleInstalled);
    window.addEventListener("pwa-already-installed", handleAlreadyInstalled);
    window.addEventListener("pwa-update-available", handleUpdateAvailable);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Set initial online status
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener(
        "pwa-install-available",
        handleInstallAvailable
      );
      window.removeEventListener("pwa-installed", handleInstalled);
      window.removeEventListener(
        "pwa-already-installed",
        handleAlreadyInstalled
      );
      window.removeEventListener("pwa-update-available", handleUpdateAvailable);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const installPWA = () => {
    if (typeof window !== "undefined" && (window as any).installPWA) {
      (window as any).installPWA();
    }
  };

  const checkForUpdates = () => {
    if (typeof window !== "undefined" && (window as any).checkForUpdates) {
      (window as any).checkForUpdates();
    }
  };

  return {
    isInstalled,
    canInstall,
    isOnline,
    installPWA,
    checkForUpdates,
    isUpdateAvailable,
  };
}
