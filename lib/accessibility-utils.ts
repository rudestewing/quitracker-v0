/**
 * Accessibility utilities for the color mood system
 * Provides support for colorblind users and other accessibility needs
 */

import { ColorMood, colorMoods } from "./colors";

// Color contrast ratios for WCAG compliance
export const CONTRAST_RATIOS = {
  AA_NORMAL: 4.5,
  AA_LARGE: 3,
  AAA_NORMAL: 7,
  AAA_LARGE: 4.5,
} as const;

// Convert hex to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

// Calculate relative luminance
function getRelativeLuminance(rgb: {
  r: number;
  g: number;
  b: number;
}): number {
  const { r, g, b } = rgb;
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Calculate contrast ratio between two colors
export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) return 1;

  const lum1 = getRelativeLuminance(rgb1);
  const lum2 = getRelativeLuminance(rgb2);

  const brighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (brighter + 0.05) / (darker + 0.05);
}

// Check if contrast meets WCAG standards
export function meetsContrastStandard(
  foreground: string,
  background: string,
  level: "AA" | "AAA" = "AA",
  size: "normal" | "large" = "normal"
): boolean {
  const ratio = getContrastRatio(foreground, background);
  const key = `${level}_${size.toUpperCase()}` as keyof typeof CONTRAST_RATIOS;
  const required = CONTRAST_RATIOS[key];
  return ratio >= required;
}

// Colorblind-friendly patterns for mood identification
export const COLORBLIND_PATTERNS = {
  calm: {
    pattern: "dots",
    symbol: "●●●",
    description: "Three filled circles",
  },
  energetic: {
    pattern: "zigzag",
    symbol: "⚡⚡⚡",
    description: "Lightning bolts",
  },
  focused: {
    pattern: "lines",
    symbol: "|||",
    description: "Vertical lines",
  },
  cheerful: {
    pattern: "stars",
    symbol: "✦✦✦",
    description: "Stars",
  },
  dark: {
    pattern: "filled",
    symbol: "■■■",
    description: "Filled squares",
  },
} as const;

// Generate accessible mood indicators
export function getAccessibleMoodIndicator(mood: ColorMood): {
  pattern: string;
  symbol: string;
  description: string;
  ariaLabel: string;
} {
  const indicator = COLORBLIND_PATTERNS[mood];
  return {
    ...indicator,
    ariaLabel: `${mood} mood - ${indicator.description}`,
  };
}

// High contrast versions of moods for better accessibility
export function getHighContrastColors(mood: ColorMood) {
  const colors = colorMoods[mood];

  // Ensure text colors have high contrast
  const ensureContrast = (foreground: string, background: string) => {
    const ratio = getContrastRatio(foreground, background);
    if (ratio < CONTRAST_RATIOS.AA_NORMAL) {
      // Return high contrast alternative
      return background === "#ffffff" || background.includes("f")
        ? "#000000"
        : "#ffffff";
    }
    return foreground;
  };

  return {
    ...colors,
    text: {
      primary: ensureContrast(colors.text.primary, colors.background.main),
      secondary: ensureContrast(colors.text.secondary, colors.background.main),
      muted: ensureContrast(colors.text.muted, colors.background.main),
      white: "#ffffff",
      black: "#000000",
    },
  };
}

// Screen reader announcements for mood changes
export function getMoodChangeAnnouncement(
  newMood: ColorMood,
  previousMood?: ColorMood
): string {
  const moodDescriptions = {
    calm: "calm and peaceful colors for relaxation",
    energetic: "vibrant and energetic colors for motivation",
    focused: "clean and focused colors for productivity",
    cheerful: "bright and cheerful colors for positivity",
    dark: "dark and comfortable colors for low-light use",
  };

  if (previousMood) {
    return `Color theme changed from ${previousMood} to ${newMood}. Now using ${moodDescriptions[newMood]}.`;
  }

  return `Color theme set to ${newMood}. Using ${moodDescriptions[newMood]}.`;
}

// Generate CSS custom properties with accessibility features
export function generateAccessibleCSSProperties(
  mood: ColorMood,
  options: {
    highContrast?: boolean;
    reducedMotion?: boolean;
  } = {}
) {
  const colors = options.highContrast
    ? getHighContrastColors(mood)
    : colorMoods[mood];
  const properties: Record<string, string> = {};

  // Convert colors to CSS custom properties
  properties["--mood-primary"] = colors.primary.main;
  properties["--mood-primary-hover"] = colors.primary.hover;
  properties["--mood-background"] = colors.background.main;
  properties["--mood-background-card"] = colors.background.card;
  properties["--mood-text-primary"] = colors.text.primary;
  properties["--mood-text-secondary"] = colors.text.secondary;
  properties["--mood-text-muted"] = colors.text.muted;

  // Add motion preferences
  if (options.reducedMotion) {
    properties["--mood-transition-duration"] = "0ms";
    properties["--mood-animation-duration"] = "0ms";
  } else {
    properties["--mood-transition-duration"] = "300ms";
    properties["--mood-animation-duration"] = "500ms";
  }

  return properties;
}

// Validate mood accessibility
export function validateMoodAccessibility(mood: ColorMood): {
  isAccessible: boolean;
  issues: string[];
  suggestions: string[];
} {
  const colors = colorMoods[mood];
  const issues: string[] = [];
  const suggestions: string[] = [];

  // Check text contrast
  const textContrast = getContrastRatio(
    colors.text.primary,
    colors.background.main
  );
  if (textContrast < CONTRAST_RATIOS.AA_NORMAL) {
    issues.push(
      `Primary text contrast ratio is ${textContrast.toFixed(
        2
      )}, below WCAG AA standard`
    );
    suggestions.push(
      "Consider using darker text or lighter background for better readability"
    );
  }

  // Check button contrast
  const buttonContrast = getContrastRatio(
    colors.text.white,
    colors.primary.main
  );
  if (buttonContrast < CONTRAST_RATIOS.AA_NORMAL) {
    issues.push(
      `Button text contrast ratio is ${buttonContrast.toFixed(
        2
      )}, below WCAG AA standard`
    );
    suggestions.push(
      "Consider adjusting button colors for better accessibility"
    );
  }

  return {
    isAccessible: issues.length === 0,
    issues,
    suggestions,
  };
}

// Keyboard navigation helpers
export const KEYBOARD_SHORTCUTS = {
  CYCLE_MOOD_FORWARD: "KeyM",
  CYCLE_MOOD_BACKWARD: "KeyM+Shift",
  TOGGLE_HIGH_CONTRAST: "KeyH+Ctrl",
  RESET_TO_CALM: "KeyR+Ctrl+Shift",
} as const;

export function getMoodNavigationInstructions(): string {
  return `
    Keyboard shortcuts for mood navigation:
    - M: Cycle to next mood
    - Shift+M: Cycle to previous mood  
    - Ctrl+H: Toggle high contrast mode
    - Ctrl+Shift+R: Reset to calm mood
  `;
}
