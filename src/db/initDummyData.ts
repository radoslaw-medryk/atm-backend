import { sql } from "slonik";
import { db } from ".";

export async function initDummyData() {
    db.query(sql`
        DELETE FROM "AvailableCashEntries";
        INSERT INTO "AvailableCashEntries" (
            "id",
            "singleUnitValue",
            "count"
        ) VALUES
        ('1000', 1000, 1),
        ('500', 500, 2),
        ('200', 200, 10),
        ('100', 100, 0),
        ('50', 50, 0),
        ('20', 20, 10),
        ('10', 10, 10),
        ('5', 5, 0),
        ('2', 2, 10),
        ('1', 1, 0)
    `);
}
