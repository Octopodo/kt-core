# KT_Path

Generic path utilities for hierarchical project structures in Adobe Creative Suite applications.

## Overview

The KT_Path module provides a host-agnostic path system for navigating project hierarchies in Adobe applications. It uses the **Adapter Pattern** to abstract away differences between After Effects, Premiere Pro, and other Creative Suite applications, providing a unified interface for path operations.

## How It Works

### The Adapter Pattern

The core concept is the `KT_IPathAdapter<T>` interface, which defines how to interact with project items in a specific Adobe application:

```typescript
interface KT_IPathAdapter<T> {
    separator: string; // Path separator (e.g., "//" for AE)
    isContainer(item: T): boolean; // Can this item have children?
    getName(item: T): string; // Get item's display name
    getParent(item: T): T | null; // Get parent item or null for root
    getChildren(item: T): T[]; // Get child items
}
```

### Path Generation Algorithm

The `KT_ProjectPath<T>` class generates absolute paths by walking up the hierarchy:

```typescript
// For an After Effects item: Project/Folder1/Comp1
// Path generation walks UP from item to root:
// 1. Comp1 (child of Folder1)
// 2. Folder1 (child of Project)
// 3. Project (root)
// Result: "//Folder1//Comp1" (separator = "//")
```

### Why Custom Adapters Are Required

Each Adobe application has different APIs and data structures:

**After Effects:**

- Items: `CompItem`, `FootageItem`, `FolderItem`
- Hierarchy: `app.project.rootFolder` → nested folders → items
- Container check: `item.typeName === "Folder"`

**Premiere Pro:**

- Items: Sequences, clips, bins
- Hierarchy: `app.project.rootItem` → bins → clips
- Container check: `item.type === "Bin"`

## Architecture

### Core Components

| Component            | Purpose                                     |
| -------------------- | ------------------------------------------- |
| `KT_IPathAdapter<T>` | Interface defining host-specific operations |
| `KT_ProjectPath<T>`  | Generic path utilities using an adapter     |

### Path Structure

Paths use configurable separators to avoid conflicts with file system paths:

```typescript
// After Effects (default separator: "//")
const aePath = "//Project//Comps//Main_Comp";

// Premiere Pro (could use "/" or custom separator)
const prPath = "/Project/Sequences/Final_Cut";
```

## API Reference

### KT_IPathAdapter<T> Interface

Host-specific adapter interface that must be implemented for each Adobe application.

```typescript
interface KT_IPathAdapter<T> {
    separator: string;
    isContainer(item: T): boolean;
    getName(item: T): string;
    getParent(item: T): T | null;
    getChildren(item: T): T[];
}
```

**Required Methods:**

# `separator: string`

The path separator string. Should be unique to avoid conflicts:

- After Effects: `"//"` (double slash)
- Premiere Pro: `"/"` (single slash) or custom

# `isContainer(item: T): boolean`

Determines if an item can contain other items (folders, bins, etc.).

```typescript
// After Effects implementation
isContainer(item: _ItemClasses): boolean {
    return item.typeName === "Folder";
}

// Premiere Pro implementation
isContainer(item: any): boolean {
    return item.type === "Bin";
}
```

# `getName(item: T): string`

Returns the display name of the item.

```typescript
// After Effects
getName(item: _ItemClasses): string {
    return item.name;
}
```

# `getParent(item: T): T | null`

Returns the parent item, or `null` for root items.

```typescript
// After Effects
getParent(item: _ItemClasses): _ItemClasses | null {
    return item.parentFolder;
}
```

# `getChildren(item: T): T[]`

Returns all direct children of the item.

```typescript
// After Effects
getChildren(item: _ItemClasses): _ItemClasses[] {
    if (item.typeName !== "Folder") return [];
    const children: _ItemClasses[] = [];
    for (let i = 1; i <= item.items.length; i++) {
        children.push(item.items[i]);
    }
    return children;
}
```

### KT_ProjectPath<T> Class

Generic path utilities that work with any adapter implementation.

#### Constructor

```typescript
constructor(adapter: KT_IPathAdapter<T>)
```

**Parameters:**

| Parameter | Type                 | Description                          |
| --------- | -------------------- | ------------------------------------ |
| `adapter` | `KT_IPathAdapter<T>` | Host-specific adapter implementation |

#### Methods

# ⚙️ `get(item: T): string`

Generates an absolute path for the given item.

```typescript
const path = pathUtils.get(compItem);
// Returns: "//Comps//Main_Comp"
```

