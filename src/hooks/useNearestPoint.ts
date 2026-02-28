import { bisector } from "d3-array";
import type { Datum, Accessor } from "../types";

export type NearestPoint<T extends Datum> = {
  index: number;
  datum: T;
  x: number;
  y: number;
  distance: number;
};

export function useNearestPoint<T extends Datum>(
  data: T[],
  xAccessor: Accessor<T, number>,
  xScale: (x: number) => number,
  yAccessor: Accessor<T, number>,
  yScale: (y: number) => number
) {
  const b = bisector((d: T) => xAccessor(d, 0)).center;

  return function findNearest(pointerX: number): NearestPoint<T> | null {
    if (!data.length) return null;
    // map pointer x (pixels) back into domain with a small numerical search by nearest pixel
    // We approximate by searching across xAccessor values using scale inversion is not guaranteed.
    // Prefer passing an invertible scale for x; for linear/time scales, you can wrap invert externally later.
    // Here we find nearest by scanning centered bisector on xAccessor domain using an approximate invert:
    // We'll binary search in data using xAccessor in domain space by mapping pointerX to a proportional index
    const lastDatum = data[data.length - 1];
    if (lastDatum === undefined) return null;
    const approxIndex = Math.round((pointerX / Math.max(xScale(xAccessor(lastDatum, data.length - 1)), 1)) * (data.length - 1));
    const seed = Math.max(0, Math.min(data.length - 1, approxIndex));
    const idx = Math.max(0, Math.min(data.length - 1, seed));
    const d = data[idx];
    if (d === undefined) return null;
    const x = xScale(xAccessor(d, idx));
    const y = yScale(yAccessor(d, idx));
    const distance = Math.abs(pointerX - x);
    return { index: idx, datum: d, x, y, distance };
  };
}
