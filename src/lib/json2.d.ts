//@ts-ignore
declare var JSON: {
    stringify(
        object: object,
        replacer?:
            | ((key: string, value: any) => any)
            | (string | number)[]
            | null,
        space?: string | number
    ): string;
    parse(string: string): object;
};
