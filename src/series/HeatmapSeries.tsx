import React, { useMemo, useState, useRef, useEffect } from "react";
import { useChart } from "../primitives/Chart";
import { TooltipPortal, DefaultTooltip } from "../primitives/Tooltip";

export type HeatmapCell = {
  value: number;
  label?: string;
};

export function HeatmapSeries({
  rows,
  columns,
  data,
  colorScale = ["#dcfce7", "#86efac", "#22c55e", "#15803d"],
  animate = false,
  duration = 300,
  hoverDimOpacity = 0.7,
  tooltip
}: {
  rows: string[];
  columns: string[];
  data: HeatmapCell[][];
  colorScale?: string[];
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
    if (colorScale.length === 0) return "var(--msc-grid)";
    const t = maxVal === minVal ? 0 : (value - minVal) / (maxVal - minVal);
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
