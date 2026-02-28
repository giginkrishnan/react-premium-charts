import React, { useMemo } from "react";
import { area as d3area, curveMonotoneX, curveLinear } from "d3-shape";
import type { ScaleContinuousNumeric } from "d3-scale";
import type { Datum, Accessor } from "../types";

export function AreaSeries<T extends Datum>({
  data,
  x,
  y,
  y0 = 0,
  xScale,
  yScale,
  fill = "var(--msc-s1)",
  fillOpacity = 0.18,
  curve = "monotone",
  animate = true,
  duration = 600
}: {
  data: T[];
  x: Accessor<T, number>;
  y: Accessor<T, number>;
  y0?: number;
  xScale: ScaleContinuousNumeric<number, number>;
  yScale: ScaleContinuousNumeric<number, number>;
  fill?: string;
  fillOpacity?: number;
  curve?: "monotone" | "linear";
  animate?: boolean;
  duration?: number;
}) {
  const d = useMemo(() => {
    const gen = d3area<T>()
      .x((dd: T, i: number) => xScale(x(dd, i)))
      .y1((dd: T, i: number) => yScale(y(dd, i)))
      .y0(() => yScale(y0))
      .defined((dd: T, i: number) => Number.isFinite(x(dd, i)) && Number.isFinite(y(dd, i)))
      .curve(curve === "monotone" ? curveMonotoneX : curveLinear);
    return gen(data) ?? "";
  }, [data, x, y, y0, xScale, yScale, curve]);

  return (
    <path
      d={d}
      fill={fill}
      fillOpacity={fillOpacity}
      stroke="none"
      className={animate ? "msc-area-animate" : undefined}
      style={
        animate
          ? {
              animation: `msc-area-reveal ${duration}ms ease-out forwards`
            }
          : undefined
      }
    />
  );
}
