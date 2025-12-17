interface Object {
    hasOwnProperty(prop: PropertyKey): boolean;
}
interface ObjectConstructor {
    keys<T extends object>(obj: T): (keyof T)[];
    values<T extends object>(obj: T): T[keyof T][];

    getOwnPropertyDescriptor<T extends object>(
        obj: T,
        prop: PropertyKey
    ): PropertyDescriptor | undefined;
}
