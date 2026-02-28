import React, { createContext, useContext, useMemo } from "react";

export type ThemeMode = "light" | "dark";

const Ctx = createContext<{ mode: ThemeMode }>({ mode: "light" });

export function ThemeProvider({
  mode = "light",
  children
}: {
  mode?: ThemeMode;
  children: React.ReactNode;
}) {
  const value = useMemo(() => ({ mode }), [mode]);
  return (
    <Ctx.Provider value={value}>
      <div className="msc-root" data-msc-theme={mode}>
        {children}
      </div>
    </Ctx.Provider>
  );
}

export function useTheme() {
  return useContext(Ctx);
}
