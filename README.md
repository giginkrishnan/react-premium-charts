# react-modern-charts

A small, modern **SVG-first** React chart library scaffold (your own engine), using **d3-scale + d3-shape** for math only.

## Install
```bash
npm i d3-array d3-scale d3-shape
npm i react-modern-charts
```

Import CSS once:
```ts
import "react-modern-charts/styles.css";
```

## Build
```bash
npm i
npm run build
```

## Local demo
This repo includes a Vite playground in `.playground/`.

```bash
cd .playground
npm i
npm run dev
```

## Exports
- `<Chart/>` (svg container + pointer tracking)
- `<Grid/>`, `<AxisBottom/>`, `<AxisLeft/>`
- `<LineSeries/>`, `<AreaSeries/>`, `<BarSeries/>`
- `<TooltipPortal/>`, `<DefaultTooltip/>`
