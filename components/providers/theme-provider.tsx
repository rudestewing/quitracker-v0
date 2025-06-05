"use client";

import * as React from "react";
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from "next-themes";
import { ColorMoodProvider } from "@/hooks/use-color-mood";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <ColorMoodProvider>{children}</ColorMoodProvider>
    </NextThemesProvider>
  );
}
