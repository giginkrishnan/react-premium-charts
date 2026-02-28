# Chart Gallery & Documentation

A comprehensive guide to all chart types available in **react-premium-charts**.

![Chart Gallery](https://raw.githubusercontent.com/giginkrishnan/react-modern-charts/main/assets/chart-gallery.png)

---

## Overview

react-premium-charts is an SVG-first React charting library built with **d3-scale** and **d3-shape** for layout and path generation. All charts support theming (light/dark), color palettes, tooltips, gradients, and responsive sizing.

### Quick Start

```bash
npm i d3-array d3-scale d3-shape react-premium-charts
```

```tsx
import "react-premium-charts/styles.css";
import { ThemeProvider, Chart, LineSeries } from "react-premium-charts";

function App() {
  return (
    <ThemeProvider mode="light" palette="default">
      <Chart width={400} height={200} margin={{ top: 16, right: 16, bottom: 28, left: 40 }}>
        <LineSeries data={data} x={(_, i) => i} y={(d) => d.value} xScale={xScale} yScale={yScale} />
      </Chart>
    </ThemeProvider>
  );
}
```

---

## Theming & Palettes

Wrap your app with `ThemeProvider`:

```tsx
<ThemeProvider mode="light" palette="default" isGradientEnabled={true}>
  <YourCharts />
</ThemeProvider>
```

| Prop | Type | Description |
|------|------|-------------|
| `mode` | `"light"` \| `"dark"` | Affects backgrounds, text, borders |
| `palette` | `ChartPalette` | Chart series colors (--msc-s1 through --msc-s5) |
| `isGradientEnabled` | `boolean` (default: `true`) | When `false`, charts use solid fills instead of gradients |

### Predefined Palettes

| Palette | Colors | Description |
|---------|--------|-------------|
| **default** | #118133, #343738, #78AE81, #64B66F, #5E656E | Forest green — primary default |
| **forest** | #118133, #343738, #78AE81, #64B66F, #5E656E | Greens and grays |
| **sage** | #a4b494, #bec5ad, #3B5249, #519872, #34252F | Muted earthy greens |
| **periwinkle** | #EDFFEC, #61E786, #5A5766, #48435C, #9792E3 | Honeydew, mint, charcoal, grape |
| **indigo** | #30343F, #FAFAFF, #E4D9FF, #273469, #1E2749 | Jet black, ghost white, twilight indigo |
| **ocean** | #75DDDD, #508991, #172A3A, #004346, #09BC8A | Pearl aqua, pacific cyan, dark teal, mint |

Use `var(--msc-s1)` through `var(--msc-s5)` in any series to inherit palette colors. Access theme via `useTheme()` for `mode`, `palette`, and `isGradientEnabled`.

---

## Chart Types

### 1. Vertical Bar Chart

**Component:** `BarSeries`

Vertical bars for categorical data. Use band scale for categories and linear scale for values.

| Prop | Type | Description |
|------|------|-------------|
| `data` | `T[]` | Data array |
| `x` | `(d, i) => string` | Category accessor |
| `y` | `(d, i) => number` | Value accessor |
| `xScale` | `ScaleBand<string>` | Band scale for categories |
| `yScale` | `ScaleLinear` | Linear scale for values |
| `fill` | `string` | Bar color (default: `var(--msc-s1)`) |
| `radius` | `number` | Corner radius (default: 10) |
| `animate` | `boolean` | Staggered grow animation |
| `tooltip` | `(d, i) => TooltipContent` | Custom tooltip |

```tsx
<BarSeries
  data={data}
  x={(d) => d.day}
  y={(d) => d.value}
  xScale={xScale}
  yScale={yScale}
  fill="var(--msc-s1)"
  tooltip={(d) => ({ title: d.day, rows: [{ label: "Value", value: String(d.value), color: "var(--msc-s1)" }] })}
/>
```

---

### 2. Horizontal Bar Chart

**Component:** `HorizontalBarSeries`

Horizontal bars. Use band scale for categories (y-axis) and linear scale for values (x-axis).

| Prop | Type | Description |
|------|------|-------------|
| `data` | `T[]` | Data array |
| `y` | `(d, i) => string` | Category accessor |
| `x` | `(d, i) => number` | Value accessor |
| `yScale` | `ScaleBand<string>` | Band scale for categories |
| `xScale` | `ScaleLinear` | Linear scale for values |
| `fill` | `string` | Bar color (default: `var(--msc-s1)`) |
| `radius` | `number` | Corner radius |
| `animate` | `boolean` | Staggered grow animation |
| `tooltip` | `(d, i) => TooltipContent` | Custom tooltip |

```tsx
<HorizontalBarSeries
  data={data}
  y={(d) => d.day}
  x={(d) => d.value}
  yScale={yScale}
  xScale={xScale}
  fill="var(--msc-s1)"
  tooltip={(d) => ({ title: d.day, rows: [{ label: "Value", value: String(d.value), color: "var(--msc-s1)" }] })}
/>
```

---

### 3. Stacked Bar Chart

**Component:** `StackedBarSeries`

Single bar divided into segments. Leftmost segment has top-left and bottom-left corners rounded; rightmost has top-right and bottom-right rounded; middle segments have square corners.

| Prop | Type | Description |
|------|------|-------------|
| `segments` | `StackedSegment[]` | `{ value, fill, label?, tooltip? }` |
| `orientation` | `"horizontal"` \| `"vertical"` | Bar direction |
| `radius` | `number` | Corner radius for end segments (default: 4) |
| `showValues` | `boolean` | Show value labels in segments |
| `valueFormat` | `(v) => string` | Format displayed values |
| `animate` | `boolean` | Animate segment growth |
| `hoverDimOpacity` | `number` | Dim non-hovered segments |

```tsx
const segments = [
  { value: 25, fill: "var(--msc-s1)", label: "A", tooltip: { title: "A", rows: [{ label: "Value", value: "25", color: "var(--msc-s1)" }] } },
  { value: 35, fill: "var(--msc-s2)", label: "B", tooltip: { title: "B", rows: [{ label: "Value", value: "35", color: "var(--msc-s2)" }] } },
];
<StackedBarSeries segments={segments} orientation="horizontal" radius={4} />
```

---

### 4. Grouped Bar Chart

**Component:** `GroupedBarSeries`

Side-by-side bars for comparing multiple metrics per category.

| Prop | Type | Description |
|------|------|-------------|
| `data` | `T[]` | Category data |
| `x` | `(d) => string` | Category label accessor |
| `xScale` | `ScaleBand<string>` | Band scale for categories |
| `yScale` | `ScaleLinear` | Linear scale for values |
| `groups` | `GroupedBarConfig[]` | `{ y, fill, tooltip }` per series |
| `radius` | `number` | Bar corner radius |
| `animate` | `boolean` | Staggered bar animation |
| `hoverDimOpacity` | `number` | Opacity when another bar is hovered |

```tsx
<GroupedBarSeries
  data={data}
  x={(d) => d.day}
  xScale={xScale}
  yScale={yScale}
  groups={[
    { y: (d) => d.d1, fill: "var(--msc-s1)", tooltip: (d) => ({ title: d.day, rows: [{ label: "D1", value: String(d.d1), color: "var(--msc-s1)" }] }) },
    { y: (d) => d.d2, fill: "var(--msc-s2)", tooltip: (d) => ({ title: d.day, rows: [{ label: "D2", value: String(d.d2), color: "var(--msc-s2)" }] }) },
  ]}
/>
```

---

### 5. Line Chart

**Component:** `LineSeries`

Line with optional markers for trend visualization.

| Prop | Type | Description |
|------|------|-------------|
| `data` | `T[]` | Data array |
| `x` | `(d, i) => number` | X accessor (often index) |
| `y` | `(d, i) => number` | Y value accessor |
| `xScale` | `ScaleLinear` | X scale |
| `yScale` | `ScaleLinear` | Y scale |
| `stroke` | `string` | Line color (default: `var(--msc-s1)`) |
| `showMarkers` | `boolean` | Show circles at data points |
| `curve` | `"monotone"` \| `"linear"` | Line interpolation |
| `animate` | `boolean` | Draw animation |
| `tooltip` | `(d, i) => TooltipContent` | Custom tooltip |

```tsx
<LineSeries
  data={data}
  x={(_, i) => i}
  y={(d) => d.value}
  xScale={xScale}
  yScale={yScale}
  stroke="var(--msc-s1)"
  showMarkers
  tooltip={(d) => ({ title: d.day, rows: [{ label: "Value", value: String(d.value), color: "var(--msc-s1)" }] })}
/>
```

---

### 6. Area Chart

**Component:** `AreaSeries`

Filled area under a line. Often combined with `LineSeries` for trend + fill.

| Prop | Type | Description |
|------|------|-------------|
| `data` | `T[]` | Data array |
| `x` | `(d, i) => number` | X accessor |
| `y` | `(d, i) => number` | Y value accessor |
| `y0` | `number` | Baseline (default: 0) |
| `xScale` | `ScaleLinear` | X scale |
| `yScale` | `ScaleLinear` | Y scale |
| `fill` | `string` | Area color (default: `var(--msc-s1)`) |
| `fillOpacity` | `number` | Fill opacity |
| `animate` | `boolean` | Reveal animation |
| `tooltip` | `(d, i) => TooltipContent` | Custom tooltip |

```tsx
<AreaSeries
  data={data}
  x={(_, i) => i}
  y={(d) => d.value}
  y0={0}
  xScale={xScale}
  yScale={yScale}
  fill="var(--msc-s1)"
  fillOpacity={0.4}
/>
```

---

### 7. Pie Chart

**Component:** `PieChart`, `PieSeries`

Circular chart for part-to-whole relationships. Use `PieChart` for legend + chart, or `PieSeries` inside `Chart` for custom layouts.

| Prop | Type | Description |
|------|------|-------------|
| `data` | `T[]` | Data array |
| `value` | `(d) => number` | Value accessor |
| `label` | `(d) => string` | Slice label accessor |
| `colors` | `string[]` | Slice colors (default: `var(--msc-s1)` through `--msc-s5`) |
| `showLegend` | `boolean` | Show legend below chart |
| `showValues` | `boolean` | Show values in legend |
| `valueFormat` | `(v) => string` | Format values |
| `innerRadius` | `number` | Donut hole (0 = full pie) |
| `padAngle` | `number` | Gap between slices |
| `cornerRadius` | `number` | Rounded slice corners |
| `defs` | `ReactNode` | SVG defs (e.g. gradients) |
| `tooltip` | `(d, i) => TooltipContent` | Custom tooltip |

```tsx
<PieChart
  data={data}
  value={(d) => d.value}
  label={(d) => d.label}
  showLegend
  showValues
  colors={["var(--msc-s1)", "var(--msc-s2)", "var(--msc-s3)", "var(--msc-s4)", "var(--msc-s5)"]}
/>
```

---

### 8. Doughnut Chart

**Component:** `PieChart` with `innerRadius`

Same as Pie Chart with a hole. Set `innerRadius={40}` (or any value > 0).

```tsx
<PieChart
  data={data}
  value={(d) => d.value}
  label={(d) => d.label}
  innerRadius={40}
  showLegend
  showValues
/>
```

---

### 9. Polar Area Chart

**Component:** `PolarAreaChart`

Equal-angle slices with variable radius by value.

| Prop | Type | Description |
|------|------|-------------|
| `data` | `T[]` | Data array |
| `value` | `(d) => number` | Value accessor |
| `label` | `(d) => string` | Slice label accessor |
| `colors` | `string[]` | Slice colors (default: palette) |
| `showLegend` | `boolean` | Show legend |
| `showValues` | `boolean` | Show values in legend |
| `defs` | `ReactNode` | SVG defs (gradients) |
| `animate` | `boolean` | Animate slices |

```tsx
<PolarAreaChart
  data={data}
  value={(d) => d.value}
  label={(d) => d.label}
  showLegend
/>
```

---

### 10. Radar Chart

**Component:** `RadarChart`

Spider/radar chart with multiple axes.

| Prop | Type | Description |
|------|------|-------------|
| `data` | `T[]` | Data array |
| `value` | `(d) => number` | Value accessor |
| `label` | `(d) => string` | Axis label accessor |
| `fill` | `string` | Fill color |
| `stroke` | `string` | Stroke color |
| `defs` | `ReactNode` | SVG defs (gradients) |
| `fillOpacity` | `number` | Fill opacity |
| `showMarkers` | `boolean` | Show data point markers |

```tsx
<RadarChart
  data={data}
  value={(d) => d.value}
  label={(d) => d.label}
  fill="var(--msc-s1)"
  stroke="var(--msc-s1)"
/>
```

---

### 11. Scatter Chart

**Component:** `ScatterSeries`

Scatter plot with x and y accessors.

| Prop | Type | Description |
|------|------|-------------|
| `data` | `T[]` | Data array |
| `x` | `(d, i) => number` | X accessor |
| `y` | `(d, i) => number` | Y accessor |
| `xScale` | `ScaleLinear` | X scale |
| `yScale` | `ScaleLinear` | Y scale |
| `fill` | `string` | Marker color (default: `var(--msc-s1)`) |
| `stroke` | `string` | Marker stroke |
| `radius` | `number` | Marker radius |
| `animate` | `boolean` | Pop-in animation |
| `tooltip` | `(d, i) => TooltipContent` | Custom tooltip |

```tsx
<ScatterSeries
  data={data}
  x={(d) => d.x}
  y={(d) => d.y}
  xScale={xScale}
  yScale={yScale}
  fill="var(--msc-s1)"
  tooltip={(d) => ({ title: `(${d.x}, ${d.y})`, rows: [{ label: "Y", value: String(d.y), color: "var(--msc-s1)" }] })}
/>
```

---

### 12. Bubble Chart

**Component:** `BubbleSeries`

Scatter with variable marker size.

| Prop | Type | Description |
|------|------|-------------|
| `data` | `T[]` | Data array |
| `x` | `(d, i) => number` | X accessor |
| `y` | `(d, i) => number` | Y accessor |
| `size` | `(d, i) => number` | Size accessor |
| `xScale` | `ScaleLinear` | X scale |
| `yScale` | `ScaleLinear` | Y scale |
| `fill` | `string` | Bubble color (default: `var(--msc-s1)`) |
| `fillOpacity` | `number` | Fill opacity |
| `animate` | `boolean` | Pop-in animation |
| `tooltip` | `(d, i) => TooltipContent` | Custom tooltip |

```tsx
<BubbleSeries
  data={data}
  x={(d) => d.x}
  y={(d) => d.y}
  size={(d) => d.size}
  xScale={xScale}
  yScale={yScale}
  fill="var(--msc-s1)"
  tooltip={(d) => ({ title: `Size: ${d.size}`, rows: [{ label: "Value", value: String(d.size), color: "var(--msc-s1)" }] })}
/>
```

---

### 13. Combo Chart (Bar + Line)

**Component:** `ComboChart`

Overlay bars with a line series.

| Prop | Type | Description |
|------|------|-------------|
| `data` | `T[]` | Data array |
| `x` | `(d) => string` | Category accessor |
| `bar` | `(d) => number` | Bar value accessor |
| `line` | `(d) => number` | Line value accessor |
| `barLabel` / `lineLabel` | `string` | Legend labels |
| `barFill` / `lineStroke` | `string` | Colors (default: `var(--msc-s1)`, `var(--msc-s2)`) |
| `defs` | `ReactNode` | SVG defs (gradients) |
| `showMarkers` | `boolean` | Show line markers |
| `barTooltip` / `lineTooltip` | `(d, i) => TooltipContent` | Custom tooltips |

```tsx
<ComboChart
  data={data}
  x={(d) => d.day}
  bar={(d) => d.barValue}
  line={(d) => d.lineValue}
  barLabel="Bar"
  lineLabel="Line"
  barFill="var(--msc-s1)"
  lineStroke="var(--msc-s2)"
/>
```

---

### 14. Multiaxis Line Chart

**Component:** `MultiaxisLineChart`

Line chart with two Y axes (e.g. different units).

| Prop | Type | Description |
|------|------|-------------|
| `data` | `T[]` | Data array |
| `x` | `(d) => string \| number` | X accessor |
| `leftLine` | `(d) => number` | Left Y-axis value |
| `rightLine` | `(d) => number` | Right Y-axis value |
| `leftLabel` / `rightLabel` | `string` | Axis labels |
| `leftStroke` / `rightStroke` | `string` | Line colors (default: `var(--msc-s1)`, `var(--msc-s2)`) |
| `defs` | `ReactNode` | SVG defs |
| `showMarkers` | `boolean` | Show line markers |
| `leftTooltip` / `rightTooltip` | `(d, i) => TooltipContent` | Custom tooltips |

```tsx
<MultiaxisLineChart
  data={data}
  x={(d) => d.day}
  leftLine={(d) => d.d1}
  rightLine={(d) => d.d2}
  leftLabel="D1"
  rightLabel="D2"
  leftStroke="var(--msc-s1)"
  rightStroke="var(--msc-s2)"
/>
```

---

### 15. Heatmap

**Component:** `HeatmapSeries`

Grid-based chart where cell color represents value.

| Prop | Type | Description |
|------|------|-------------|
| `rows` | `string[]` | Row labels (Y-axis) |
| `columns` | `string[]` | Column labels (X-axis) |
| `data` | `HeatmapCell[][]` | `{ value, label? }` per cell |
| `colorScale` | `string[]` | Discrete colors (low → high) |
| `gradientStops` | `{ offset: number; color: string }[]` | Smooth gradient (overrides colorScale) |
| `animate` | `boolean` | Cell reveal animation |
| `hoverDimOpacity` | `number` | Dim non-hovered cells |
| `tooltip` | `(row, col, cell) => TooltipContent` | Custom tooltip |

```tsx
<HeatmapSeries
  rows={["Mon", "Wed", "Fri"]}
  columns={["SEP", "OCT", "NOV", "DEC"]}
  data={heatmapData}
  gradientStops={[
    { offset: 0, color: "#78ae81" },
    { offset: 0.5, color: "#64b66f" },
    { offset: 1, color: "#118133" },
  ]}
  tooltip={(row, col, cell) => ({ title: `${row} - ${col}`, rows: [{ label: "Value", value: String(cell.value), color: "var(--msc-s1)" }] })}
/>
```

**Note:** Heatmap `gradientStops` require hex colors for interpolation; CSS variables are not supported in the color interpolation.

---

### 16. Gradients

All charts support gradient fills. Use `LinearGradient` or `RadialGradient` inside `Chart`, then pass `fill="url(#gradientId)"` or `stroke="url(#gradientId)"` to any series. Control via `ThemeProvider` `isGradientEnabled` prop.

**Linear gradient** (bars, areas, lines):

```tsx
<Chart>
  <LinearGradient id="barGrad" y2="100%" stops={[
    { offset: "0%", color: "var(--msc-s1)", opacity: 1 },
    { offset: "100%", color: "var(--msc-s1)", opacity: 0.3 }
  ]} />
  <BarSeries fill="url(#barGrad)" ... />
</Chart>
```

**Radial gradient** (pie, doughnut, polar area):

```tsx
<PieChart
  defs={<RadialGradient id="pieGrad" stops={[
    { offset: "0%", color: "var(--msc-s1)", opacity: 0.6 },
    { offset: "100%", color: "var(--msc-s1)" }
  ]} />}
  colors={["url(#pieGrad)", "var(--msc-s2)", "var(--msc-s3)", ...]}
  ...
/>
```

---

## Primitives & Building Blocks

### Chart

SVG container with pointer tracking. All series render inside it.

```tsx
<Chart width={400} height={200} margin={{ top: 16, right: 16, bottom: 28, left: 40 }} defs={...}>
  {/* series, axes, grid */}
</Chart>
```

### Grid

```tsx
<Grid xTicks={xTicks} yTicks={yTicks} />
```

### Axes

```tsx
<AxisLeft ticks={leftTicks} />
<AxisBottom ticks={bottomTicks} />
<AxisRight ticks={rightTicks} x={innerWidth} />
```

### Legend

```tsx
<Legend items={[{ label: "A", value: "25", color: "var(--msc-s1)" }]} />
```

### ThresholdLine

Horizontal or vertical reference line at a fixed value.

### ChartTitle

Title text above the chart.

---

## Tooltips

All series support a `tooltip` prop returning `{ title, rows }`:

```tsx
tooltip={(d, i) => ({
  title: d.day,
  rows: [
    { label: "Value", value: String(d.value), color: "var(--msc-s1)" }
  ]
})}
```

Use `TooltipPortal` and `DefaultTooltip` for custom tooltip placement.

---

## Exports Summary

| Export | Description |
|--------|--------------|
| `ThemeProvider`, `useTheme` | Theme wrapper + hook for mode, palette, isGradientEnabled |
| `Chart`, `useChart` | SVG container + context |
| `Grid`, `AxisBottom`, `AxisLeft`, `AxisRight` | Layout primitives |
| `LineSeries`, `AreaSeries` | Line and area paths |
| `BarSeries`, `HorizontalBarSeries`, `GroupedBarSeries`, `StackedBarSeries` | Bar variants |
| `PieSeries`, `PieChart`, `PolarAreaSeries`, `PolarAreaChart` | Pie/donut/polar |
| `ComboChart`, `MultiaxisLineChart` | Combo and multiaxis |
| `RadarChart` | Radar/spider chart |
| `ScatterSeries`, `BubbleSeries` | Scatter and bubble |
| `HeatmapSeries` | Heatmap grid |
| `LinearGradient`, `RadialGradient` | Gradient primitives |
| `ThresholdLine`, `ChartTitle`, `Legend` | Annotations |
| `TooltipPortal`, `DefaultTooltip` | Tooltip system |
| `useNearestPoint` | Hover/snap utilities |

---

## Local Playground

Run the interactive demo:

```bash
cd .playground
npm i
npm run dev
```

The playground showcases all chart types with palette switcher and gradient toggle.
