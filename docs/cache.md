# KT_Cache

Advanced caching system for Adobe Creative Suite project items with lazy loading, multi-index search, and path-aware operations.

## Overview

The KT_Cache module provides high-performance caching for Adobe project structures. It solves the performance challenges of working with large Adobe projects by maintaining multiple optimized indices and implementing lazy loading strategies.

## Key Features

- **Multi-Index Storage**: Simultaneous indexing by ID, name, and path
- **Lazy Loading**: Scan project structure only when needed
- **Path-Aware Operations**: Automatic path updates for folder moves and renames
- **Sub-Cache System**: Specialized caches for different item types
- **RegExp Search**: Efficient pattern matching across item names
- **Type-Safe Accessors**: Strongly typed sub-cache accessors
- **ExtendScript Compatible**: Optimized for Adobe's JavaScript environment

## Architecture

### Core Components

| Component          | Purpose                                          |
| ------------------ | ------------------------------------------------ |
| `ICacheItem`       | Interface for cacheable items                    |
| `KT_CacheStore<T>` | Generic indexed storage with search capabilities |
| `KT_LazyCache<T>`  | Lazy-loading multi-cache system                  |

### Multi-Index System

The cache uses three primary indices for optimal lookup performance:

- **ID Index**: Maps unique identifiers to cached objects
- **Name Index**: Maps object names to collections (handles duplicates)
- **Path Index**: Maps file paths to objects using the path adapter

This multi-index approach ensures O(1) lookup complexity across different access patterns common in Adobe workflows.

### Lazy Loading Strategy

Instead of scanning entire project structures upfront, the cache implements lazy loading:

- Objects are cached only when first accessed
- Recursive scanning occurs on-demand
- Memory usage scales with actual usage patterns
- Performance impact is distributed across operations

### Path-Aware Operations

All path-based operations require a custom path adapter because:

- Adobe applications have different path representations
- File system paths vs. application-specific paths differ
- Path resolution must account for project-relative vs. absolute paths
- Different applications (AE, PR, PS) have unique path conventions

## Basic Usage

```typescript
import { KT_LazyCache, KT_CacheStore } from "kt-core";
import { KT_AeIs as is } from "kt-ae-is";

// For After Effects project items
const aeCache = new KT_LazyCache(
    aePathUtils, // Path utilities for AE
    {
        compositions: (item) => is.comp(item),
        footage: (item) => is.footage(item),
        folders: (item) => is.folder(item),
    }
);

// Initialize cache (lazy scan)
aeCache.init();

// Access sub-caches
const comps = aeCache.get("compositions");
const footage = aeCache.get("footage");
```

## Adobe Integration Patterns

### Path Adapter Implementation

The cache requires a path adapter that implements `KT_IPathAdapter` to handle application-specific path operations:

```typescript
interface KT_IPathAdapter {
    getPath(item: any): string;
    getParentPath(item: any): string;
    isFolder(item: any): boolean;
    getName(item: any): string;
}
```

### Cache Initialization Strategy

For optimal performance in Adobe environments:

1. **Lazy Initialization**: Call `init()` only when cache access is needed
2. **Type-Specific Checkers**: Define filter functions for each item type
3. **Root Accessors**: Provide functions to get project root and item count
4. **Invalidation Triggers**: Use item count changes to detect structure modifications

### Multi-Index Lookup Operations

The cache supports three primary lookup patterns:

- **ID-based**: Direct O(1) access via unique identifiers
- **Name-based**: Collection returns for duplicate names
- **Path-based**: Hierarchical navigation using adapter paths

## API Reference

### ICacheItem Interface

Base interface for all cacheable items.

```typescript
interface ICacheItem {
    id: number | string;
    name: string;
}
```

**Properties:**

| Property | Type               | Description       |
| -------- | ------------------ | ----------------- |
| `id`     | `number \| string` | Unique identifier |
| `name`   | `string`           | Display name      |

### KT_CacheStore<T> Class

Generic indexed cache store with O(1) lookups.

#### Constructor

```typescript
constructor(pathUtils: KT_Path<T>)
```

**Parameters:**

| Parameter   | Type                       | Description                      |
| ----------- | -------------------------- | -------------------------------- |
| `pathUtils` | [`KT_Path<T>`](../path.md) | Path utilities for the item type |

#### Methods

# ⚙️ `add(item: T, knownPath?: string): void`

Add an item to the cache.

```typescript
// Add with automatic path calculation
mediaCache.add(footageItem);

// Add with pre-calculated path (optimization)
mediaCache.add(footageItem, "/Project/Footage/clip_001.mov");
```

**Parameters:**

| Parameter   | Type     | Default     | Description                    |
| ----------- | -------- | ----------- | ------------------------------ |
| `item`      | `T`      | -           | Item to cache                  |
| `knownPath` | `string` | `undefined` | Pre-calculated path (optional) |

# ⚙️ `remove(item: T): void`

Remove an item from the cache.

```typescript
mediaCache.remove(deletedFootage);
```

# ⚙️ `update(item: T, newPath?: string): void`

Update an item in the cache (handles path changes).

```typescript
// Update with automatic path recalculation
mediaCache.update(movedItem);

// Update with known new path
mediaCache.update(movedItem, "/New/Path/item.mp4");
```

# ⚙️ `rename(item: T, newName: string): void`

Rename an item and update all indices.

```typescript
mediaCache.rename(comp, "Final_Composition");
```

# ⚙️ `getById(id: number | string): T | undefined`

Get item by ID (O(1)).

```typescript
const item = mediaCache.getById(123);
```

# ⚙️ `getByName(name: string): T[]`

Get all items with matching name.

```typescript
const comps = compCache.getByName("Background");
```

# ⚙️ `getByPath(path: string): T | undefined`

