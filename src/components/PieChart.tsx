import React from "react";
import { Chart } from "../primitives/Chart";
import { PieSeries } from "../series/PieSeries";
import { Legend } from "../primitives/Legend";
import type { Datum, Accessor } from "../types";
import type { TooltipContent } from "../series/BarSeries";

const DEFAULT_COLORS = [
  "var(--msc-s1)",
  "var(--msc-s2)",
  "var(--msc-s3)",
  "var(--msc-s4)",
  "var(--msc-s5)"
];

export function PieChart<T extends Datum>({
  data,
  value,
  label,
  colors = DEFAULT_COLORS,
  width = 280,
  height = 260,
  margin = { top: 16, right: 16, bottom: 16, left: 16 },
  showLegend = true,
  showValues = true,
  valueFormat = (v) => String(v),
  innerRadius = 0,
  padAngle = 0.02,
  cornerRadius = 4,
  tooltip
}: {
  data: T[];
  value: Accessor<T, number>;
  label?: Accessor<T, string>;
  colors?: string[];
  width?: number;
  height?: number;
  margin?: { top?: number; right?: number; bottom?: number; left?: number };
  showLegend?: boolean;
  showValues?: boolean;
  valueFormat?: (value: number) => string;
  innerRadius?: number;
  padAngle?: number;
  cornerRadius?: number;
  tooltip?: (d: T, i: number) => TooltipContent;
}) {
  const getColor = (i: number): string =>
    colors[i % colors.length] ?? colors[0] ?? "var(--msc-s1)";

  const legendItems = data.map((d, i) => ({
    label: label ? label(d, i) : `Item ${i + 1}`,
    value: showValues ? valueFormat(value(d, i)) : undefined,
    color: getColor(i)
  }));

  const defaultTooltip: (d: T, i: number) => TooltipContent =
    tooltip ??
    ((d, i) => ({
      title: label ? label(d, i) : `Item ${i + 1}`,
      rows: [{ label: "Value", value: valueFormat(value(d, i)), color: getColor(i) }]
    }));

  const chartMargin = {
    top: margin.top ?? 16,
    right: margin.right ?? 16,
    bottom: margin.bottom ?? 16,
    left: margin.left ?? 16
  };

  return (
    <div>
      <Chart width={width} height={height} margin={chartMargin}>
        <PieSeries
          data={data}
          value={value}
          colors={colors}
          innerRadius={innerRadius}
          padAngle={padAngle}
          cornerRadius={cornerRadius}
          tooltip={defaultTooltip}
        />
      </Chart>
      {showLegend && <Legend items={legendItems} />}
    </div>
  );
}
