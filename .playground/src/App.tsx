import React, { useMemo } from "react";
import { scaleLinear, scaleBand } from "d3-scale";
import {
  ThemeProvider,
  useTheme,
  Chart,
  Grid,
  AxisBottom,
  AxisLeft,
  LineSeries,
  AreaSeries,
  BarSeries,
  HorizontalBarSeries,
  GroupedBarSeries,
  StackedBarSeries,
  PieChart,
  ComboChart,
  PolarAreaChart,
  RadarChart,
  ScatterSeries,
  BubbleSeries,
  HeatmapSeries,
  LinearGradient,
  RadialGradient,
  MultiaxisLineChart
} from "react-modern-charts";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const lineData = DAYS.map((day, i) => ({
  day,
  d1: 20 + Math.sin(i * 0.8) * 30 + Math.random() * 20,
  d2: 15 + Math.cos(i * 0.6) * 25 + Math.random() * 15
}));

const barData = DAYS.map((day, i) => ({
  day,
  value: 30 + Math.sin(i) * 25 + Math.random() * 15
}));

const groupedBarData = DAYS.map((day, i) => ({
  day,
  d1: 30 + Math.sin(i) * 25 + (i === 2 ? -40 : 0),
  d2: 20 + Math.cos(i * 1.2) * 20 + (i === 6 ? -25 : 0)
}));

const stackedSegmentsGradient = [
  { value: 25, fill: "url(#stackGrad1)", label: "A", tooltip: { title: "Segment A", rows: [{ label: "Value", value: "25", color: "var(--msc-s1)" }] } },
  { value: 35, fill: "url(#stackGrad2)", label: "B", tooltip: { title: "Segment B", rows: [{ label: "Value", value: "35", color: "var(--msc-s2)" }] } },
  { value: 20, fill: "url(#stackGrad3)", label: "C", tooltip: { title: "Segment C", rows: [{ label: "Value", value: "20", color: "var(--msc-s3)" }] } },
  { value: 15, fill: "url(#stackGrad4)", label: "D", tooltip: { title: "Segment D", rows: [{ label: "Value", value: "15", color: "var(--msc-s4)" }] } },
  { value: 5, fill: "url(#stackGrad5)", label: "E", tooltip: { title: "Segment E", rows: [{ label: "Value", value: "5", color: "var(--msc-s5)" }] } }
];
const stackedSegmentsSolid = [
  { value: 25, fill: "var(--msc-s1)", label: "A", tooltip: { title: "Segment A", rows: [{ label: "Value", value: "25", color: "var(--msc-s1)" }] } },
  { value: 35, fill: "var(--msc-s2)", label: "B", tooltip: { title: "Segment B", rows: [{ label: "Value", value: "35", color: "var(--msc-s2)" }] } },
  { value: 20, fill: "var(--msc-s3)", label: "C", tooltip: { title: "Segment C", rows: [{ label: "Value", value: "20", color: "var(--msc-s3)" }] } },
  { value: 15, fill: "var(--msc-s4)", label: "D", tooltip: { title: "Segment D", rows: [{ label: "Value", value: "15", color: "var(--msc-s4)" }] } },
  { value: 5, fill: "var(--msc-s5)", label: "E", tooltip: { title: "Segment E", rows: [{ label: "Value", value: "5", color: "var(--msc-s5)" }] } }
];

const pieData = DAYS.slice(0, 7).map((day, i) => ({
  label: day,
  value: [48, 50, 44, 90, 26, 84, 20][i]
}));

const radarData = [
  { label: "A", value: 80 },
  { label: "B", value: 60 },
  { label: "C", value: 90 },
  { label: "D", value: 45 },
  { label: "E", value: 70 }
];

const scatterData = DAYS.map((_, i) => ({
  x: 10 + i * 12 + Math.random() * 8,
  y: 20 + Math.sin(i) * 25 + Math.random() * 15
}));

const bubbleData = DAYS.map((_, i) => ({
  x: 15 + i * 14,
  y: 25 + Math.cos(i * 0.8) * 20,
  size: 5 + Math.random() * 15
}));

