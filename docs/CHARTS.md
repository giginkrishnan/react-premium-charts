# Chart Gallery & Documentation

A comprehensive guide to all chart types available in **react-modern-charts**.

![Chart Gallery](https://raw.githubusercontent.com/giginkrishnan/react-modern-charts/main/assets/chart-gallery.png)

---

## Overview

react-modern-charts is an SVG-first React charting library built with **d3-scale** and **d3-shape** for layout and path generation. All charts support theming (light/dark), tooltips, and responsive sizing.

### Quick Start

```bash
npm i d3-array d3-scale d3-shape react-modern-charts
```

```tsx
import "react-modern-charts/styles.css";
import { ThemeProvider, Chart, LineSeries } from "react-modern-charts";

function App() {
  return (
    <ThemeProvider mode="light">
      <Chart width={400} height={200} margin={{ top: 16, right: 16, bottom: 28, left: 40 }}>
        <LineSeries data={data} x={(_, i) => i} y={(d) => d.value} xScale={xScale} yScale={yScale} />
      </Chart>
    </ThemeProvider>
  );
}
```

---

## Chart Types

### 1. Line + Area (Multi-Dataset)

Combine `LineSeries` and `AreaSeries` for trend visualization with filled regions. Ideal for time series or sequential data.

**Components:** `Chart`, `Grid`, `AxisBottom`, `AxisLeft`, `LineSeries`, `AreaSeries`, `ChartTitle`

| Prop | Type | Description |
|------|------|-------------|
| `data` | `T[]` | Data array |
| `x` | `(d, i) => number` | X accessor (often index) |
| `y` | `(d) => number` | Y value accessor |
| `y0` | `number` | Baseline for area (default: 0) |
| `stroke` / `fill` | `string` | Line/area color |
| `showMarkers` | `boolean` | Show circles at data points |
| `curve` | `"monotone" \| "linear"` | Line interpolation |
| `tooltip` | `(d, i) => TooltipContent` | Custom tooltip |

**Example:** Two datasets with area fill and line overlay, with markers and tooltips.

---

### 2. Grouped Bar Chart

Side-by-side bars for comparing multiple metrics per category. Use `GroupedBarSeries` with a `groups` array.

**Components:** `Chart`, `Grid`, `AxisBottom`, `AxisLeft`, `GroupedBarSeries`

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

**Example:** Compare Dataset 1 vs Dataset 2 across days of the week.

---

### 3. Bar + Line Combo Chart

Overlay bars with a line series. Use the `ComboChart` component for a ready-made combo, or compose `BarSeries` + `LineSeries` manually.

**ComboChart Props:**

| Prop | Type | Description |
|------|------|-------------|
| `data` | `T[]` | Data array |
| `x` | `(d) => string` | Category accessor |
| `bar` | `(d) => number` | Bar value accessor |
| `line` | `(d) => number` | Line value accessor |
| `barLabel` / `lineLabel` | `string` | Legend labels |
| `barFill` / `lineStroke` | `string` | Colors |
| `width` / `height` | `number` | Chart dimensions |
| `showMarkers` | `boolean` | Show line markers |
| `barTooltip` / `lineTooltip` | `(d, i) => TooltipContent` | Custom tooltips |

**Example:** Bar chart with overlaid line showing a secondary metric.

---

### 4. Pie Chart with Legend

Circular chart for part-to-whole relationships. Use `PieChart` for a complete solution with legend, or `PieSeries` inside `Chart` for custom layouts.

**PieChart Props:**

| Prop | Type | Description |
|------|------|-------------|
| `data` | `T[]` | Data array |
| `value` | `(d) => number` | Value accessor |
| `label` | `(d) => string` | Slice label accessor |
| `colors` | `string[]` | Slice colors |
| `showLegend` | `boolean` | Show legend below chart |
| `showValues` | `boolean` | Show values in legend |
| `valueFormat` | `(v) => string` | Format values |
| `innerRadius` | `number` | Donut hole (0 = full pie) |
| `padAngle` | `number` | Gap between slices |
| `cornerRadius` | `number` | Rounded slice corners |
| `tooltip` | `(d, i) => TooltipContent` | Custom tooltip |

**Example:** Seven slices with legend showing label and value per slice.

---

### 5. Horizontal Stacked Bar

Single bar divided into segments. Use `StackedBarSeries` with `orientation="horizontal"`.

**StackedBarSeries Props:**

| Prop | Type | Description |
|------|------|-------------|
| `segments` | `StackedSegment[]` | `{ value, fill, label?, tooltip? }` |
| `orientation` | `"horizontal" \| "vertical"` | Bar direction |
| `radius` | `number` | Corner radius |
| `showValues` | `boolean` | Show value labels in segments |
| `valueFormat` | `(v) => string` | Format displayed values |
| `animate` | `boolean` | Animate segment growth |
| `hoverDimOpacity` | `number` | Dim non-hovered segments |

**Example:** Single horizontal bar with segments A (25), B (35), C (20), D (15).

---

### 6. Heatmap

Grid-based chart where cell color represents value. Use `HeatmapSeries` with rows, columns, and a 2D data array.

**HeatmapSeries Props:**

| Prop | Type | Description |
|------|------|-------------|
| `rows` | `string[]` | Row labels (Y-axis) |
| `columns` | `string[]` | Column labels (X-axis) |
| `data` | `HeatmapCell[][]` | `{ value, label? }` per cell |
| `colorScale` | `string[]` | Color gradient (low → high) |
| `animate` | `boolean` | Cell reveal animation |
| `hoverDimOpacity` | `number` | Dim non-hovered cells |
| `tooltip` | `(row, col, cell) => TooltipContent` | Custom tooltip |

**Example:** 3×4 grid (Mon/Wed/Fri × SEP/OCT/NOV/DEC) with green intensity scale.

---

## Primitives & Building Blocks

### Chart

SVG container with pointer tracking. All series render inside it.

```tsx
<Chart width={400} height={200} margin={{ top: 16, right: 16, bottom: 28, left: 40 }}>
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
```

### ThresholdLine

Horizontal or vertical reference line at a fixed value.

### ChartTitle

Title text above the chart.

### Legend

```tsx
<Legend items={[{ label: "A", value: "25", color: "#3b82f6" }]} />
```

---

## Theming

Wrap your app with `ThemeProvider`:

```tsx
<ThemeProvider mode="light">  {/* or "dark" */}
  <YourCharts />
</ThemeProvider>
```

CSS variables (`--msc-s1`, `--msc-s2`, `--msc-bg`, `--msc-text`, etc.) adapt automatically.

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
| `ThemeProvider` | Light/dark theme wrapper |
| `Chart`, `useChart` | SVG container + context |
| `Grid`, `AxisBottom`, `AxisLeft` | Layout primitives |
| `LineSeries`, `AreaSeries` | Line and area paths |
| `BarSeries`, `GroupedBarSeries`, `StackedBarSeries` | Bar variants |
| `PieSeries`, `PieChart` | Pie/donut charts |
| `ComboChart` | Bar + line combo |
| `HeatmapSeries` | Heatmap grid |
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

The playground showcases all chart types in a responsive grid.
