import { createPool } from "slonik";
import { config } from "../config";
import { fromNumeric } from "./utils/fromNumeric";
import { fromUtc } from "./utils/fromUtc";

export const db = createPool(config.db.connection, {
    typeParsers: [
        {
            name: "timestamp",
            parse: value => (value == null ? value : fromUtc(value)),
        },
        {
            name: "timestamptz",
            parse: value => (value == null ? value : new Date(value)),
        },
        {
            name: "numeric",
            parse: fromNumeric,
        },
    ],
});
