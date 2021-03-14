import { isType } from "verifica-ts";

export type PostPayoutsRequest = {
    value: string;
};

export const isPostPayoutsRequest = isType<PostPayoutsRequest>();
