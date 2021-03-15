import { sql } from "slonik";
import { db } from "..";
import { CashEntry } from "../../logic/payouts/models/CashEntry";
import { PayoutConcurrencyError } from "../errors/PayoutConcurrencyError";
import { onInit } from "../init";
import { sqlTuple } from "../utils/sqlTuple";

const init = sql`
    DROP FUNCTION IF EXISTS "performDbPayout";
    CREATE FUNCTION "performDbPayout"(_entries "IdAndCount"[])
    RETURNS void
    LANGUAGE plpgsql
    AS $$
        DECLARE
            _entry "IdAndCount";
            _count integer;
            _sum integer;
        BEGIN
            -- The whole function body is transactional, so raising an exception reverts any changes

            FOREACH _entry IN ARRAY _entries LOOP
                -- First substract withdrawed count for the entry (no-op if entry doesn't exist)
                UPDATE "AvailableCashEntries"
                SET count = count - _entry.count
                WHERE id = _entry.id;

                -- Check if entry actually exists, raise exception of not
                SELECT COUNT(*)
                INTO _count
                FROM "AvailableCashEntries"
                WHERE id = _entry.id;

                IF _count = 0 THEN
                    RAISE EXCEPTION 'PayoutOperationImpossible';
                END IF;

                -- Check if withdrawal didn't leave the entry negative, raise exception if yes
                SELECT SUM(count)
                INTO _sum
                FROM "AvailableCashEntries"
                WHERE id = _entry.id;

                IF _sum < 0 THEN
                    RAISE EXCEPTION 'PayoutOperationImpossible';
                END IF;
            END LOOP;
        END
    $$
`;
onInit(100, init);

export async function performDbPayout(cashEntries: CashEntry[]) {
    const _cashEntries = cashEntriesToSqlArray(cashEntries);

    try {
        await db.query(sql`SELECT 1 FROM "performDbPayout"(${_cashEntries});`);
    } catch (e) {
        if (e.message === "PayoutOperationImpossible") {
            throw new PayoutConcurrencyError();
        }
        throw e;
    }
}

function cashEntriesToSqlArray(cashEntries: CashEntry[]) {
    if (cashEntries.length === 0) {
        return sql`ARRAY[]::"IdAndCount"[]`;
    }

    const items = sql.join(
        cashEntries.map(q => sqlTuple(q.id, q.count)),
        sql`,`
    );

    return sql`ARRAY[${items}]::"IdAndCount"[]`;
}