const heatmapRows = ["Mon", "Wed", "Fri"];
const heatmapCols = ["SEP", "OCT", "NOV", "DEC"];
const heatmapData: { value: number; label?: string }[][] = [
  [2, 1, 3, 0],
  [1, 2, 1, 3],
  [0, 3, 2, 1]
].map((row) => row.map((v) => ({ value: v })));

const chartMargin = { top: 24, right: 16, bottom: 28, left: 46 };
const chartSize = { width: 320, height: 200 };

function VerticalBarChart() {
  const { isGradientEnabled } = useTheme();
  const { width, height } = chartSize;
  const margin = chartMargin;
  const innerW = width - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;

  const x = useMemo(() => scaleBand<string>().domain(barData.map((d) => d.day)).range([0, innerW]).padding(0.25), [innerW]);
  const y = useMemo(() => scaleLinear().domain([0, Math.max(...barData.map((d) => d.value))]).nice().range([innerH, 0]), [innerH]);

  const bottomTicks = useMemo(() => barData.map((d) => ({ value: d.day, x: (x(d.day) ?? 0) + x.bandwidth() / 2, y: innerH })), [x, innerH]);
  const leftTicks = useMemo(() => y.ticks(5).map((v) => ({ value: String(v), x: 0, y: y(v) })), [y]);
  const xTicks = x.domain().map((m) => (x(m) ?? 0) + x.bandwidth() / 2);
  const yTicks = y.ticks(5).map((v) => y(v));

  return (
    <Chart width={width} height={height} margin={margin}>
      {isGradientEnabled && <LinearGradient id="vertBarGrad" y1="100%" y2="0%" stops={[{ offset: "0%", color: "var(--msc-s1)", opacity: 0.5 }, { offset: "100%", color: "var(--msc-s1)" }]} />}
      <Grid xTicks={xTicks} yTicks={yTicks} />
      <AxisLeft ticks={leftTicks} />
      <AxisBottom ticks={bottomTicks} />
      <BarSeries
        data={barData}
        x={(d) => d.day}
        y={(d) => d.value}
        xScale={x}
        yScale={y}
        fill={isGradientEnabled ? "url(#vertBarGrad)" : "var(--msc-s1)"}
        tooltip={(d) => ({ title: d.day, rows: [{ label: "Value", value: String(d.value), color: "var(--msc-s1)" }] })}
      />
    </Chart>
  );
}

function HorizontalBarChart() {
  const { isGradientEnabled } = useTheme();
  const { width, height } = chartSize;
  const margin = chartMargin;
  const innerW = width - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;

  const y = useMemo(() => scaleBand<string>().domain(barData.map((d) => d.day)).range([0, innerH]).padding(0.25), [innerH]);
  const x = useMemo(() => scaleLinear().domain([0, Math.max(...barData.map((d) => d.value))]).nice().range([0, innerW]), [innerW]);

  const leftTicks = useMemo(() => barData.map((d) => ({ value: d.day, x: 0, y: (y(d.day) ?? 0) + y.bandwidth() / 2 })), [y]);
  const bottomTicks = useMemo(() => x.ticks(5).map((v) => ({ value: String(v), x: x(v), y: innerH })), [x, innerH]);
  const yTicks = y.domain().map((m) => (y(m) ?? 0) + y.bandwidth() / 2);
  const xTicks = x.ticks(5).map((v) => x(v));

  return (
    <Chart width={width} height={height} margin={margin}>
      {isGradientEnabled && <LinearGradient id="horizBarGrad" x1="0%" x2="100%" stops={[{ offset: "0%", color: "var(--msc-s1)" }, { offset: "100%", color: "var(--msc-s1)", opacity: 0.5 }]} />}
      <Grid xTicks={xTicks} yTicks={yTicks} />
      <AxisLeft ticks={leftTicks} />
      <AxisBottom ticks={bottomTicks} />
      <HorizontalBarSeries
        data={barData}
        y={(d) => d.day}
        x={(d) => d.value}
        yScale={y}
        xScale={x}
        fill={isGradientEnabled ? "url(#horizBarGrad)" : "var(--msc-s1)"}
        tooltip={(d) => ({ title: d.day, rows: [{ label: "Value", value: String(d.value), color: "var(--msc-s1)" }] })}
      />
    </Chart>
  );
}

