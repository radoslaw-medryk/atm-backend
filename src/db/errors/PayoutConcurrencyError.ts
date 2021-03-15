export class PayoutConcurrencyError extends Error {
    constructor() {
        super("PayoutConcurrencyError");
        Object.setPrototypeOf(this, PayoutConcurrencyError);
    }
}
