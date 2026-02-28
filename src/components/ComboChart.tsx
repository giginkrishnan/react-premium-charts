import React, { useMemo } from "react";
import { scaleLinear, scaleBand } from "d3-scale";
import { Chart } from "../primitives/Chart";
import { Grid } from "../primitives/Grid";
import { AxisBottom, AxisLeft } from "../primitives/Axis";
import { BarSeries } from "../series/BarSeries";
import { LineSeries } from "../series/LineSeries";
import type { Datum, Accessor } from "../types";
import type { TooltipContent } from "../series/BarSeries";

export function ComboChart<T extends Datum>({
  data,
  x,
  bar,
  line,
  barLabel = "Bar",
  lineLabel = "Line",
  barFill = "var(--msc-s1)",
  lineStroke = "var(--msc-s2)",
  width = 320,
  height = 200,
  margin = { top: 24, right: 16, bottom: 28, left: 46 },
  showMarkers = true,
  animate = true,
  barTooltip,
  lineTooltip
}: {
  data: T[];
  x: Accessor<T, string>;
  bar: Accessor<T, number>;
  line: Accessor<T, number>;
  barLabel?: string;
  lineLabel?: string;
  barFill?: string;
  lineStroke?: string;
  width?: number;
  height?: number;
  margin?: { top?: number; right?: number; bottom?: number; left?: number };
  showMarkers?: boolean;
  animate?: boolean;
  barTooltip?: (d: T, i: number) => TooltipContent;
  lineTooltip?: (d: T, i: number) => TooltipContent;
}) {
  const chartMargin = {
    top: margin.top ?? 24,
    right: margin.right ?? 16,
    bottom: margin.bottom ?? 28,
    left: margin.left ?? 46
  };

  const innerW = width - (chartMargin.left ?? 0) - (chartMargin.right ?? 0);
  const innerH = height - (chartMargin.top ?? 0) - (chartMargin.bottom ?? 0);

  const xScale = useMemo(
    () => scaleBand<string>().domain(data.map((d, i) => x(d, i))).range([0, innerW]).padding(0.25),
    [data, x, innerW]
  );

  const yScale = useMemo(() => {
    const barVals = data.map((d, i) => bar(d, i));
    const lineVals = data.map((d, i) => line(d, i));
    const all = [...barVals, ...lineVals];
    return scaleLinear()
      .domain([Math.min(...all, 0), Math.max(...all)])
      .nice()
      .range([innerH, 0]);
  }, [data, bar, line, innerH]);

  const lineXScale = useMemo(() => {
    const firstD = data[0];
    const lastD = data[data.length - 1];
    const first = firstD ? (xScale(x(firstD, 0)) ?? 0) + xScale.bandwidth() / 2 : 0;
    const last =
      data.length > 1 && lastD
        ? (xScale(x(lastD, data.length - 1)) ?? 0) + xScale.bandwidth() / 2
        : first;
    return scaleLinear().domain([0, Math.max(0, data.length - 1)]).range([first, last]);
  }, [data, x, xScale]);

  const bottomTicks = useMemo(
    () => data.map((d, i) => ({ value: x(d, i), x: (xScale(x(d, i)) ?? 0) + xScale.bandwidth() / 2, y: innerH })),
    [data, x, xScale, innerH]
  );
  const leftTicks = useMemo(() => yScale.ticks(5).map((v) => ({ value: String(v), x: 0, y: yScale(v) })), [yScale]);
  const xTicks = xScale.domain().map((m) => (xScale(m) ?? 0) + xScale.bandwidth() / 2);
  const yTicks = yScale.ticks(5).map((v) => yScale(v));

  const defaultBarTooltip: (d: T, i: number) => TooltipContent =
    barTooltip ??
    ((d, i) => ({
      title: x(d, i),
      rows: [{ label: barLabel, value: String(bar(d, i)), color: barFill }]
    }));

  const defaultLineTooltip: (d: T, i: number) => TooltipContent =
    lineTooltip ??
    ((d, i) => ({
      title: x(d, i),
      rows: [{ label: lineLabel, value: String(line(d, i)), color: lineStroke }]
    }));

  return (
    <Chart width={width} height={height} margin={chartMargin}>
      <Grid xTicks={xTicks} yTicks={yTicks} />
      <AxisLeft ticks={leftTicks} />
      <AxisBottom ticks={bottomTicks} />
      <BarSeries
        data={data}
        x={x}
        y={bar}
        xScale={xScale}
        yScale={yScale}
        fill={barFill}
        animate={animate}
        tooltip={defaultBarTooltip}
      />
      <LineSeries
        data={data}
        x={(_, i) => i}
        y={line}
        xScale={lineXScale}
        yScale={yScale}
        stroke={lineStroke}
        showMarkers={showMarkers}
        animate={animate}
        tooltip={defaultLineTooltip}
      />
    </Chart>
  );
}