function GroupedBarChart() {
  const { isGradientEnabled } = useTheme();
  const { width, height } = chartSize;
  const margin = chartMargin;
  const innerW = width - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;

  const x = useMemo(() => scaleBand<string>().domain(groupedBarData.map((d) => d.day)).range([0, innerW]).padding(0.25), [innerW]);
  const y = useMemo(() => {
    const vals = groupedBarData.flatMap((d) => [d.d1, d.d2]);
    return scaleLinear().domain([Math.min(...vals, 0), Math.max(...vals)]).nice().range([innerH, 0]);
  }, [innerH]);

  const bottomTicks = useMemo(() => groupedBarData.map((d) => ({ value: d.day, x: (x(d.day) ?? 0) + x.bandwidth() / 2, y: innerH })), [x, innerH]);
  const leftTicks = useMemo(() => y.ticks(5).map((v) => ({ value: String(v), x: 0, y: y(v) })), [y]);
  const xTicks = x.domain().map((m) => (x(m) ?? 0) + x.bandwidth() / 2);
  const yTicks = y.ticks(5).map((v) => y(v));

  return (
    <Chart width={width} height={height} margin={margin}>
      {isGradientEnabled && (
        <>
          <LinearGradient id="groupBarGrad1" y1="100%" y2="0%" stops={[{ offset: "0%", color: "var(--msc-s1)", opacity: 0.5 }, { offset: "100%", color: "var(--msc-s1)" }]} />
          <LinearGradient id="groupBarGrad2" y1="100%" y2="0%" stops={[{ offset: "0%", color: "var(--msc-s2)", opacity: 0.5 }, { offset: "100%", color: "var(--msc-s2)" }]} />
        </>
      )}
      <Grid xTicks={xTicks} yTicks={yTicks} />
      <AxisLeft ticks={leftTicks} />
      <AxisBottom ticks={bottomTicks} />
      <GroupedBarSeries
        data={groupedBarData}
        x={(d) => d.day}
        xScale={x}
        yScale={y}
        groups={[
          { y: (d) => d.d1, fill: isGradientEnabled ? "url(#groupBarGrad1)" : "var(--msc-s1)", tooltip: (d) => ({ title: d.day, rows: [{ label: "D1", value: String(d.d1), color: "var(--msc-s1)" }] }) },
          { y: (d) => d.d2, fill: isGradientEnabled ? "url(#groupBarGrad2)" : "var(--msc-s2)", tooltip: (d) => ({ title: d.day, rows: [{ label: "D2", value: String(d.d2), color: "var(--msc-s2)" }] }) }
        ]}
      />
    </Chart>
  );
}

function AreaChart() {
  const { isGradientEnabled } = useTheme();
  const { width, height } = chartSize;
  const margin = chartMargin;
  const innerW = width - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;

  const x = useMemo(() => scaleLinear().domain([0, lineData.length - 1]).range([0, innerW]), [innerW]);
  const y = useMemo(() => scaleLinear().domain([0, Math.max(...lineData.map((d) => d.d1))]).nice().range([innerH, 0]), [innerH]);
  const bottomTicks = useMemo(() => lineData.map((d, i) => ({ value: d.day, x: x(i), y: innerH })), [x, innerH]);
  const leftTicks = useMemo(() => y.ticks(5).map((v) => ({ value: String(v), x: 0, y: y(v) })), [y]);
  const xTicks = lineData.map((_, i) => x(i));
  const yTicks = y.ticks(5).map((v) => y(v));

  return (
    <Chart width={width} height={height} margin={margin}>
      {isGradientEnabled && <LinearGradient id="areaGrad" y2="100%" stops={[{ offset: "0%", color: "var(--msc-s1)", opacity: 0.15 }, { offset: "100%", color: "var(--msc-s1)", opacity: 0.6 }]} />}
      <Grid xTicks={xTicks} yTicks={yTicks} />
      <AxisLeft ticks={leftTicks} />
      <AxisBottom ticks={bottomTicks} />
      <AreaSeries data={lineData} x={(_, i) => i} y={(d) => d.d1} y0={0} xScale={x} yScale={y} fill={isGradientEnabled ? "url(#areaGrad)" : "var(--msc-s1)"} fillOpacity={isGradientEnabled ? 1 : 0.4} />
    </Chart>
  );
}

