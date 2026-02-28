import React from "react";

export type LegendItem = {
  label: string;
  value?: string;
  color: string;
};

export function Legend({
  items,
  direction = "row"
}: {
  items: LegendItem[];
  direction?: "row" | "column";
}) {
  return (
    <div
      className="msc-legend"
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 12,
        flexDirection: direction,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 12
      }}
    >
      {items.map((item, i) => (
        <div
          key={`${item.label}-${i}`}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 12,
            color: "var(--msc-muted)"
          }}
        >
          <span
            className="msc-dot"
            style={{
              background: item.color,
              width: 8,
              height: 8,
              marginRight: 0
            }}
          />
          <span>
            {item.label}
            {item.value != null && `: ${item.value}`}
          </span>
        </div>
      ))}
    </div>
  );
}
