import { KT_ProjectPath as KT_Path } from "./path";

export interface ICacheItem {
    id: number | string;
    name: string;
}

/**
 * Generic Cache Store that maintains indices for ID, Name, and Path.
 */
export class KT_CacheStore<T extends ICacheItem> {
    private _byId: { [key: string]: T } = {};
    private _byName: { [key: string]: T[] } = {};
    private _byPath: { [key: string]: T } = {};
    private _pathsById: { [key: string]: string } = {}; // Inverse index for O(1) path retrieval
    private _items: T[] = [];

    // Optimization for RegExp search
    private _allNamesString: string = "";
    private static readonly SEPARATOR = "\n"; // Use newline for multiline regex support

    private pathUtils: KT_Path<T>;

    constructor(pathUtils: KT_Path<T>) {
        this.pathUtils = pathUtils;
    }

    /**
     * Adds an item to the cache.
     * @param item The item to add.
     * @param knownPath Optional pre-calculated path. If omitted, it will be calculated.
     */
    add(item: T, knownPath?: string) {
        // Use known path if provided (scan optimization), else calculate it
        const path = knownPath || this.pathUtils.get(item);

        const idStr = item.id.toString();

        //Check if item already exists
        if (this._byId[idStr]) {
            return;
        }

        this._items.push(item);

        // ID Index
        this._byId[idStr] = item;

        // Name Index
        if (!this._byName[item.name]) {
            this._byName[item.name] = [];
            // Sanitize name to remove newlines if any, to preserve integrity
            const safeName = item.name.replace(/\n/g, "");
            // Only append to string if it's a new name
            this._allNamesString +=
                KT_CacheStore.SEPARATOR + safeName + KT_CacheStore.SEPARATOR;
        }
        this._byName[item.name].push(item);

        // Path Index
        this._byPath[path] = item;
        this._pathsById[idStr] = path;
    }

