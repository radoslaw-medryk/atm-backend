import { isType } from "verifica-ts";

export type MeaningfulError = {
    status: number;
    expose: boolean;
    message?: string;
};

export const isMeaningfulError = isType<MeaningfulError>();
