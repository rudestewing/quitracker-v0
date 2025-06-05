import { usePWA } from "@/hooks/use-pwa";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, RefreshCw, Wifi, WifiOff } from "lucide-react";

export function PWAStatus() {
  const { isInstalled, canInstall, isOnline, installPWA, checkForUpdates } =
    usePWA();

  return (
    <div className="flex items-center gap-2 text-sm">
      {/* Network Status */}
      <Badge
        variant={isOnline ? "default" : "destructive"}
        className="flex items-center gap-1"
      >
        {isOnline ? (
          <Wifi className="w-3 h-3" />
        ) : (
          <WifiOff className="w-3 h-3" />
        )}
        {isOnline ? "Online" : "Offline"}
      </Badge>

      {/* PWA Install Status */}
      {isInstalled ? (
        <Badge variant="secondary" className="flex items-center gap-1">
          <Download className="w-3 h-3" />
          Installed
        </Badge>
      ) : canInstall ? (
        <Button
          variant="outline"
          size="sm"
          onClick={installPWA}
          className="flex items-center gap-1"
        >
          <Download className="w-3 h-3" />
          Install App
        </Button>
      ) : null}

      {/* Update Check */}
      <Button
        variant="ghost"
        size="sm"
        onClick={checkForUpdates}
        className="flex items-center gap-1"
        title="Check for updates"
      >
        <RefreshCw className="w-3 h-3" />
      </Button>
    </div>
  );
}
