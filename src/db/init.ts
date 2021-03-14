import { TaggedTemplateLiteralInvocationType } from "slonik";
import { db } from ".";
import { by } from "../utils/sortBy";

const onInitQueries: { sql: TaggedTemplateLiteralInvocationType; priority: number }[] = [];

export async function onInit(priority: number, sql: TaggedTemplateLiteralInvocationType) {
    onInitQueries.push({
        sql,
        priority,
    });
}

export async function initDb() {
    try {
        console.log("DB INIT - STARTING...");
        require("./models");

        for (const query of onInitQueries.sort(by(q => q.priority))) {
            await db.query(query.sql);
        }

        console.log("DB INIT - DONE.");
    } catch (e) {
        console.error("DB INIT - ERROR.", e);
    }
}
