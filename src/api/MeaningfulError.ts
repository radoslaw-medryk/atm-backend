import { isType } from "verifica-ts";

export class MeaningfulError extends Error {
    status: number;
    expose: boolean;

    constructor(status: number, expose: boolean, message?: string) {
        super(message);
        Object.setPrototypeOf(this, MeaningfulError);

        this.status = status;
        this.expose = expose;
    }
}

export const isMeaningfulError = isType<MeaningfulError>();