    remove(item: T) {
        const idStr = item.id.toString();

        // Remove from items array
        for (let i = 0; i < this._items.length; i++) {
            if (this._items[i].id.toString() === idStr) {
                this._items.splice(i, 1);
                break;
            }
        }

        // Remove from ID Index
        delete this._byId[idStr];

        // Remove from Path Index
        // Use our internal index for O(1) access
        const path = this._pathsById[idStr] || this.pathUtils.get(item);

        if (this._byPath[path] && this._byPath[path].id.toString() === idStr) {
            delete this._byPath[path];
        }
        delete this._pathsById[idStr];

        // Remove from Name Index
        if (this._byName[item.name]) {
            const arr = this._byName[item.name];
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].id.toString() === idStr) {
                    arr.splice(i, 1);
                    break;
                }
            }
            // Logic to clean up _allNamesString if name is no longer used
            if (arr.length === 0) {
                delete this._byName[item.name];
                const safeName = item.name.replace(/\n/g, "");
                const strToRemove =
                    KT_CacheStore.SEPARATOR +
                    safeName +
                    KT_CacheStore.SEPARATOR;
                // We use split/join to remove all occurrences
                this._allNamesString = this._allNamesString
                    .split(strToRemove)
                    .join("");
            }
        }
    }

    /**
     * Updates an item in the cache.
     * Handles path changes efficiently using the internal index.
     */
    update(item: T, newPath?: string) {
        const idStr = item.id.toString();
        const oldPath = this._pathsById[idStr];
        const path = newPath || this.pathUtils.get(item);

        if (oldPath !== path) {
            if (oldPath && this._byPath[oldPath]) delete this._byPath[oldPath];
            this._byPath[path] = item;
            this._pathsById[idStr] = path;
        }
    }

    /**
     * Efficiently updates paths for items starting with a specific prefix.
     * Used for cascading folder moves.
     */
    renamePathPrefix(oldPrefix: string, newPrefix: string) {
        for (const path in this._byPath) {
            if (this._byPath.hasOwnProperty(path)) {
                if (path.indexOf(oldPrefix) === 0) {
                    const item = this._byPath[path];
                    const suffix = path.substring(oldPrefix.length);
                    const newPath = newPrefix + suffix;

                    delete this._byPath[path];
                    this._byPath[newPath] = item;
                    this._pathsById[item.id.toString()] = newPath;
                }
            }
        }
    }
    rename(item: T, newName: string) {
        const idStr = item.id.toString();
        const oldPath = this._pathsById[idStr];
        if (!oldPath) return;

        const oldName = this.pathUtils.getName(oldPath);
        if (oldName === newName) return;

        // Update Name Index
        if (this._byName[oldName]) {
            const arr = this._byName[oldName];
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].id.toString() === idStr) {
                    arr.splice(i, 1);
                    break;
                }
            }
            if (arr.length === 0) {
                delete this._byName[oldName];
                const safeName = oldName.replace(/\n/g, "");
                const strToRemove =
                    KT_CacheStore.SEPARATOR +
                    safeName +
                    KT_CacheStore.SEPARATOR;
                this._allNamesString = this._allNamesString
                    .split(strToRemove)
                    .join("");
            }
        }

        if (!this._byName[newName]) {
            this._byName[newName] = [];
            const safeName = newName.replace(/\n/g, "");
            this._allNamesString +=
                KT_CacheStore.SEPARATOR + safeName + KT_CacheStore.SEPARATOR;
        }
        this._byName[newName].push(item);

        // Update Path Index
        const parentPath = this.pathUtils.getParentPath(oldPath);
        const separator = this.pathUtils.getSeparator();
        const newPath = parentPath
            ? parentPath + separator + newName
            : separator + newName;

        if (this._byPath[oldPath]) delete this._byPath[oldPath];
        this._byPath[newPath] = item;
        this._pathsById[idStr] = newPath;

        // Cascade
        if (this.pathUtils.isContainer(item)) {
            const oldPrefix = oldPath + separator;
            const newPrefix = newPath + separator;
            this.renamePathPrefix(oldPrefix, newPrefix);
        }
    }

    getPathById(id: number | string): string | undefined {
        return this._pathsById[id.toString()];
    }

    clear() {
        this._byId = {};
        this._byName = {};
        this._byPath = {};
        this._pathsById = {};
        this._items = [];
        this._allNamesString = "";
    }

    getById(id: number | string): T | undefined {
        return this._byId[id.toString()];
    }

    getByName(name: string): T[] {
        return this._byName[name] || [];
    }

    getByPath(path: string): T | undefined {
        return this._byPath[path];
    }

    getByRegExp(regex: RegExp): T[] {
        const matches: T[] = [];
        // ExtendScript doesn't support Set, use object for uniqueness
        const uniqueNames: { [key: string]: boolean } = {};

        // ExtendScript RegExp doesn't have .flags property
        // We force 'g' (global) for iteration and 'm' (multiline) so ^$ work per line
        // . won't match \n, preventing catastrophic backtracking across names
        let flags = "gm";
        // We force 'i' (case-insensitive) for matching
        // @ts-ignore
        if (regex.ignoreCase) flags += "i";

        // @ts-ignore
        const globalRegex = new RegExp(regex.source, flags);

        // If the regex matches empty string, we need to prevent infinite loop manually if engine doesn't handle it
        // But with 'match' logic we rely on valid matches.

        let match;
        // Limit iterations to prevent infinite loops in case of weird regex behavior in ES3
        let safetyCounter = 0;
        const maxIterations = 100000;

        while ((match = globalRegex.exec(this._allNamesString)) !== null) {
            if (safetyCounter++ > maxIterations) break; // Emergency break

            // Ensure we advance if match is empty (though should not happen with useful regexes)
            // @ts-ignore
            if (match.index === globalRegex.lastIndex) {
                // @ts-ignore
                globalRegex.lastIndex++;
            }

            const matchIndex = match.index;

            // Find start separator (search backwards from matchIndex)
            const startSepIndex = this._allNamesString.lastIndexOf(
                KT_CacheStore.SEPARATOR,
                matchIndex
            );

            // Find end separator (search forwards from matchIndex)
            // Note: We search from matchIndex to ensure we find the newline AFTER the match start
            // If match contains newline (unlikely with .), we still want the binding newlines
            const endSepIndex = this._allNamesString.indexOf(
                KT_CacheStore.SEPARATOR,
                matchIndex
            );

            if (startSepIndex !== -1 && endSepIndex !== -1) {
                // Extract name (excluding separators)
                const name = this._allNamesString.substring(
                    startSepIndex + 1,
                    endSepIndex
                );

                // Double check if name is valid and not empty (e.g. if we matched between double separators)
                if (name && !uniqueNames[name]) {
                    uniqueNames[name] = true;
                    const items = this.getByName(name);
                    for (let i = 0; i < items.length; i++) {
                        matches.push(items[i]);
                    }
                }
            }
        }

        return matches;
    }

    getAll(): T[] {
        return this._items;
    }
}

export class KT_LazyCache<T extends ICacheItem> {
    // Global Cache
    readonly allItems: KT_CacheStore<T>;

    // Sub-Caches Config
    readonly subCaches: { [name: string]: KT_CacheStore<T> } = {};
    private readonly checkers: { [name: string]: (item: T) => boolean };

    // Dependencies
    private pathUtils: KT_Path<T>;

    private _initialized: boolean = false;

    // This needs to be implemented by the host specific logic or passed as a callback
    // because numItems and scanning logic is host specific.
    private _getProjectRoot: () => T;
    private _getNumItems: () => number;

    // Use a tracker to know when to rescan
    private _projectItemCount: number = 0;

