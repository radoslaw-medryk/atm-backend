import Big from "big.js";

export type CashEntry = {
    id: string;
    singleUnitValue: Big;
    count: number;
};
