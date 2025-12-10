/**
 * Generic path utilities for hierarchical project items.
 *
 * This module provides a robust path system for navigating project structures
 * (like After Effects or Premiere Pro) in a host-agnostic way.
 * Paths use a configurable separator (defaulting to "//") to avoid conflicts.
 */

export interface IPathAdapter<T> {
    separator: string;
    /**
     * Returns true if the item can contain other items (e.g. Folder, Bin).
     */
    isContainer(item: T): boolean;
    /**
     * Returns the name of the item.
     */
    getName(item: T): string;
    /**
     * Returns the parent of the item, or null if it's a root.
     */
    getParent(item: T): T | null;
    /**
     * Returns the children of the item.
     */
    getChildren(item: T): T[];
}

export class KT_ProjectPath<T> {
    private adapter: IPathAdapter<T>;

    constructor(adapter: IPathAdapter<T>) {
        this.adapter = adapter;
    }

    getSeparator = (): string => {
        return this.adapter.separator;
    };

    /**
     * Generates a path string for a given item.
     */
    get = (item: T): string => {
        const parts: string[] = [];
        let current: T | null = item;

        while (current) {
            const parent = this.adapter.getParent(current);
            // If parent is null, current is likely a root, but we usually
            // don't include the root's name in these absolute paths if it represents the "Project" itself.
            // However, the original logic stopped when parent was the Project.
            // We'll rely on the adapter returning null for the parent of the root.

            if (parent) {
                parts.unshift(this.adapter.getName(current));
            }
            current = parent;
        }

        return this.adapter.separator + parts.join(this.adapter.separator);
    };

    join = (...paths: string[]): string => {
        return paths.join(this.adapter.separator);
    };

    traverse = (root: T, callback: (item: T) => void) => {
        if (!this.adapter.isContainer(root)) return;

        const children: T[] = this.adapter.getChildren(root);
        for (const item of children) {
            callback(item);
            if (this.adapter.isContainer(item)) {
                this.traverse(item, callback);
            }
        }
    };

    /**
     * Generic filter method to find items matching a predicate.
     * Replaces specific getComps/getFolders.
     */
    filter = (root: T, predicate: (item: T) => boolean): T[] => {
        const results: T[] = [];
        this.traverse(root, (item) => {
            if (predicate(item)) {
                results.push(item);
            }
        });
        return results;
    };

    parse = (path: string): string[] => {
        const segments = path.split(this.adapter.separator);
        return segments.filter((s) => s.length > 0);
    };

    resolve = (root: T, path: string): T | null => {
        const segments = this.parse(path);
        let current: T = root;

        for (const segment of segments) {
            if (!this.adapter.isContainer(current)) {
                return null;
            }

            const children = this.adapter.getChildren(current);
            const found = children.find(
                (child) => this.adapter.getName(child) === segment
            );

            if (!found) {
                return null;
            }

            current = found;
        }

        return current;
    };

    getParentPath = (path: string): string => {
        const segments = this.parse(path);
        if (segments.length <= 0) {
            return ""; // Root or empty
        }
        segments.pop();
        return this.adapter.separator + segments.join(this.adapter.separator);
    };

    getNameFromPath = (path: string): string => {
        const segments = this.parse(path);
        return segments.length > 0 ? segments[segments.length - 1] : "";
    };

    isAbsolute = (path: string): boolean => {
        return path.indexOf(this.adapter.separator) === 0;
    };

    normalize = (path: string): string => {
        const sep = this.adapter.separator;
        // Remove leading/trailing separators, collapse multiple separators
        let normalized = path.replace(
            new RegExp(sep.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "+", "g"), // Escape regex specials
            sep
        );

        if (normalized.indexOf(sep) === 0) {
            normalized = normalized.slice(sep.length);
        }

        if (normalized.endsWith(sep)) {
            normalized = normalized.slice(0, -sep.length);
        }

        return sep + normalized;
    };

    getRelative = (fromPath: string, toPath: string): string => {
        if (this.isAbsolute(toPath)) {
            return toPath;
        }
        // Assuming fromPath is absolute, we simple append.
        // A more robust implementation would handle .. logic but
        // the original was simple concatenation.
        return (
            fromPath +
            this.adapter.separator +
            this.parse(toPath).join(this.adapter.separator)
        );
    };

    list = (root: T): string[] => {
        const paths: string[] = [];
        this.traverse(root, (item) => {
            paths.push(this.get(item));
        });
        return paths;
    };

    isPath = (path: string): boolean => {
        return path.indexOf(this.adapter.separator) === 0;
    };
}
