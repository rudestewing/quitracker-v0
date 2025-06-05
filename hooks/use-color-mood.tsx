"use client";

import * as React from "react";
import {
  ColorMood,
  colorMoods,
  getUiColorsForMood,
  isDarkMood,
} from "@/lib/colors";

// Context untuk mengelola color mood state
interface ColorMoodContextType {
  currentMood: ColorMood;
  setMood: (mood: ColorMood, manual?: boolean) => void;
  colors: (typeof colorMoods)[ColorMood];
  uiColors: ReturnType<typeof getUiColorsForMood>;
  isDark: boolean;
  availableMoods: {
    value: ColorMood;
    label: string;
    emoji: string;
    description: string;
  }[];
  settings: MoodSettings;
  updateSettings: (settings: Partial<MoodSettings>) => void;
  analytics: MoodAnalytics;
  resetAnalytics: () => void;
}

const ColorMoodContext = React.createContext<ColorMoodContextType | undefined>(
  undefined
);

// Mood descriptions untuk UI
const moodDescriptions = {
  calm: {
    label: "Calm & Peaceful",
    emoji: "😌",
    description: "Soft, pastel colors for relaxation and mindfulness",
  },
  energetic: {
    label: "Energetic & Motivated",
    emoji: "⚡",
    description: "Vibrant colors to boost energy and motivation",
  },
  focused: {
    label: "Focused & Productive",
    emoji: "🎯",
    description: "Clean, minimalist colors for concentration",
  },
  cheerful: {
    label: "Cheerful & Happy",
    emoji: "🌈",
    description: "Bright, joyful colors to lift your spirits",
  },
  dark: {
    label: "Dark & Cozy",
    emoji: "🌙",
    description: "Dark theme with calming colors for night use",
  },
} as const;

// Local storage keys
const MOOD_STORAGE_KEY = "quittracker-color-mood";
const MOOD_SETTINGS_KEY = "quittracker-mood-settings";
const MOOD_ANALYTICS_KEY = "quittracker-mood-analytics";

// Auto mood detection based on time
function getAutoMoodByTime(): ColorMood {
  const hour = new Date().getHours();

  if (hour >= 6 && hour < 9) {
    return "energetic"; // Morning energy
  } else if (hour >= 9 && hour < 17) {
    return "focused"; // Work hours
  } else if (hour >= 17 && hour < 20) {
    return "cheerful"; // Evening relaxation
  } else if (hour >= 20 && hour < 22) {
    return "calm"; // Wind down
  } else {
    return "dark"; // Night mode
  }
}

// Mood settings interface
interface MoodSettings {
  autoDetection: boolean;
  preferredMoods: {
    morning: ColorMood;
    day: ColorMood;
    evening: ColorMood;
    night: ColorMood;
  };
  rememberLastMood: boolean;
}

// Default mood settings
const defaultMoodSettings: MoodSettings = {
  autoDetection: false,
  preferredMoods: {
    morning: "energetic",
    day: "focused",
    evening: "cheerful",
    night: "dark",
  },
  rememberLastMood: true,
};

// Mood analytics interface
interface MoodAnalytics {
  moodUsage: Record<ColorMood, number>;
  lastChanged: string;
  totalChanges: number;
  dailyMoods: Array<{
    date: string;
    mood: ColorMood;
    duration: number;
  }>;
}

