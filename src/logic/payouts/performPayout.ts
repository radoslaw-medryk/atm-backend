import Big from "big.js";
import { getDbAvailableCashEntries } from "../../db/functions/getDbAvailableCashEntries";
import { performDbPayout } from "../../db/functions/performDbPayout";
import { CashEntry } from "./models/CashEntry";
import { selectPayoutCashEntries } from "./selectPayoutCashEntries";

export async function performPayout(value: Big): Promise<CashEntry[] | undefined> {
    const availableCashEntries = await getDbAvailableCashEntries();

    const selectedEntries = selectPayoutCashEntries(value, availableCashEntries);
    if (!selectedEntries) {
        return undefined;
    }

    await performDbPayout(selectedEntries);
    return selectedEntries;
}
