"use client";

import React from "react";
import { useColorMood } from "@/hooks/use-color-mood";
import { getMoodAwareColors, withAlpha } from "@/lib/color-mood-utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface MoodAwareComponentsProps {
  className?: string;
}

export function MoodAwareComponents({ className }: MoodAwareComponentsProps) {
  const { currentMood, colors, isDark } = useColorMood();
  const moodColors = getMoodAwareColors(currentMood);

  return (
    <div className={className}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Progress Tracking Card */}
        <MoodAwareCard
          title="🎯 Your Progress"
          description="Track your quit journey"
          mood={currentMood}
        >
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Days Clean</span>
              <Badge
                style={{
                  backgroundColor: colors.status.success,
                  color: isDark ? colors.text.white : colors.text.primary,
                }}
              >
                15 days
              </Badge>
            </div>

            <Progress value={75} className="h-3" />

            <div className="text-xs text-muted-foreground">
              75% towards your 20-day goal
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div
                  className="text-lg font-bold"
                  style={{ color: colors.primary.main }}
                >
                  15
                </div>
                <div className="text-xs text-muted-foreground">Days</div>
              </div>
              <div>
                <div
                  className="text-lg font-bold"
                  style={{ color: colors.status.success }}
                >
                  $450
                </div>
                <div className="text-xs text-muted-foreground">Saved</div>
              </div>
              <div>
                <div
                  className="text-lg font-bold"
                  style={{ color: colors.status.info }}
                >
                  98%
                </div>
                <div className="text-xs text-muted-foreground">Health</div>
              </div>
            </div>
          </div>
        </MoodAwareCard>

        {/* Mood & Wellness Card */}
        <MoodAwareCard
          title="💚 Wellness Check"
          description="How are you feeling today?"
          mood={currentMood}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-3xl"
                style={{
                  backgroundColor: withAlpha(colors.primary.main, 0.1),
                  border: `2px solid ${colors.primary.main}`,
                }}
              >
                😊
              </div>
            </div>

            <div className="text-center">
              <div className="font-medium">Feeling Good</div>
              <div className="text-sm text-muted-foreground">
                Current mood matches your color choice
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <MoodAwareButton
                mood={currentMood}
                variant="primary"
                size="sm"
                fullWidth
              >
                Log Today's Mood
              </MoodAwareButton>
              <MoodAwareButton
                mood={currentMood}
                variant="secondary"
                size="sm"
                fullWidth
              >
                View Mood History
              </MoodAwareButton>
            </div>
          </div>
        </MoodAwareCard>

        {/* Achievements Card */}
        <MoodAwareCard
          title="🏆 Achievements"
          description="Your milestones"
          mood={currentMood}
        >
          <div className="space-y-3">
            {[
              { name: "First Week", emoji: "🌟", completed: true },
              { name: "Two Weeks Strong", emoji: "💪", completed: true },
              { name: "One Month Hero", emoji: "🦸", completed: false },
              { name: "Health Warrior", emoji: "⚡", completed: false },
            ].map((achievement, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-2 rounded-lg"
                style={{
                  backgroundColor: achievement.completed
                    ? withAlpha(colors.status.success, 0.1)
                    : withAlpha(colors.secondary.main, 0.05),
                  border: `1px solid ${
                    achievement.completed
                      ? colors.status.success
                      : colors.border.light
                  }`,
                }}
              >
                <span className="text-2xl">{achievement.emoji}</span>
                <div className="flex-1">
                  <div className="font-medium text-sm">{achievement.name}</div>
                </div>
                {achievement.completed && (
                  <Badge
                    variant="secondary"
                    style={{
                      backgroundColor: colors.status.success,
                      color: colors.text.white,
                    }}
                  >
                    ✓
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </MoodAwareCard>

        {/* Quick Actions Card */}
        <MoodAwareCard
          title="⚡ Quick Actions"
          description="What would you like to do?"
          mood={currentMood}
        >
          <div className="grid grid-cols-2 gap-3">
            <MoodAwareButton mood={currentMood} variant="primary" size="sm">
              💭 Log Thought
            </MoodAwareButton>
            <MoodAwareButton mood={currentMood} variant="secondary" size="sm">
              📊 View Stats
            </MoodAwareButton>
            <MoodAwareButton mood={currentMood} variant="outline" size="sm">
              🎯 Set Goal
            </MoodAwareButton>
            <MoodAwareButton mood={currentMood} variant="outline" size="sm">
              📱 Get Support
            </MoodAwareButton>
          </div>
        </MoodAwareCard>
      </div>
    </div>
  );
}

// Mood-aware Card component
interface MoodAwareCardProps {
  title: string;
  description: string;
  mood: string;
  children: React.ReactNode;
}

function MoodAwareCard({
  title,
  description,
  mood,
  children,
}: MoodAwareCardProps) {
  const { colors } = useColorMood();

  return (
    <Card
      className="transition-all duration-300"
      style={{
        backgroundColor: colors.background.card,
        borderColor: colors.border.card,
      }}
    >
      <CardHeader>
        <CardTitle className="text-lg" style={{ color: colors.text.primary }}>
          {title}
        </CardTitle>
        <CardDescription style={{ color: colors.text.muted }}>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

// Mood-aware Button component
interface MoodAwareButtonProps {
  mood: string;
  variant: "primary" | "secondary" | "outline";
  size?: "sm" | "default" | "lg";
  fullWidth?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

function MoodAwareButton({
  mood,
  variant,
  size = "default",
  fullWidth = false,
  children,
  onClick,
}: MoodAwareButtonProps) {
  const { colors } = useColorMood();
  const moodColors = getMoodAwareColors(mood as any);

  const getButtonStyles = () => {
    switch (variant) {
      case "primary":
        return {
          backgroundColor: colors.primary.main,
          color: colors.text.white,
          border: `1px solid ${colors.primary.main}`,
          "&:hover": {
            backgroundColor: colors.primary.hover,
          },
        };
      case "secondary":
        return {
          backgroundColor: colors.secondary.main,
          color: colors.text.primary,
          border: `1px solid ${colors.secondary.main}`,
        };
      case "outline":
        return {
          backgroundColor: "transparent",
          color: colors.primary.main,
          border: `1px solid ${colors.primary.main}`,
        };
      default:
        return {};
    }
  };

  const styles = getButtonStyles();

  return (
    <Button
      size={size}
      onClick={onClick}
      className={`transition-colors duration-200 ${fullWidth ? "w-full" : ""}`}
      style={styles}
    >
      {children}
    </Button>
  );
}

// Daily Inspiration component with mood colors
export function MoodAwareInspiration() {
  const { currentMood, colors } = useColorMood();

  const inspirations = {
    calm: {
      message: "Take a deep breath. You're doing great, one day at a time.",
      emoji: "🌸",
      author: "Your Inner Peace",
    },
    energetic: {
      message: "You have the power to overcome anything! Keep pushing forward!",
      emoji: "🔥",
      author: "Your Inner Strength",
    },
    focused: {
      message: "Stay focused on your goals. Every small step counts.",
      emoji: "🎯",
      author: "Your Determination",
    },
    cheerful: {
      message: "Smile! You're creating a better version of yourself every day!",
      emoji: "🌈",
      author: "Your Joy",
    },
    dark: {
      message: "Even in darkness, you shine. Rest and recharge for tomorrow.",
      emoji: "⭐",
      author: "Your Resilience",
    },
  };

  const inspiration =
    inspirations[currentMood as keyof typeof inspirations] || inspirations.calm;

  return (
    <Card
      className="text-center"
      style={{
        backgroundColor: withAlpha(colors.primary.main, 0.05),
        borderColor: colors.primary.light,
      }}
    >
      <CardContent className="pt-6">
        <div className="text-4xl mb-4">{inspiration.emoji}</div>
        <blockquote
          className="text-lg font-medium mb-2"
          style={{ color: colors.text.primary }}
        >
          "{inspiration.message}"
        </blockquote>
        <cite className="text-sm" style={{ color: colors.text.muted }}>
          — {inspiration.author}
        </cite>
      </CardContent>
    </Card>
  );
}
