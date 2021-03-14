import Big from "big.js";

export function fromNumeric(value: string | undefined | null): Big | undefined | null {
    if (value == null) {
        return value;
    }

    return new Big(value);
}
