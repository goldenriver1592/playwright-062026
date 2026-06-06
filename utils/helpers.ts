export function isNonEmptyString(v: unknown): boolean {
    return typeof v === 'string' && v.trim().length > 0;
}

export function isPositiveNumber(v: unknown): boolean {
    return typeof v === 'number' && v > 0;
}

export function isNonEmptyArray(v: unknown): boolean {
    return Array.isArray(v) && v.length > 0;
}

export function isNonArrayObject(v: unknown): boolean {
    return (
        v !== null &&
        v !== undefined &&
        typeof v === 'object' &&
        !Array.isArray(v)
    );
}