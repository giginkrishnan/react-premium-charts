import React from "react";
import { useChart } from "./Chart";

export function ThresholdLine({
  value,
  yScale,
  stroke = "var(--msc-s4)",
  strokeWidth = 1.5,
  strokeDasharray = "6 4",
  label
}: {
  value: number;
  yScale: (v: number) => number;
  stroke?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
  label?: string;
}) {
  const { innerWidth } = useChart();
  const y = yScale(value);

  return (
    <g>
      <line
        x1={0}
        x2={innerWidth}
        y1={y}
        y2={y}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeDasharray={strokeDasharray}
      />
      {label && (
        <text
          x={innerWidth - 4}
          y={y - 6}
          textAnchor="end"
          fontSize={11}
          fill="var(--msc-muted)"
        >
          {label}
        </text>
      )}
    </g>
  );
}
