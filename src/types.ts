export type Datum = Record<string, unknown>;
export type Accessor<T extends Datum, V> = (d: T, i: number) => V;
