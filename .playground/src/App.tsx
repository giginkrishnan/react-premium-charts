import React, { useMemo } from "react";
import { scaleLinear, scaleBand } from "d3-scale";
import {
  ThemeProvider,
  Chart,
  Grid,
  AxisBottom,
  AxisLeft,
  LineSeries,
  AreaSeries,
  BarSeries,
  GroupedBarSeries,
  StackedBarSeries,
  PieSeries,
  PieChart,
  ComboChart,
  HeatmapSeries,
  ThresholdLine,
  ChartTitle
} from "react-modern-charts";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const lineData = DAYS.map((day, i) => ({
  day,
  d1: 20 + Math.sin(i * 0.8) * 30 + Math.random() * 20,
  d2: 15 + Math.cos(i * 0.6) * 25 + Math.random() * 15
}));

const groupedBarData = DAYS.map((day, i) => ({
  day,
  d1: 30 + Math.sin(i) * 25 + (i === 2 ? -40 : 0),
  d2: 20 + Math.cos(i * 1.2) * 20 + (i === 6 ? -25 : 0)
}));

const comboData = groupedBarData.map((d) => ({ ...d }));

const pieData = DAYS.slice(0, 7).map((day, i) => ({
  label: day,
  value: [48, 50, 44, 90, 26, 84, 20][i]
}));

const stackedSegments = [
  { value: 25, fill: "var(--msc-s1)", label: "A", tooltip: { title: "Segment A", rows: [{ label: "Value", value: "25", color: "var(--msc-s1)" }] } },
  { value: 35, fill: "var(--msc-s2)", label: "B", tooltip: { title: "Segment B", rows: [{ label: "Value", value: "35", color: "var(--msc-s2)" }] } },
  { value: 20, fill: "#3b82f6", label: "C", tooltip: { title: "Segment C", rows: [{ label: "Value", value: "20", color: "#3b82f6" }] } },
  { value: 15, fill: "#8b5cf6", label: "D", tooltip: { title: "Segment D", rows: [{ label: "Value", value: "15", color: "#8b5cf6" }] } },
  { value: 5, fill: "#f59e0b", label: "E", tooltip: { title: "Segment E", rows: [{ label: "Value", value: "5", color: "#f59e0b" }] } }
];

const heatmapRows = ["Mon", "Wed", "Fri"];
const heatmapCols = ["SEP", "OCT", "NOV", "DEC"];
const heatmapData: { value: number; label?: string }[][] = [
  [2, 1, 3, 0],
  [1, 2, 1, 3],
  [0, 3, 2, 1]
].map((row) => row.map((v) => ({ value: v })));

const chartMargin = { top: 24, right: 16, bottom: 28, left: 46 };
const chartSize = { width: 320, height: 200 };

function LineAreaChart() {
  const { width, height } = chartSize;
  const margin = chartMargin;
  const innerW = width - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;

  const x = useMemo(() => scaleLinear().domain([0, lineData.length - 1]).range([0, innerW]), [innerW]);
  const y = useMemo(() => {
    const max = Math.max(...lineData.flatMap((d) => [d.d1, d.d2]));
    return scaleLinear().domain([0, max]).nice().range([innerH, 0]);
  }, [innerH]);

  const bottomTicks = useMemo(() => lineData.map((d, i) => ({ value: d.day, x: x(i), y: innerH })), [x, innerH]);
  const leftTicks = useMemo(() => y.ticks(5).map((v) => ({ value: String(v), x: 0, y: y(v) })), [y]);
  const xTicks = lineData.map((_, i) => x(i));
  const yTicks = y.ticks(5).map((v) => y(v));

  return (
    <Chart width={width} height={height} margin={margin}>
      <ChartTitle title="Title" />
      <Grid xTicks={xTicks} yTicks={yTicks} />
      <AxisLeft ticks={leftTicks} />
      <AxisBottom ticks={bottomTicks} />
      <AreaSeries data={lineData} x={(_, i) => i} y={(d) => d.d1} y0={0} xScale={x} yScale={y} fill="var(--msc-s1)" fillOpacity={0.25} />
      <AreaSeries data={lineData} x={(_, i) => i} y={(d) => d.d2} y0={0} xScale={x} yScale={y} fill="var(--msc-s2)" fillOpacity={0.2} />
      <LineSeries data={lineData} x={(_, i) => i} y={(d) => d.d1} xScale={x} yScale={y} stroke="var(--msc-s1)" showMarkers tooltip={(d) => ({ title: d.day, rows: [{ label: "Dataset 1", value: String(d.d1), color: "var(--msc-s1)" }] })} />
      <LineSeries data={lineData} x={(_, i) => i} y={(d) => d.d2} xScale={x} yScale={y} stroke="var(--msc-s2)" showMarkers tooltip={(d) => ({ title: d.day, rows: [{ label: "Dataset 2", value: String(d.d2), color: "var(--msc-s2)" }] })} />
    </Chart>
  );
}

