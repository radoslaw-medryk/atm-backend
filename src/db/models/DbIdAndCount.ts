import { sql } from "slonik";
import { isType } from "verifica-ts";
import { onInit } from "../init";

export type DbIdAndCount = {
    id: string;
    count: number;
};

export const isDbIdAndCount = isType<DbIdAndCount>();

const init = sql`
    DROP TYPE IF EXISTS "IdAndCount" CASCADE;
    CREATE TYPE "IdAndCount" AS (
        "id" varchar,
        "count" integer
    );
`;
onInit(0, init);
