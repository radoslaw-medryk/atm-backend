import Big, { RoundingMode } from "big.js";
import { last } from "../../utils/last";
import { by } from "../../utils/sortBy";
import { CashEntry } from "./models/CashEntry";

type IntermediateCashEntry = {
    index: number;
    id: string;
    singleUnitValue: Big;
    count: number;
};

export function selectPayoutCashEntries(value: Big, availableCashEntries: CashEntry[]): CashEntry[] | undefined {
    const sortedAvailableEntries = availableCashEntries.sort(by(q => q.singleUnitValue, "desc"));

    const selectedEntries: IntermediateCashEntry[] = [];

    while (true) {
        const valueSoFar = getTotalValue(selectedEntries);
        const valueLeft = value.minus(valueSoFar);

        if (valueLeft.eq(0)) {
            return mapResult(selectedEntries);
        }

        const nextSmallerEntry = findNextSmallerCashEntry(sortedAvailableEntries, selectedEntries, valueLeft);
        if (nextSmallerEntry) {
            selectedEntries.push(nextSmallerEntry);
            continue;
        }

        const didBacktrackMofified = backtrackAndModifySelectedEntries(selectedEntries);
        if (!didBacktrackMofified) {
            return undefined;
        }
    }
}

function findNextSmallerCashEntry(
    sortedAvailableEntries: CashEntry[],
    selectedEntries: IntermediateCashEntry[],
    valueLeft: Big
): IntermediateCashEntry | undefined {
    const lastSelectedEntry = last(selectedEntries);
    const lastIndex = lastSelectedEntry ? lastSelectedEntry.index : -1;

    const nextIndex = lastIndex + 1;
    const nextAvailableEntry = sortedAvailableEntries[nextIndex];

    if (nextAvailableEntry) {
        const nextCount = maxPossibleCount(valueLeft, nextAvailableEntry);

        return {
            index: nextIndex,
            id: nextAvailableEntry.id,
            singleUnitValue: nextAvailableEntry.singleUnitValue,
            count: nextCount,
        };
    }

    return undefined;
}

function backtrackAndModifySelectedEntries(selectedEntries: IntermediateCashEntry[]) {
    while (true) {
        const currentClimb = selectedEntries.pop();
        if (!currentClimb) {
            return false;
        }

        if (currentClimb.count > 0) {
            selectedEntries.push({
                index: currentClimb.index,
                id: currentClimb.id,
                singleUnitValue: currentClimb.singleUnitValue,
                count: currentClimb.count - 1,
            });

            return true;
        }
    }
}

function mapResult(selectedEntries: IntermediateCashEntry[]): CashEntry[] {
    return selectedEntries
        .map(q => ({
            id: q.id,
            singleUnitValue: q.singleUnitValue,
            count: q.count,
        }))
        .filter(q => q.count > 0);
}

function getTotalValue(entries: IntermediateCashEntry[]): Big {
    return entries.reduce((sum, curr) => {
        const value = curr.singleUnitValue.mul(curr.count);
        return sum.plus(value);
    }, new Big(0));
}

function maxPossibleCount(valueLeft: Big, nextAvailableEntry: CashEntry): number {
    const maxOptimisticCount = valueLeft
        .div(nextAvailableEntry.singleUnitValue)
        .round(0, RoundingMode.RoundDown)
        .toNumber();

    return Math.min(maxOptimisticCount, nextAvailableEntry.count);
}
