// Color configuration for Quit Tracking App
// 🎨 Soft, calming color palette designed for mental wellness

export const colors = {
  // 🌟 Primary colors - main action colors
  primary: {
    main: "#E67C7C", // Soft Red (pastel red) - warna utama yang lembut
    hover: "#D86C6C", // Darker variant for hover states
    light: "#F0A0A0", // Lighter variant
    dark: "#D85555", // Darker variant
  },

  // 🪶 Background colors
  background: {
    main: "#FAF6F6", // Almost White / Warm Light - latar belakang utama
    card: "#FDECEC", // Soft Blush - untuk card dan highlight ringan
  },

  // 🧭 Secondary colors
  secondary: {
    main: "#D9A5A5", // Dusty Rose - pendukung merah pastel
    accent: "#D9A5A5", // Untuk icon, border, dsb
  },

  // 📘 Text colors
  text: {
    primary: "#444444", // Charcoal Gray - kontras tinggi tapi tidak keras
    white: "#FFFFFF", // White text for dark backgrounds
    muted: "#666666", // Muted text variant
  },

  // 🧠 Status colors
  status: {
    warning: "#E4B28A", // Desaturated Orange - untuk reminder lembut
    success: "#B8D8C5", // Desaturated Green - untuk progress positif
    info: "#A5C4D9", // Soft blue for informational messages
  },

  // 🧊 Border and divider colors
  border: {
    main: "#E0DCDC", // Mist Gray - garis batas yang tidak kontras
    light: "#F0EEEE", // Lighter border variant
    card: "#E0DCDC", // Card border color
  },

  // 🎯 Interactive states
  interactive: {
    hover: "#D86C6C", // Hover state for primary elements
    active: "#C85555", // Active/pressed state
    disabled: "#E0DCDC", // Disabled state
    focus: "#E67C7C", // Focus ring color
  },

  // 🌱 Progress and streak colors
  progress: {
    positive: "#B8D8C5", // Desaturated Green - streak positif
    neutral: "#E0DCDC", // Neutral progress
    warning: "#E4B28A", // Progress warning
  },
} as const;

// Pre-defined UI component color combinations
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
