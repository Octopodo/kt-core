import ts from "typescript";

class KT_StringUtils {
    // Helper function to extract flags from RegExp as string (compatible with ExtendScript)
    private static getFlags(reg: RegExp): string {
        return (
            // @ts-ignore
            (reg.global ? "g" : "") +
            // @ts-ignore
            (reg.ignoreCase ? "i" : "") +
            // @ts-ignore
            (reg.multiline ? "m" : "")
        );
    }

    // Helper function to create RegExp from string or RegExp, handling anchors and case sensitivity
    private static createRegExp(
        search: string | RegExp,
        caseSensitive: boolean,
        anchor: "start" | "end" | "exact" | "none" = "none"
    ): RegExp {
        let pattern: string;
        let flags: string = "";

        if (typeof search === "string") {
            // Escape special regex characters in string
            pattern = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            flags = caseSensitive ? "" : "i";
        } else {
            // search is RegExp
            // @ts-ignore
            pattern = search.source;
            flags = KT_StringUtils.getFlags(search);
            if (!caseSensitive && !KT_StringUtils.contains(flags, "i")) {
                flags += "i";
            }
        }

        // Add anchor based on type
        switch (anchor) {
            case "start":
                pattern = "^" + pattern;
                break;
            case "end":
                pattern = pattern + "$";
                break;
            case "exact":
                pattern = "^" + pattern + "$";
                break;
            case "none":
            default:
                // No anchor for contains/match
                break;
        }

        return new RegExp(pattern, flags);
    }

    static startsWith = (
        str: string,
        search: string | RegExp,
        caseSensitive: boolean = true
    ): boolean => {
        if (
            typeof search === "string" &&
            (search.length > str.length || search.length === 0)
        ) {
            return false;
        }
        const regex = KT_StringUtils.createRegExp(
            search,
            caseSensitive,
            "start"
        );
        return regex.test(str);
    };

    static endsWith = (
        str: string,
        search: string | RegExp,
        caseSensitive: boolean = true
    ): boolean => {
        if (
            typeof search === "string" &&
            (search.length > str.length || search.length === 0)
        ) {
            return false;
        }
        const regex = KT_StringUtils.createRegExp(search, caseSensitive, "end");
        return regex.test(str);
    };

    static contains = (
        str: string,
        search: string | RegExp,
        caseSensitive: boolean = true
    ): boolean => {
        if (
            typeof search === "string" &&
            (search.length === 0 || search.length > str.length)
        ) {
            return false;
        }
        const regex = KT_StringUtils.createRegExp(
            search,
            caseSensitive,
            "none"
        );
        return regex.test(str);
    };

    static match = (
        str: string,
        search: string | RegExp,
        caseSensitive: boolean = true,
        flags?: string
    ): boolean => {
        if (
            typeof search === "string" &&
            (search.length === 0 || search.length > str.length)
        ) {
            return false;
        }
        // For match, use 'none' anchor and combine additional flags
        let regex: RegExp;
        if (typeof search === "string") {
            const combinedFlags = caseSensitive
                ? flags || ""
                : (flags || "") + "i";
            regex = new RegExp(search, combinedFlags);
        } else {
            let combinedFlags = KT_StringUtils.getFlags(search);
            if (
                !caseSensitive &&
                !KT_StringUtils.contains(combinedFlags, "i")
            ) {
                combinedFlags += "i";
            }
            if (flags) {
                combinedFlags += flags;
            }
            // @ts-ignore
            regex = new RegExp(search.source, combinedFlags);
        }
        return regex.test(str);
    };

    static equals = (
        str1: string,
        search: string | RegExp,
        caseSensitive: boolean = true
    ): boolean => {
        if (typeof search === "string" && str1.length !== search.length) {
            return false;
        }
        const regex = KT_StringUtils.createRegExp(
            search,
            caseSensitive,
            "exact"
        );
        return regex.test(str1);
    };
}

export { KT_StringUtils };
