import Koa from "koa";
import Router from "koa-router";
import bodyParser from "koa-bodyparser";
import { handleVerificaExceptions } from "verifica-koa";
import { errorHandler } from "./errorHandler";
import cors from "koa-cors";

const app = new Koa();
app.proxy = true;

export const router = new Router({});

export function startServer(port: number) {
    require("./routes");
    app.use(errorHandler);
    app.use(cors());
    app.use(bodyParser());
    app.use(handleVerificaExceptions());
    app.use(router.routes());
    app.use(router.allowedMethods());

    app.listen(port, () => {
        console.log(`Server is running on port ${port}.`);
    });
}
