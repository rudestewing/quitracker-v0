"use client";

import { usePWA } from "@/hooks/use-pwa";
import { PWAUpdateButton } from "@/components/pwa-update-button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Download, CheckCircle, Wifi, WifiOff } from "lucide-react";

export function PWAStatus() {
  const { isInstalled, canInstall, isOnline, installPWA } = usePWA();

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Smartphone className="h-4 w-4" />
          App Status
        </CardTitle>
        <CardDescription className="text-sm">
          Manage your progressive web app installation and updates
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        {/* Installation Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Installation:</span>
          <Badge
            variant={isInstalled ? "default" : "secondary"}
            className="text-xs"
          >
            {isInstalled ? (
              <>
                <CheckCircle className="h-3 w-3 mr-1" />
                Installed
              </>
            ) : (
              "Not Installed"
            )}
          </Badge>
        </div>

        {/* Online Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Connection:</span>
          <Badge
            variant={isOnline ? "default" : "destructive"}
            className="text-xs"
          >
            {isOnline ? (
              <Wifi className="h-3 w-3 mr-1" />
            ) : (
              <WifiOff className="h-3 w-3 mr-1" />
            )}
            {isOnline ? "Online" : "Offline"}
          </Badge>
        </div>

        {/* Install Button */}
        {canInstall && !isInstalled && (
          <Button onClick={installPWA} className="w-full" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Install App
          </Button>
        )}

        {/* Update Button */}
        {isInstalled && (
          <div className="border-t pt-3">
            <PWAUpdateButton />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
