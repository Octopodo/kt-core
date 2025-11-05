class KT_StringUtils {
    static startsWith = (
        str: string,
        search: string,
        caseSensitive: boolean
    ): boolean => {
        if (search.length > str.length || search.length === 0) {
            return false;
        }
        const substr = str.substring(0, search.length);
        return caseSensitive
            ? substr === search
            : substr.toLowerCase() === search.toLowerCase();
    };

    static endsWith = (
        str: string,
        search: string,
        caseSensitive: boolean
    ): boolean => {
        if (search.length > str.length || search.length === 0) {
            return false;
        }
        const substr = str.substring(str.length - search.length);
        return caseSensitive
            ? substr === search
            : substr.toLowerCase() === search.toLowerCase();
    };

    static contains = (
        str: string,
        search: string,
        caseSensitive: boolean
    ): boolean => {
        if (search.length === 0 || search.length > str.length) {
            return false;
        }
        const substr = str.substring(0, search.length);
        return caseSensitive
            ? substr === search
            : substr.toLowerCase() === search.toLowerCase();
    };

    static match = (
        str: string,
        search: string,
        caseSensitive: boolean,
        flags?: string
    ): boolean => {
        if (search.length === 0 || search.length > str.length) {
            return false;
        }
        const regexFlags = caseSensitive ? flags || "" : (flags || "") + "i";
        const regex = new RegExp(search, regexFlags);
        return regex.test(str);
    };
}

export { KT_StringUtils };
