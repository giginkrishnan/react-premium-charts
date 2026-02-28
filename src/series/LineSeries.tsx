import React, { useMemo, useState, useRef, useEffect } from "react";
import { line as d3line, curveMonotoneX, curveLinear } from "d3-shape";
import type { ScaleContinuousNumeric } from "d3-scale";
import type { Datum, Accessor } from "../types";
import { TooltipPortal, DefaultTooltip } from "../primitives/Tooltip";
import type { TooltipContent } from "./BarSeries";
import { useChart } from "../primitives/Chart";

const HOVER_HIT_RADIUS = 12;
const HOVER_LEAVE_DELAY = 150;

export function LineSeries<T extends Datum>({
  data,
  x,
  y,
  xScale,
  yScale,
  stroke = "var(--msc-s1)",
  strokeWidth = 2.5,
  curve = "monotone",
  showMarkers = false,
  animate = false,
  duration = 800,
  hoverDimOpacity = 0.5,
  tooltip
}: {
  data: T[];
  x: Accessor<T, number>;
  y: Accessor<T, number>;
  xScale: ScaleContinuousNumeric<number, number>;
  yScale: ScaleContinuousNumeric<number, number>;
  stroke?: string;
  strokeWidth?: number;
  curve?: "monotone" | "linear";
  showMarkers?: boolean;
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

  const { pathD, points } = useMemo(() => {
    const gen = d3line<T>()
      .x((dd: T, i: number) => xScale(x(dd, i)))
      .y((dd: T, i: number) => yScale(y(dd, i)))
      .defined((dd: T, i: number) => Number.isFinite(x(dd, i)) && Number.isFinite(y(dd, i)))
      .curve(curve === "monotone" ? curveMonotoneX : curveLinear);
    const pathD = gen(data) ?? "";
    const points = data.map((d, i) => ({
      x: xScale(x(d, i)),
      y: yScale(y(d, i)),
      datum: d,
      index: i
    }));
    return { pathD, points };
  }, [data, x, y, xScale, yScale, curve]);

  const lineOpacity = hoveredIndex === null ? 1 : hoverDimOpacity;

  return (
    <g>
      <path
        d={pathD}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        opacity={lineOpacity}
        pathLength={animate ? 1 : undefined}
        strokeDasharray={animate ? "1 1" : undefined}
        strokeDashoffset={animate ? 1 : undefined}
        style={{
          ...(animate ? { animation: `msc-line-draw ${duration}ms ease-out forwards` } : {}),
          transition: "opacity 0.2s ease"
        }}
      />
      {points.map((pt, i) => (
        <g key={i}>
          {/* Invisible hit target for easier hover */}
          <circle
            cx={pt.x}
            cy={pt.y}
            r={HOVER_HIT_RADIUS}
            fill="transparent"
            style={{ cursor: "pointer" }}
            onMouseEnter={() => handleEnter(i)}
            onMouseLeave={handleLeave}
          />
          {(showMarkers || hoveredIndex === i) && (
            <>
              <circle
                cx={pt.x}
                cy={pt.y}
                r={showMarkers ? 4 : 6}
                fill={showMarkers ? stroke : "var(--msc-panel)"}
                stroke={showMarkers ? "var(--msc-panel)" : stroke}
                strokeWidth={showMarkers ? 2 : 2.5}
                style={{ transition: "opacity 0.15s ease" }}
              />
              {tooltip && hoveredIndex === i && (
                <TooltipPortal
                  anchorX={pt.x}
                  anchorY={pt.y}
                  containerWidth={innerWidth}
                  containerHeight={innerHeight}
                  svgRef={svgRef}
                  margin={margin}
                >
                  <DefaultTooltip {...tooltip(pt.datum, i)} />
                </TooltipPortal>
              )}
            </>
          )}
        </g>
      ))}
    </g>
  );
}
