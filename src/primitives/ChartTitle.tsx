import React from "react";

export function ChartTitle({
  title,
  x = 0,
  y = -8
}: {
  title: string;
  x?: number;
  y?: number;
}) {
  return (
    <text
      x={x}
      y={y}
      fontSize={14}
      fontWeight={600}
      fill="var(--msc-muted)"
    >
      {title}
    </text>
  );
}