function GroupedBarChart() {
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
      <Grid xTicks={xTicks} yTicks={yTicks} />
      <AxisLeft ticks={leftTicks} />
      <AxisBottom ticks={bottomTicks} />
      <GroupedBarSeries
        data={groupedBarData}
        x={(d) => d.day}
        xScale={x}
        yScale={y}
        groups={[
          { y: (d) => d.d1, fill: "var(--msc-s1)", tooltip: (d) => ({ title: d.day, rows: [{ label: "Dataset 1", value: String(d.d1), color: "var(--msc-s1)" }] }) },
          { y: (d) => d.d2, fill: "var(--msc-s2)", tooltip: (d) => ({ title: d.day, rows: [{ label: "Dataset 2", value: String(d.d2), color: "var(--msc-s2)" }] }) }
        ]}
      />
    </Chart>
  );
}

function PieChartWithLegend() {
  const colors = ["#86efac", "#22c55e", "#3b82f6", "#8b5cf6", "#ef4444", "#f59e0b", "#eab308"];

  return (
    <PieChart
      data={pieData}
      value={(d) => d.value}
      label={(d) => d.label}
      colors={colors}
      showLegend
      showValues
    />
  );
}

function HorizontalStackedBarChart() {
  const width = 320;
  const height = 80;
  const margin = { top: 16, right: 16, bottom: 16, left: 16 };

  return (
    <Chart width={width} height={height} margin={margin}>
      <StackedBarSeries segments={stackedSegments} orientation="horizontal" radius={4} />
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
          colorScale={["#dcfce7", "#86efac", "#22c55e", "#15803d"]}
          tooltip={(row, col, cell) => ({ title: `${row} - ${col}`, rows: [{ label: "Value", value: String(cell.value), color: "var(--msc-s1)" }] })}
        />
      </Chart>
      <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 8, fontSize: 11, color: "var(--msc-muted)" }}>
        <span>Less</span>
        <span style={{ display: "flex", gap: 4 }}>
          {["#dcfce7", "#86efac", "#22c55e", "#15803d"].map((c, i) => (
            <span key={i} style={{ width: 12, height: 12, background: c, borderRadius: 2 }} />
          ))}
        </span>
        <span>More</span>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider mode="light">
      <div className="wrap">
        <h1 style={{ marginBottom: 24, fontSize: 18 }}>Chart Gallery</h1>
        <div className="card">
          <h2>Line + Area (multi-dataset)</h2>
          <LineAreaChart />
        </div>
        <div className="card">
          <h2>Grouped Bar</h2>
          <GroupedBarChart />
        </div>
        <div className="card">
          <h2>Bar + Line Combo</h2>
          <ComboChart
            data={comboData}
            x={(d) => d.day}
            bar={(d) => d.d1}
            line={(d) => d.d2}
            barLabel="Dataset 1"
            lineLabel="Dataset 2"
          />
        </div>
        <div className="card">
          <h2>Pie with Legend</h2>
          <PieChartWithLegend />
        </div>
        <div className="card">
          <h2>Horizontal Stacked Bar</h2>
          <HorizontalStackedBarChart />
        </div>
        <div className="card">
          <h2>Heatmap</h2>
          <HeatmapChart />
        </div>
      </div>
    </ThemeProvider>
  );
}
