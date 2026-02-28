import React, { useState, useRef, useEffect } from "react";
import type { ScaleBand, ScaleContinuousNumeric } from "d3-scale";
import type { Datum, Accessor } from "../types";
import { TooltipPortal, DefaultTooltip } from "../primitives/Tooltip";
import { useChart } from "../primitives/Chart";
import type { TooltipContent } from "./BarSeries";

const HOVER_LEAVE_DELAY = 150;

export function HorizontalBarSeries<T extends Datum>({
  data,
  y,
  x,
  yScale,
  xScale,
  fill = "var(--msc-s1)",
  radius = 6,
  animate = true,
  duration = 500,
  hoverDimOpacity = 0.4,
  tooltip
}: {
  data: T[];
  y: Accessor<T, string>;
  x: Accessor<T, number>;
  yScale: ScaleBand<string>;
  xScale: ScaleContinuousNumeric<number, number>;
  fill?: string;
  radius?: number;
  animate?: boolean;
  duration?: number;
  hoverDimOpacity?: number;
  tooltip?: (d: T, i: number) => TooltipContent;
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const leaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { innerWidth, innerHeight, svgRef, margin, registerClearTooltip, clearAllTooltips } = useChart();
  const barH = yScale.bandwidth();

  const clearTooltip = () => {
    if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
    leaveTimeoutRef.current = null;
    setHoveredIndex(null);
  };

  useEffect(() => {
    return registerClearTooltip(clearTooltip);
  }, [registerClearTooltip]);

  const handleEnter = (i: number) => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    clearAllTooltips();
    setHoveredIndex(i);
  };

  const handleLeave = () => {
    leaveTimeoutRef.current = setTimeout(clearTooltip, HOVER_LEAVE_DELAY);
  };

  return (
    <g>
      {data.map((d, i) => {
        const yy = yScale(y(d, i));
        if (yy == null) return null;
        const xVal = x(d, i);
        const xx = xScale(xVal);
        const zeroX = xScale(0);
        const w = xx - zeroX;
        const isHovered = hoveredIndex === i;
        const opacity = hoveredIndex === null ? 0.92 : isHovered ? 1 : hoverDimOpacity;
        const anchorX = w >= 0 ? zeroX + Math.abs(w) / 2 : zeroX - Math.abs(w) / 2;
        const anchorY = yy + barH / 2;

        return (
          <g key={i}>
            <rect
              x={w >= 0 ? zeroX : xx}
              y={yy}
              width={Math.abs(w)}
              height={barH}
              rx={radius}
              ry={radius}
              fill={fill}
              opacity={opacity}
              className={`msc-bar-hoverable ${animate ? "msc-bar-animate msc-bar-horizontal" : ""}`.trim()}
              style={{
                ...(animate
                  ? { animation: `msc-bar-grow-horizontal ${duration}ms ease-out ${i * 60}ms both` }
                  : {}),
                transition: "opacity 0.2s ease",
                cursor: tooltip ? "pointer" : undefined
              }}
              onMouseEnter={() => handleEnter(i)}
              onMouseLeave={handleLeave}
            />
            {tooltip && isHovered && (
              <TooltipPortal
                anchorX={anchorX}
                anchorY={anchorY}
                containerWidth={innerWidth}
                containerHeight={innerHeight}
                svgRef={svgRef}
                margin={margin}
              >
                <DefaultTooltip {...tooltip(d, i)} />
              </TooltipPortal>
            )}
          </g>
        );
      })}
    </g>
  );
}