// Provider component
export function ColorMoodProvider({ children }: { children: React.ReactNode }) {
  // Initialize settings from localStorage
  const [settings, setSettings] = React.useState<MoodSettings>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(MOOD_SETTINGS_KEY);
      if (stored) {
        try {
          return { ...defaultMoodSettings, ...JSON.parse(stored) };
        } catch {
          return defaultMoodSettings;
        }
      }
    }
    return defaultMoodSettings;
  });

  // Initialize analytics from localStorage
  const [analytics, setAnalytics] = React.useState<MoodAnalytics>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(MOOD_ANALYTICS_KEY);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return {
            moodUsage: {
              calm: 0,
              energetic: 0,
              focused: 0,
              cheerful: 0,
              dark: 0,
            },
            lastChanged: new Date().toISOString(),
            totalChanges: 0,
            dailyMoods: [],
          };
        }
      }
    }
    return {
      moodUsage: { calm: 0, energetic: 0, focused: 0, cheerful: 0, dark: 0 },
      lastChanged: new Date().toISOString(),
      totalChanges: 0,
      dailyMoods: [],
    };
  });

  // Initialize mood from localStorage, settings, or auto-detection
  const [currentMood, setCurrentMood] = React.useState<ColorMood>(() => {
    if (typeof window !== "undefined") {
      // Check if auto-detection is enabled
      if (settings.autoDetection) {
        return getAutoMoodByTime();
      }

      // Check for stored mood if remember last mood is enabled
      if (settings.rememberLastMood) {
        const stored = localStorage.getItem(MOOD_STORAGE_KEY);
        if (stored && stored in colorMoods) {
          return stored as ColorMood;
        }
      }
    }
    return "calm";
  });

  // Update localStorage, CSS variables, and analytics when mood changes
  const setMood = React.useCallback(
    (mood: ColorMood, manual: boolean = true) => {
      setCurrentMood(mood);

      if (typeof window !== "undefined") {
        // Save mood preference if remember last mood is enabled
        if (settings.rememberLastMood) {
          localStorage.setItem(MOOD_STORAGE_KEY, mood);
        }

        // Update CSS variables for immediate theme changes
        updateCSSVariables(mood);

        // Update analytics if this was a manual change
        if (manual) {
          const now = new Date();
          const today = now.toDateString();

          setAnalytics((prev) => {
            const newAnalytics = {
              ...prev,
              moodUsage: {
                ...prev.moodUsage,
                [mood]: (prev.moodUsage[mood] || 0) + 1,
              },
              lastChanged: now.toISOString(),
              totalChanges: prev.totalChanges + 1,
              dailyMoods: [
                ...prev.dailyMoods.filter((dm) => dm.date !== today),
                {
                  date: today,
                  mood,
                  duration: Date.now(),
                },
              ],
            };

            // Save to localStorage
            localStorage.setItem(
              MOOD_ANALYTICS_KEY,
              JSON.stringify(newAnalytics)
            );
            return newAnalytics;
          });
        }
      }
    },
    [settings.rememberLastMood]
  );
  // Update settings function
  const updateSettings = React.useCallback(
    (newSettings: Partial<MoodSettings>) => {
      setSettings((prev) => {
        const updated = { ...prev, ...newSettings };

        if (typeof window !== "undefined") {
          localStorage.setItem(MOOD_SETTINGS_KEY, JSON.stringify(updated));
        }

        // If auto-detection was enabled, update mood
        if (newSettings.autoDetection && !prev.autoDetection) {
          const autoMood = getAutoMoodByTime();
          setMood(autoMood, false);
        }

        return updated;
      });
    },
    [setMood]
  );

  // Reset analytics function
  const resetAnalytics = React.useCallback(() => {
    const freshAnalytics = {
      moodUsage: { calm: 0, energetic: 0, focused: 0, cheerful: 0, dark: 0 },
      lastChanged: new Date().toISOString(),
      totalChanges: 0,
      dailyMoods: [],
    };

    setAnalytics(freshAnalytics);

    if (typeof window !== "undefined") {
      localStorage.setItem(MOOD_ANALYTICS_KEY, JSON.stringify(freshAnalytics));
    }
  }, []);

  // Auto mood detection effect
  React.useEffect(() => {
    if (!settings.autoDetection) return;

    const checkAutoMood = () => {
      const autoMood = getAutoMoodByTime();
      if (autoMood !== currentMood) {
        setMood(autoMood, false);
      }
    };

    // Check every hour
    const interval = setInterval(checkAutoMood, 60 * 60 * 1000);

    // Check on settings change
    checkAutoMood();

    return () => clearInterval(interval);
  }, [settings.autoDetection, currentMood, setMood]);

  // Initialize CSS variables on mount
  React.useEffect(() => {
    updateCSSVariables(currentMood);
  }, [currentMood]);

  const colors = colorMoods[currentMood];
  const uiColors = getUiColorsForMood(currentMood);
  const isDark = isDarkMood(currentMood);

  const availableMoods = Object.keys(moodDescriptions).map((key) => ({
    value: key as ColorMood,
    ...moodDescriptions[key as ColorMood],
  }));

  const value: ColorMoodContextType = {
    currentMood,
    setMood,
    colors,
    uiColors,
    isDark,
    availableMoods,
    settings,
    updateSettings,
    analytics,
    resetAnalytics,
  };

  return (
    <ColorMoodContext.Provider value={value}>
      {children}
    </ColorMoodContext.Provider>
  );
}

// Hook untuk menggunakan color mood context
export function useColorMood() {
  const context = React.useContext(ColorMoodContext);
  if (context === undefined) {
    throw new Error("useColorMood must be used within a ColorMoodProvider");
  }
  return context;
}