Get item by path (O(1)).

```typescript
const item = mediaCache.getByPath("/Project/Media/logo.png");
```

# ⚙️ `getByRegExp(regex: RegExp): T[]`

Find items using regular expression on names.

```typescript
// Find all compositions starting with "Comp_"
const comps = compCache.getByRegExp(/^Comp_.*/);

// Case-insensitive search
const finals = compCache.getByRegExp(/final/i);
```

# ⚙️ `getAll(): T[]`

Get all cached items.

```typescript
const allItems = mediaCache.getAll();
```

# ⚙️ `clear(): void`

Clear all cached items and indices.

```typescript
mediaCache.clear();
```

### KT_LazyCache<T> Class

Lazy-loading multi-cache system for project-wide scanning.

#### Constructor

```typescript
constructor(
    pathUtils: KT_Path<T>,
    checkers: { [name: string]: (item: T) => boolean },
    getProjectRoot: () => T,
    getNumItems: () => number
)
```

**Parameters:**

| Parameter        | Type                                       | Description                                   |
| ---------------- | ------------------------------------------ | --------------------------------------------- |
| `pathUtils`      | [`KT_Path<T>`](../path.md)                 | Path utilities                                |
| `checkers`       | `{ [name: string]: (item: T) => boolean }` | Functions to categorize items into sub-caches |
| `getProjectRoot` | `() => T`                                  | Function to get project root item             |
| `getNumItems`    | `() => number`                             | Function to get total item count              |

#### Methods

# ⚙️ `init(force?: boolean): void`

Initialize cache with lazy scanning.

```typescript
// Initialize (scans if needed)
aeCache.init();

// Force rescan
aeCache.init(true);
```

# ⚙️ `get(cacheName: string): KT_CacheStore<T> | undefined`

Get a sub-cache by name.

```typescript
const compCache = aeCache.get("compositions");
const footageCache = aeCache.get("footage");
```

# ⚙️ `add(item: T, knownPath?: string): void`

Add item to all relevant caches.

```typescript
// Add new composition
aeCache.add(newComp);
```

# ⚙️ `remove(item: T): void`

Remove item from all caches.

```typescript
aeCache.remove(deletedItem);
```

# ⚙️ `update(items: T[] | T): void`

Update items in all caches (handles path changes).

```typescript
// Update single item
aeCache.update(movedComp);

// Update multiple items
aeCache.update([comp1, comp2, comp3]);
```

# ⚙️ `rename(item: T, newName: string): void`

Rename item across all caches.

```typescript
aeCache.rename(comp, "Final_VFX");
```

# ⚙️ `clear(): void`

Clear all caches.

```typescript
aeCache.clear();
```

# ⚙️ `refresh(): void`

Force complete rescan.

```typescript
aeCache.refresh();
```

## Performance Considerations

### Indexing Strategy

- **ID Index**: O(1) lookup by unique identifier
- **Name Index**: O(1) lookup returning arrays (multiple items can share names)
- **Path Index**: O(1) lookup by full path string
- **RegExp Search**: Optimized using concatenated name strings with multiline regex

### Lazy Loading Benefits

- **Minimal Startup Impact**: Only scans when first accessed
- **Change Detection**: Auto-rescans when project item count changes
- **Memory Efficient**: Only caches what's needed

### Adobe-Specific Optimizations

- **Path-Aware Updates**: Automatic cascading updates for folder moves
- **ExtendScript Compatible**: Avoids modern JavaScript features
- **RegExp Handling**: Special logic for ExtendScript's limited RegExp support

## Dependencies

The cache module depends on:

- [`KT_Path<T>`](../path.md) - Path utilities for item navigation
- ExtendScript-compatible RegExp handling

## Common Patterns

### Project-Wide Asset Management

```typescript
// Setup comprehensive AE project cache
const projectCache = new KT_LazyCache(
    aePathUtils,
    {
        all: () => true, // Everything
        compositions: (item) => item.typeName === "Composition",
        footage: (item) => item.typeName === "Footage",
        solids: (item) => item.typeName === "Solid",
        folders: (item) => item.typeName === "Folder",
    },
    () => app.project.rootFolder,
    () => app.project.items.length
);

// Initialize
projectCache.init();

// Usage examples
const allComps = projectCache.get("compositions").getAll();
const bgFootage = projectCache.get("footage").getByRegExp(/background/i);
const mainComp = projectCache.get("compositions").getByName("Main")[0];
```

### Batch Operations

```typescript
// Efficient batch updates
const itemsToUpdate = [item1, item2, item3];
projectCache.update(itemsToUpdate);

// Bulk search and filter
const all4KFootage = projectCache.get("footage").getByRegExp(/4k|uhd/i);
const tempFiles = projectCache.get("all").getByRegExp(/^temp_/i);
```

### Change Tracking

```typescript
// Monitor for changes
if (projectCache.needsRefresh()) {
    projectCache.refresh();
}

// Handle renames efficiently
projectCache.rename(oldItem, "New_Name");
```

## Error Handling

The cache system includes built-in error handling for ExtendScript environments:

- **Scan Errors**: Logged to ESTK console with `$.writeln()`
- **Invalid Items**: Gracefully skipped during scanning
- **Path Conflicts**: Handled with overwrite logic
- **Memory Limits**: Designed for large project structures

## Integration with KT_Core

````typescript
import { KT_Core } from "kt-core";

// Access cache utilities
const CacheStore = KT_Core.cacheStore;
const LazyCache = KT_Core.lazyCache;

// Create project-specific cache
const myCache = new LazyCache(pathUtils, checkers, rootGetter, countGetter);
```</content>
<parameter name="filePath">c:\work\dev\KT\_es\kt-core\docs\cache.md
````
