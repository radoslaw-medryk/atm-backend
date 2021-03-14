import { startServer } from "./api/server";
import { config } from "./config";

startServer(config.server.port);
