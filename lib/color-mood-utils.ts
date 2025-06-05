import { ColorMood, colorMoods, isDarkMood } from "@/lib/colors";

/**
 * Color Mood Utilities
 * Helper functions untuk bekerja dengan color mood system
 */

// Convert hex color to RGB values
export function hexToRgb(
  hex: string
): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

// Convert hex to HSL for CSS variables
export function hexToHsl(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return "0 0% 0%";

  const { r, g, b } = rgb;
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rNorm:
        h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0);
        break;
      case gNorm:
        h = (bNorm - rNorm) / d + 2;
        break;
      case bNorm:
        h = (rNorm - gNorm) / d + 4;
        break;
    }
    h /= 6;
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(
    l * 100
  )}%`;
}

// Get contrasting text color (black or white) for a given background color
export function getContrastingTextColor(backgroundColor: string): string {
  const rgb = hexToRgb(backgroundColor);
  if (!rgb) return "#000000";

  // Calculate luminance
  const { r, g, b } = rgb;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5 ? "#000000" : "#FFFFFF";
}

// Check if a color is considered "dark"
export function isColorDark(color: string): boolean {
  const rgb = hexToRgb(color);
  if (!rgb) return false;

  const { r, g, b } = rgb;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.5;
}

// Generate alpha variant of a color
export function withAlpha(color: string, alpha: number): string {
  const rgb = hexToRgb(color);
  if (!rgb) return color;

  const { r, g, b } = rgb;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Lighten or darken a color by percentage
export function adjustColorBrightness(color: string, percent: number): string {
  const rgb = hexToRgb(color);
  if (!rgb) return color;

  const { r, g, b } = rgb;
  const adjust = (value: number) => {
    const adjusted = value + (value * percent) / 100;
    return Math.max(0, Math.min(255, Math.round(adjusted)));
  };

  const newR = adjust(r);
  const newG = adjust(g);
  const newB = adjust(b);

  return `#${newR.toString(16).padStart(2, "0")}${newG
    .toString(16)
    .padStart(2, "0")}${newB.toString(16).padStart(2, "0")}`;
}

// Get mood-appropriate colors for specific UI elements
export function getMoodAwareColors(mood: ColorMood) {
  const moodColors = colorMoods[mood];
  const isDark = isDarkMood(mood);

  return {
    // Button variants
    button: {
      primary: {
        background: moodColors.primary.main,
        foreground: getContrastingTextColor(moodColors.primary.main),
        hover: moodColors.primary.hover,
      },
      secondary: {
        background: moodColors.secondary.main,
        foreground: moodColors.text.primary,
        hover: adjustColorBrightness(moodColors.secondary.main, -10),
      },
      ghost: {
        background: "transparent",
        foreground: moodColors.text.primary,
        hover: withAlpha(moodColors.primary.main, 0.1),
      },
    },

    // Input elements
    input: {
      background: isDark
        ? moodColors.background.card
        : moodColors.background.main,
      border: moodColors.border.main,
      foreground: moodColors.text.primary,
      placeholder: moodColors.text.muted,
      focus: moodColors.primary.main,
    },

    // Cards and surfaces
    surface: {
      primary: moodColors.background.main,
      secondary: moodColors.background.card,
      elevated: isDark
        ? adjustColorBrightness(moodColors.background.card, 10)
        : adjustColorBrightness(moodColors.background.card, 5),
    },

    // Status colors with mood influence
    status: {
      success: moodColors.status.success,
      warning: moodColors.status.warning,
      error: isDark ? "#ff6b6b" : "#dc3545",
      info: moodColors.status.info,
    },

    // Text hierarchy
    text: {
      primary: moodColors.text.primary,
      secondary: moodColors.text.muted,
      inverse: moodColors.text.white,
      accent: moodColors.primary.main,
    },
  };
}

// CSS-in-JS helper for mood-aware styling
export function moodAwareStyle(
  mood: ColorMood,
  element: string,
  variant?: string
) {
  const colors = getMoodAwareColors(mood);

  const styles: Record<string, any> = {
    button: {
      primary: {
        backgroundColor: colors.button.primary.background,
        color: colors.button.primary.foreground,
        "&:hover": {
          backgroundColor: colors.button.primary.hover,
        },
      },
      secondary: {
        backgroundColor: colors.button.secondary.background,
        color: colors.button.secondary.foreground,
        "&:hover": {
          backgroundColor: colors.button.secondary.hover,
        },
      },
    },
    card: {
      default: {
        backgroundColor: colors.surface.secondary,
        borderColor: colorMoods[mood].border.main,
        color: colors.text.primary,
      },
    },
    input: {
      default: {
        backgroundColor: colors.input.background,
        borderColor: colors.input.border,
        color: colors.input.foreground,
        "&::placeholder": {
          color: colors.input.placeholder,
        },
        "&:focus": {
          borderColor: colors.input.focus,
          outline: `2px solid ${withAlpha(colors.input.focus, 0.2)}`,
        },
      },
    },
  };

  return styles[element]?.[variant || "default"] || {};
}

// Generate CSS custom properties for a mood
export function generateMoodCSSProperties(
  mood: ColorMood
): Record<string, string> {
  const moodColors = colorMoods[mood];

  return {
    "--mood-primary": moodColors.primary.main,
    "--mood-primary-hover": moodColors.primary.hover,
    "--mood-primary-light": moodColors.primary.light,
    "--mood-primary-dark": moodColors.primary.dark,

    "--mood-background": moodColors.background.main,
    "--mood-background-card": moodColors.background.card,

    "--mood-secondary": moodColors.secondary.main,
    "--mood-secondary-accent": moodColors.secondary.accent,

    "--mood-text-primary": moodColors.text.primary,
    "--mood-text-white": moodColors.text.white,
    "--mood-text-muted": moodColors.text.muted,

    "--mood-status-success": moodColors.status.success,
    "--mood-status-warning": moodColors.status.warning,
    "--mood-status-info": moodColors.status.info,

    "--mood-border-main": moodColors.border.main,
    "--mood-border-light": moodColors.border.light,
    "--mood-border-card": moodColors.border.card,

    "--mood-interactive-hover": moodColors.interactive.hover,
    "--mood-interactive-active": moodColors.interactive.active,
    "--mood-interactive-disabled": moodColors.interactive.disabled,
    "--mood-interactive-focus": moodColors.interactive.focus,
  };
}

// Helper for Tailwind CSS dynamic classes
export function getMoodTailwindClasses(mood: ColorMood) {
  const isDark = isDarkMood(mood);

  return {
    // Background classes
    bg: {
      primary: isDark ? "bg-gray-900" : "bg-gray-50",
      card: isDark ? "bg-gray-800" : "bg-white",
      accent: isDark ? "bg-purple-900" : "bg-red-50",
    },

    // Text classes
    text: {
      primary: isDark ? "text-white" : "text-gray-900",
      secondary: isDark ? "text-gray-300" : "text-gray-600",
      accent: isDark ? "text-purple-300" : "text-red-600",
    },

    // Border classes
    border: {
      default: isDark ? "border-gray-700" : "border-gray-200",
      accent: isDark ? "border-purple-600" : "border-red-300",
    },
  };
}

// Type definitions for utilities
export type MoodAwareColors = ReturnType<typeof getMoodAwareColors>;
export type MoodTailwindClasses = ReturnType<typeof getMoodTailwindClasses>;
