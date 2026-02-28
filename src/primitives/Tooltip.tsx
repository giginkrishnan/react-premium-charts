import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const TOOLTIP_WIDTH = 200;
const TOOLTIP_HEIGHT = 120;
const OFFSET = 12;
const PADDING = 8;
const TOOLTIP_Z_INDEX = 10000;

/**
 * Computes tooltip position to stay within container bounds.
 * Prefers top-right of anchor; flips horizontally/vertically as needed.
 */
export function computeTooltipPosition(
  anchorX: number,
  anchorY: number,
  containerWidth: number,
  containerHeight: number,
  tooltipWidth = TOOLTIP_WIDTH,
  tooltipHeight = TOOLTIP_HEIGHT
): { x: number; y: number } {
  let x = anchorX + OFFSET;
  let y = anchorY - tooltipHeight - OFFSET;

  if (x + tooltipWidth > containerWidth - PADDING) {
    x = anchorX - tooltipWidth - OFFSET;
  }
  if (x < PADDING) {
    x = PADDING;
  }
  if (y < PADDING) {
    y = anchorY + OFFSET;
  }
  if (y + tooltipHeight > containerHeight - PADDING) {
    y = containerHeight - tooltipHeight - PADDING;
  }

  return { x: Math.max(PADDING, x), y: Math.max(PADDING, y) };
}

function useScreenPosition(
  innerX: number,
  innerY: number,
  svgRef: React.RefObject<SVGSVGElement | null> | undefined,
  margin: { left: number; top: number } | undefined
): { x: number; y: number } | null {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const svg = svgRef?.current;
    if (!svg || !margin) return;
    const pt = svg.createSVGPoint();
    pt.x = innerX + margin.left;
    pt.y = innerY + margin.top;
    const ctm = svg.getScreenCTM();
    if (!ctm) return;
    const screen = pt.matrixTransform(ctm);
    setPos({ x: screen.x, y: screen.y });
  }, [innerX, innerY, svgRef, margin]);

  return pos;
}

export function TooltipPortal({
  x,
  y,
  anchorX,
  anchorY,
  containerWidth,
  containerHeight,
  svgRef,
  margin,
  children
}: {
  x?: number;
  y?: number;
  anchorX?: number;
  anchorY?: number;
  containerWidth?: number;
  containerHeight?: number;
  svgRef?: React.RefObject<SVGSVGElement | null>;
  margin?: { left: number; top: number };
  children: React.ReactNode;
}) {
  const innerPosition =
    anchorX != null &&
    anchorY != null &&
    containerWidth != null &&
    containerHeight != null
      ? computeTooltipPosition(anchorX, anchorY, containerWidth, containerHeight)
      : { x: x ?? 0, y: y ?? 0 };

  const screenPos = useScreenPosition(
    innerPosition.x,
    innerPosition.y,
    svgRef,
    margin ?? undefined
  );

  const usePortal = svgRef != null && margin != null && screenPos != null;

  if (usePortal && screenPos) {
    return createPortal(
      <div
        style={{
          position: "fixed",
          left: screenPos.x,
          top: screenPos.y,
          zIndex: TOOLTIP_Z_INDEX,
          pointerEvents: "none",
          width: "max-content",
          maxWidth: TOOLTIP_WIDTH,
          minWidth: 140
        }}
      >
        {children}
      </div>,
      document.body
    );
  }

  return (
    <foreignObject
      x={innerPosition.x}
      y={innerPosition.y}
      width={TOOLTIP_WIDTH + 40}
      height={TOOLTIP_HEIGHT + 40}
      style={{ overflow: "visible", pointerEvents: "none" }}
    >
      <div
        style={{
          width: "max-content",
          maxWidth: TOOLTIP_WIDTH,
          minWidth: 140,
          pointerEvents: "none"
        }}
      >
        {children}
      </div>
    </foreignObject>
  );
}

export function DefaultTooltip({
  title,
  rows
}: {
  title: string;
  rows: Array<{ label: string; value: string; color: string }>;
}) {
  return (
    <div className="msc-tooltip">
      <div className="msc-tooltip-title">{title}</div>
      {rows.map((r) => (
        <div key={r.label} className="msc-tooltip-row">
          <div style={{ display: "flex", alignItems: "center" }}>
            <span className="msc-dot" style={{ background: r.color }} />
            <span>{r.label}</span>
          </div>
          <div style={{ fontWeight: 650 }}>{r.value}</div>
        </div>
      ))}
    </div>
  );
}