    constructor(
        pathUtils: KT_Path<T>,
        checkers: { [name: string]: (item: T) => boolean },
        getProjectRoot: () => T,
        getNumItems: () => number
    ) {
        this.pathUtils = pathUtils;
        this.checkers = checkers;
        this._getProjectRoot = getProjectRoot;
        this._getNumItems = getNumItems;

        this.allItems = new KT_CacheStore<T>(pathUtils);

        // Initialize sub-caches
        for (const key in checkers) {
            if (checkers.hasOwnProperty(key)) {
                this.subCaches[key] = new KT_CacheStore<T>(pathUtils);
            }
        }
    }

    /**
     * Accessor for sub-caches
     */
    get(cacheName: string): KT_CacheStore<T> | undefined {
        return this.subCaches[cacheName];
    }

    init = (force: boolean = false): void => {
        const currentCount = this._getNumItems();
        if (
            !this._initialized ||
            force ||
            currentCount !== this._projectItemCount
        ) {
            this.scan();
        }
    };

    /**
     * Adds an item to the cache externally.
     * Useful when creating new items without rescanning.
     */
    add = (item: T, knownPath?: string): void => {
        if (!this._initialized) {
            this.scan();
            return;
        }

        // We delegate path calculation to the CacheStore entirely
        // KT_CacheStore.add will call pathUtils.get(item) since we pass no 2nd arg

        // Add to global cache
        this.allItems.add(item, knownPath);

        // Add to specific caches based on checkers
        for (const key in this.checkers) {
            if (this.checkers.hasOwnProperty(key)) {
                if (this.checkers[key](item)) {
                    this.subCaches[key].add(item, knownPath);
                }
            }
        }
    };

    /**
     * Removes an item from the cache externally.
     */
    remove = (item: T): void => {
        if (!this._initialized) return;

        // Remove from global cache
        this.allItems.remove(item);

        // Remove from specific caches
        for (const key in this.subCaches) {
            // We don't check for existence/checker match for removal efficiency,
            // just try to remove. The generic store handles missing items gracefully.
            this.subCaches[key].remove(item);
        }
    };

    /**
     * Updates an item in the cache.
     * Efficiently handles path changes, including cascading updates for folders.
     */
    update = (items: T[] | T): void => {
        if (!this._initialized) return;

        if (!Array.isArray(items)) items = [items];
        //@ts-ignore
        for (const item of items) {
            this.singleUpdate(item);
        }
    };
    /**
     * Updates an item in the cache.
     * Efficiently handles path changes, including cascading updates for folders.
     */
    singleUpdate = (item: T): void => {
        if (!this._initialized) return;

        const newPath = this.pathUtils.get(item);
        const oldPath = this.allItems.getPathById(item.id.toString());

        // Perform updates only if we have a valid path change
        if (oldPath && newPath && oldPath !== newPath) {
            this.allItems.update(item, newPath);

            // Sub-cache updates
            // We iterate all sub-caches to ensure consistency
            for (const key in this.subCaches) {
                if (
                    this.checkers[key](item) ||
                    this.subCaches[key].getById(item.id.toString())
                ) {
                    this.subCaches[key].update(item, newPath);
                }
            }

            // FOLDER MOVE CASCADE
            // If the item acts as a container, its move affects its children paths
            if (this.pathUtils.isContainer(item)) {
                const separator = this.pathUtils.getSeparator();
                const oldPrefix = oldPath + separator;
                const newPrefix = newPath + separator;

                // Update all stores
                this.allItems.renamePathPrefix(oldPrefix, newPrefix);

                for (const key in this.subCaches) {
                    this.subCaches[key].renamePathPrefix(oldPrefix, newPrefix);
                }
            }
        }
    };

    /**
     * Renames an item in the cache.
     * Updates indices and handles cascading path changes.
     */
    rename = (item: T, newName: string): void => {
        if (!this._initialized) return;

        this.allItems.rename(item, newName);

        for (const key in this.subCaches) {
            if (this.subCaches[key].getById(item.id.toString())) {
                this.subCaches[key].rename(item, newName);
            }
        }
    };

    clear = (): void => {
        this.allItems.clear();
        for (const key in this.subCaches) {
            this.subCaches[key].clear();
        }
        this._initialized = false;
        this._projectItemCount = 0;
    };

    refresh = (): void => {
        this.scan();
    };

    scan = (): void => {
        this.clear();
        const root = this._getProjectRoot();
        this._initialized = true;
        try {
            this._scanRecursive(root);

            this._projectItemCount = this._getNumItems();
        } catch (error) {
            $.writeln("Error scanning project: " + error);
            this._initialized = false;
        }
    };

    private _scanRecursive = (container: T) => {
        const children = this.pathUtils.getChildren(container);

        //@ts-ignore
        for (const item of children) {
            const itemPath = this.pathUtils.get(item);
            this.add(item, itemPath);

            if (this.pathUtils.isContainer(item)) {
                this._scanRecursive(item);
            }
        }
    };
}
