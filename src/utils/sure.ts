export function sure<T>(value: T | null | undefined) {
    if (value == null) {
        throw new Error("value == null");
    }

    return value;
}
