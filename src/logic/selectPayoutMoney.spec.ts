import Big from "big.js";
import { AvailableMoney } from "../db/models/AvailableMoney";
import { IdAndAmount } from "../db/models/IdAndAmount";
import { selectPayoutMoney } from "./selectPayoutMoney";

type TestIdAndCount = [string, number];

type TestCase = {
    value: Big;
    available: TestIdAndCount[];
    expected: TestIdAndCount[] | undefined;
};

describe("selectPayoutMoney", () => {
    test(
        `Returns undefined when nothing available`,
        testCase({
            value: new Big(1100),
            available: [],
            expected: undefined,
        })
    );

    test(
        `Returns undefined when completely out of bills`,
        testCase({
            value: new Big(1100),
            available: [
                ["1000", 0],
                ["100", 0],
            ],
            expected: undefined,
        })
    );

    test(
        `Returns undefined when withdrawing impossible`,
        testCase({
            value: new Big(101),
            available: [
                ["100", 1],
                ["2", 1],
            ],
            expected: undefined,
        })
    );

    test(
        `Returns empty array when nothing to withdraw`,
        testCase({
            value: new Big(0),
            available: [["1000", 1]],
            expected: [],
        })
    );

    test(
        `Preffers bigger bills`,
        testCase({
            value: new Big(1000),
            available: [
                ["1000", 1],
                ["500", 2],
            ],
            expected: [["1000", 1]],
        })
    );

    test(
        `Combines bill types to match expected amount, preffering bigger bills`,
        testCase({
            value: new Big(2000),
            available: [
                ["1000", 1],
                ["500", 4],
            ],
            expected: [
                ["1000", 1],
                ["500", 2],
            ],
        })
    );

    test(
        `Handles when some of the 'most easy' possibility's payout bills are not enough and finds another possibility`,
        testCase({
            value: new Big(2100),
            available: [
                ["1000", 1],
                ["500", 4],
                ["200", 5],
                ["100", 0],
            ],
            expected: [
                ["1000", 1],
                ["500", 1],
                ["200", 3],
            ],
        })
    );

    test(
        `Handles fractions`,
        testCase({
            value: new Big("1000.02"),
            available: [
                ["1000", 1],
                ["500", 4],
                ["200", 5],
                ["100", 0],
                ["0.01", 10],
            ],
            expected: [
                ["1000", 1],
                ["0.01", 2],
            ],
        })
    );
});

function testCase(testCase: TestCase) {
    return () => {
        const availableMoney = testCase.available.map(mapAvailableMoney);
        const expected = testCase.expected && testCase.expected.map(mapIdAndCount);

        const actual = selectPayoutMoney(testCase.value, availableMoney);

        expect(actual).toEqual(expected);
    };
}

function mapAvailableMoney(input: TestIdAndCount): AvailableMoney {
    return {
        id: input[0],
        value: new Big(input[0]),
        amount: input[1],
    };
}

function mapIdAndCount(input: TestIdAndCount): IdAndAmount {
    return {
        id: input[0],
        amount: input[1],
    };
}
