"use client";

import React from "react";
import { useColorMood } from "@/hooks/use-color-mood";
import { ColorMoodSelector } from "@/components/color-mood-selector";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function ColorMoodSettings() {
  const { currentMood, setMood, availableMoods, isDark } = useColorMood();
  const [autoMoodEnabled, setAutoMoodEnabled] = React.useState(false);
  const [circadianModeEnabled, setCircadianModeEnabled] = React.useState(false);
  const [moodAnalyticsEnabled, setMoodAnalyticsEnabled] = React.useState(true);

  // Get mood change statistics (mock data for demo)
  const moodStats = {
    totalChanges: 24,
    favoriteModod: "calm",
    averageSessionTime: "45 min",
    lastChanged: "2 hours ago",
  };

  const handleResetToDefault = () => {
    setMood("calm");
    setAutoMoodEnabled(false);
    setCircadianModeEnabled(false);
  };

  const handleExportPreferences = () => {
    const preferences = {
      currentMood,
      autoMoodEnabled,
      circadianModeEnabled,
      moodAnalyticsEnabled,
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(preferences, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "quittracker-mood-preferences.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Current Mood Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🎨 Color Mood Settings
            <Badge variant="secondary">
              {availableMoods.find((m) => m.value === currentMood)?.emoji}{" "}
              {currentMood}
            </Badge>
          </CardTitle>
          <CardDescription>
            Customize your color experience and mood preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>
              Your current mood colors will be applied throughout the app.
              Changes are saved automatically to your browser.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Mood Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Choose Your Color Mood</CardTitle>
          <CardDescription>
            Select colors that match your current feeling or desired emotional
            state
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ColorMoodSelector variant="grid" showDescription={true} />
        </CardContent>
      </Card>

      {/* Advanced Settings */}
      <Card>
        <CardHeader>
          <CardTitle>🔧 Advanced Settings</CardTitle>
          <CardDescription>
            Automatic mood adjustments and smart features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Auto Mood Detection */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="auto-mood" className="font-medium">
                Auto Mood Detection
              </Label>
              <p className="text-sm text-muted-foreground">
                Automatically suggest mood changes based on time of day and
                usage patterns
              </p>
            </div>
            <Switch
              id="auto-mood"
              checked={autoMoodEnabled}
              onCheckedChange={setAutoMoodEnabled}
            />
          </div>

          <Separator />

          {/* Circadian Mode */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="circadian-mode" className="font-medium">
                Circadian Color Mode
              </Label>
              <p className="text-sm text-muted-foreground">
                Switch to dark/calm colors in the evening and bright colors
                during the day
              </p>
            </div>
            <Switch
              id="circadian-mode"
              checked={circadianModeEnabled}
              onCheckedChange={setCircadianModeEnabled}
            />
          </div>

          <Separator />

          {/* Mood Analytics */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="mood-analytics" className="font-medium">
                Mood Analytics
              </Label>
              <p className="text-sm text-muted-foreground">
                Track how color moods correlate with your quit progress
              </p>
            </div>
            <Switch
              id="mood-analytics"
              checked={moodAnalyticsEnabled}
              onCheckedChange={setMoodAnalyticsEnabled}
            />
          </div>
        </CardContent>
      </Card>

      {/* Mood Statistics */}
      {moodAnalyticsEnabled && (
        <Card>
          <CardHeader>
            <CardTitle>📊 Mood Usage Statistics</CardTitle>
            <CardDescription>
              Your color mood preferences and usage patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {moodStats.totalChanges}
                </div>
                <div className="text-sm text-muted-foreground">
                  Mood Changes
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {
                    availableMoods.find(
                      (m) => m.value === moodStats.favoriteModod
                    )?.emoji
                  }
                </div>
                <div className="text-sm text-muted-foreground">
                  Favorite Mood
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {moodStats.averageSessionTime}
                </div>
                <div className="text-sm text-muted-foreground">Avg Session</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {moodStats.lastChanged}
                </div>
                <div className="text-sm text-muted-foreground">
                  Last Changed
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
              <h4 className="font-medium">Mood Distribution</h4>
              {availableMoods.map((mood, index) => {
                const usage = Math.floor(Math.random() * 100); // Mock data
                return (
                  <div key={mood.value} className="flex items-center gap-3">
                    <span className="text-lg">{mood.emoji}</span>
                    <span className="text-sm font-medium min-w-0 flex-1">
                      {mood.label}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-secondary rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${usage}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground min-w-0">
                        {usage}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>⚙️ Preferences Management</CardTitle>
          <CardDescription>
            Backup, restore, or reset your mood preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={handleExportPreferences}
              className="gap-2"
            >
              📁 Export Preferences
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                /* TODO: Import functionality */
              }}
              className="gap-2"
            >
              📂 Import Preferences
            </Button>
            <Button
              variant="destructive"
              onClick={handleResetToDefault}
              className="gap-2"
            >
              🔄 Reset to Default
            </Button>
          </div>

          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              💡 <strong>Tip:</strong> Your mood preferences are automatically
              saved in your browser. Use export/import to sync preferences
              across devices.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Color Psychology Info */}
      <Card>
        <CardHeader>
          <CardTitle>🧠 Color Psychology</CardTitle>
          <CardDescription>
            How different color moods can affect your wellbeing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {availableMoods.map((mood) => (
              <div
                key={mood.value}
                className="flex gap-3 p-3 rounded-lg border"
              >
                <span className="text-2xl">{mood.emoji}</span>
                <div>
                  <h4 className="font-medium">{mood.label}</h4>
                  <p className="text-sm text-muted-foreground">
                    {mood.description}
                  </p>
                  <div className="mt-2">
                    <ColorPsychologyTips mood={mood.value} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper component for color psychology tips
function ColorPsychologyTips({ mood }: { mood: string }) {
  const tips = {
    calm: "Best for meditation, journaling, and evening wind-down sessions.",
    energetic: "Great for motivation, goal-setting, and overcoming challenges.",
    focused: "Ideal for tracking progress, analyzing data, and planning ahead.",
    cheerful:
      "Perfect for celebrating milestones and boosting positive emotions.",
    dark: "Excellent for night-time use and reducing eye strain.",
  };

  return (
    <p className="text-xs text-muted-foreground italic">
      {tips[mood as keyof typeof tips]}
    </p>
  );
}
