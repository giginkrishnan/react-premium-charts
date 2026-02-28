import React, { useMemo, useState, useRef, useEffect } from "react";
import { Chart } from "../primitives/Chart";
import { TooltipPortal, DefaultTooltip } from "../primitives/Tooltip";
import { useChart } from "../primitives/Chart";
import type { Datum, Accessor } from "../types";
import type { TooltipContent } from "../series/BarSeries";

const HOVER_LEAVE_DELAY = 150;

export function RadarChart<T extends Datum>({
  data,
  value,
  label,
  colors = ["var(--msc-s1)", "var(--msc-s2)", "var(--msc-s3)"],
  width = 280,
  height = 280,
  margin = { top: 24, right: 24, bottom: 24, left: 24 },
  levels = 5,
  animate = true,
  duration = 500,
  fillOpacity = 0.25,
  strokeWidth = 2,
  fill,
  stroke,
  defs,
  tooltip
}: {
  data: T[];
  value: Accessor<T, number>;
  label: Accessor<T, string>;
  colors?: string[];
  width?: number;
  height?: number;
  margin?: { top?: number; right?: number; bottom?: number; left?: number };
  levels?: number;
  animate?: boolean;
  duration?: number;
  fillOpacity?: number;
  strokeWidth?: number;
  fill?: string;
  stroke?: string;
  defs?: React.ReactNode;
  tooltip?: (d: T, i: number) => TooltipContent;
}) {
  const chartMargin = {
    top: margin.top ?? 24,
    right: margin.right ?? 24,
    bottom: margin.bottom ?? 24,
    left: margin.left ?? 24
  };

  const innerW = width - (chartMargin.left ?? 0) - (chartMargin.right ?? 0);
  const innerH = height - (chartMargin.top ?? 0) - (chartMargin.bottom ?? 0);
  const cx = innerW / 2;
  const cy = innerH / 2;
  const radius = Math.min(cx, cy) - 16;

  const n = data.length;
  const angleStep = (2 * Math.PI) / n;

  const points = useMemo(() => {
    const maxVal = Math.max(...data.map((d, i) => value(d, i)), 1);
    return data.map((d, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const val = value(d, i);
      const r = (val / maxVal) * radius;
      return {
        x: cx + r * Math.cos(angle),
        y: cy + r * Math.sin(angle),
        label: label(d, i),
        value: val,
        datum: d,
        index: i
      };
    });
  }, [data, value, label, angleStep, radius, cx, cy]);

  const polygonPoints = points.map((p) => `${p.x},${p.y}`).join(" ");
  const fillColor = fill ?? colors[0] ?? "var(--msc-s1)";
  const strokeColor = stroke ?? colors[0] ?? "var(--msc-s1)";

  return (
    <Chart width={width} height={height} margin={chartMargin}>
      {defs}
      <RadarGrid
        n={n}
        levels={levels}
        cx={cx}
        cy={cy}
        radius={radius}
        angleStep={angleStep}
      />
      <g>
        <polygon
          points={polygonPoints}
          fill={fillColor}
          fillOpacity={fillOpacity}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          style={{
            ...(animate
              ? { animation: `msc-area-reveal ${duration}ms ease-out forwards` }
              : {})
          }}
        />
        {points.map((pt, i) => (
          <RadarPoint
            key={i}
            pt={pt}
            color={strokeColor}
            animate={animate}
            duration={duration}
            delay={i * 60}
            tooltip={tooltip}
          />
        ))}
      </g>
      {points.map((pt, i) => (
        <text
          key={`label-${i}`}
          x={pt.x + (pt.x >= cx ? 8 : -8)}
          y={pt.y}
          textAnchor={pt.x >= cx ? "start" : "end"}
          dominantBaseline="middle"
          fontSize={10}
          fill="var(--msc-muted)"
        >
          {pt.label}
        </text>
      ))}
    </Chart>
  );
}

function RadarGrid({
  n,
  levels,
  cx,
  cy,
  radius,
  angleStep
}: {
  n: number;
  levels: number;
  cx: number;
  cy: number;
  radius: number;
  angleStep: number;
}) {
  const lines: React.ReactNode[] = [];

  for (let level = 1; level <= levels; level++) {
    const r = (radius * level) / levels;
    const pts: string[] = [];
    for (let i = 0; i <= n; i++) {
      const angle = i * angleStep - Math.PI / 2;
      pts.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
    }
    lines.push(
      <polygon
        key={`level-${level}`}
        points={pts.join(" ")}
        fill="none"
        stroke="var(--msc-grid)"
        strokeWidth={1}
      />
    );
  }

  for (let i = 0; i < n; i++) {
    const angle = i * angleStep - Math.PI / 2;
    const x2 = cx + radius * Math.cos(angle);
    const y2 = cy + radius * Math.sin(angle);
    lines.push(
      <line
        key={`axis-${i}`}
        x1={cx}
        y1={cy}
        x2={x2}
        y2={y2}
        stroke="var(--msc-grid)"
        strokeWidth={1}
      />
    );
  }

  return <g>{lines}</g>;
}

function RadarPoint<T extends Datum>({
  pt,
  color,
  animate,
  duration,
  delay,
  tooltip
}: {
  pt: { x: number; y: number; datum: T; index: number };
  color: string;
  animate: boolean;
  duration: number;
  delay: number;
  tooltip?: (d: T, i: number) => TooltipContent;
}) {
  const [hovered, setHovered] = useState(false);
  const leaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { innerWidth, innerHeight, svgRef, margin, registerClearTooltip, clearAllTooltips } = useChart();

  useEffect(() => {
    const clear = () => {
      if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
      setHovered(false);
    };
    return registerClearTooltip(clear);
  }, [registerClearTooltip]);

  const handleEnter = () => {
    if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
    clearAllTooltips();
    setHovered(true);
  };

  const handleLeave = () => {
    leaveTimeoutRef.current = setTimeout(() => setHovered(false), HOVER_LEAVE_DELAY);
  };

  return (
    <g>
      <circle
        cx={pt.x}
        cy={pt.y}
        r={5}
        fill={color}
        stroke="var(--msc-panel)"
        strokeWidth={2}
        style={{
          cursor: tooltip ? "pointer" : undefined,
          ...(animate
            ? { animation: `msc-marker-pop 400ms ease-out ${delay}ms both` }
            : {})
        }}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      />
      {tooltip && hovered && (
        <TooltipPortal
          anchorX={pt.x}
          anchorY={pt.y}
          containerWidth={innerWidth}
          containerHeight={innerHeight}
          svgRef={svgRef}
          margin={margin}
        >
          <DefaultTooltip {...tooltip(pt.datum, pt.index)} />
        </TooltipPortal>
      )}
    </g>
  );
}
