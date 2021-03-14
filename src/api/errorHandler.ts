import { Middleware } from "koa";
import { isValid } from "verifica";
import { isMeaningfulError } from "./MeaningfulError";

export const errorHandler: Middleware = async (ctx, next) => {
    try {
        await next();
    } catch (e) {
        console.error(e);

        ctx.set("Content-Type", "application/json");

        if (isValid(e, isMeaningfulError)) {
            ctx.status = e.status;
            ctx.body = JSON.stringify({
                error: e.expose && e.message ? e.message : "Server error",
            });
            return;
        }

        ctx.status = 500;
        ctx.body = JSON.stringify({
            error: "Internal server error",
        });
    }
};