function LineChart() {
  const { width, height } = chartSize;
  const margin = chartMargin;
  const innerW = width - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;

  const x = useMemo(() => scaleLinear().domain([0, lineData.length - 1]).range([0, innerW]), [innerW]);
  const y = useMemo(() => scaleLinear().domain([0, Math.max(...lineData.map((d) => d.d1))]).nice().range([innerH, 0]), [innerH]);
  const bottomTicks = useMemo(() => lineData.map((d, i) => ({ value: d.day, x: x(i), y: innerH })), [x, innerH]);
  const leftTicks = useMemo(() => y.ticks(5).map((v) => ({ value: String(v), x: 0, y: y(v) })), [y]);
  const xTicks = lineData.map((_, i) => x(i));
  const yTicks = y.ticks(5).map((v) => y(v));

  return (
    <Chart width={width} height={height} margin={margin}>
      <Grid xTicks={xTicks} yTicks={yTicks} />
      <AxisLeft ticks={leftTicks} />
      <AxisBottom ticks={bottomTicks} />
      <LineSeries data={lineData} x={(_, i) => i} y={(d) => d.d1} xScale={x} yScale={y} stroke="var(--msc-s1)" showMarkers tooltip={(d) => ({ title: d.day, rows: [{ label: "Value", value: String(d.d1), color: "var(--msc-s1)" }] })} />
    </Chart>
  );
}

function GradientChart() {
  const { isGradientEnabled } = useTheme();
  const { width, height } = chartSize;
  const margin = chartMargin;
  const innerW = width - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;

  const x = useMemo(() => scaleLinear().domain([0, lineData.length - 1]).range([0, innerW]), [innerW]);
  const y = useMemo(() => scaleLinear().domain([0, Math.max(...lineData.map((d) => d.d1))]).nice().range([innerH, 0]), [innerH]);
  const bottomTicks = useMemo(() => lineData.map((d, i) => ({ value: d.day, x: x(i), y: innerH })), [x, innerH]);
  const leftTicks = useMemo(() => y.ticks(5).map((v) => ({ value: String(v), x: 0, y: y(v) })), [y]);
  const xTicks = lineData.map((_, i) => x(i));
  const yTicks = y.ticks(5).map((v) => y(v));

  return (
    <Chart width={width} height={height} margin={margin}>
      {isGradientEnabled && <LinearGradient id="gradAreaGrad" y2="100%" stops={[{ offset: "0%", color: "var(--msc-s1)", opacity: 0.15 }, { offset: "100%", color: "var(--msc-s1)", opacity: 0.6 }]} />}
      <Grid xTicks={xTicks} yTicks={yTicks} />
      <AxisLeft ticks={leftTicks} />
      <AxisBottom ticks={bottomTicks} />
      <AreaSeries data={lineData} x={(_, i) => i} y={(d) => d.d1} y0={0} xScale={x} yScale={y} fill={isGradientEnabled ? "url(#gradAreaGrad)" : "var(--msc-s1)"} fillOpacity={isGradientEnabled ? 1 : 0.4} />
      <LineSeries data={lineData} x={(_, i) => i} y={(d) => d.d1} xScale={x} yScale={y} stroke="var(--msc-s1)" showMarkers />
    </Chart>
  );
}

function HeatmapChart() {
  const width = 320;
  const height = 140;
  const margin = { top: 8, right: 16, bottom: 36, left: 44 };

  return (
    <div>
      <Chart width={width} height={height} margin={margin}>
        <HeatmapSeries
          rows={heatmapRows}
          columns={heatmapCols}
          data={heatmapData}
          gradientStops={[
            { offset: 0, color: "#78ae81" },
            { offset: 0.5, color: "#64b66f" },
            { offset: 1, color: "#118133" }
          ]}
          tooltip={(row, col, cell) => ({ title: `${row} - ${col}`, rows: [{ label: "Value", value: String(cell.value), color: "var(--msc-s1)" }] })}
        />
      </Chart>
      <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 8, fontSize: 11, color: "var(--msc-muted)" }}>
        <span>Less</span>
        <span style={{ display: "flex", gap: 4 }}>
          {["#78ae81", "#64b66f", "#118133", "#343738", "#5e656e"].map((c, i) => (
            <span key={i} style={{ width: 12, height: 12, background: c, borderRadius: 2 }} />
          ))}
        </span>
        <span>More</span>
      </div>
    </div>
  );
}

