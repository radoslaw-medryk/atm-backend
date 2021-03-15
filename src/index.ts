import { startServer } from "./api/server";
import { config } from "./config";
import { initDb } from "./db/init";

async function main() {
    await initDb();
    startServer(config.server.port);
}

main().catch(e => console.error("ERROR IN MAIN", e));
