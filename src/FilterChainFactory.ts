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

    sanitize(options: any): any {
        const sanitized: any = {};

        // Single param assignment to first key
        let inputOptions = options;
        if (
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
            if (firstKey) {
                inputOptions = { [firstKey]: options };
            }
        }

        // Set defaults for all template keys
        for (const key in this.template) {
            if (!this.template.hasOwnProperty(key)) continue;
            const value = inputOptions[key];
            sanitized[key] = value !== undefined ? this.__toArray(value) : [];
        }

        // Include and normalize comps to array if present
        if (inputOptions.comps) {
            sanitized.comps =
                inputOptions.comps instanceof Array
                    ? inputOptions.comps
                    : [inputOptions.comps];
        }

        return sanitized;
    }

    filter(item: any, sanitized: any, caseSensitive = false): boolean {
        for (const key in sanitized) {
            if (!sanitized.hasOwnProperty(key)) continue;
            if (key === "comps") continue; // Skip non-filter keys
            if (sanitized[key].length === 0) continue; // Skip empty filters

            if (typeof this.template[key] === "function") {
                // Custom filter function - pass item and expected value directly
                const fn = this.template[key] as any;
                const expected = sanitized[key][0];
                const match = fn(item, expected);
                if (!match) return false;
            } else {
                // Common mode filter - use itemValue
                let mode = key === "name" || key === "type" ? "exact" : key;
                if (mode in this.commonModes) {
                    const fn = this.commonModes[mode];
                    const itemValue =
                        item[key] !== undefined ? item[key] : item.name;
                    const match = fn(itemValue, sanitized[key], caseSensitive);
                    if (!match) return false;
                } else {
                    continue;
                }
            }
        }
        return true;
    }

    match(item: any, options: any, caseSensitive = false): boolean {
        const sanitized = this.sanitize(options);
        return this.filter(item, sanitized, caseSensitive);
    }

    private __toArray(value: any): any[] {
        if (value instanceof Array) return value;
        if (
            typeof value === "string" ||
            value instanceof RegExp ||
            typeof value === "boolean"
        )
            return [value];
        if (typeof value === "function") return [value];
        return [];
    }
}

export { KT_FilterChainFactory };