const CHART_CARDS = [
  { title: "Vertical Bar", Chart: VerticalBarChart },
  { title: "Horizontal Bar", Chart: HorizontalBarChart },
  { title: "Stacked Bar", Chart: () => {
    const { isGradientEnabled } = useTheme();
    return (
      <Chart width={chartSize.width} height={80} margin={{ top: 16, right: 16, bottom: 16, left: 16 }}>
        {isGradientEnabled && (
          <>
            <LinearGradient id="stackGrad1" x1="0%" x2="100%" stops={[{ offset: "0%", color: "var(--msc-s1)" }, { offset: "100%", color: "var(--msc-s1)", opacity: 0.5 }]} />
            <LinearGradient id="stackGrad2" x1="0%" x2="100%" stops={[{ offset: "0%", color: "var(--msc-s2)" }, { offset: "100%", color: "var(--msc-s2)", opacity: 0.5 }]} />
            <LinearGradient id="stackGrad3" x1="0%" x2="100%" stops={[{ offset: "0%", color: "var(--msc-s3)" }, { offset: "100%", color: "var(--msc-s3)", opacity: 0.5 }]} />
            <LinearGradient id="stackGrad4" x1="0%" x2="100%" stops={[{ offset: "0%", color: "var(--msc-s4)" }, { offset: "100%", color: "var(--msc-s4)", opacity: 0.5 }]} />
            <LinearGradient id="stackGrad5" x1="0%" x2="100%" stops={[{ offset: "0%", color: "var(--msc-s5)" }, { offset: "100%", color: "var(--msc-s5)", opacity: 0.5 }]} />
          </>
        )}
        <StackedBarSeries segments={isGradientEnabled ? stackedSegmentsGradient : stackedSegmentsSolid} orientation="horizontal" radius={4} />
      </Chart>
    );
  }},
  { title: "Grouped Bar", Chart: GroupedBarChart },
  { title: "Area", Chart: AreaChart },
  { title: "Line", Chart: LineChart },
  { title: "Multiaxis Line", Chart: () => (
    <MultiaxisLineChart
      data={lineData}
      x={(d) => d.day}
      leftLine={(d) => d.d1}
      rightLine={(d) => d.d2}
      leftLabel="D1"
      rightLabel="D2"
      width={320}
      height={200}
      margin={{ top: 24, right: 48, bottom: 28, left: 46 }}
    />
  )},
  { title: "Pie", Chart: () => {
    const { isGradientEnabled } = useTheme();
    return (
      <PieChart
        data={pieData}
        value={(d) => d.value}
        label={(d) => d.label}
        showLegend
        showValues
        defs={isGradientEnabled ? (
          <>
            <RadialGradient id="pieGrad1" stops={[{ offset: "0%", color: "var(--msc-s1)", opacity: 0.6 }, { offset: "100%", color: "var(--msc-s1)" }]} />
            <RadialGradient id="pieGrad2" stops={[{ offset: "0%", color: "var(--msc-s2)", opacity: 0.6 }, { offset: "100%", color: "var(--msc-s2)" }]} />
            <RadialGradient id="pieGrad3" stops={[{ offset: "0%", color: "var(--msc-s3)", opacity: 0.6 }, { offset: "100%", color: "var(--msc-s3)" }]} />
            <RadialGradient id="pieGrad4" stops={[{ offset: "0%", color: "var(--msc-s4)", opacity: 0.6 }, { offset: "100%", color: "var(--msc-s4)" }]} />
            <RadialGradient id="pieGrad5" stops={[{ offset: "0%", color: "var(--msc-s5)", opacity: 0.6 }, { offset: "100%", color: "var(--msc-s5)" }]} />
            <RadialGradient id="pieGrad6" stops={[{ offset: "0%", color: "var(--msc-s1)", opacity: 0.6 }, { offset: "100%", color: "var(--msc-s1)" }]} />
            <RadialGradient id="pieGrad7" stops={[{ offset: "0%", color: "var(--msc-s2)", opacity: 0.6 }, { offset: "100%", color: "var(--msc-s2)" }]} />
          </>
        ) : undefined}
        colors={isGradientEnabled ? ["url(#pieGrad1)", "url(#pieGrad2)", "url(#pieGrad3)", "url(#pieGrad4)", "url(#pieGrad5)", "url(#pieGrad6)", "url(#pieGrad7)"] : undefined}
      />
    );
  }},
  { title: "Doughnut", Chart: () => {
    const { isGradientEnabled } = useTheme();
    return (
      <PieChart
        data={pieData}
        value={(d) => d.value}
        label={(d) => d.label}
        innerRadius={40}
        showLegend
        showValues
        defs={isGradientEnabled ? (
          <>
            <RadialGradient id="donutGrad1" stops={[{ offset: "0%", color: "var(--msc-s1)", opacity: 0.6 }, { offset: "100%", color: "var(--msc-s1)" }]} />
            <RadialGradient id="donutGrad2" stops={[{ offset: "0%", color: "var(--msc-s2)", opacity: 0.6 }, { offset: "100%", color: "var(--msc-s2)" }]} />
            <RadialGradient id="donutGrad3" stops={[{ offset: "0%", color: "var(--msc-s3)", opacity: 0.6 }, { offset: "100%", color: "var(--msc-s3)" }]} />
            <RadialGradient id="donutGrad4" stops={[{ offset: "0%", color: "var(--msc-s4)", opacity: 0.6 }, { offset: "100%", color: "var(--msc-s4)" }]} />
            <RadialGradient id="donutGrad5" stops={[{ offset: "0%", color: "var(--msc-s5)", opacity: 0.6 }, { offset: "100%", color: "var(--msc-s5)" }]} />
            <RadialGradient id="donutGrad6" stops={[{ offset: "0%", color: "var(--msc-s1)", opacity: 0.6 }, { offset: "100%", color: "var(--msc-s1)" }]} />
            <RadialGradient id="donutGrad7" stops={[{ offset: "0%", color: "var(--msc-s2)", opacity: 0.6 }, { offset: "100%", color: "var(--msc-s2)" }]} />
          </>
        ) : undefined}
        colors={isGradientEnabled ? ["url(#donutGrad1)", "url(#donutGrad2)", "url(#donutGrad3)", "url(#donutGrad4)", "url(#donutGrad5)", "url(#donutGrad6)", "url(#donutGrad7)"] : undefined}
      />
    );
  }},
  { title: "Polar Area", Chart: () => {
    const { isGradientEnabled } = useTheme();
    return (
      <PolarAreaChart
        data={radarData}
        value={(d) => d.value}
        label={(d) => d.label}
        showLegend
        defs={isGradientEnabled ? (
          <>
            <RadialGradient id="polarGrad1" stops={[{ offset: "0%", color: "var(--msc-s1)", opacity: 0.6 }, { offset: "100%", color: "var(--msc-s1)" }]} />
            <RadialGradient id="polarGrad2" stops={[{ offset: "0%", color: "var(--msc-s2)", opacity: 0.6 }, { offset: "100%", color: "var(--msc-s2)" }]} />
            <RadialGradient id="polarGrad3" stops={[{ offset: "0%", color: "var(--msc-s3)", opacity: 0.6 }, { offset: "100%", color: "var(--msc-s3)" }]} />
            <RadialGradient id="polarGrad4" stops={[{ offset: "0%", color: "var(--msc-s4)", opacity: 0.6 }, { offset: "100%", color: "var(--msc-s4)" }]} />
            <RadialGradient id="polarGrad5" stops={[{ offset: "0%", color: "var(--msc-s5)", opacity: 0.6 }, { offset: "100%", color: "var(--msc-s5)" }]} />
          </>
        ) : undefined}
        colors={isGradientEnabled ? ["url(#polarGrad1)", "url(#polarGrad2)", "url(#polarGrad3)", "url(#polarGrad4)", "url(#polarGrad5)"] : undefined}
      />
    );
  }},
  { title: "Radar", Chart: () => {
    const { isGradientEnabled } = useTheme();
    return (
      <RadarChart
        data={radarData}
        value={(d) => d.value}
        label={(d) => d.label}
        defs={isGradientEnabled ? <LinearGradient id="radarGrad" y2="100%" stops={[{ offset: "0%", color: "var(--msc-s1)", opacity: 0.5 }, { offset: "100%", color: "var(--msc-s1)", opacity: 0.1 }]} /> : undefined}
        fill={isGradientEnabled ? "url(#radarGrad)" : "var(--msc-s1)"}
        stroke={isGradientEnabled ? "url(#radarGrad)" : "var(--msc-s1)"}
      />
    );
  }},
  { title: "Scatter", Chart: () => {
    const { isGradientEnabled } = useTheme();
    const innerW = chartSize.width - chartMargin.left - chartMargin.right;
    const innerH = chartSize.height - chartMargin.top - chartMargin.bottom;
    const x = scaleLinear().domain([0, Math.max(...scatterData.map((d) => d.x))]).nice().range([0, innerW]);
    const y = scaleLinear().domain([0, Math.max(...scatterData.map((d) => d.y))]).nice().range([innerH, 0]);
    const bottomTicks = x.ticks(5).map((v) => ({ value: String(v), x: x(v), y: innerH }));
    const leftTicks = y.ticks(5).map((v) => ({ value: String(v), x: 0, y: y(v) }));
    return (
      <Chart width={chartSize.width} height={chartSize.height} margin={chartMargin}>
        {isGradientEnabled && <RadialGradient id="scatterGrad" stops={[{ offset: "0%", color: "var(--msc-s1)", opacity: 0.7 }, { offset: "100%", color: "var(--msc-s1)" }]} />}
        <Grid xTicks={x.ticks(5).map((v) => x(v))} yTicks={y.ticks(5).map((v) => y(v))} />
        <AxisLeft ticks={leftTicks} />
        <AxisBottom ticks={bottomTicks} />
        <ScatterSeries data={scatterData} x={(d) => d.x} y={(d) => d.y} xScale={x} yScale={y} fill={isGradientEnabled ? "url(#scatterGrad)" : "var(--msc-s1)"} tooltip={(d) => ({ title: `(${d.x.toFixed(0)}, ${d.y.toFixed(0)})`, rows: [{ label: "Y", value: String(d.y), color: "var(--msc-s1)" }] })} />
      </Chart>
    );
  }},
  { title: "Bubble", Chart: () => {
    const { isGradientEnabled } = useTheme();
    const innerW = chartSize.width - chartMargin.left - chartMargin.right;
    const innerH = chartSize.height - chartMargin.top - chartMargin.bottom;
    const x = scaleLinear().domain([0, Math.max(...bubbleData.map((d) => d.x))]).nice().range([0, innerW]);
    const y = scaleLinear().domain([0, Math.max(...bubbleData.map((d) => d.y))]).nice().range([innerH, 0]);
    const bottomTicks = x.ticks(5).map((v) => ({ value: String(v), x: x(v), y: innerH }));
    const leftTicks = y.ticks(5).map((v) => ({ value: String(v), x: 0, y: y(v) }));
    return (
      <Chart width={chartSize.width} height={chartSize.height} margin={chartMargin}>
        {isGradientEnabled && <RadialGradient id="bubbleGrad" stops={[{ offset: "0%", color: "var(--msc-s1)", opacity: 0.6 }, { offset: "100%", color: "var(--msc-s1)" }]} />}
        <Grid xTicks={x.ticks(5).map((v) => x(v))} yTicks={y.ticks(5).map((v) => y(v))} />
        <AxisLeft ticks={leftTicks} />
        <AxisBottom ticks={bottomTicks} />
        <BubbleSeries data={bubbleData} x={(d) => d.x} y={(d) => d.y} size={(d) => d.size} xScale={x} yScale={y} fill={isGradientEnabled ? "url(#bubbleGrad)" : "var(--msc-s1)"} tooltip={(d) => ({ title: `Size: ${d.size.toFixed(0)}`, rows: [{ label: "Value", value: String(d.size), color: "var(--msc-s1)" }] })} />
      </Chart>
    );
  }},
  { title: "Multitype (Combo)", Chart: () => {
    const { isGradientEnabled } = useTheme();
    return (
      <ComboChart
        data={groupedBarData}
        x={(d) => d.day}
        bar={(d) => d.d1}
        line={(d) => d.d2}
        barLabel="Bar"
        lineLabel="Line"
        defs={isGradientEnabled ? <LinearGradient id="comboBarGrad" y1="100%" y2="0%" stops={[{ offset: "0%", color: "var(--msc-s1)", opacity: 0.5 }, { offset: "100%", color: "var(--msc-s1)" }]} /> : undefined}
        barFill={isGradientEnabled ? "url(#comboBarGrad)" : "var(--msc-s1)"}
      />
    );
  }},
  { title: "Gradient", Chart: GradientChart },
  { title: "Heatmap", Chart: HeatmapChart }
];

