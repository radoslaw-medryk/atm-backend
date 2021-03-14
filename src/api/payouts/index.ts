import Big from "big.js";
import { ensure } from "verifica-core";
import { router } from "../server";
import { isPostPayoutsRequest } from "./models/PostPayoutsRequest";

router.post("/payouts", async ctx => {
    const { value } = ensure(ctx.request.body, isPostPayoutsRequest);
    const valueBig = new Big(value);

    throw new Error("NotImplemented");
});
