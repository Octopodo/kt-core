# KT_FilterChainFactory

Template-based factory to build reusable filters for Adobe Creative Suite project items. Accepts a `FilterTemplate` mapping keys to modes or custom functions for AE/PR asset management.

## Overview

The `KT_FilterChainFactory` is a powerful utility for creating flexible, reusable filtering systems for Adobe Creative Suite projects. It works by defining a **template** that specifies how each property of your AE/PR items should be filtered, then applying those filters to individual items or entire collections.

### How It Works

1. **Define a Template**: Create a `FilterTemplate` object where each key corresponds to a property in your AE/PR items, and the value specifies the filtering logic (built-in mode or custom function).

2. **Create the Factory**: Instantiate `KT_FilterChainFactory` with your template.

3. **Apply Filters**: Use optimized lookups when possible, then fall back to flexible filtering for complex criteria.

### Key Concepts

### Key Concepts

- **Template-Based**: Define filtering rules once, reuse across AE/PR projects
- **Hybrid Performance**: Combine fast indexed lookups with flexible filtering
- **Adobe-Specific Logic**: Custom functions for compositions, footage, sequences
- **Flexible Input**: Handle strings, numbers, RegExp, arrays, and objects
- **Case Sensitivity**: Control case sensitivity per operation

### When to Use

- **AE Project Management**: Find compositions, footage, or folders by name, path, or properties
- **PR Media Organization**: Filter clips by duration, resolution, media type, or metadata
- **Batch Processing**: Apply effects or operations to specific groups of items
- **Script Automation**: Build reusable search logic for AE/PR scripts and extensions
- **Asset Libraries**: Create smart filters for large project libraries

## Filtering Logic

The factory applies filters using a two-level logic system:

### Within a Single Property (OR Logic)

For each property in your template, if multiple filter values are provided, the item matches if **any** of the values match (OR logic).

```typescript
// Template: { tags: null }
// Filter: { tags: ["urgent", "important"] }
// Item matches if it has EITHER "urgent" OR "important" tag
```

### Between Properties (AND Logic)

For an item to match the overall filter, it must satisfy **all** properties in the template (AND logic).

```typescript
// Template: { status: null, priority: null }
// Filter: { status: "active", priority: "high" }
// Item must have status="active" AND priority="high"
```

### Built-in vs Custom Modes

- **Built-in modes** (`exact`, `startsWith`, `endsWith`, `contains`) handle common string matching patterns
- **Custom modes** allow you to define any filtering logic you need (numbers, dates, arrays, etc.)

## Basic Workflow

```typescript
// 1. Define filtering logic for AE/PR projects
const projectTemplate = {
    name: null, // Built-in exact match
    type: null, // "Composition", "Footage", "Folder"
    path: (item, filters) => {
        // Custom path logic
        const itemPath = getItemPath(item);
        return filters.some((filter) => itemPath.startsWith(filter));
    },
    id: (item, filters) => item.id === filters[0], // Exact ID match
};

// 2. Create the factory
const factory = new KT_FilterChainFactory(projectTemplate);

// 3. Filter project items
const allItems = app.project.items;
const results = [];

for (let i = 1; i <= allItems.length; i++) {
    const item = allItems[i];
    if (
        factory.match(item, {
            type: "Composition",
            name: /final/i, // Case-insensitive regex
        })
    ) {
        results.push(item);
    }
}
// Result: All compositions with "final" in the name
```

## Performance Considerations

The factory is designed for performance when filtering large datasets:

### Use `match()` for Single Items

```typescript
// Good for one-off filtering
if (factory.match(item, criteria)) {
    // process item
}
```

### Use `sanitize()` + `filter()` for Batch Operations

```typescript
// Better for filtering many items with same criteria
const sanitized = factory.sanitize(criteria);
for (let i = 0; i < items.length; i++) {
    if (factory.filter(items[i], sanitized)) {
        results.push(items[i]);
    }
}
```

**Why?** `sanitize()` normalizes the filter criteria once, avoiding repeated processing.

**Why?** `sanitize()` normalizes the filter criteria once, avoiding repeated processing.

## Common Use Cases

### After Effects Project Items

Filter compositions, footage, and folders in AE projects:

```typescript
const aeTemplate = {
    name: null, // Exact name match
    type: null, // "Composition", "Footage", "Folder"
    path: (item, filters) => {
        // Custom path logic
        const itemPath = getItemPath(item);
        return filters.some((p) => itemPath.startsWith(p));
    },
    id: (item, filters) => item.id === filters[0], // Exact ID match
};
```

