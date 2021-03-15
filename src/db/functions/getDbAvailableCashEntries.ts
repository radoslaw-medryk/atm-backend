import { sql } from "slonik";
import { ensure } from "verifica-core";
import { isArrayOf } from "verifica-predicates";
import { db } from "..";
import { DbAvailableCashEntry, isDbAvailableCashEntry } from "../models/DbAvailableCashEntry";

export async function getDbAvailableCashEntries(): Promise<DbAvailableCashEntry[]> {
    const rows = await db.any(sql`SELECT * FROM "AvailableCashEntries";`);

    return ensure(rows, isArrayOf(isDbAvailableCashEntry));
}
