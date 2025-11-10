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
    includes(searchElement: T, fromIndex?: number): boolean;
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

interface String {
    includes(searchString: string, position?: number): boolean;
    toLowerCase(): string;
    toUpperCase(): string;
}
