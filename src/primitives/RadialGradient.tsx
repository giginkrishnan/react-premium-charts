import React from "react";

export function RadialGradient({
  id,
  cx = "50%",
  cy = "50%",
  r = "50%",
  fx,
  fy,
  stops
}: {
  id: string;
  cx?: string | number;
  cy?: string | number;
  r?: string | number;
  fx?: string | number;
  fy?: string | number;
  stops: Array<{ offset: string | number; color: string; opacity?: number }>;
}) {
  return (
    <defs>
      <radialGradient id={id} cx={cx} cy={cy} r={r} fx={fx} fy={fy}>
        {stops.map((s, i) => (
          <stop
            key={i}
            offset={s.offset}
            stopColor={s.color}
            stopOpacity={s.opacity ?? 1}
          />
        ))}
      </radialGradient>
    </defs>
  );
}
