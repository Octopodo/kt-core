interface Array<T> {
    forEach(
        callback: (element: T, index: number, array: T[]) => void,
        thisArg?: any
    ): void;

    map<U>(
        callback: (element: T, index: number, array: T[]) => U,
        thisArg?: any
    ): U[];
    filter(
        callback: (element: T, index: number, array: T[]) => boolean,
        thisArg?: any
    ): T[];
    every(
        callback: (element: T, index: number, array: T[]) => boolean,
        thisArg?: any
    ): boolean;

    indexOf(searchElement: T, fromIndex?: number): number;
    includes(searchElement: T, fromIndex?: number): boolean;
    find(
        predicate: (element: T, index: number, array: T[]) => boolean,
        thisArg?: any
    ): T | undefined;
    some(
        predicate: (element: T, index: number, array: T[]) => boolean,
        thisArg?: any
    ): boolean;
}

interface ArrayConstructor {
    isArray(arg: any): arg is any[];
    from<T>(iterable: ArrayLike<T>): T[];
}
