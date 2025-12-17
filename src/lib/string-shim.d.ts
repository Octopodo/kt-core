interface String {
    includes(searchString: string, position?: number): boolean;
    startsWith(searchString: string, position?: number): boolean;
    endsWith(searchString: string, position?: number): boolean;
    toLowerCase(): string;
    toUpperCase(): string;
}
