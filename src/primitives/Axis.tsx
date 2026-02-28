import React from "react";
import { useChart } from "./Chart";

type Tick = { value: string; x: number; y: number };

export function AxisBottom({
  ticks,
  y = undefined
}: {
  ticks: Tick[];
  y?: number;
}) {
  const { innerHeight } = useChart();
  const yy = y ?? innerHeight;

  return (
    <g>
      <line x1={0} x2={Math.max(...ticks.map(t => t.x), 0)} y1={yy} y2={yy} stroke="var(--msc-border)" />
      {ticks.map((t) => (
        <g key={t.value} transform={`translate(${t.x},${yy})`}>
          <line y2={6} stroke="var(--msc-border)" />
          <text
            y={18}
            textAnchor="middle"
            fontSize={12}
            fill="var(--msc-muted)"
          >
            {t.value}
          </text>
        </g>
      ))}
    </g>
  );
}

export function AxisLeft({
  ticks
}: {
  ticks: Tick[];
}) {
  const x = 0;
  const maxY = Math.max(...ticks.map(t => t.y), 0);

  return (
    <g>
      <line x1={x} x2={x} y1={0} y2={maxY} stroke="var(--msc-border)" />
      {ticks.map((t) => (
        <g key={t.value} transform={`translate(${x},${t.y})`}>
          <line x2={-6} stroke="var(--msc-border)" />
          <text
            x={-10}
            dy="0.32em"
            textAnchor="end"
            fontSize={12}
            fill="var(--msc-muted)"
          >
            {t.value}
          </text>
        </g>
      ))}
    </g>
  );
}
