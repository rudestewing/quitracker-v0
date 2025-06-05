# 🎨 Color Mood System Documentation

## Overview

Color Mood System adalah fitur yang memungkinkan pengguna untuk mengubah seluruh tema warna aplikasi berdasarkan mood atau perasaan mereka saat itu. Sistem ini dirancang khusus untuk aplikasi QuitTracker dengan fokus pada kesehatan mental dan emotional wellness.

## Features

### 🌈 5 Mood Palettes

1. **😌 Calm & Peaceful** (Default)

   - Warna pastel lembut untuk relaksasi
   - Cocok untuk sesi mindfulness dan meditasi
   - Palet: Soft red, dusty rose, warm whites

2. **⚡ Energetic & Motivated**

   - Warna vibrant untuk meningkatkan energi
   - Cocok saat butuh motivasi ekstra
   - Palet: Vibrant orange, bright yellows, warm tones

3. **🎯 Focused & Productive**

   - Warna minimalis untuk konsentrasi
   - Cocok untuk sesi kerja dan produktivitas
   - Palet: Professional blue, neutral grays, clean whites

4. **🌈 Cheerful & Happy**

   - Warna cerah untuk mengangkat semangat
   - Cocok saat ingin merasa lebih positif
   - Palet: Hot pink, bright colors, joyful tones

5. **🌙 Dark & Cozy**
   - Tema gelap untuk penggunaan malam
   - Cocok untuk late night sessions
   - Palet: Dark backgrounds, light purple accents

## Implementation

### Core Files

- **`lib/colors.ts`** - Konfigurasi semua color palettes
- **`hooks/use-color-mood.tsx`** - React hooks untuk mengelola mood state
- **`components/color-mood-selector.tsx`** - UI components untuk pemilihan mood

### Usage Examples

#### Basic Hook Usage

```tsx
import { useColorMood } from "@/hooks/use-color-mood";

function MyComponent() {
  const { currentMood, setMood, colors, isDark } = useColorMood();

  return (
    <div style={{ backgroundColor: colors.background.main }}>
      <button onClick={() => setMood("energetic")}>
        Switch to Energetic Mode
      </button>
    </div>
  );
}
```

#### Using Color Mood Selector

```tsx
import { ColorMoodSelector } from '@/components/color-mood-selector'

// Grid layout (default)
<ColorMoodSelector variant="grid" />

// Dropdown selector
<ColorMoodSelector variant="dropdown" />

// Compact button layout
<ColorMoodSelector variant="compact" />
```

#### Floating Mood Selector

```tsx
import { FloatingMoodSelector } from "@/components/color-mood-selector";

// Adds a floating button in bottom-right corner
<FloatingMoodSelector />;
```

### Integration

The Color Mood System is integrated into the app through:

1. **Theme Provider**: Wraps the entire app in `app/layout.tsx`
2. **CSS Variables**: Automatically updates CSS custom properties
3. **Local Storage**: Persists user's mood preference
4. **Type Safety**: Full TypeScript support

## CSS Variables Integration

The system automatically updates these CSS variables:

- `--primary` - Primary brand color
- `--background` - Main background color
- `--card` - Card background color
- `--text-primary` - Primary text color
- `--border` - Border colors
- And many more...

## API Reference

### Types

```typescript
type ColorMood = "calm" | "energetic" | "focused" | "cheerful" | "dark";

interface ColorMoodContextType {
  currentMood: ColorMood;
  setMood: (mood: ColorMood) => void;
  colors: MoodColorPalette;
  uiColors: UIColors;
  isDark: boolean;
  availableMoods: MoodDescription[];
}
```

### Hooks

#### `useColorMood()`

Main hook untuk mengakses dan mengubah mood state.

#### `useMoodColors(mood?: ColorMood)`

Hook untuk mendapatkan warna spesifik mood tanpa mengubah state global.

#### `useMoodPersistence()`

Hook untuk mengelola penyimpanan mood preference.

### Components

#### `<ColorMoodSelector>`

Props:

- `variant?: 'grid' | 'dropdown' | 'compact'`
- `className?: string`
- `showDescription?: boolean`

#### `<FloatingMoodSelector>`

Floating action button untuk quick mood switching.

#### `<QuickMoodSwitcher>`

Horizontal row of mood emoji buttons.

## Color Psychology

Setiap mood dirancang berdasarkan prinsip color psychology:

- **Calm**: Warna pastel mengurangi stress dan anxiety
- **Energetic**: Warna warm meningkatkan energy dan motivation
- **Focused**: Warna cool meningkatkan concentration dan clarity
- **Cheerful**: Warna bright meningkatkan positive emotions
- **Dark**: Warna dark mengurangi eye strain di malam hari

## Benefits for QuitTracker App

1. **Emotional Support**: User bisa memilih warna yang sesuai dengan emotional state
2. **Motivation**: Warna energetic bisa membantu di hari-hari sulit
3. **Calm & Mindfulness**: Warna calm mendukung sesi meditasi dan relaksasi
4. **Personalization**: Setiap user bisa customize experience sesuai preferensi
5. **Accessibility**: Dark mode dan high contrast options
6. **Circadian Rhythm**: Dark mode untuk penggunaan malam hari

## Demo

Kunjungi `/color-mood-demo` untuk melihat semua mood palettes dalam action dan testing semua components.

## Future Enhancements

- **Auto Mood Detection**: Berdasarkan time of day atau user behavior
- **Custom Mood**: User bisa membuat custom color palette
- **Mood Analytics**: Track correlation antara mood colors dan progress
- **Seasonal Themes**: Automatic seasonal color adjustments
- **Accessibility Improvements**: High contrast dan colorblind-friendly options
