"use client";

import { usePWAUpdate } from "@/hooks/use-pwa-update";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, RefreshCw, CheckCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export function PWAUpdateButton() {
  const {
    updateAvailable,
    isChecking,
    isUpdating,
    checkForUpdate,
    applyUpdate,
    lastChecked,
  } = usePWAUpdate();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Button
          onClick={checkForUpdate}
          disabled={isChecking || isUpdating}
          variant="outline"
          size="sm"
          className="relative flex-1"
        >
          <RefreshCw
            className={`h-3 w-3 mr-2 ${isChecking ? "animate-spin" : ""}`}
          />
          {isChecking ? "Checking..." : "Check Updates"}
        </Button>

        {updateAvailable && (
          <Badge variant="destructive" className="animate-pulse text-xs">
            Available
          </Badge>
        )}
      </div>

      {updateAvailable && (
        <Button
          onClick={applyUpdate}
          disabled={isUpdating}
          variant="default"
          size="sm"
          className="bg-green-600 hover:bg-green-700 w-full"
        >
          <Download
            className={`h-3 w-3 mr-2 ${isUpdating ? "animate-bounce" : ""}`}
          />
          {isUpdating ? "Updating..." : "Install Update"}
        </Button>
      )}

      {lastChecked && !updateAvailable && (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <CheckCircle className="h-3 w-3" />
          Last checked {formatDistanceToNow(lastChecked, { addSuffix: true })}
        </div>
      )}
    </div>
  );
}
