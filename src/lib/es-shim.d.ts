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
}

interface ArrayConstructor {
    isArray(arg: any): arg is any[];
}

interface Object {
    hasOwnProperty(prop: PropertyKey): boolean;
}
interface ObjectConstructor {
    keys<T extends object>(obj: T): (keyof T)[];

    getOwnPropertyDescriptor<T extends object>(
        obj: T,
        prop: PropertyKey
    ): PropertyDescriptor | undefined;
}
