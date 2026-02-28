export { ThemeProvider, useTheme } from "./theme/ThemeProvider";
export type { ThemeMode, ChartPalette } from "./theme/ThemeProvider";

export { Chart, useChart } from "./primitives/Chart";
export type { ChartMargin, ChartSize } from "./primitives/Chart";

export { AxisBottom, AxisLeft, AxisRight } from "./primitives/Axis";
export { Grid } from "./primitives/Grid";
export { ThresholdLine } from "./primitives/ThresholdLine";
export { LinearGradient } from "./primitives/LinearGradient";
export { RadialGradient } from "./primitives/RadialGradient";
export { ChartTitle } from "./primitives/ChartTitle";
export { Legend } from "./primitives/Legend";
export type { LegendItem } from "./primitives/Legend";

export { TooltipPortal, DefaultTooltip, computeTooltipPosition } from "./primitives/Tooltip";

export { LineSeries } from "./series/LineSeries";
export { AreaSeries } from "./series/AreaSeries";
export { BarSeries } from "./series/BarSeries";
export { HorizontalBarSeries } from "./series/HorizontalBarSeries";
export { GroupedBarSeries } from "./series/GroupedBarSeries";
export type { GroupedBarConfig } from "./series/GroupedBarSeries";
export { StackedBarSeries } from "./series/StackedBarSeries";
export type { StackedSegment } from "./series/StackedBarSeries";
export { PieSeries } from "./series/PieSeries";
export { PolarAreaSeries } from "./series/PolarAreaSeries";
export { PieChart } from "./components/PieChart";
export { ComboChart } from "./components/ComboChart";
export { RadarChart } from "./components/RadarChart";
export { PolarAreaChart } from "./components/PolarAreaChart";
export { MultiaxisLineChart } from "./components/MultiaxisLineChart";
export { ScatterSeries } from "./series/ScatterSeries";
export { BubbleSeries } from "./series/BubbleSeries";
export { HeatmapSeries } from "./series/HeatmapSeries";
export type { HeatmapCell, HeatmapGradientStop } from "./series/HeatmapSeries";

export { useNearestPoint } from "./hooks/useNearestPoint";
export type { Datum, Accessor } from "./types";
export type { TooltipContent } from "./series/BarSeries";
