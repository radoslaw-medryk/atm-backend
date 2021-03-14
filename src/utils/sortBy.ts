import Big from "big.js";

export type Sortable = number | string | Date | Big;

export type SortSelectorFunc<TBase, TValue> = (base: TBase) => TValue;
type SortFunc<TBase> = (a: TBase, b: TBase) => number;

export function by<TBase, TValue extends Sortable>(
    selector: SortSelectorFunc<TBase, TValue>,
    order: "asc" | "desc" = "asc"
): SortFunc<TBase> {
    return function (a, b) {
        let compared: number;

        const aValue = selector(a);
        const bValue = selector(b);

        if (typeof aValue === "number" && typeof bValue === "number") {
            compared = aValue - bValue;
        } else if (typeof aValue === "string" && typeof bValue === "string") {
            compared = aValue.localeCompare(bValue);
        } else if (aValue instanceof Date && bValue instanceof Date) {
            compared = aValue.getTime() - bValue.getTime();
        } else if (aValue instanceof Big && bValue instanceof Big) {
            compared = aValue.minus(bValue).toNumber();
        } else {
            throw new Error("Unsupported TValue!");
        }

        return order === "asc" ? compared : -compared;
    };
}