// Function to update CSS variables
function updateCSSVariables(mood: ColorMood) {
  const colors = colorMoods[mood];
  const root = document.documentElement;

  // Convert hex to HSL for CSS variables
  const hexToHsl = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0,
      s = 0,
      l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(
      l * 100
    )}%`;
  };

  // Update primary colors
  root.style.setProperty("--primary", hexToHsl(colors.primary.main));
  root.style.setProperty("--primary-foreground", hexToHsl(colors.text.white));

  // Update background colors
  root.style.setProperty("--background", hexToHsl(colors.background.main));
  root.style.setProperty("--card", hexToHsl(colors.background.card));
  root.style.setProperty("--card-foreground", hexToHsl(colors.text.primary));

  // Update secondary colors
  root.style.setProperty("--secondary", hexToHsl(colors.secondary.main));
  root.style.setProperty(
    "--secondary-foreground",
    hexToHsl(colors.text.primary)
  );

  // Update muted colors
  root.style.setProperty("--muted", hexToHsl(colors.secondary.accent));
  root.style.setProperty("--muted-foreground", hexToHsl(colors.text.muted));

  // Update accent colors
  root.style.setProperty("--accent", hexToHsl(colors.secondary.accent));
  root.style.setProperty("--accent-foreground", hexToHsl(colors.text.primary));

  // Update border colors
  root.style.setProperty("--border", hexToHsl(colors.border.main));
  root.style.setProperty("--input", hexToHsl(colors.border.main));

  // Update ring color
  root.style.setProperty("--ring", hexToHsl(colors.primary.main));

  // Update foreground
  root.style.setProperty("--foreground", hexToHsl(colors.text.primary));

  // Update popover colors
  root.style.setProperty("--popover", hexToHsl(colors.background.card));
  root.style.setProperty("--popover-foreground", hexToHsl(colors.text.primary));
}

// Hook untuk menggunakan warna spesifik mood tanpa context
export function useMoodColors(mood?: ColorMood) {
  const { currentMood } = useColorMood();
  const selectedMood = mood || currentMood;

  return React.useMemo(
    () => ({
      colors: colorMoods[selectedMood],
      uiColors: getUiColorsForMood(selectedMood),
      isDark: isDarkMood(selectedMood),
    }),
    [selectedMood]
  );
}

// Hook untuk persitence mood preference
export function useMoodPersistence() {
  const { currentMood, setMood, settings, updateSettings } = useColorMood();

  const saveMoodPreference = React.useCallback(
    (mood: ColorMood) => {
      setMood(mood);
    },
    [setMood]
  );

  const getMoodPreference = React.useCallback((): ColorMood => {
    return currentMood;
  }, [currentMood]);

  const exportPreferences = React.useCallback(() => {
    const data = {
      currentMood,
      settings,
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `quittracker-mood-preferences-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [currentMood, settings]);

  const importPreferences = React.useCallback(
    (file: File) => {
      return new Promise<void>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target?.result as string);
            if (data.currentMood && data.settings) {
              setMood(data.currentMood);
              updateSettings(data.settings);
              resolve();
            } else {
              reject(new Error("Invalid preference file format"));
            }
          } catch (error) {
            reject(error);
          }
        };
        reader.readAsText(file);
      });
    },
    [setMood, updateSettings]
  );

  return {
    saveMoodPreference,
    getMoodPreference,
    currentMood,
    exportPreferences,
    importPreferences,
  };
}

// Hook untuk mood analytics
export function useMoodAnalytics() {
  const { analytics, resetAnalytics } = useColorMood();
  const getMostUsedMood = React.useCallback((): ColorMood => {
    const entries = Object.entries(analytics.moodUsage) as [
      ColorMood,
      number
    ][];
    return entries.reduce(
      (maxMood, [mood, count]) =>
        count > analytics.moodUsage[maxMood] ? mood : maxMood,
      "calm" as ColorMood
    );
  }, [analytics.moodUsage]);

  const getMoodPercentages = React.useCallback(() => {
    const total = Object.values(analytics.moodUsage).reduce(
      (sum, count) => sum + count,
      0
    );
    if (total === 0) return {};

    return Object.entries(analytics.moodUsage).reduce(
      (acc, [mood, count]) => ({
        ...acc,
        [mood]: Math.round((count / total) * 100),
      }),
      {} as Record<ColorMood, number>
    );
  }, [analytics.moodUsage]);

  const getRecentMoodTrend = React.useCallback(() => {
    const recent = analytics.dailyMoods.slice(-7); // Last 7 days
    return recent.map((day) => ({
      date: day.date,
      mood: day.mood,
      emoji: moodDescriptions[day.mood].emoji,
    }));
  }, [analytics.dailyMoods]);

  return {
    analytics,
    resetAnalytics,
    getMostUsedMood,
    getMoodPercentages,
    getRecentMoodTrend,
  };
}

// Hook untuk auto mood suggestions
export function useMoodSuggestions() {
  const { currentMood, analytics } = useColorMood();

  const getSuggestedMood = React.useCallback((): {
    mood: ColorMood;
    reason: string;
  } => {
    const hour = new Date().getHours();
    const mostUsed =
      (Object.entries(analytics.moodUsage).sort(
        ([, a], [, b]) => b - a
      )[0]?.[0] as ColorMood) || "calm";

    // Time-based suggestions
    if (hour >= 6 && hour < 9) {
      return { mood: "energetic", reason: "Start your morning with energy!" };
    } else if (hour >= 9 && hour < 17) {
      return { mood: "focused", reason: "Perfect time for productivity" };
    } else if (hour >= 17 && hour < 20) {
      return { mood: "cheerful", reason: "Brighten your evening" };
    } else if (hour >= 20 && hour < 22) {
      return { mood: "calm", reason: "Wind down for the day" };
    } else {
      return { mood: "dark", reason: "Easy on the eyes for night time" };
    }
  }, [analytics.moodUsage]);

  return {
    getSuggestedMood,
  };
}
