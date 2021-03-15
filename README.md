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