export default function App() {
  const [palette, setPalette] = React.useState<"default" | "sage" | "periwinkle" | "indigo" | "ocean" | "forest">("default");

  return (
    <ThemeProvider mode="light" palette={palette} isGradientEnabled={false}>
      <div className="wrap">
        <div style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          <h1 style={{ margin: 0, fontSize: 18 }}>Chart Gallery</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12, color: "var(--msc-muted)" }}>Palette:</span>
            <button
              onClick={() => setPalette("default")}
              style={{
                padding: "6px 12px",
                fontSize: 12,
                borderRadius: 8,
                border: `1px solid ${palette === "default" ? "#118133" : "var(--msc-border)"}`,
                background: palette === "default" ? "#118133" : "transparent",
                color: palette === "default" ? "white" : "var(--msc-text)",
                cursor: "pointer"
              }}
            >
              Default
            </button>
            <button
              onClick={() => setPalette("sage")}
              style={{
                padding: "6px 12px",
                fontSize: 12,
                borderRadius: 8,
                border: `1px solid ${palette === "sage" ? "#3b5249" : "var(--msc-border)"}`,
                background: palette === "sage" ? "#3b5249" : "transparent",
                color: palette === "sage" ? "white" : "var(--msc-text)",
                cursor: "pointer"
              }}
            >
              Sage
            </button>
            <button
              onClick={() => setPalette("periwinkle")}
              style={{
                padding: "6px 12px",
                fontSize: 12,
                borderRadius: 8,
                border: `1px solid ${palette === "periwinkle" ? "#9792e3" : "var(--msc-border)"}`,
                background: palette === "periwinkle" ? "#9792e3" : "transparent",
                color: palette === "periwinkle" ? "white" : "var(--msc-text)",
                cursor: "pointer"
              }}
            >
              Periwinkle
            </button>
            <button
              onClick={() => setPalette("indigo")}
              style={{
                padding: "6px 12px",
                fontSize: 12,
                borderRadius: 8,
                border: `1px solid ${palette === "indigo" ? "#273469" : "var(--msc-border)"}`,
                background: palette === "indigo" ? "#273469" : "transparent",
                color: palette === "indigo" ? "white" : "var(--msc-text)",
                cursor: "pointer"
              }}
            >
              Indigo
            </button>
            <button
              onClick={() => setPalette("ocean")}
              style={{
                padding: "6px 12px",
                fontSize: 12,
                borderRadius: 8,
                border: `1px solid ${palette === "ocean" ? "#004346" : "var(--msc-border)"}`,
                background: palette === "ocean" ? "#004346" : "transparent",
                color: palette === "ocean" ? "white" : "var(--msc-text)",
                cursor: "pointer"
              }}
            >
              Ocean
            </button>
            <button
              onClick={() => setPalette("forest")}
              style={{
                padding: "6px 12px",
                fontSize: 12,
                borderRadius: 8,
                border: `1px solid ${palette === "forest" ? "#118133" : "var(--msc-border)"}`,
                background: palette === "forest" ? "#118133" : "transparent",
                color: palette === "forest" ? "white" : "var(--msc-text)",
                cursor: "pointer"
              }}
            >
              Forest
            </button>
          </div>
        </div>
        {CHART_CARDS.map(({ title, Chart }) => (
          <div key={title} className="card">
            <h2>{title}</h2>
            <Chart />
          </div>
        ))}
      </div>
    </ThemeProvider>
  );
}
