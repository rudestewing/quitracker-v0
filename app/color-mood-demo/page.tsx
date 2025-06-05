"use client";

import React from "react";
import { useColorMood } from "@/hooks/use-color-mood";
import {
  ColorMoodSelector,
  FloatingMoodSelector,
  QuickMoodSwitcher,
} from "@/components/color-mood-selector";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  MoodAwareComponents,
  MoodAwareInspiration,
} from "@/components/mood-aware-components";
import { ColorMoodSettings } from "@/components/color-mood-settings-enhanced";
import { AccessibilitySettings } from "@/components/accessibility-settings";

export default function ColorMoodDemo() {
  const { currentMood, colors, uiColors, isDark } = useColorMood();

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">🎨 Color Mood System</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experience how different color palettes can affect your mood and
            productivity. Choose a mood below to see the entire interface
            transform.
          </p>
          <Badge variant="secondary" className="text-sm">
            Current Mood: {currentMood} {isDark ? "🌙" : "☀️"}
          </Badge>
        </div>

        {/* Quick Mood Switcher */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Mood Switcher</CardTitle>
            <CardDescription>
              Tap any emoji to instantly change the app's color theme
            </CardDescription>
          </CardHeader>
          <CardContent>
            <QuickMoodSwitcher />
          </CardContent>
        </Card>

        {/* Color Mood Selector */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Choose Your Color Mood</CardTitle>
            <CardDescription>
              Select a color palette that matches your current emotional state
              or desired feeling
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ColorMoodSelector variant="grid" />
          </CardContent>
        </Card>

        {/* UI Components Demo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Buttons Demo */}
          <Card>
            <CardHeader>
              <CardTitle>Button Styles</CardTitle>
              <CardDescription>
                See how buttons look in the current mood
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <Button variant="default">Primary Button</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
              </div>
            </CardContent>
          </Card>

          {/* Status & Alerts Demo */}
          <Card>
            <CardHeader>
              <CardTitle>Status Colors</CardTitle>
              <CardDescription>
                Different states and notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Alert>
                <AlertTitle>Info</AlertTitle>
                <AlertDescription>
                  This is an informational message.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Progress Example</span>
                  <span className="text-sm text-muted-foreground">75%</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>

              <div className="flex gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Color Palette Display */}
        <Card>
          <CardHeader>
            <CardTitle>Current Color Palette</CardTitle>
            <CardDescription>
              The active colors for {currentMood} mood
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Primary Colors */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Primary</h4>
                <div className="space-y-1">
                  <ColorSwatch color={colors.primary.main} label="Main" />
                  <ColorSwatch color={colors.primary.hover} label="Hover" />
                  <ColorSwatch color={colors.primary.light} label="Light" />
                  <ColorSwatch color={colors.primary.dark} label="Dark" />
                </div>
              </div>

              {/* Background Colors */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Background</h4>
                <div className="space-y-1">
                  <ColorSwatch color={colors.background.main} label="Main" />
                  <ColorSwatch color={colors.background.card} label="Card" />
                </div>
              </div>

              {/* Secondary Colors */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Secondary</h4>
                <div className="space-y-1">
                  <ColorSwatch color={colors.secondary.main} label="Main" />
                  <ColorSwatch color={colors.secondary.accent} label="Accent" />
                </div>
              </div>

              {/* Status Colors */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Status</h4>
                <div className="space-y-1">
                  <ColorSwatch color={colors.status.success} label="Success" />
                  <ColorSwatch color={colors.status.warning} label="Warning" />
                  <ColorSwatch color={colors.status.info} label="Info" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sample App Layout */}
        <Card>
          <CardHeader>
            <CardTitle>Sample App Layout</CardTitle>
            <CardDescription>
              See how a typical app interface looks with the current mood
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className="border rounded-lg p-4 space-y-4"
              style={{ backgroundColor: colors.background.card }}
            >
              {/* Mock Navigation */}
              <div className="flex items-center justify-between pb-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full"
                    style={{ backgroundColor: colors.primary.main }}
                  />
                  <span className="font-medium">QuitTracker</span>
                </div>
                <Button size="sm">Settings</Button>
              </div>

              <Separator />

              {/* Mock Content */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Today's Progress</h4>
                  <div
                    className="p-3 rounded border"
                    style={{ backgroundColor: colors.background.main }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Days Clean</span>
                      <Badge
                        style={{
                          backgroundColor: colors.status.success,
                          color: colors.text.white,
                        }}
                      >
                        7 days
                      </Badge>
                    </div>
                    <Progress value={70} />
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Mood Tracker</h4>
                  <div
                    className="p-3 rounded border"
                    style={{ backgroundColor: colors.background.main }}
                  >
                    <div className="text-center">
                      <div
                        className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: colors.primary.main }}
                      >
                        😊
                      </div>
                      <span className="text-sm text-muted-foreground">
                        Feeling Good
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Quick Actions</h4>
                  <div className="space-y-2">
                    <Button size="sm" className="w-full">
                      Log Mood
                    </Button>
                    <Button size="sm" variant="outline" className="w-full">
                      View Stats
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Daily Inspiration */}
        <MoodAwareInspiration />

        {/* Real-world App Components */}
        <Card>
          <CardHeader>
            <CardTitle>🚀 Real App Components</CardTitle>
            <CardDescription>
              See how actual app components adapt to different moods
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MoodAwareComponents />
          </CardContent>
        </Card>

        {/* Enhanced Settings Demo */}
        <Card>
          <CardHeader>
            <CardTitle>⚙️ Enhanced Mood Settings</CardTitle>
            <CardDescription>
              Test the complete mood system with auto-detection, analytics, and
              persistence
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ColorMoodSettings />
          </CardContent>
        </Card>

        {/* Accessibility Settings */}
        <Card>
          <CardHeader>
            <CardTitle>♿ Accessibility Features</CardTitle>
            <CardDescription>
              Comprehensive accessibility settings for all users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AccessibilitySettings />
          </CardContent>
        </Card>

        {/* Floating Mood Selector (positioned in corner) */}
        <FloatingMoodSelector />
      </div>
    </div>
  );
}

// Helper component to display color swatches
function ColorSwatch({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="w-6 h-6 rounded border border-border flex-shrink-0"
        style={{ backgroundColor: color }}
      />
      <div className="flex-1 min-w-0">
        <div className="text-xs font-mono text-muted-foreground truncate">
          {color}
        </div>
        <div className="text-xs text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}
