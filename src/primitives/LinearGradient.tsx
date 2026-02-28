import React from "react";

export function LinearGradient({
  id,
  x1 = "0%",
  y1 = "0%",
  x2 = "0%",
  y2 = "100%",
  stops
}: {
  id: string;
  x1?: string | number;
  y1?: string | number;
  x2?: string | number;
  y2?: string | number;
  stops: Array<{ offset: string | number; color: string; opacity?: number }>;
}) {
  return (
    <defs>
      <linearGradient id={id} x1={x1} y1={y1} x2={x2} y2={y2}>
        {stops.map((s, i) => (
          <stop
            key={i}
            offset={s.offset}
            stopColor={s.color}
            stopOpacity={s.opacity ?? 1}
          />
        ))}
      </linearGradient>
    </defs>
  );
}
