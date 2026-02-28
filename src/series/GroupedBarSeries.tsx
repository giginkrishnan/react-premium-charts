import React, { useState, useRef, useEffect } from "react";
import type { ScaleBand, ScaleContinuousNumeric } from "d3-scale";
import type { Datum, Accessor } from "../types";
import { TooltipPortal, DefaultTooltip } from "../primitives/Tooltip";
import { useChart } from "../primitives/Chart";
import type { TooltipContent } from "./BarSeries";

const HOVER_LEAVE_DELAY = 150;

export type GroupedBarConfig<T extends Datum> = {
  y: Accessor<T, number>;
  fill: string;
  tooltip?: (d: T, i: number) => TooltipContent;
};

export function GroupedBarSeries<T extends Datum>({
  data,
  x,
  xScale,
  yScale,
  groups,
  radius = 6,
  animate = false,
  duration = 500,
  hoverDimOpacity = 0.4
}: {
  data: T[];
  x: Accessor<T, string>;
  xScale: ScaleBand<string>;
  yScale: ScaleContinuousNumeric<number, number>;
  groups: GroupedBarConfig<T>[];
  radius?: number;
  animate?: boolean;
  duration?: number;
  hoverDimOpacity?: number;
}) {
  const [hovered, setHovered] = useState<{ groupIdx: number; dataIdx: number } | null>(null);
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

  const handleEnter = (groupIdx: number, dataIdx: number) => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    clearAllTooltips();
    setHovered({ groupIdx, dataIdx });
  };

  const handleLeave = () => {
    leaveTimeoutRef.current = setTimeout(clearTooltip, HOVER_LEAVE_DELAY);
  };

  const groupCount = groups.length;
  const categoryBand = xScale.bandwidth();
  const barGap = 2;
  const barWidth = (categoryBand - barGap * (groupCount - 1)) / groupCount;

  return (
    <g>
      {groups.map((group, groupIdx) =>
        data.map((d, i) => {
          const xx = xScale(x(d, i));
          if (xx == null) return null;
          const xOffset = xx + groupIdx * (barWidth + barGap);
          const yVal = group.y(d, i);
          const yy = yScale(yVal);
          const zeroY = yScale(0);
          const h = zeroY - yy;
          const rectY = h >= 0 ? yy : zeroY;
          const isHovered = hovered?.groupIdx === groupIdx && hovered?.dataIdx === i;
          const opacity = hovered === null ? 0.92 : isHovered ? 1 : hoverDimOpacity;

          return (
            <g key={`${groupIdx}-${i}`}>
              <rect
                x={xOffset}
                y={rectY}
                width={barWidth}
                height={Math.abs(h)}
                rx={radius}
                ry={radius}
                fill={group.fill}
                opacity={opacity}
                className={`msc-bar-hoverable ${animate ? "msc-bar-animate" : ""}`.trim()}
                style={{
                  ...(animate
                    ? { animation: `msc-bar-grow ${duration}ms ease-out ${(i * groupCount + groupIdx) * 40}ms both` }
                    : {}),
                  transition: "opacity 0.2s ease",
                  cursor: group.tooltip ? "pointer" : undefined
                }}
                onMouseEnter={() => handleEnter(groupIdx, i)}
                onMouseLeave={handleLeave}
              />
              {group.tooltip && isHovered && (
                <TooltipPortal
                  anchorX={xOffset + barWidth / 2}
                  anchorY={yy}
                  containerWidth={innerWidth}
                  containerHeight={innerHeight}
                  svgRef={svgRef}
                  margin={margin}
                >
                  <DefaultTooltip {...group.tooltip(d, i)} />
                </TooltipPortal>
              )}
            </g>
          );
        })
      )}
    </g>
  );
}
