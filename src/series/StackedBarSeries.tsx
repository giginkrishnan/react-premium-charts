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
  const n = segments.length;

  function roundedRectPath(
    x: number,
    y: number,
    w: number,
    h: number,
    r: number,
    roundLeft: boolean,
    roundRight: boolean
  ): string {
    const r2 = Math.min(r, w / 2, h / 2);
    if (r2 <= 0) return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`;
    if (roundLeft && roundRight) {
      return `M ${x + r2} ${y} L ${x + w - r2} ${y} A ${r2} ${r2} 0 0 1 ${x + w} ${y + r2} L ${x + w} ${y + h - r2} A ${r2} ${r2} 0 0 1 ${x + w - r2} ${y + h} L ${x + r2} ${y + h} A ${r2} ${r2} 0 0 1 ${x} ${y + h - r2} L ${x} ${y + r2} A ${r2} ${r2} 0 0 1 ${x + r2} ${y} Z`;
    }
    if (roundLeft) {
      return `M ${x + r2} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x + r2} ${y + h} A ${r2} ${r2} 0 0 1 ${x} ${y + h - r2} L ${x} ${y + r2} A ${r2} ${r2} 0 0 1 ${x + r2} ${y} Z`;
    }
    if (roundRight) {
      return `M ${x} ${y} L ${x + w - r2} ${y} A ${r2} ${r2} 0 0 1 ${x + w} ${y + r2} L ${x + w} ${y + h - r2} A ${r2} ${r2} 0 0 1 ${x + w - r2} ${y + h} L ${x} ${y + h} Z`;
    }
    return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`;
  }

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

        const isFirst = idx === 0;
        const isLast = idx === n - 1;
        const roundLeft = isFirst;
        const roundRight = isLast;
        const pathD = roundedRectPath(x, 0, Math.max(0, width), barThickness, radius, roundLeft, roundRight);

        return (
          <g key={idx}>
            <path
              d={pathD}
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
