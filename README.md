# atm project

A simple project imitating a backend REST API for an ATM.

### How to run

- Clone the repo
- `npm install`
- `npm run db` (requires Docker, leave terminal open)
- `npm run start` (in a new Terminal window)

The `DB_INIT_DUMMY_DATA` flag is set to `true` by default when running locally. It will initialise the DB to the folowwing available cash entries:

- `$1000` x 1
- `$500` x 2
- `$200` x 10
- `$100` x 0
- `$50` x 0
- `$20` x 10
- `$10` x 10
- `$5` x 0
- `$2` x 10
- `$1` x 0

### Technologies used

This project is a standalone REST API server built using Node + Typescript. It connects to an PostgreSQL database. Some of the 3rd party libraries used:
- `koa` - as an API framework
- `slonik` - PostgreSQL client
- `big.js` - For hanling decimal precision numbers
- a few more small library and helpers

### Concurrency safety

The project ensures concurrency safety (i.e. when multiple payout operations are performed concurrently and compete for the limited amount of bills/coins). The project ensures there are no unexpected results (e.g. negative amount of bills/coins left, etc.) by relying on PostgreSQL function's transactional nature.

The payout operation consists of 3 steps:
- get available coins/bills amounts from the DB;
- in code, find the desired combination of coins&bills to withdraw;
- transactionally substract the amounts from the DB. If concurrent operation modified them to the point where there is no enough coins/bills to satisfy the payout, transaction is reverted and exception raised.

### Tests, linting & prettier

This project is set up with Unit Tests using `jest`, Linting with `eslint` and `prettier` for formatting the code.

To run all the checks:
- `npm run build`
- `npm run lint`
- `npm run test`

### Exposed endpoints

##### Request:
```
POST localhost:5000/payouts
{
     "value": "2000"
}
```

##### Response:
```
{
    "selectedEntries": [
        {
            "id": "1000",
            "singleUnitValue": "1000",
            "count": 1
        },
        {
            "id": "500",
            "singleUnitValue": "500",
            "count": 2
        }
    ]
}
```

### Notes

I have realised an edge case when the algorithm fails to select the optimal solution (the least number of banknotes/coins). I have expressed it as a Unit test that fails right now `Can give up on some big value bills to achieve overall optimaly low number of bills/coins`.

I have found descriptions of this problem with more description and example algorithms, e.g. here:

https://en.wikipedia.org/wiki/Change-making_problem

Given limited time resources I didn't have a chance to make the fixes yet.