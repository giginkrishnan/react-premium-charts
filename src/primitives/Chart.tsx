import React, { createContext, useContext, useMemo, useRef, useState, useCallback } from "react";

export type ChartMargin = { top: number; right: number; bottom: number; left: number };
export type ChartSize = { width: number; height: number };

type ChartContextValue = {
  size: ChartSize;
  margin: ChartMargin;
  innerWidth: number;
  innerHeight: number;
  svgRef: React.RefObject<SVGSVGElement>;
  pointer: { x: number; y: number } | null;
  setPointer: (p: { x: number; y: number } | null) => void;
  registerClearTooltip: (fn: () => void) => () => void;
  clearAllTooltips: () => void;
};

const ChartCtx = createContext<ChartContextValue | null>(null);

export function useChart() {
  const v = useContext(ChartCtx);
  if (!v) throw new Error("useChart must be used inside <Chart>");
  return v;
}

export function Chart({
  width,
  height,
  margin = { top: 16, right: 16, bottom: 28, left: 40 },
  children,
  className,
  style
}: {
  width: number;
  height: number;
  margin?: ChartMargin;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [pointer, setPointer] = useState<{ x: number; y: number } | null>(null);
  const clearTooltipFns = useRef<Set<() => void>>(new Set());

  const registerClearTooltip = useCallback((fn: () => void) => {
    clearTooltipFns.current.add(fn);
    return () => {
      clearTooltipFns.current.delete(fn);
    };
  }, []);

  const handleChartLeave = useCallback(() => {
    setPointer(null);
    clearTooltipFns.current.forEach((fn) => fn());
  }, []);

  const clearAllTooltips = useCallback(() => {
    clearTooltipFns.current.forEach((fn) => fn());
  }, []);

  const innerWidth = Math.max(0, width - margin.left - margin.right);
  const innerHeight = Math.max(0, height - margin.top - margin.bottom);

  const value = useMemo<ChartContextValue>(
    () => ({
      size: { width, height },
      margin,
      innerWidth,
      innerHeight,
      svgRef,
      pointer,
      setPointer,
      registerClearTooltip,
      clearAllTooltips
    }),
    [width, height, margin, innerWidth, innerHeight, pointer, registerClearTooltip, clearAllTooltips]
  );

  return (
    <ChartCtx.Provider value={value}>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        overflow="visible"
        className={className}
        style={{ background: "var(--msc-panel)", borderRadius: "var(--msc-radius)", ...style }}
        onMouseLeave={handleChartLeave}
        onMouseMove={(e) => {
          const svg = svgRef.current;
          if (!svg) return;
          const pt = svg.createSVGPoint();
          pt.x = e.clientX;
          pt.y = e.clientY;
          const screenCTM = svg.getScreenCTM();
          if (!screenCTM) return;
          const local = pt.matrixTransform(screenCTM.inverse());
          setPointer({ x: local.x, y: local.y });
        }}
      >
        <g transform={`translate(${margin.left},${margin.top})`}>{children}</g>
      </svg>
    </ChartCtx.Provider>
  );
}
