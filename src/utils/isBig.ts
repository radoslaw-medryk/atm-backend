import { makeError, Predicate, rawValue } from "verifica";
import { Big } from "big.js";

export const isBig: Predicate<Big> = function (verificable) {
    const value = rawValue(verificable);

    if (!(value instanceof Big)) {
        return makeError(verificable, {
            type: "isBig",
        });
    }
};
