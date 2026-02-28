import React, { useState, useRef, useEffect } from "react";
import type { ScaleBand, ScaleContinuousNumeric } from "d3-scale";
import type { Datum, Accessor } from "../types";
import { TooltipPortal, DefaultTooltip } from "../primitives/Tooltip";
import { useChart } from "../primitives/Chart";

export type TooltipContent = {
  title: string;
  rows: Array<{ label: string; value: string; color: string }>;
};

const HOVER_LEAVE_DELAY = 150;

export function BarSeries<T extends Datum>({
  data,
  x,
  y,
  xScale,
  yScale,
  fill = "var(--msc-s1)",
  radius = 10,
  animate = true,
  duration = 500,
  hoverDimOpacity = 0.4,
  tooltip
}: {
  data: T[];
  x: Accessor<T, string>;
  y: Accessor<T, number>;
  xScale: ScaleBand<string>;
  yScale: ScaleContinuousNumeric<number, number>;
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
  const barW = xScale.bandwidth();

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
        const xx = xScale(x(d, i));
        if (xx == null) return null;
        const yVal = y(d, i);
        const yy = yScale(yVal);
        const zeroY = yScale(0);
        const h = zeroY - yy;
        const isHovered = hoveredIndex === i;
        const opacity = hoveredIndex === null ? 0.92 : isHovered ? 1 : hoverDimOpacity;
        const anchorX = xx + barW / 2;
        const anchorY = yy;

        return (
          <g key={i}>
            <rect
              x={xx}
              y={h >= 0 ? yy : zeroY}
              width={barW}
              height={Math.abs(h)}
              rx={radius}
              ry={radius}
              fill={fill}
              opacity={opacity}
              className={`msc-bar-hoverable ${animate ? "msc-bar-animate" : ""}`.trim()}
              style={{
                ...(animate
                  ? { animation: `msc-bar-grow ${duration}ms ease-out ${i * 60}ms both` }
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
