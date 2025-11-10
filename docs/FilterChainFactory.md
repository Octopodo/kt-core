# KT_FilterChainFactory Module Documentation

Advanced filtering system for collections using chainable filters and template-based customization. Supports multiple filter modes, RegExp patterns, and flexible matching logic.

## Table of Contents

- [Overview](#overview)
- [API Reference](#api-reference)
- [Methods](#methods)
- [Filter Modes](#filter-modes)
- [Usage Examples](#usage-examples)
- [Advanced Patterns](#advanced-patterns)
- [Type Definitions](#type-definitions)

## Overview

`KT_FilterChainFactory` provides a sophisticated filtering system for collections. It uses a template-based approach where:

- **Templates** define how to filter based on specific properties
- **Filter Modes** determine matching logic (exact, startsWith, endsWith, contains, custom)
- **Common Modes** are built-in: `exact`, `startsWith`, `endsWith`, `contains`
- **Custom Modes** allow domain-specific filtering logic

### Key Capabilities

🎯 **Flexible Matching**: Multiple filter types for different use cases  
🎯 **Custom Filters**: Define domain-specific filtering logic  
🎯 **Case Sensitivity**: Control strict vs. loose matching  
🎯 **Multi-filter Support**: Chain multiple filters with AND logic  
🎯 **Pattern Support**: Both string and RegExp patterns supported

## API Reference

### Constructor & Methods

| Method          | Parameters                          | Returns   | Description                           |
| --------------- | ----------------------------------- | --------- | ------------------------------------- |
| `constructor()` | `template: FilterTemplate`          | -         | Create factory with filter definition |
| `sanitize()`    | `options: any`                      | `object`  | Normalize filter options              |
| `match()`       | `(item, options, caseSensitive?)`   | `boolean` | Check if item matches filters         |
| `filter()`      | `(item, sanitized, caseSensitive?)` | `boolean` | Apply sanitized filters to item       |

## Methods

### `constructor(template: FilterTemplate)`

Create a new filter factory with a custom template.

**Signature:**

```typescript
constructor(template: FilterTemplate)
```

**Parameters:**

| Parameter  | Type             | Description                             |
| ---------- | ---------------- | --------------------------------------- |
| `template` | `FilterTemplate` | Dictionary of filter functions or modes |

**FilterTemplate Type:**

```typescript
type FilterTemplate = {
    [key: string]: FilterFn | null | undefined;
};

type FilterFn = (
    itemValue: any,
    filters: any[],
    caseSensitive: boolean
) => boolean;
```

**Example:**

```typescript
import { KT_FilterChainFactory } from "kt-core";

const filterTemplate = {
    name: null, // Use built-in 'exact' mode
    description: "contains", // Use built-in 'contains' mode
    priority: (itemValue, filters, caseSensitive) => {
        // Custom filter logic
        for (let i = 0; i < filters.length; i++) {
            if (itemValue >= filters[i]) return true;
        }
        return false;
    },
};

const factory = new KT_FilterChainFactory(filterTemplate);
```

### `sanitize(options: any): object`

Normalize and standardize filter options. Converts various input formats into a consistent structure.

**Signature:**

```typescript
sanitize(options: any): any
```

**Parameters:**

| Parameter | Type  | Description                       |
| --------- | ----- | --------------------------------- |
| `options` | `any` | Filter options in various formats |

**Returns:** Normalized filter object with arrays for each template key

**Conversion Rules:**

| Input Type           | Conversion                                         |
| -------------------- | -------------------------------------------------- |
| `null` / `undefined` | Returns empty object                               |
| `number`             | `{ id: number }`                                   |
| `string` (URL-like)  | `{ path: string }` if starts with "//"             |
| `string` (other)     | `{ firstTemplateKey: string }`                     |
| `RegExp`             | `{ firstTemplateKey: RegExp }`                     |
| `Array`              | `{ firstTemplateKey: Array }`                      |
| `object`             | Passed through, non-existent keys filled with `[]` |

**Example:**

```typescript
const factory = new KT_FilterChainFactory({
    name: null,
    type: null,
});

// Various input formats
factory.sanitize("John"); // { name: ["John"], type: [] }
factory.sanitize(123); // { id: [123], name: [], type: [] }
factory.sanitize({ name: "John" }); // { name: ["John"], type: [] }
factory.sanitize({ name: ["John", "Jane"] }); // { name: ["John", "Jane"], type: [] }
factory.sanitize("//usr/local/file"); // { path: ["//usr/local/file"], name: [], type: [] }
```

### `match(item: any, options: any, caseSensitive?: boolean): boolean`

Check if an item matches the given filter options. Convenience method combining sanitize and filter.

**Signature:**

```typescript
match(item: any, options: any, caseSensitive?: boolean): boolean
```

**Parameters:**

| Parameter       | Type      | Default | Description              |
| --------------- | --------- | ------- | ------------------------ |
| `item`          | `any`     | -       | The item to check        |
| `options`       | `any`     | -       | Filter criteria          |
| `caseSensitive` | `boolean` | `false` | Case sensitivity control |

**Returns:** `true` if item matches all filters, `false` otherwise

**Example:**

```typescript
const item = { name: "Alice", type: "User", priority: 10 };
const factory = new KT_FilterChainFactory({
    name: null,
    type: null,
});

factory.match(item, { name: "Alice" }); // true
factory.match(item, { name: "alice" }); // true (case-insensitive default)
factory.match(item, { name: "alice", type: "user" }); // true (both match)
```

### `filter(item: any, sanitized: any, caseSensitive?: boolean): boolean`

Apply pre-sanitized filters to an item. Used internally by `match()` but can be called directly for performance.

**Signature:**

```typescript
filter(item: any, sanitized: any, caseSensitive?: boolean): boolean
```

**Parameters:**

| Parameter       | Type      | Default | Description                                      |
| --------------- | --------- | ------- | ------------------------------------------------ |
| `item`          | `any`     | -       | The item to filter                               |
| `sanitized`     | `any`     | -       | Pre-processed filter options (from `sanitize()`) |
| `caseSensitive` | `boolean` | `false` | Case sensitivity control                         |

**Returns:** `true` if item matches all sanitized filters, `false` otherwise

**When to Use:**
Use `filter()` when applying the same sanitized filters to multiple items (avoids repeated sanitization).

**Example:**

```typescript
const factory = new KT_FilterChainFactory({ name: null, type: null });

// Pre-sanitize once
const filters = factory.sanitize({ name: "Admin", type: "Staff" });

// Apply to multiple items
const items = [
    { name: "Admin", type: "Staff" },
    { name: "User", type: "Staff" },
    { name: "Admin", type: "User" },
];

for (let i = 0; i < items.length; i++) {
    if (factory.filter(items[i], filters)) {
        console.log("Match:", items[i].name);
    }
}
// Output:
// Match: Admin
```

## Filter Modes

### Built-in Filter Modes

The factory includes four built-in filter modes automatically.

#### `exact`

Match items with exact equality.

**Logic:**

- For each filter value, check if item value equals it (case-sensitive or not)
- Return `true` if ANY filter matches (OR logic within a filter key)
- All filter keys must match (AND logic between keys)

**Usage:**

```typescript
const factory = new KT_FilterChainFactory({
    status: null, // null = use 'exact' mode
});

factory.match({ status: "active" }, { status: "active" }); // true
factory.match({ status: "active" }, { status: "Active" }); // false (by default case-sensitive property name)
```

#### `startsWith`

Match items where value starts with filter pattern.

**Logic:**

- Uses `KT_StringUtils.startsWith()` internally
- Case sensitivity controlled by parameter
- Also accepts RegExp patterns

**Usage:**

```typescript
const factory = new KT_FilterChainFactory({
    filename: "startsWith",
});

factory.match({ filename: "report_2024.pdf" }, { filename: "report" }); // true
```

#### `endsWith`

Match items where value ends with filter pattern.

**Logic:**

- Uses `KT_StringUtils.endsWith()` internally
- Case sensitivity controlled by parameter
- Also accepts RegExp patterns

**Usage:**

```typescript
const factory = new KT_FilterChainFactory({
    filename: "endsWith",
});

factory.match({ filename: "report_2024.pdf" }, { filename: ".pdf" }); // true
```

#### `contains`

Match items where value contains filter pattern anywhere.

**Logic:**

- Uses `KT_StringUtils.contains()` internally
- Case sensitivity controlled by parameter
- Also accepts RegExp patterns

**Usage:**

```typescript
const factory = new KT_FilterChainFactory({
    description: "contains",
});

factory.match(
    { description: "This is a important report" },
    { description: "important" }
); // true
```

### Custom Filter Modes

Define custom filtering logic for domain-specific needs.

**Function Signature:**

```typescript
(itemValue: any, filters: any[], caseSensitive: boolean) => boolean;
```

**Parameters:**

| Parameter       | Type      | Description                              |
| --------------- | --------- | ---------------------------------------- |
| `itemValue`     | `any`     | The value from the item being filtered   |
| `filters`       | `any[]`   | Array of filter values to match against  |
| `caseSensitive` | `boolean` | Whether to apply case-sensitive matching |

**Returns:** `true` if item matches, `false` otherwise

**Example: Number Range Filter**

```typescript
const filterTemplate = {
    price: (itemValue, filters, caseSensitive) => {
        // filters = [min, max]
        if (filters.length === 0) return true;
        if (filters.length === 1) {
            return itemValue >= filters[0];
        }
        return itemValue >= filters[0] && itemValue <= filters[1];
    },
};

const factory = new KT_FilterChainFactory(filterTemplate);
factory.match({ price: 50 }, { price: [40, 60] }); // true
factory.match({ price: 30 }, { price: [40, 60] }); // false
```

**Example: Array Contains Filter**

```typescript
const filterTemplate = {
    tags: (itemValue, filters, caseSensitive) => {
        // itemValue is array, filters is array of tags to find
        for (let i = 0; i < filters.length; i++) {
            const searchTag = filters[i];
            for (let j = 0; j < itemValue.length; j++) {
                if (itemValue[j] === searchTag) {
                    return true;
                }
            }
        }
        return false;
    },
};

const factory = new KT_FilterChainFactory(filterTemplate);
factory.match({ tags: ["javascript", "typescript"] }, { tags: "typescript" }); // true
```

## Usage Examples

### Example 1: Simple Document Filtering

```typescript
import { KT_FilterChainFactory } from "kt-core";

const template = {
    filename: "endsWith",
    author: null,
};

const factory = new KT_FilterChainFactory(template);

const documents = [
    { filename: "report.pdf", author: "Alice" },
    { filename: "data.xlsx", author: "Bob" },
    { filename: "slides.pdf", author: "Alice" },
];

// Find PDFs
for (let i = 0; i < documents.length; i++) {
    if (factory.match(documents[i], { filename: ".pdf" })) {
        console.log("PDF:", documents[i].filename);
    }
}
// Output: PDF: report.pdf, PDF: slides.pdf

// Find Alice's PDFs
for (let i = 0; i < documents.length; i++) {
    if (factory.match(documents[i], { filename: ".pdf", author: "Alice" })) {
        console.log("Alice's PDF:", documents[i].filename);
    }
}
// Output: Alice's PDF: report.pdf, Alice's PDF: slides.pdf
```

### Example 2: File Search with Path Patterns

```typescript
const template = {
    path: "startsWith",
    extension: null,
    size: (itemValue, filters, caseSensitive) => {
        // Filter by file size in bytes
        for (let i = 0; i < filters.length; i++) {
            if (itemValue <= filters[i]) return true;
        }
        return false;
    },
};

const factory = new KT_FilterChainFactory(template);

const files = [
    { path: "/projects/src/main.ts", extension: "ts", size: 2048 },
    { path: "/projects/src/utils.ts", extension: "ts", size: 4096 },
    { path: "/projects/build/output.js", extension: "js", size: 8192 },
];

// Find TypeScript files under 5KB
for (let i = 0; i < files.length; i++) {
    if (
        factory.match(files[i], {
            path: "/projects/src",
            extension: "ts",
            size: 5000,
        })
    ) {
        console.log("Match:", files[i].path);
    }
}
// Output: Match: /projects/src/main.ts
```

### Example 3: Multi-filter Search

```typescript
const template = {
    name: null,
    status: "exact",
    priority: (itemValue, filters) => {
        // Return true if priority is in the list of required priorities
        for (let i = 0; i < filters.length; i++) {
            if (itemValue === filters[i]) return true;
        }
        return false;
    },
};

const factory = new KT_FilterChainFactory(template);

const tasks = [
    { name: "Review Code", status: "active", priority: 1 },
    { name: "Update Docs", status: "active", priority: 2 },
    { name: "Bug Fix", status: "closed", priority: 1 },
];

// Find high-priority active tasks
for (let i = 0; i < tasks.length; i++) {
    if (
        factory.match(tasks[i], {
            status: "active",
            priority: [1], // High priority
        })
    ) {
        console.log("Urgent:", tasks[i].name);
    }
}
// Output: Urgent: Review Code
```

## Advanced Patterns

### Performance Optimization: Reusing Sanitized Filters

When filtering many items with the same criteria, sanitize once and reuse:

```typescript
const factory = new KT_FilterChainFactory(template);
const criteria = { type: "PDF", author: "Alice" };

// Sanitize once
const sanitized = factory.sanitize(criteria);

// Use multiple times
const results = [];
for (let i = 0; i < items.length; i++) {
    if (factory.filter(items[i], sanitized)) {
        results.push(items[i]);
    }
}
```

### Combining Multiple Templates

Create hierarchical filtering by chaining factories:

```typescript
const factory1 = new KT_FilterChainFactory({
    type: null,
    status: null
});

const factory2 = new KT_FilterChainFactory({
    priority: null,
    owner: null
});

// First filter by type/status, then by priority/owner
const items = [...];
const firstPass = [];
for (let i = 0; i < items.length; i++) {
    if (factory1.match(items[i], { type: "Task", status: "open" })) {
        firstPass.push(items[i]);
    }
}

const secondPass = [];
for (let i = 0; i < firstPass.length; i++) {
    if (factory2.match(firstPass[i], { priority: 1 })) {
        secondPass.push(firstPass[i]);
    }
}
```

### Dynamic Filter Building

Build filters programmatically:

```typescript
function buildItemFilter(template) {
    const factory = new KT_FilterChainFactory(template);

    return {
        match: (item, criteria) => factory.match(item, criteria),
        batch: (items, criteria) => {
            const results = [];
            const sanitized = factory.sanitize(criteria);
            for (let i = 0; i < items.length; i++) {
                if (factory.filter(items[i], sanitized)) {
                    results.push(items[i]);
                }
            }
            return results;
        },
    };
}

const userFilter = buildItemFilter({
    role: null,
    status: "exact",
    active: null,
});

const users = [
    /*...*/
];
const activeAdmins = userFilter.batch(users, { role: "admin", active: true });
```

## Type Definitions

### FilterTemplate

```typescript
type FilterTemplate = {
    [key: string]: FilterFn | null | undefined;
};
```

A dictionary where:

- **Key**: Property name on items being filtered
- **Value**:
    - `null` or `undefined` → Use built-in 'exact' mode
    - Function → Custom filter function
    - String → Name of built-in mode ('contains', 'startsWith', etc.)

### FilterFn

```typescript
type FilterFn = (
    itemValue: any,
    filters: any[],
    caseSensitive: boolean
) => boolean;
```

Custom filter function that:

- Receives the item's property value
- Receives array of filter values
- Receives case sensitivity flag
- Returns boolean: true if matches, false otherwise

## Related Documentation

- 📖 [Main README](../README.md)
- 📖 [String Utilities Documentation](./stringUtils.md) - Used internally for pattern matching
- 📖 [KT_Core Documentation](./KtCore.md)
