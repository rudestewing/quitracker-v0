"use client";

import * as React from "react";
import { useColorMood } from "@/hooks/use-color-mood";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  validateMoodAccessibility,
  getAccessibleMoodIndicator,
  getMoodNavigationInstructions,
  COLORBLIND_PATTERNS,
} from "@/lib/accessibility-utils";
import { Eye, Keyboard, Volume2, Palette, Info } from "lucide-react";
import { ColorMood } from "@/lib/colors";

interface AccessibilitySettings {
  highContrast: boolean;
  reducedMotion: boolean;
  screenReaderAnnouncements: boolean;
  colorblindSupport: boolean;
  keyboardShortcuts: boolean;
  largeFonts: boolean;
}

export function AccessibilitySettings() {
  const { currentMood, availableMoods } = useColorMood();

  const [settings, setSettings] = React.useState<AccessibilitySettings>({
    highContrast: false,
    reducedMotion: false,
    screenReaderAnnouncements: true,
    colorblindSupport: false,
    keyboardShortcuts: true,
    largeFonts: false,
  });

  // Validate current mood accessibility
  const accessibility = validateMoodAccessibility(currentMood);

  const updateSetting = (key: keyof AccessibilitySettings, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));

    // Apply changes to document
    if (key === "reducedMotion") {
      document.documentElement.style.setProperty(
        "--motion-preference",
        value ? "reduce" : "auto"
      );
    }

    if (key === "largeFonts") {
      document.documentElement.style.setProperty(
        "--font-scale",
        value ? "1.2" : "1"
      );
    }
  };

  // Keyboard shortcuts handler
  React.useEffect(() => {
    if (!settings.keyboardShortcuts) return;

    const handleKeyboard = (e: KeyboardEvent) => {
      // Handle keyboard shortcuts here
      if (e.ctrlKey && e.shiftKey && e.code === "KeyR") {
        e.preventDefault();
        // Reset to calm mood
        console.log("Reset to calm mood");
      }
    };

    window.addEventListener("keydown", handleKeyboard);
    return () => window.removeEventListener("keydown", handleKeyboard);
  }, [settings.keyboardShortcuts]);

  return (
    <div className="space-y-6">
      {/* Accessibility Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Accessibility Overview
          </CardTitle>
          <CardDescription>
            Current mood accessibility status and recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Current Mood Accessibility:</span>
            <Badge
              variant={accessibility.isAccessible ? "default" : "destructive"}
            >
              {accessibility.isAccessible ? "Accessible" : "Needs Attention"}
            </Badge>
          </div>

          {accessibility.issues.length > 0 && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-medium">Accessibility Issues:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {accessibility.issues.map((issue, index) => (
                      <li key={index} className="text-sm">
                        {issue}
                      </li>
                    ))}
                  </ul>
                  {accessibility.suggestions.length > 0 && (
                    <div className="mt-3">
                      <p className="font-medium">Suggestions:</p>
                      <ul className="list-disc list-inside space-y-1">
                        {accessibility.suggestions.map((suggestion, index) => (
                          <li key={index} className="text-sm">
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Vision Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Vision & Display
          </CardTitle>
          <CardDescription>
            Adjust visual settings for better accessibility
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="high-contrast">High Contrast Mode</Label>
            <Switch
              id="high-contrast"
              checked={settings.highContrast}
              onCheckedChange={(checked) =>
                updateSetting("highContrast", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="large-fonts">Large Fonts</Label>
            <Switch
              id="large-fonts"
              checked={settings.largeFonts}
              onCheckedChange={(checked) =>
                updateSetting("largeFonts", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="colorblind-support">Colorblind Support</Label>
            <Switch
              id="colorblind-support"
              checked={settings.colorblindSupport}
              onCheckedChange={(checked) =>
                updateSetting("colorblindSupport", checked)
              }
            />
          </div>

          {settings.colorblindSupport && (
            <div className="space-y-3 pt-2 border-t">
              <p className="text-sm text-muted-foreground">
                Mood identification patterns for colorblind users:
              </p>
              <div className="grid grid-cols-1 gap-2">
                {availableMoods.map((mood) => {
                  const indicator = getAccessibleMoodIndicator(mood.value);
                  return (
                    <div
                      key={mood.value}
                      className="flex items-center gap-3 p-2 border rounded"
                    >
                      <span className="text-lg">{mood.emoji}</span>
                      <span className="font-mono text-lg">
                        {indicator.symbol}
                      </span>
                      <div className="flex-1">
                        <p className="font-medium capitalize">{mood.value}</p>
                        <p className="text-xs text-muted-foreground">
                          {indicator.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Motion Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Motion & Animation</CardTitle>
          <CardDescription>Control animations and transitions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="reduced-motion">Reduced Motion</Label>
              <p className="text-sm text-muted-foreground">
                Minimize animations and transitions
              </p>
            </div>
            <Switch
              id="reduced-motion"
              checked={settings.reducedMotion}
              onCheckedChange={(checked) =>
                updateSetting("reducedMotion", checked)
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Screen Reader Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            Screen Reader Support
          </CardTitle>
          <CardDescription>
            Configure audio announcements and descriptions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="screen-reader">Mood Change Announcements</Label>
              <p className="text-sm text-muted-foreground">
                Announce color theme changes to screen readers
              </p>
            </div>
            <Switch
              id="screen-reader"
              checked={settings.screenReaderAnnouncements}
              onCheckedChange={(checked) =>
                updateSetting("screenReaderAnnouncements", checked)
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Keyboard Navigation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Keyboard Navigation
          </CardTitle>
          <CardDescription>
            Keyboard shortcuts and navigation settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="keyboard-shortcuts">
              Enable Keyboard Shortcuts
            </Label>
            <Switch
              id="keyboard-shortcuts"
              checked={settings.keyboardShortcuts}
              onCheckedChange={(checked) =>
                updateSetting("keyboardShortcuts", checked)
              }
            />
          </div>

          {settings.keyboardShortcuts && (
            <div className="space-y-3 pt-2 border-t">
              <p className="text-sm font-medium">Available Shortcuts:</p>
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="flex justify-between">
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">M</kbd>
                  <span>Cycle to next mood</span>
                </div>
                <div className="flex justify-between">
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">
                    Shift + M
                  </kbd>
                  <span>Cycle to previous mood</span>
                </div>
                <div className="flex justify-between">
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">
                    Ctrl + H
                  </kbd>
                  <span>Toggle high contrast</span>
                </div>
                <div className="flex justify-between">
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">
                    Ctrl + Shift + R
                  </kbd>
                  <span>Reset to calm mood</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common accessibility tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                updateSetting("highContrast", !settings.highContrast)
              }
            >
              Toggle High Contrast
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                updateSetting("reducedMotion", !settings.reducedMotion)
              }
            >
              Toggle Motion
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                // Reset all accessibility settings
                setSettings({
                  highContrast: false,
                  reducedMotion: false,
                  screenReaderAnnouncements: true,
                  colorblindSupport: false,
                  keyboardShortcuts: true,
                  largeFonts: false,
                });
              }}
            >
              Reset Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
