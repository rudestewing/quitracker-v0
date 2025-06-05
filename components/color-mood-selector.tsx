"use client";

import * as React from "react";
import { useColorMood } from "@/hooks/use-color-mood";
import { ColorMood } from "@/lib/colors";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface ColorMoodSelectorProps {
  variant?: "grid" | "dropdown" | "compact";
  className?: string;
  showDescription?: boolean;
}

export function ColorMoodSelector({
  variant = "grid",
  className,
  showDescription = true,
}: ColorMoodSelectorProps) {
  const { currentMood, setMood, availableMoods, colors } = useColorMood();

  if (variant === "dropdown") {
    return (
      <div className={cn("w-full max-w-xs", className)}>
        <Select
          value={currentMood}
          onValueChange={(value: ColorMood) => setMood(value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue>
              <div className="flex items-center gap-2">
                <span className="text-lg">
                  {availableMoods.find((m) => m.value === currentMood)?.emoji}
                </span>
                <span>
                  {availableMoods.find((m) => m.value === currentMood)?.label}
                </span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {availableMoods.map((mood) => (
              <SelectItem key={mood.value} value={mood.value}>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{mood.emoji}</span>
                  <div className="flex flex-col">
                    <span>{mood.label}</span>
                    {showDescription && (
                      <span className="text-xs text-muted-foreground">
                        {mood.description}
                      </span>
                    )}
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className={cn("flex gap-2 flex-wrap", className)}>
        {availableMoods.map((mood) => (
          <Button
            key={mood.value}
            variant={currentMood === mood.value ? "default" : "outline"}
            size="sm"
            onClick={() => setMood(mood.value)}
            className="gap-2"
          >
            <span className="text-sm">{mood.emoji}</span>
            <span className="hidden sm:inline">{mood.label.split(" ")[0]}</span>
          </Button>
        ))}
      </div>
    );
  }

  // Grid variant (default)
  return (
    <div className={cn("w-full", className)}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {availableMoods.map((mood) => (
          <MoodCard
            key={mood.value}
            mood={mood}
            isSelected={currentMood === mood.value}
            onSelect={() => setMood(mood.value)}
            showDescription={showDescription}
          />
        ))}
      </div>
    </div>
  );
}

interface MoodCardProps {
  mood: {
    value: ColorMood;
    label: string;
    emoji: string;
    description: string;
  };
  isSelected: boolean;
  onSelect: () => void;
  showDescription: boolean;
}

function MoodCard({
  mood,
  isSelected,
  onSelect,
  showDescription,
}: MoodCardProps) {
  // Get preview colors for this specific mood without circular dependency
  const previewColors = React.useMemo(() => {
    // Define colors inline to avoid circular import
    const moodPalettes = {
      calm: {
        primary: { main: "#E67C7C" },
        secondary: { main: "#D9A5A5" },
        background: { card: "#FDECEC" },
        status: { success: "#B8D8C5" },
        border: { main: "#E0DCDC" },
        text: { primary: "#444444" },
      },
      energetic: {
        primary: { main: "#FF6B35" },
        secondary: { main: "#FFB084" },
        background: { card: "#FFF1E6" },
        status: { success: "#4CAF50" },
        border: { main: "#FFCC99" },
        text: { primary: "#2D1810" },
      },
      focused: {
        primary: { main: "#4A90E2" },
        secondary: { main: "#6C757D" },
        background: { card: "#F8F9FA" },
        status: { success: "#28A745" },
        border: { main: "#ADB5BD" },
        text: { primary: "#212529" },
      },
      cheerful: {
        primary: { main: "#FF69B4" },
        secondary: { main: "#FFB6C1" },
        background: { card: "#FFF0F7" },
        status: { success: "#32CD32" },
        border: { main: "#FFA0CB" },
        text: { primary: "#2E1A2B" },
      },
      dark: {
        primary: { main: "#BB86FC" },
        secondary: { main: "#6C6C6C" },
        background: { card: "#1E1E1E" },
        status: { success: "#81C784" },
        border: { main: "#8C8C8C" },
        text: { primary: "#FFFFFF" },
      },
    };
    return moodPalettes[mood.value];
  }, [mood.value]);

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-md",
        isSelected && "ring-2 ring-primary shadow-lg"
      )}
      onClick={onSelect}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{mood.emoji}</span>
            <CardTitle className="text-sm font-medium">{mood.label}</CardTitle>
          </div>
          {isSelected && (
            <Badge variant="default" className="text-xs">
              Active
            </Badge>
          )}
        </div>
        {showDescription && (
          <CardDescription className="text-xs">
            {mood.description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        {/* Color preview */}
        <div className="flex gap-1 mb-3">
          <div
            className="w-6 h-6 rounded-full border border-border"
            style={{ backgroundColor: previewColors.primary.main }}
            title="Primary color"
          />
          <div
            className="w-6 h-6 rounded-full border border-border"
            style={{ backgroundColor: previewColors.secondary.main }}
            title="Secondary color"
          />
          <div
            className="w-6 h-6 rounded-full border border-border"
            style={{ backgroundColor: previewColors.background.card }}
            title="Background color"
          />
          <div
            className="w-6 h-6 rounded-full border border-border"
            style={{ backgroundColor: previewColors.status.success }}
            title="Success color"
          />
        </div>

        {/* Mini preview card */}
        <div
          className="h-16 rounded-md border p-2 text-xs"
          style={{
            backgroundColor: previewColors.background.card,
            borderColor: previewColors.border.main,
            color: previewColors.text.primary,
          }}
        >
          <div className="flex items-center justify-between h-full">
            <div>Preview</div>
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: previewColors.primary.main }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Floating mood selector button
export function FloatingMoodSelector() {
  const { currentMood, availableMoods } = useColorMood();
  const [isOpen, setIsOpen] = React.useState(false);

  const currentMoodData = availableMoods.find((m) => m.value === currentMood);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen && (
        <div className="absolute bottom-16 right-0 bg-background border rounded-lg shadow-lg p-4 w-80">
          <div className="mb-3">
            <h3 className="font-medium text-sm mb-1">Choose Your Mood</h3>
            <p className="text-xs text-muted-foreground">
              Select colors that match your current feeling
            </p>
          </div>
          <ColorMoodSelector variant="compact" showDescription={false} />
        </div>
      )}

      <Button
        size="sm"
        className="rounded-full shadow-lg gap-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg">{currentMoodData?.emoji}</span>
        <span className="hidden sm:inline text-xs">
          {currentMoodData?.label.split(" ")[0]}
        </span>
      </Button>
    </div>
  );
}

// Quick mood switcher for mobile
export function QuickMoodSwitcher() {
  const { currentMood, setMood, availableMoods } = useColorMood();

  return (
    <div className="flex flex-col gap-2 overflow-x-auto pb-2">
      {availableMoods.map((mood) => (
        <Button
          key={mood.value}
          variant={currentMood === mood.value ? "default" : "ghost"}
          size="sm"
          onClick={() => setMood(mood.value)}
          className="flex-shrink-0 rounded-full w-10 h-10 p-0"
        >
          <span className="text-lg">{mood.emoji}</span>
        </Button>
      ))}
    </div>
  );
}
