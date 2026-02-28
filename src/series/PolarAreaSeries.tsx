import React, { useMemo, useState, useRef, useEffect } from "react";
import { arc as d3arc } from "d3-shape";
import type { Datum, Accessor } from "../types";
import { useChart } from "../primitives/Chart";
import { TooltipPortal, DefaultTooltip } from "../primitives/Tooltip";
import type { TooltipContent } from "./BarSeries";

const DEFAULT_COLORS = [
  "var(--msc-s1)",
  "var(--msc-s2)",
  "var(--msc-s3)",
  "var(--msc-s4)",
  "var(--msc-s5)"
];

const HOVER_LEAVE_DELAY = 150;

type ArcDatum = { data: Datum; index: number; startAngle: number; endAngle: number; innerRadius: number; outerRadius: number };

export function PolarAreaSeries<T extends Datum>({
  data,
  value,
  colors = DEFAULT_COLORS,
  innerRadius = 0,
  padAngle = 0.02,
  cornerRadius = 4,
  animate = true,
  duration = 600,
  hoverDimOpacity = 0.4,
  tooltip
}: {
  data: T[];
  value: Accessor<T, number>;
  colors?: string[];
  innerRadius?: number;
  padAngle?: number;
  cornerRadius?: number;
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

  const { arcs, arcGen, cx, cy } = useMemo(() => {
    const r = Math.min(innerWidth, innerHeight) / 2 - 8;
    const cx = innerWidth / 2;
    const cy = innerHeight / 2;
    const maxVal = Math.max(...data.map((d, i) => value(d, i)), 1);
    const n = data.length;
    const angleStep = (2 * Math.PI) / n;

    const arcs: ArcDatum[] = data.map((d, i) => {
      const val = value(d, i);
      const outerR = innerRadius + (val / maxVal) * (r - innerRadius);
      return {
        data: d,
        index: i,
        startAngle: i * angleStep,
        endAngle: (i + 1) * angleStep,
        innerRadius,
        outerRadius: outerR
      };
    });

    const arcGen = d3arc<ArcDatum>()
      .innerRadius((a) => a.innerRadius)
      .outerRadius((a) => a.outerRadius)
      .padAngle(padAngle)
      .cornerRadius(cornerRadius);

    return { arcs, arcGen, cx, cy };
  }, [data, value, innerWidth, innerHeight, innerRadius, padAngle, cornerRadius]);

  return (
    <g transform={`translate(${cx},${cy})`}>
      {arcs.map((arc, i) => {
        const d = arcGen(arc);
        if (!d) return null;
        const fill = colors[i % colors.length] ?? colors[0];
        const isHovered = hoveredIndex === i;
        const fillOpacity = hoveredIndex === null ? 0.92 : isHovered ? 1 : hoverDimOpacity;
        const [centroidX, centroidY] = arcGen.centroid(arc);

        return (
          <g key={i}>
            <path
              d={d}
              fill={fill}
              fillOpacity={fillOpacity}
              className={`msc-pie-slice-hoverable ${animate ? "msc-pie-slice-animate" : ""}`.trim()}
              style={{
                ...(animate
                  ? { animation: `msc-pie-draw ${duration}ms ease-out ${i * 40}ms both` }
                  : {}),
                transition: "fill-opacity 0.2s ease",
                cursor: tooltip ? "pointer" : undefined
              }}
              onMouseEnter={() => handleEnter(i)}
              onMouseLeave={handleLeave}
            />
            {tooltip && isHovered && (
              <TooltipPortal
                anchorX={cx + centroidX}
                anchorY={cy + centroidY}
                containerWidth={innerWidth}
                containerHeight={innerHeight}
                svgRef={svgRef}
                margin={margin}
              >
                <DefaultTooltip {...tooltip(arc.data as T, i)} />
              </TooltipPortal>
            )}
          </g>
        );
      })}
    </g>
  );
}
