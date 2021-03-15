import Big from "big.js";
import { sql } from "slonik";
import { ensure, isNumber, isObject, isString, Predicate } from "verifica";

import { isBig } from "../../utils/isBig";
import { onInit } from "../init";

export type DbAvailableCashEntry = {
    id: string;
    singleUnitValue: Big;
    count: number;
};

export const isDbAvailableCashEntry: Predicate<DbAvailableCashEntry> = function (verificable) {
    ensure(verificable, isObject);

    ensure(verificable.id, isString);
    ensure(verificable.singleUnitValue, isBig);
    ensure(verificable.count, isNumber);
};

const init = sql`
    CREATE TABLE IF NOT EXISTS "AvailableCashEntries" (
        "id" varchar PRIMARY KEY,
        "singleUnitValue" numeric NOT NULL,
        "count" integer NOT NULL
    );
`;
onInit(0, init);
