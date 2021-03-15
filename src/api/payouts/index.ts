import Big from "big.js";
import { ensure } from "verifica-core";
import { performPayout } from "../../logic/payouts/performPayout";
import { MeaningfulError } from "../MeaningfulError";
import { router } from "../server";
import { isPostPayoutsRequest } from "./models/PostPayoutsRequest";
import { PostPayoutsResponse } from "./models/PostPayoutsResponse";

router.post("/payouts", async ctx => {
    const { value } = ensure(ctx.request.body, isPostPayoutsRequest);
    const valueBig = new Big(value);

    const selectedEntries = await performPayout(valueBig);

    if (!selectedEntries) {
        throw new MeaningfulError(500, true, "Cash unavailable to satisfy payout request.");
    }

    const response: PostPayoutsResponse = {
        selectedEntries,
    };
    ctx.body = response;
});
