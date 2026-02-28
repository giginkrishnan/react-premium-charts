import React, { createContext, useContext, useMemo } from "react";

export type ThemeMode = "light" | "dark";

/** Predefined color palettes for chart series (--msc-s1 through --msc-s5) */
export type ChartPalette = "default" | "sage" | "periwinkle" | "indigo" | "ocean" | "forest";

const Ctx = createContext<{ mode: ThemeMode; palette: ChartPalette; isGradientEnabled: boolean }>({
  mode: "light",
  palette: "default",
  isGradientEnabled: true
});

export function ThemeProvider({
  mode = "light",
  palette = "default",
  isGradientEnabled = true,
  children
}: {
  mode?: ThemeMode;
  palette?: ChartPalette;
  isGradientEnabled?: boolean;
  children: React.ReactNode;
}) {
  const value = useMemo(() => ({ mode, palette, isGradientEnabled }), [mode, palette, isGradientEnabled]);
  return (
    <Ctx.Provider value={value}>
      <div className="msc-root" data-msc-theme={mode} data-msc-palette={palette}>
        {children}
      </div>
    </Ctx.Provider>
  );
}

export function useTheme() {
  return useContext(Ctx);
}
