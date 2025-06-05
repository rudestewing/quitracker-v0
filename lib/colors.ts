// Color configuration for Quit Tracking App
// 🎨 Soft, calming color palette designed for mental wellness

// 🌈 Color Mood System - Different palettes based on user's emotional state
export type ColorMood = "calm" | "energetic" | "focused" | "cheerful" | "dark";

// Helper function to create a complete color palette with all required properties
const createMoodPalette = (baseColors: any) => ({
  ...baseColors,
  // 🧊 Border and divider colors
  border: {
    main: baseColors.secondary.main, // Use secondary as border
    light: baseColors.background.card, // Lighter border variant
    card: baseColors.secondary.accent, // Card border color
  },

  // 🎯 Interactive states
  interactive: {
    hover: baseColors.primary.hover, // Hover state for primary elements
    active: baseColors.primary.dark, // Active/pressed state
    disabled: baseColors.secondary.main, // Disabled state
    focus: baseColors.primary.main, // Focus ring color
  },

  // 🌱 Progress and streak colors
  progress: {
    positive: baseColors.status.success, // Success color for positive progress
    neutral: baseColors.secondary.main, // Neutral progress
    warning: baseColors.status.warning, // Progress warning
  },
});

export const colorMoods = {
  // 😌 Calm - Original soft, pastel palette for relaxation
  calm: createMoodPalette({
    primary: {
      main: "#E67C7C", // Soft Red (pastel red)
      hover: "#D86C6C",
      light: "#F0A0A0",
      dark: "#D85555",
    },
    background: {
      main: "#FAF6F6", // Almost White / Warm Light
      card: "#FDECEC", // Soft Blush
    },
    secondary: {
      main: "#D9A5A5", // Dusty Rose
      accent: "#E0DCDC",
    },
    text: {
      primary: "#444444", // Charcoal Gray
      white: "#FFFFFF",
      muted: "#666666",
    },
    status: {
      warning: "#E4B28A", // Desaturated Orange
      success: "#B8D8C5", // Desaturated Green
      info: "#A5C4D9", // Soft blue
    },
  }),

  // ⚡ Energetic - Vibrant colors to boost motivation
  energetic: createMoodPalette({
    primary: {
      main: "#FF6B35", // Vibrant Orange
      hover: "#E55A2E",
      light: "#FF8F66",
      dark: "#CC5529",
    },
    background: {
      main: "#FFF8F5", // Warm white
      card: "#FFF1E6", // Light orange tint
    },
    secondary: {
      main: "#FFB084", // Light orange
      accent: "#FFCC99",
    },
    text: {
      primary: "#2D1810", // Dark brown
      white: "#FFFFFF",
      muted: "#5A3A2A",
    },
    status: {
      warning: "#FFD700", // Bright yellow
      success: "#4CAF50", // Vibrant green
      info: "#2196F3", // Bright blue
    },
  }),

  // 🎯 Focused - Clean, minimalist colors for concentration
  focused: createMoodPalette({
    primary: {
      main: "#4A90E2", // Professional blue
      hover: "#3A7BC8",
      light: "#7BB3F0",
      dark: "#2F5F8F",
    },
    background: {
      main: "#FAFBFC", // Pure white
      card: "#F8F9FA", // Light gray
    },
    secondary: {
      main: "#6C757D", // Neutral gray
      accent: "#ADB5BD",
    },
    text: {
      primary: "#212529", // Almost black
      white: "#FFFFFF",
      muted: "#6C757D",
    },
    status: {
      warning: "#FFC107", // Amber
      success: "#28A745", // Success green
      info: "#17A2B8", // Info cyan
    },
  }),

  // 🌈 Cheerful - Bright, happy colors to lift spirits
  cheerful: createMoodPalette({
    primary: {
      main: "#FF69B4", // Hot pink
      hover: "#E55AA0",
      light: "#FF8FC7",
      dark: "#CC5490",
    },
    background: {
      main: "#FFF9FC", // Light pink tint
      card: "#FFF0F7", // Soft pink
    },
    secondary: {
      main: "#FFB6C1", // Light pink
      accent: "#FFA0CB",
    },
    text: {
      primary: "#2E1A2B", // Dark purple
      white: "#FFFFFF",
      muted: "#5C4A57",
    },
    status: {
      warning: "#FFD700", // Golden yellow
      success: "#32CD32", // Lime green
      info: "#00CED1", // Dark turquoise
    },
  }),

  // 🌙 Dark - Dark theme with calming colors for night use
  dark: createMoodPalette({
    primary: {
      main: "#BB86FC", // Light purple
      hover: "#A374E8",
      light: "#D4B4FF",
      dark: "#9D5EE3",
    },
    background: {
      main: "#121212", // Dark background
      card: "#1E1E1E", // Card background
    },
    secondary: {
      main: "#6C6C6C", // Medium gray
      accent: "#8C8C8C",
    },
    text: {
      primary: "#FFFFFF", // White text
      white: "#FFFFFF",
      muted: "#B3B3B3", // Light gray
    },
    status: {
      warning: "#FFB74D", // Soft orange
      success: "#81C784", // Soft green
      info: "#64B5F6", // Soft blue
    },
  }),
} as const;