# ⚙️ `join(...paths: string[]): string`

Joins path segments using the adapter's separator.

```typescript
const fullPath = pathUtils.join("Comps", "Main_Comp");
// Returns: "Comps//Main_Comp"
```

# ⚙️ `resolve(root: T, path: string): T | null`

Resolves a path string to an actual item, starting from root.

```typescript
const item = pathUtils.resolve(rootFolder, "//Comps//Main_Comp");
// Returns: CompItem or null if not found
```

# ⚙️ `getParentPath(path: string): string`

Extracts the parent path from a full path.

```typescript
const parent = pathUtils.getParentPath("//Comps//Main_Comp");
// Returns: "//Comps"
```

# ⚙️ `getName(path: string): string`

Extracts the item name from a path.

```typescript
const name = pathUtils.getName("//Comps//Main_Comp");
// Returns: "Main_Comp"
```

# ⚙️ `traverse(root: T, callback: (item: T) => void): void`

Recursively traverses all items starting from root.

```typescript
pathUtils.traverse(rootFolder, (item) => {
    console.log(pathUtils.get(item));
});
// Visits every item in the project hierarchy
```

# ⚙️ `filter(root: T, predicate: (item: T) => boolean): T[]`

Finds all items matching a predicate.

```typescript
const comps = pathUtils.filter(
    rootFolder,
    (item) => item.typeName === "Composition"
);
// Returns: CompItem[]
```

# ⚙️ `normalize(path: string): string`

Normalizes a path string (removes extra separators, fixes slashes).

```typescript
const normalized = pathUtils.normalize("Comps////Main_Comp");
// Returns: "//Comps//Main_Comp"
```

# ⚙️ `getRelative(fromPath: string, toPath: string): string`

Creates a relative path from one absolute path to another.

```typescript
const relative = pathUtils.getRelative("//Comps", "//Comps//Main_Comp");
// Returns: "//Comps//Main_Comp" (already absolute)
```

## Real-World Implementation

### After Effects Adapter

```typescript
import { KT_IPathAdapter, KT_ProjectPath } from "kt-core";

class KT_AePathAdapter implements KT_IPathAdapter<_ItemClasses> {
    separator = "//";

    isContainer(item: _ItemClasses): boolean {
        return item.typeName === "Folder";
    }

    getName(item: _ItemClasses): string {
        return item.name;
    }

    getParent(item: _ItemClasses): _ItemClasses | null {
        return item.parentFolder;
    }

    getChildren(item: _ItemClasses): _ItemClasses[] {
        if (!this.isContainer(item)) return [];

        const children: _ItemClasses[] = [];
        for (let i = 1; i <= item.items.length; i++) {
            children.push(item.items[i]);
        }
        return children;
    }
}

export const KT_AeProjectPath = new KT_ProjectPath(new KT_AePathAdapter());
```

### Usage in Cache System

The path utilities are essential for the cache system because they provide:

1. **Consistent Path Generation**: All cached items have predictable paths
2. **Hierarchy Navigation**: Cache can traverse and update paths when items move
3. **Path-Based Lookups**: O(1) access to items by their full path

```typescript
// Cache uses path utils for path generation
const itemPath = pathUtils.get(item); // "//Comps//Main_Comp"
cache.add(item, itemPath); // Index by path

// When folder moves, cache updates all child paths
cache.renamePathPrefix("//OldFolder//", "//NewFolder//");
```

## Integration with KT_Core

```typescript
import { KT_Core } from "kt-core";

// Access path utilities through KT_Core
const pathUtils = KT_Core.pathUtils; // Generic utilities
const aePath = KT_Core.aePath; // AE-specific implementation (if available)
```

## Why This Design Matters

### Host Agnostic Architecture

The adapter pattern allows the same path logic to work across different Adobe applications without modification. Each host implements the `KT_IPathAdapter<T>` interface, and the `KT_ProjectPath<T>` class handles all path operations generically.

### Performance Considerations

- **Lazy Evaluation**: Paths are generated only when needed
- **Caching**: Path utilities can be cached to avoid recalculation
- **Optimized Traversal**: Tree traversal algorithms minimize redundant operations

### ExtendScript Compatibility

- **No Modern JavaScript**: Uses ES3-compatible patterns
- **String Manipulation**: Relies on KT_StringUtils for safe operations
- **Error Handling**: Graceful handling of malformed paths and missing items</content>
  <parameter name="filePath">c:\work\dev\KT_es\kt-core\docs\path.md
