import { CashEntry } from "../../../logic/models/CashEntry";

export type PostPayoutsResponse = {
    entries: CashEntry[] | undefined;
};
