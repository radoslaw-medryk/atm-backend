import Big, { RoundingMode } from "big.js";
import { AvailableMoney } from "../db/models/AvailableMoney";
import { IdAndAmount } from "../db/models/IdAndAmount";
import { last } from "../utils/last";
import { by } from "../utils/sortBy";
import { sure } from "../utils/sure";

type StepIndexAndAmount = {
    index: number;
    money: AvailableMoney;
    count: number;
};

export function selectPayoutMoney(value: Big, availableMoney: AvailableMoney[]): IdAndAmount[] | undefined {
    const sortedAvailableMoney = availableMoney.sort(by(q => q.value, "desc"));

    const selectedMoney: StepIndexAndAmount[] = [];

    while (true) {
        const valueSoFar = getTotalValue(selectedMoney);
        const valueLeft = value.minus(valueSoFar);

        if (valueLeft.eq(0)) {
            return mapResult(sortedAvailableMoney, selectedMoney);
        }

        const lastSelected = last(selectedMoney);
        const lastIndex = lastSelected ? lastSelected.index : -1;

        const currIndex = lastIndex + 1;
        const currMoney = sortedAvailableMoney[currIndex];

        if (currMoney) {
            const currCount = maxPossibleCount(valueLeft, currMoney);

            selectedMoney.push({
                index: currIndex,
                money: currMoney,
                count: currCount,
            });
            continue;
        }

        while (true) {
            const currentClimb = selectedMoney.pop();
            if (!currentClimb) {
                return undefined;
            }

            if (currentClimb.count > 0) {
                selectedMoney.push({
                    index: currentClimb.index,
                    money: currentClimb.money,
                    count: currentClimb.count - 1,
                });
                break;
            }
        }
    }
}

function mapResult(sortedAvailableMoney: AvailableMoney[], selectedMoney: StepIndexAndAmount[]): IdAndAmount[] {
    return selectedMoney
        .map(q => ({
            id: sure(sortedAvailableMoney[q.index]).id,
            amount: q.count,
        }))
        .filter(q => q.amount > 0);
}

function getTotalValue(selectedMoney: StepIndexAndAmount[]): Big {
    return selectedMoney.reduce((sum, curr) => {
        const value = curr.money.value.mul(curr.count);
        return sum.plus(value);
    }, new Big(0));
}

function maxPossibleCount(valueLeft: Big, currMoney: AvailableMoney): number {
    const maxOptimisticCount = valueLeft.div(currMoney.value).round(0, RoundingMode.RoundDown).toNumber();
    return Math.min(maxOptimisticCount, currMoney.amount);
}