// Default mood
export const colors = colorMoods.calm;

// Pre-defined UI component color combinations using current mood
export const uiColors = {
  // Primary button styling
  primaryButton: {
    background: colors.primary.main,
    hover: colors.primary.hover,
    text: colors.text.white,
    disabled: colors.interactive.disabled,
  },

  // Page layout colors
  layout: {
    background: colors.background.main,
    cardBackground: colors.background.card,
    cardBorder: colors.border.card,
  },

  // Text combinations
  typography: {
    heading: colors.text.primary,
    body: colors.text.primary,
    muted: colors.text.muted,
    onPrimary: colors.text.white,
  },

  // Alert and notification colors
  alerts: {
    warning: {
      background: colors.status.warning,
      text: colors.text.primary,
      border: colors.status.warning,
    },
    success: {
      background: colors.status.success,
      text: colors.text.primary,
      border: colors.status.success,
    },
    info: {
      background: colors.status.info,
      text: colors.text.primary,
      border: colors.status.info,
    },
  },
} as const;

// Function to get UI colors for a specific mood
export const getUiColorsForMood = (mood: ColorMood) => {
  const moodColors = colorMoods[mood];
  return {
    primaryButton: {
      background: moodColors.primary.main,
      hover: moodColors.primary.hover,
      text: moodColors.text.white,
      disabled: moodColors.interactive.disabled,
    },
    layout: {
      background: moodColors.background.main,
      cardBackground: moodColors.background.card,
      cardBorder: moodColors.border.card,
    },
    typography: {
      heading: moodColors.text.primary,
      body: moodColors.text.primary,
      muted: moodColors.text.muted,
      onPrimary: moodColors.text.white,
    },
    alerts: {
      warning: {
        background: moodColors.status.warning,
        text: moodColors.text.primary,
        border: moodColors.status.warning,
      },
      success: {
        background: moodColors.status.success,
        text: moodColors.text.primary,
        border: moodColors.status.success,
      },
      info: {
        background: moodColors.status.info,
        text: moodColors.text.primary,
        border: moodColors.status.info,
      },
    },
  };
};

// Export individual color values for easy access
export const {
  primary,
  background,
  secondary,
  text,
  status,
  border,
  interactive,
  progress,
} = colors;

// Type definitions for TypeScript support
export type ColorPalette = typeof colors;
export type UIColors = typeof uiColors;
export type PrimaryColors = typeof colors.primary;
export type StatusColors = typeof colors.status;

// Mood-related exports
export type MoodColorPalette = (typeof colorMoods)[ColorMood];

// Helper function to check if a mood is dark
export const isDarkMood = (mood: ColorMood): boolean => {
  return mood === "dark";
};