### Premiere Pro Project Assets

Filter sequences, clips, and bins:

```typescript
const prTemplate = {
    name: "contains", // Name contains text
    mediaType: null, // "Video", "Audio", "Image"
    duration: (item, filters) => {
        // Duration in seconds
        const duration = item.getOutPoint() - item.getInPoint();
        return duration >= filters[0] && duration <= filters[1];
    },
    resolution: (item, filters) => {
        // Width x Height
        const [width, height] = item.getDimensions();
        return width >= filters[0] && height >= filters[1];
    },
};
```

### File-Based Assets

Filter by file extension, size, and metadata:

```typescript
const fileTemplate = {
    extension: "endsWith", // .mp4, .jpg, .aep
    fileSize: (item, filters) => {
        // Size in MB
        const sizeMB = item.file?.size / (1024 * 1024);
        return sizeMB <= filters[0];
    },
    frameRate: (item, filters) => {
        // FPS matching
        return Math.abs(item.frameRate - filters[0]) < 0.1;
    },
};
```

## Dependencies

The `KT_FilterChainFactory` relies on [`KT_StringUtils`](../stringUtils.md) for pattern matching in built-in modes:

- `startsWith`, `endsWith`, `contains` modes use the corresponding `KT_StringUtils` methods
- Supports both string and RegExp patterns
- Inherits case sensitivity controls from `KT_StringUtils`

## API

| Method        | Signature                                                       | Returns                 | Notes                              |
| ------------- | --------------------------------------------------------------- | ----------------------- | ---------------------------------- |
| `constructor` | `(template: [FilterTemplate](#filtertemplate))`                 | `KT_FilterChainFactory` | Create factory with template       |
| `sanitize`    | `(options: any): object`                                        | `object`                | Normalize options for repeated use |
| `match`       | `(item: any, options: any, caseSensitive?: boolean): boolean`   | `boolean`               | Sanitize + filter convenience      |
| `filter`      | `(item: any, sanitized: any, caseSensitive?: boolean): boolean` | `boolean`               | Apply sanitized filters to an item |

Built-in modes: `exact`, `startsWith`, `endsWith`, `contains`. Custom mode functions have signature `(itemValue, filters, caseSensitive) => boolean`.

## Example

```typescript
import { KT_FilterChainFactory } from "kt-core";

const factory = new KT_FilterChainFactory({
    filename: "endsWith",
    author: null,
});
const docs = [
    { filename: "r.pdf", author: "A" },
    { filename: "x.txt", author: "B" },
];
const results = [];
for (let i = 0; i < docs.length; i++) {
    if (factory.match(docs[i], { filename: ".pdf" })) results.push(docs[i]);
}
```

Notes:

- Prefer `sanitize()` when applying the same criteria to many items.
- `caseSensitive` defaults to `true` unless explicitly set to `false`.

```typescript
constructor(template: FilterTemplate)
```

**Parameters:**

| Parameter  | Type                                | Description                             |
| ---------- | ----------------------------------- | --------------------------------------- |
| `template` | [`FilterTemplate`](#filtertemplate) | Dictionary of filter functions or modes |

**FilterTemplate Type:**

```typescript
type FilterTemplate = {
    [key: string]: [FilterFn](#filterfn) | null | undefined;
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

# ⚙️ `sanitize(options: any): object`

Normalize and standardize filter options. Converts various input formats into a consistent structure.

#### Function Signature

```typescript
sanitize(options: any): object
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

# ⚙️ `match(item: any, options: any, caseSensitive?: boolean): boolean`

Check if an item matches the given filter options. Convenience method combining sanitize and filter.

#### Function Signature

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

# ⚙️ `filter(item: any, sanitized: any, caseSensitive?: boolean): boolean`

Apply pre-sanitized filters to an item. Used internally by `match()` but can be called directly for performance.

#### Function Signature

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
    path: "startsWith",
});

factory.match({ path: "/Projects/Main/comp_v01" }, { path: "/Projects/Main" }); // true
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

factory.match({ filename: "comp_v01_final.aep" }, { filename: ".aep" }); // true
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
    name: "contains",
});

factory.match({ name: "Main_Comp_v02_final" }, { name: "final" }); // true
```

### Custom Filter Modes

Define custom filtering logic for domain-specific needs.

#### Custom Filter Function Signature

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

### Example 1: AE Composition Filtering

```typescript
const aeTemplate = {
    name: "contains",
    type: null,
};

