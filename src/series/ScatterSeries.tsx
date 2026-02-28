import React, { useState, useRef, useEffect } from "react";
import type { ScaleContinuousNumeric } from "d3-scale";
import type { Datum, Accessor } from "../types";
import { TooltipPortal, DefaultTooltip } from "../primitives/Tooltip";
import { useChart } from "../primitives/Chart";
import type { TooltipContent } from "./BarSeries";

const HOVER_LEAVE_DELAY = 150;

export function ScatterSeries<T extends Datum>({
  data,
  x,
  y,
  xScale,
  yScale,
  fill = "var(--msc-s1)",
  stroke = "var(--msc-panel)",
  strokeWidth = 2,
  radius = 5,
  animate = true,
  duration = 400,
  hoverDimOpacity = 0.5,
  tooltip
}: {
  data: T[];
  x: Accessor<T, number>;
  y: Accessor<T, number>;
  xScale: ScaleContinuousNumeric<number, number>;
  yScale: ScaleContinuousNumeric<number, number>;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  radius?: number;
  animate?: boolean;
  duration?: number;
  hoverDimOpacity?: number;
  tooltip?: (d: T, i: number) => TooltipContent;
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const leaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { innerWidth, innerHeight, svgRef, margin, registerClearTooltip, clearAllTooltips } = useChart();

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
        const yy = yScale(y(d, i));
        if (!Number.isFinite(xx) || !Number.isFinite(yy)) return null;
        const isHovered = hoveredIndex === i;
        const opacity = hoveredIndex === null ? 0.92 : isHovered ? 1 : hoverDimOpacity;

        return (
          <g key={i}>
            <circle
              cx={xx}
              cy={yy}
              r={radius}
              fill={fill}
              stroke={stroke}
              strokeWidth={strokeWidth}
              opacity={opacity}
              style={{
                transition: "opacity 0.2s ease",
                cursor: tooltip ? "pointer" : undefined,
                ...(animate
                  ? { animation: `msc-marker-pop ${duration}ms ease-out ${i * 50}ms both` }
                  : {})
              }}
              onMouseEnter={() => handleEnter(i)}
              onMouseLeave={handleLeave}
            />
            {tooltip && isHovered && (
              <TooltipPortal
                anchorX={xx}
                anchorY={yy}
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
