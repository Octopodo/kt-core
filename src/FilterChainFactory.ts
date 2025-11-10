// filter-chain-factory.ts
import { KT_StringUtils } from "./stringUtils";

type FilterFn = (
    itemValue: any,
    filters: any[],
    caseSensitive: boolean
) => boolean;

type FilterTemplate = { [key: string]: FilterFn | null | undefined };

class KT_FilterChainFactory {
    private template: FilterTemplate;
    private commonModes: { [mode: string]: FilterFn } = {};

    constructor(template: FilterTemplate) {
        this.template = template;
        this.__initCommonModes();
    }

    private __initCommonModes(): void {
        this.commonModes = {
            exact: (itemValue, filters, caseSensitive) => {
                for (let f = 0; f < filters.length; f++) {
                    const filter = filters[f];
                    if (filter instanceof RegExp) {
                        if (filter.test(itemValue)) return true;
                    } else {
                        const str = filter as string;
                        const lowerItem = caseSensitive
                            ? itemValue
                            : itemValue.toLowerCase();
                        const lowerFilter = caseSensitive
                            ? str
                            : str.toLowerCase();
                        if (lowerItem === lowerFilter) return true;
                    }
                }
                return false;
            },
            startsWith: (itemValue, filters, caseSensitive) => {
                for (let f = 0; f < filters.length; f++) {
                    const filter = filters[f];
                    if (filter instanceof RegExp) {
                        if (filter.test(itemValue)) return true;
                    } else {
                        const str = filter as string;
                        if (
                            KT_StringUtils.startsWith(
                                itemValue,
                                str,
                                caseSensitive
                            )
                        )
                            return true;
                    }
                }
                return false;
            },
            endsWith: (itemValue, filters, caseSensitive) => {
                for (let f = 0; f < filters.length; f++) {
                    const filter = filters[f];
                    if (filter instanceof RegExp) {
                        if (filter.test(itemValue)) return true;
                    } else {
                        const str = filter as string;
                        if (
                            KT_StringUtils.endsWith(
                                itemValue,
                                str,
                                caseSensitive
                            )
                        )
                            return true;
                    }
                }
                return false;
            },
            contains: (itemValue, filters, caseSensitive) => {
                for (let f = 0; f < filters.length; f++) {
                    const filter = filters[f];
                    if (filter instanceof RegExp) {
                        if (filter.test(itemValue)) return true;
                    } else {
                        const str = filter as string;
                        if (
                            KT_StringUtils.contains(
                                itemValue,
                                str,
                                caseSensitive
                            )
                        )
                            return true;
                    }
                }
                return false;
            },
        };
    }

    // ... existing code ...

    sanitize(options: any): any {
        if (!options) return {};

        const sanitized: any = {};
        let inputOptions = options;

        // Single param assignment
        if (typeof options === "number") {
            inputOptions = { id: options };
        } else if (
            typeof options === "string" ||
            options instanceof RegExp ||
            options instanceof Array
        ) {
            let firstKey: string | undefined;
            for (const key in this.template) {
                if (this.template.hasOwnProperty(key)) {
                    firstKey = key;
                    break;
                }
            }
            if (
                typeof options === "string" &&
                KT_StringUtils.startsWith(options, "//", true)
            ) {
                inputOptions = { path: options };
            } else if (firstKey) {
                inputOptions = { [firstKey]: options };
            }
        }

        // Set defaults for all template keys - ensure we're using the corrected inputOptions
        for (const key in this.template) {
            if (!this.template.hasOwnProperty(key)) continue;
            const value = inputOptions[key];
            sanitized[key] =
                value !== undefined && value !== null
                    ? this.__toArray(value)
                    : [];
        }

        // Extract caseSensitive option
        sanitized.caseSensitive = inputOptions.caseSensitive || false;

        return sanitized;
    }

    // ... existing code ...

    filter(item: any, sanitized: any, caseSensitive = false): boolean {
        // Use caseSensitive from sanitized if available, otherwise use parameter
        const useCaseSensitive =
            sanitized.caseSensitive !== undefined
                ? sanitized.caseSensitive
                : caseSensitive;

        for (const key in sanitized) {
            if (!sanitized.hasOwnProperty(key)) continue;
            if (key === "comps" || key === "caseSensitive") continue;
            if (sanitized[key].length === 0) continue;

            if (typeof this.template[key] === "function") {
                // Custom filter - pass entire array, let function decide how to use it
                const fn = this.template[key] as any;
                const match = fn(item, sanitized[key]);
                if (!match) return false;
            } else {
                // Common mode filter
                let mode = key === "name" || key === "type" ? "exact" : key;
                if (mode in this.commonModes) {
                    const fn = this.commonModes[mode];
                    const itemValue =
                        item[key] !== undefined ? item[key] : item.name;
                    const match = fn(
                        itemValue,
                        sanitized[key],
                        useCaseSensitive
                    );
                    if (!match) return false;
                }
            }
        }
        return true;
    }

    // ... existing code ...

    match(item: any, options: any, caseSensitive = false): boolean {
        const sanitized = this.sanitize(options);
        return this.filter(item, sanitized, caseSensitive);
    }

    private __toArray(value: any): any[] {
        if (value instanceof Array) return value;
        if (
            typeof value === "string" ||
            value instanceof RegExp ||
            typeof value === "boolean" ||
            typeof value === "number"
        )
            return [value];
        if (typeof value === "function") return [value];
        return [];
    }
}

export { KT_FilterChainFactory };