const factory = new KT_FilterChainFactory(aeTemplate);

const projectItems = app.project.items;

// Find all compositions with "final" in the name
for (let i = 1; i <= projectItems.length; i++) {
    const item = projectItems[i];
    if (factory.match(item, { name: "final", type: "Composition" })) {
        $.writeln("Final comp:", item.name);
    }
}
```

### Example 2: PR Sequence Filtering

```typescript
const prTemplate = {
    name: "startsWith",
    duration: (item, filters) => {
        const duration = item.getOutPoint() - item.getInPoint();
        return duration >= filters[0] && duration <= filters[1];
    },
    resolution: (item, filters) => {
        const [width] = item.getDimensions();
        return width >= filters[0];
    },
};

const factory = new KT_FilterChainFactory(prTemplate);

const sequences = getAllSequences();

// Find HD sequences between 30-300 seconds
for (const seq of sequences) {
    if (
        factory.match(seq, {
            name: "Episode",
            duration: [30, 300],
            resolution: 1920,
        })
    ) {
        processSequence(seq);
    }
}
```

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

````

### Example 3: Footage Library Organization

```typescript
const footageTemplate = {
    name: "contains",
    fileSize: (item, filters) => {
        const sizeMB = item.file?.size / (1024 * 1024);
        return sizeMB <= filters[0];
    },
    frameRate: (item, filters) => {
        return Math.abs(item.frameRate - filters[0]) < 0.1;
    }
};

const factory = new KT_FilterChainFactory(footageTemplate);

const footageItems = getAllFootage();

// Find 24fps footage under 500MB containing "interview"
for (const footage of footageItems) {
    if (factory.match(footage, {
        name: "interview",
        fileSize: 500,
        frameRate: 24
    })) {
        importFootage(footage);
    }
}
````

## Real-World Integration

The factory excels in Adobe Creative Suite workflows where you need to search through complex project structures.

### After Effects Project Browser

```typescript
class AE_ProjectFinder {
    private filterFactory = new KT_FilterChainFactory({
        name: null,
        type: null,
        folder: (item, filters) => {
            let parent = item.parentFolder;
            return filters.some((folderName) => parent?.name === folderName);
        },
        hasExpressions: (item, filters) => {
            if (item instanceof CompItem) {
                // Check if comp has expressions
                return filters[0]
                    ? item.layers.some((layer) => layer.hasExpressions)
                    : true;
            }
            return false;
        },
    });

    findComps(criteria: any) {
        const allComps = getAllCompositions();
        const sanitized = this.filterFactory.sanitize(criteria);
        return allComps.filter((comp) =>
            this.filterFactory.filter(comp, sanitized)
        );
    }
}

// Usage
const finder = new AE_ProjectFinder();
const mainComps = finder.findComps({
    folder: "Main",
    hasExpressions: true,
});
```

### Premiere Pro Media Browser

```typescript
class PR_MediaFinder {
    private filterFactory = new KT_FilterChainFactory({
        name: "contains",
        mediaType: null,
        duration: (item, filters) => {
            const duration = item.getOutPoint() - item.getInPoint();
            return duration >= filters[0] && duration <= filters[1];
        },
        resolution: (item, filters) => {
            const [width, height] = item.getDimensions();
            return width >= filters[0] && height >= filters[1];
        },
    });

    findClips(criteria: any) {
        const allClips = getAllProjectClips();
        const sanitized = this.filterFactory.sanitize(criteria);
        return allClips.filter((clip) =>
            this.filterFactory.filter(clip, sanitized)
        );
    }
}

// Usage
const finder = new PR_MediaFinder();
const hdVideos = finder.findClips({
    mediaType: "Video",
    resolution: [1920, 1080],
    duration: [10, 300], // 10 seconds to 5 minutes
});
```

## Flexible Input Handling

The `sanitize()` method intelligently handles various input formats, making the factory easy to use in different contexts:

### Automatic Type Detection

```typescript
const factory = new KT_FilterChainFactory({ name: null, type: null });

// Different input styles all work
factory.sanitize("John"); // { name: ["John"], type: [] }
factory.sanitize(123); // { id: [123], name: [], type: [] } (if id in template)
factory.sanitize({ name: "John" }); // { name: ["John"], type: [] }
factory.sanitize(/john/i); // { name: [/john/i], type: [] }
```

### Array Support

