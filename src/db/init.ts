import { TaggedTemplateLiteralInvocationType } from "slonik";
import { db } from ".";
import { config } from "../config";
import { by } from "../utils/sortBy";
import { initDummyData } from "./initDummyData";

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
        require("./functions");

        for (const query of onInitQueries.sort(by(q => q.priority))) {
            await db.query(query.sql);
        }

        if (config.db.initDummyData) {
            await initDummyData();
        }

        console.log("DB INIT - DONE.");
    } catch (e) {
        console.error("DB INIT - ERROR.", e);
    }
}
