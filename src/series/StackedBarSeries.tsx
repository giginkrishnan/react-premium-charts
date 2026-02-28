import React, { useState, useRef, useEffect } from "react";
import { TooltipPortal, DefaultTooltip } from "../primitives/Tooltip";
import { useChart } from "../primitives/Chart";
import type { TooltipContent } from "./BarSeries";

const HOVER_LEAVE_DELAY = 150;

export type StackedSegment = {
  value: number;
  fill: string;
  label?: string;
  tooltip?: TooltipContent;
};

export function StackedBarSeries({
  segments,
  orientation = "horizontal",
  radius = 4,
  animate = true,
  duration = 400,
  hoverDimOpacity = 0.4,
  showValues = true,
  valueFormat = (v) => String(v)
}: {
  segments: StackedSegment[];
  orientation?: "horizontal" | "vertical";
  radius?: number;
  animate?: boolean;
  duration?: number;
  hoverDimOpacity?: number;
  showValues?: boolean;
  valueFormat?: (value: number) => string;
}) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const leaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { innerWidth, innerHeight, svgRef, margin, registerClearTooltip, clearAllTooltips } = useChart();

  const clearTooltip = () => {
    if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
    leaveTimeoutRef.current = null;
    setHoveredIdx(null);
  };

  useEffect(() => {
    return registerClearTooltip(clearTooltip);
  }, [registerClearTooltip]);

  const handleEnter = (idx: number) => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    clearAllTooltips();
    setHoveredIdx(idx);
  };

  const handleLeave = () => {
    leaveTimeoutRef.current = setTimeout(clearTooltip, HOVER_LEAVE_DELAY);
  };

  const total = segments.reduce((s, seg) => s + seg.value, 0);
  if (total <= 0) return null;

  const isHorizontal = orientation === "horizontal";
  const barLength = isHorizontal ? innerWidth : innerHeight;
  const barThickness = isHorizontal ? innerHeight : innerWidth;

  let offset = 0;

  return (
    <g transform={isHorizontal ? undefined : `translate(0,${innerHeight}) rotate(-90)`}>
      {segments.map((seg, idx) => {
        const width = (seg.value / total) * barLength;
        const x = offset;
        offset += width;

        const isHovered = hoveredIdx === idx;
        const opacity = hoveredIdx === null ? 0.92 : isHovered ? 1 : hoverDimOpacity;
        const textX = x + width / 2;
        const textY = barThickness / 2;
        const minWidthForLabel = 24;

        return (
          <g key={idx}>
            <rect
              x={x}
              y={0}
              width={Math.max(0, width)}
              height={barThickness}
              rx={radius}
              ry={radius}
              fill={seg.fill}
              opacity={opacity}
              style={{
                ...(animate
                  ? { animation: `msc-bar-grow ${duration}ms ease-out ${idx * 50}ms both` }
                  : {}),
                transition: "opacity 0.2s ease",
                cursor: seg.tooltip ? "pointer" : undefined
              }}
              onMouseEnter={() => handleEnter(idx)}
              onMouseLeave={handleLeave}
            />
            {showValues && width >= minWidthForLabel && (
              <text
                x={textX}
                y={textY}
                textAnchor="middle"
                dominantBaseline="central"
                fill="white"
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  pointerEvents: "none",
                  textShadow: "0 1px 1px rgba(0,0,0,0.3)"
                }}
              >
                {seg.label ? `${seg.label}: ${valueFormat(seg.value)}` : valueFormat(seg.value)}
              </text>
            )}
            {seg.tooltip && isHovered && (
              <TooltipPortal
                anchorX={x + width / 2}
                anchorY={barThickness / 2}
                containerWidth={innerWidth}
                containerHeight={innerHeight}
                svgRef={svgRef}
                margin={margin}
              >
                <DefaultTooltip {...seg.tooltip} />
              </TooltipPortal>
            )}
          </g>
        );
      })}
    </g>
  );
}
