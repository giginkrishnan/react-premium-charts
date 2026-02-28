import React from "react";
import { useChart } from "./Chart";

export function Grid({
  xTicks,
  yTicks
}: {
  xTicks: number[];
  yTicks: number[];
}) {
  const { innerWidth, innerHeight } = useChart();

  return (
    <g aria-hidden="true">
      {xTicks.map((x) => (
        <line
          key={`x-${x}`}
          x1={x}
          x2={x}
          y1={0}
          y2={innerHeight}
          stroke="var(--msc-grid)"
          strokeDasharray="3 6"
        />
      ))}
      {yTicks.map((y) => (
        <line
          key={`y-${y}`}
          x1={0}
          x2={innerWidth}
          y1={y}
          y2={y}
          stroke="var(--msc-grid)"
          strokeDasharray="3 6"
        />
      ))}
    </g>
  );
}