```typescript
// Single values become arrays
factory.sanitize({ name: "John" }); // { name: ["John"] }
factory.sanitize({ name: ["John", "Jane"] }); // { name: ["John", "Jane"] }

// Mixed types
factory.sanitize({
    tags: ["urgent", "important"],
    priority: [1, 2, 3],
});
```

### RegExp Pattern Support

```typescript
// Direct RegExp
factory.sanitize({ name: /report/i }); // { name: [/report/i] }

// Multiple patterns
factory.sanitize({
    name: [/report/i, /budget/i],
}); // { name: [/report/i, /budget/i] }
```

### RegExp Pattern Support

```typescript
// Direct RegExp
factory.sanitize({ name: /report/i }); // { name: [/report/i] }

// Multiple patterns
factory.sanitize({
    name: [/report/i, /budget/i],
}); // { name: [/report/i, /budget/i] }
```

## Processing During Filtering

The factory supports processing items as they're filtered, enabling side effects or additional logic:

### Callback Support

```typescript
class SearchEngine {
    private factory = new KT_FilterChainFactory({
        name: "contains",
        type: null,
    });

    searchWithCallback(
        items: any[],
        criteria: any,
        callback: (item: any) => void
    ) {
        const sanitized = this.factory.sanitize(criteria);
        const results = [];

        for (const item of items) {
            if (this.factory.filter(item, sanitized)) {
                callback(item); // Process each match
                results.push(item);
            }
        }

        return results;
    }
}

// Usage
const logger = (item) => console.log(`Found: ${item.name}`);
engine.searchWithCallback(data, { type: "document" }, logger);
```

### Validation and Transformation

```typescript
const validatorTemplate = {
    email: (value, filters) => {
        // Validate and transform during filtering
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        return filters.length === 0 || isValid;
    },

    age: (value, filters) => {
        const numValue = Number(value);
        return !isNaN(numValue) && filters.every((min) => numValue >= min);
    },
};
```

## Hybrid Lookup Strategies

For maximum performance, combine indexed lookups with filtering:

### Optimized + Filter Fallback

```typescript
class SmartFinder {
    private factory = new KT_FilterChainFactory({
        name: null,
        category: null,
        tags: (item, filters) => filters.some((tag) => item.tags.includes(tag)),
    });

    findOptimized(items: any[], criteria: any) {
        let candidates = items;
        let usedIndex = false;

        // Try indexed lookups first (fast)
        if (criteria.id) {
            candidates = [this.getById(items, criteria.id)];
            usedIndex = true;
        } else if (criteria.name && typeof criteria.name === "string") {
            candidates = this.getByName(items, criteria.name);
            usedIndex = true;
        }

        // Apply complex filters to candidates (flexible)
        if (!usedIndex || Object.keys(criteria).length > 1) {
            const sanitized = this.factory.sanitize(criteria);
            candidates = candidates.filter((item) =>
                this.factory.filter(item, sanitized)
            );
        }

        return candidates;
    }

    private getById(items: any[], id: number) {
        return items.find((item) => item.id === id) || null;
    }

    private getByName(items: any[], name: string) {
        return items.filter((item) => item.name === name);
    }
}
```

### Multi-Stage Filtering

```typescript
class MultiStageFilter {
    private basicFactory = new KT_FilterChainFactory({
        status: null,
        type: null,
    });

    private advancedFactory = new KT_FilterChainFactory({
        priority: (value, filters) => value >= Math.max(...filters),
        tags: (value, filters) => filters.every((tag) => value.includes(tag)),
    });

    filterItems(items: any[], criteria: any) {
        // Stage 1: Fast basic filters
        const basicCriteria = { status: criteria.status, type: criteria.type };
        const stage1 = this.filterWithFactory(
            items,
            basicCriteria,
            this.basicFactory
        );

        // Stage 2: Complex filters on reduced set
        const advancedCriteria = {
            priority: criteria.minPriority,
            tags: criteria.requiredTags,
        };
        return this.filterWithFactory(
            stage1,
            advancedCriteria,
            this.advancedFactory
        );
    }

    private filterWithFactory(
        items: any[],
        criteria: any,
        factory: KT_FilterChainFactory
    ) {
        if (Object.keys(criteria).length === 0) return items;

        const sanitized = factory.sanitize(criteria);
        return items.filter((item) => factory.filter(item, sanitized));
    }
}
```

## Advanced Integration Patterns

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
    [key: string]: [FilterFn](#filterfn) | null | undefined;
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
