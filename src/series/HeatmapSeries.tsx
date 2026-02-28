import React, { useMemo, useState, useRef, useEffect } from "react";
import { useChart } from "../primitives/Chart";
import { TooltipPortal, DefaultTooltip } from "../primitives/Tooltip";

export type HeatmapCell = {
  value: number;
  label?: string;
};

function interpolateColor(
  t: number,
  stops: Array<{ offset: number; color: string }>
): string {
  if (stops.length === 0) return "var(--msc-grid)";
  const first = stops[0];
  if (stops.length === 1 || !first) return first?.color ?? "var(--msc-grid)";
  t = Math.max(0, Math.min(1, t));
  for (let i = 0; i < stops.length - 1; i++) {
    const a = stops[i];
    const b = stops[i + 1];
    if (a && b && t >= a.offset && t <= b.offset) {
      const local = (t - a.offset) / (b.offset - a.offset || 1);
      return lerpColor(a.color, b.color, local);
    }
  }
  const last = stops[stops.length - 1];
  return last?.color ?? "var(--msc-grid)";
}

function lerpColor(a: string, b: string, t: number): string {
  const parse = (hex: string): [number, number, number] => {
    const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
    return m ? [parseInt(m[1] ?? "0", 16), parseInt(m[2] ?? "0", 16), parseInt(m[3] ?? "0", 16)] : [0, 0, 0];
  };
  const [r1, g1, b1] = parse(a);
  const [r2, g2, b2] = parse(b);
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const bl = Math.round(b1 + (b2 - b1) * t);
  return `rgb(${r},${g},${bl})`;
}

export type HeatmapGradientStop = { offset: number; color: string };

export function HeatmapSeries({
  rows,
  columns,
  data,
  colorScale = ["#93c5fd", "#3b82f6", "#8b5cf6", "#7c3aed"],
  gradientStops,
  animate = true,
  duration = 300,
  hoverDimOpacity = 0.7,
  tooltip
}: {
  rows: string[];
  columns: string[];
  data: HeatmapCell[][];
  colorScale?: string[];
  gradientStops?: HeatmapGradientStop[];
  animate?: boolean;
  duration?: number;
  hoverDimOpacity?: number;
  tooltip?: (row: string, col: string, cell: HeatmapCell) => { title: string; rows: Array<{ label: string; value: string; color: string }> };
}) {
  const [hovered, setHovered] = useState<{ r: number; c: number } | null>(null);
  const leaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { innerWidth, innerHeight, svgRef, margin, registerClearTooltip, clearAllTooltips } = useChart();

  const clearTooltip = () => {
    if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
    leaveTimeoutRef.current = null;
    setHovered(null);
  };

  useEffect(() => {
    return registerClearTooltip(clearTooltip);
  }, [registerClearTooltip]);

  const handleEnter = (r: number, c: number) => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    clearAllTooltips();
    setHovered({ r, c });
  };

  const handleLeave = () => {
    leaveTimeoutRef.current = setTimeout(clearTooltip, 150);
  };

  const { cellWidth, cellHeight, minVal, maxVal } = useMemo(() => {
    const cellW = innerWidth / Math.max(columns.length, 1);
    const cellH = innerHeight / Math.max(rows.length, 1);
    let min = Infinity;
    let max = -Infinity;
    data.forEach((row) =>
      row.forEach((cell) => {
        if (cell.value < min) min = cell.value;
        if (cell.value > max) max = cell.value;
      })
    );
    if (min === Infinity) min = 0;
    if (max === -Infinity) max = 1;
    return { cellWidth: cellW, cellHeight: cellH, minVal: min, maxVal: max };
  }, [innerWidth, innerHeight, columns.length, rows.length, data]);

  const getColor = (value: number) => {
    const t = maxVal === minVal ? 0 : (value - minVal) / (maxVal - minVal);
    if (gradientStops && gradientStops.length > 0) {
      return interpolateColor(t, gradientStops);
    }
    if (colorScale.length === 0) return "var(--msc-grid)";
    const idx = Math.min(
      Math.floor(t * (colorScale.length - 1)),
      colorScale.length - 1
    );
    return colorScale[idx];
  };

  return (
    <g>
      {rows.map((rowLabel, r) => (
        <text
          key={`row-${r}`}
          x={-8}
          y={r * cellHeight + cellHeight / 2}
          textAnchor="end"
          fontSize={10}
          fill="var(--msc-muted)"
          dy="0.32em"
        >
          {rowLabel}
        </text>
      ))}
      {columns.map((colLabel, c) => (
        <text
          key={`col-${c}`}
          x={c * cellWidth + cellWidth / 2}
          y={innerHeight + 16}
          textAnchor="middle"
          fontSize={10}
          fill="var(--msc-muted)"
        >
          {colLabel}
        </text>
      ))}
      {rows.map((rowLabel, r) =>
        columns.map((colLabel, c) => {
          const cell = data[r]?.[c] ?? { value: 0 };
          const x = c * cellWidth;
          const y = r * cellHeight;
          const isHovered = hovered?.r === r && hovered?.c === c;
          const opacity = hovered === null ? 1 : isHovered ? 1 : hoverDimOpacity;

          return (
            <g key={`${r}-${c}`}>
              <rect
                x={x + 1}
                y={y + 1}
                width={cellWidth - 2}
                height={cellHeight - 2}
                fill={getColor(cell.value)}
                opacity={opacity}
                rx={2}
                style={{
                  ...(animate
                    ? { animation: `msc-area-reveal ${duration}ms ease-out ${(r * columns.length + c) * 20}ms both` }
                    : {}),
                  transition: "opacity 0.2s ease",
                  cursor: tooltip ? "pointer" : undefined
                }}
                onMouseEnter={() => handleEnter(r, c)}
                onMouseLeave={handleLeave}
              />
              {tooltip && isHovered && (
                <TooltipPortal
                  anchorX={x + cellWidth / 2}
                  anchorY={y + cellHeight / 2}
                  containerWidth={innerWidth}
                  containerHeight={innerHeight}
                  svgRef={svgRef}
                  margin={margin}
                >
                  <DefaultTooltip {...tooltip(rowLabel, colLabel, cell)} />
                </TooltipPortal>
              )}
            </g>
          );
        })
      )}
    </g>
  );
}
