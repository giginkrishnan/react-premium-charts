import React, { useMemo } from "react";
import { scaleLinear, scaleBand } from "d3-scale";
import { Chart } from "../primitives/Chart";
import { Grid } from "../primitives/Grid";
import { AxisBottom, AxisLeft, AxisRight } from "../primitives/Axis";
import { LineSeries } from "../series/LineSeries";
import type { Datum, Accessor } from "../types";
import type { TooltipContent } from "../series/BarSeries";

export function MultiaxisLineChart<T extends Datum>({
  data,
  x,
  leftLine,
  rightLine,
  leftLabel = "Left",
  rightLabel = "Right",
  leftStroke = "var(--msc-s1)",
  rightStroke = "var(--msc-s2)",
  width = 400,
  height = 240,
  margin = { top: 24, right: 48, bottom: 28, left: 48 },
  showMarkers = true,
  defs,
  leftTooltip,
  rightTooltip
}: {
  data: T[];
  x: Accessor<T, string | number>;
  leftLine: Accessor<T, number>;
  rightLine: Accessor<T, number>;
  leftLabel?: string;
  rightLabel?: string;
  leftStroke?: string;
  rightStroke?: string;
  width?: number;
  height?: number;
  margin?: { top?: number; right?: number; bottom?: number; left?: number };
  showMarkers?: boolean;
  defs?: React.ReactNode;
  leftTooltip?: (d: T, i: number) => TooltipContent;
  rightTooltip?: (d: T, i: number) => TooltipContent;
}) {
  const chartMargin = {
    top: margin.top ?? 24,
    right: margin.right ?? 48,
    bottom: margin.bottom ?? 28,
    left: margin.left ?? 48
  };

  const innerW = width - (chartMargin.left ?? 0) - (chartMargin.right ?? 0);
  const innerH = height - (chartMargin.top ?? 0) - (chartMargin.bottom ?? 0);

  const leftVals = data.map((d, i) => leftLine(d, i));
  const rightVals = data.map((d, i) => rightLine(d, i));

  const leftYScale = useMemo(
    () =>
      scaleLinear()
        .domain([Math.min(...leftVals, 0), Math.max(...leftVals)])
        .nice()
        .range([innerH, 0]),
    [leftVals, innerH]
  );

  const rightYScale = useMemo(
    () =>
      scaleLinear()
        .domain([Math.min(...rightVals, 0), Math.max(...rightVals)])
        .nice()
        .range([innerH, 0]),
    [rightVals, innerH]
  );

  const xScale = useMemo(() => {
    const labels = data.map((d, i) => String(x(d, i)));
    return scaleBand<string>().domain(labels).range([0, innerW]).padding(0.25);
  }, [data, x, innerW]);

  const lineXScale = useMemo(() => {
    const domain = xScale.domain();
    const firstLabel = domain[0] ?? "";
    const lastLabel = domain[domain.length - 1] ?? firstLabel;
    const first = (xScale(firstLabel) ?? 0) + xScale.bandwidth() / 2;
    const last = (xScale(lastLabel) ?? first) + xScale.bandwidth() / 2;
    return scaleLinear().domain([0, data.length - 1]).range([first, last]);
  }, [xScale, data.length]);

  const bottomTicks = useMemo(
    () =>
      data.map((d, i) => ({
        value: String(x(d, i)),
        x: (xScale(String(x(d, i))) ?? 0) + xScale.bandwidth() / 2,
        y: innerH
      })),
    [data, x, xScale, innerH]
  );

  const leftTicks = useMemo(
    () => leftYScale.ticks(5).map((v) => ({ value: String(v), x: 0, y: leftYScale(v) })),
    [leftYScale]
  );

  const rightTicks = useMemo(
    () =>
      rightYScale.ticks(5).map((v) => ({
        value: String(v),
        x: innerW,
        y: rightYScale(v)
      })),
    [rightYScale, innerW]
  );

  const xTicks = xScale.domain().map((m) => (xScale(m) ?? 0) + xScale.bandwidth() / 2);
  const yTicks = leftYScale.ticks(5).map((v) => leftYScale(v));

  const defaultLeftTooltip: (d: T, i: number) => TooltipContent =
    leftTooltip ??
    ((d, i) => ({
      title: String(x(d, i)),
      rows: [{ label: leftLabel, value: String(leftLine(d, i)), color: leftStroke }]
    }));

  const defaultRightTooltip: (d: T, i: number) => TooltipContent =
    rightTooltip ??
    ((d, i) => ({
      title: String(x(d, i)),
      rows: [{ label: rightLabel, value: String(rightLine(d, i)), color: rightStroke }]
    }));

  return (
    <Chart width={width} height={height} margin={chartMargin}>
      {defs}
      <Grid xTicks={xTicks} yTicks={yTicks} />
      <AxisLeft ticks={leftTicks} />
      <AxisRight ticks={rightTicks} x={innerW} />
      <AxisBottom ticks={bottomTicks} />
      <LineSeries
        data={data}
        x={(_, i) => i}
        y={leftLine}
        xScale={lineXScale}
        yScale={leftYScale}
        stroke={leftStroke}
        showMarkers={showMarkers}
        tooltip={defaultLeftTooltip}
      />
      <LineSeries
        data={data}
        x={(_, i) => i}
        y={rightLine}
        xScale={lineXScale}
        yScale={rightYScale}
        stroke={rightStroke}
        showMarkers={showMarkers}
        tooltip={defaultRightTooltip}
      />
    </Chart>
  );
}
