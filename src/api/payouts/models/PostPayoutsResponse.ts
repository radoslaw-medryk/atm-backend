import { CashEntry } from "../../../logic/payouts/models/CashEntry";

export type PostPayoutsResponse = {
    selectedEntries: CashEntry[] | undefined;
};
