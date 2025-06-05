"use client";

import * as React from "react";
import {
  useColorMood,
  useMoodPersistence,
  useMoodAnalytics,
  useMoodSuggestions,
} from "@/hooks/use-color-mood";
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
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Download,
  Upload,
  RotateCcw,
  Clock,
  TrendingUp,
  Lightbulb,
} from "lucide-react";
import { ColorMood } from "@/lib/colors";
import { ColorMoodSelector } from "./color-mood-selector";

export function ColorMoodSettings() {
  const { settings, updateSettings, currentMood } = useColorMood();
  const { exportPreferences, importPreferences } = useMoodPersistence();
  const {
    analytics,
    resetAnalytics,
    getMostUsedMood,
    getMoodPercentages,
    getRecentMoodTrend,
  } = useMoodAnalytics();
  const { getSuggestedMood } = useMoodSuggestions();

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = React.useState<
    "idle" | "success" | "error"
  >("idle");

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await importPreferences(file);
      setImportStatus("success");
      setTimeout(() => setImportStatus("idle"), 3000);
    } catch (error) {
      setImportStatus("error");
      setTimeout(() => setImportStatus("idle"), 3000);
    }
  };

  const mostUsedMood = getMostUsedMood();
  const moodPercentages = getMoodPercentages();
  const recentTrend = getRecentMoodTrend();
  const suggestion = getSuggestedMood();

  return (
    <div className="space-y-6">
      {/* Auto Detection Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Auto Mood Detection
          </CardTitle>
          <CardDescription>
            Automatically adjust your mood theme based on time of day
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-detection">Enable Auto Detection</Label>
            <Switch
              id="auto-detection"
              checked={settings.autoDetection}
              onCheckedChange={(checked) =>
                updateSettings({ autoDetection: checked })
              }
            />
          </div>

          {settings.autoDetection && (
            <div className="space-y-3 pt-2 border-t">
              <p className="text-sm text-muted-foreground">
                Time-based mood schedule:
              </p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="font-medium">6:00 - 9:00:</span> Energetic ⚡
                </div>
                <div>
                  <span className="font-medium">9:00 - 17:00:</span> Focused 🎯
                </div>
                <div>
                  <span className="font-medium">17:00 - 20:00:</span> Cheerful
                  🌈
                </div>
                <div>
                  <span className="font-medium">20:00 - 22:00:</span> Calm 😌
                </div>
                <div className="col-span-2">
                  <span className="font-medium">22:00 - 6:00:</span> Dark 🌙
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mood Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Mood Suggestions
          </CardTitle>
          <CardDescription>
            Get personalized mood recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Suggested: {suggestion.mood}</p>
              <p className="text-sm text-muted-foreground">
                {suggestion.reason}
              </p>
            </div>
            <Button
              size="sm"
              variant={
                currentMood === suggestion.mood ? "secondary" : "default"
              }
              disabled={currentMood === suggestion.mood}
            >
              {currentMood === suggestion.mood ? "Current" : "Apply"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Persistence Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Persistence Settings</CardTitle>
          <CardDescription>
            Control how your mood preferences are saved
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="remember-mood">Remember Last Mood</Label>
            <Switch
              id="remember-mood"
              checked={settings.rememberLastMood}
              onCheckedChange={(checked) =>
                updateSettings({ rememberLastMood: checked })
              }
            />
          </div>

          <Separator />

          <div className="space-y-3">
            <h4 className="font-medium">Import/Export Preferences</h4>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={exportPreferences}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Import
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </div>
            {importStatus === "success" && (
              <p className="text-sm text-green-600">
                Preferences imported successfully!
              </p>
            )}
            {importStatus === "error" && (
              <p className="text-sm text-red-600">
                Failed to import preferences. Please check the file format.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Mood Analytics
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={resetAnalytics}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </CardTitle>
          <CardDescription>
            Track your mood preferences and usage patterns
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Usage Statistics */}
          <div>
            <h4 className="font-medium mb-3">Mood Usage</h4>{" "}
            <div className="space-y-2">
              {Object.entries(moodPercentages).map(([mood, percentage]) => (
                <div key={mood} className="flex items-center justify-between">
                  <span className="text-sm capitalize">{mood}</span>
                  <div className="flex items-center gap-2">
                    <Progress value={Number(percentage)} className="w-20" />
                    <span className="text-sm text-muted-foreground w-8">
                      {Number(percentage)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Most Used Mood */}
          <div>
            <h4 className="font-medium mb-2">Most Used Mood</h4>
            <Badge variant="secondary" className="capitalize">
              {mostUsedMood}
            </Badge>
          </div>

          {/* Recent Trend */}
          {recentTrend.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Recent 7 Days</h4>
              <div className="flex gap-1">
                {recentTrend.map((day, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl">{day.emoji}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(day.date).toLocaleDateString("en", {
                        weekday: "short",
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Total Changes */}
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Total mood changes:</span>
            <span>{analytics.totalChanges}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
