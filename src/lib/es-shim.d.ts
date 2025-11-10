interface Array<T> {
    forEach(
        callback: (element: T, index: number, array: T[]) => void,
        thisArg?: any
    ): void;

    map<U>(
        callback: (element: T, index: number, array: T[]) => U,
        thisArg?: any
    ): U[];

    indexOf(searchElement: T, fromIndex?: number): number;
    isArray(arg: any): arg is T[];
}

interface ObjectConstructor {
    keys<T extends object>(obj: T): (keyof T)[];

    getOwnPropertyDescriptor<T extends object>(
        obj: T,
        prop: PropertyKey
    ): PropertyDescriptor | undefined;
}
