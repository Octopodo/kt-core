# KT-Core API Index

Complete reference of all public APIs in kt-core.

## Quick Navigation

- [KT_Core](#kt_core)
- [KT_StringUtils](#kt_stringutils)
- [KT_FilterChainFactory](#kt_filterchinfactory)
- [KT_Paterns](#kt_paterns)
- [Batch Utilities](#batch-utilities)

---

## KT_Core

Central singleton container for the library.

**Import:**

```typescript
import { KT_Core } from "kt-core";
```

### Properties

| Property   | Type         | Description                    |
| ---------- | ------------ | ------------------------------ |
| `patterns` | `KT_Paterns` | Reference to pattern utilities |

### Methods

| Method     | Signature                     | Returns  | Description                          |
| ---------- | ----------------------------- | -------- | ------------------------------------ |
| `init()`   | `()`                          | `string` | Initialize and return module name    |
| `Module()` | `(name: string, module: any)` | `void`   | Register a module at runtime         |
| `salute()` | `()`                          | `void`   | Display library info (alert dialogs) |

**📖 Full Documentation:** [KtCore.md](./docs/KtCore.md)

---

## KT_StringUtils

String utilities with case sensitivity and RegExp support.

**Import:**

```typescript
import { KT_StringUtils } from "kt-core";
```

### Methods

| Method         | Signature                                                                          | Returns   | Description                         |
| -------------- | ---------------------------------------------------------------------------------- | --------- | ----------------------------------- |
| `startsWith()` | `(str: string, search: string \| RegExp, caseSensitive?: boolean)`                 | `boolean` | Check if string starts with pattern |
| `endsWith()`   | `(str: string, search: string \| RegExp, caseSensitive?: boolean)`                 | `boolean` | Check if string ends with pattern   |
| `contains()`   | `(str: string, search: string \| RegExp, caseSensitive?: boolean)`                 | `boolean` | Check if string contains pattern    |
| `equals()`     | `(str: string, search: string \| RegExp, caseSensitive?: boolean)`                 | `boolean` | Check exact equality                |
| `match()`      | `(str: string, search: string \| RegExp, caseSensitive?: boolean, flags?: string)` | `boolean` | Match with optional flags           |

**Key Features:**

- Handles both `string` and `RegExp` inputs
- Automatic special character escaping
- RegExp flag reconstruction for ExtendScript
- Case sensitivity control
- Edge case handling

**Examples:**

```typescript
// Basic usage
KT_StringUtils.startsWith("HelloWorld", "Hello"); // true
KT_StringUtils.contains("HelloWorld", "World", false); // true

// RegExp support
const regex = /^hello/i;
KT_StringUtils.match("HelloWorld", regex); // true

// Case-insensitive
KT_StringUtils.equals("Adobe", "adobe", false); // true
```

**📖 Full Documentation:** [stringUtils.md](./docs/stringUtils.md)

---

## KT_FilterChainFactory

Advanced filtering system for collections.

**Import:**

```typescript
import { KT_FilterChainFactory } from "kt-core";
```

### Constructor

```typescript
new KT_FilterChainFactory(template: FilterTemplate)
```

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

### Methods

| Method       | Signature                                              | Returns   | Description                   |
| ------------ | ------------------------------------------------------ | --------- | ----------------------------- |
| `match()`    | `(item: any, options: any, caseSensitive?: boolean)`   | `boolean` | Check if item matches filters |
| `filter()`   | `(item: any, sanitized: any, caseSensitive?: boolean)` | `boolean` | Apply sanitized filters       |
| `sanitize()` | `(options: any)`                                       | `object`  | Normalize filter options      |

### Built-in Filter Modes

| Mode         | Logic                   | Usage                                      |
| ------------ | ----------------------- | ------------------------------------------ |
| `exact`      | Exact equality matching | `{ key: null }` or default                 |
| `startsWith` | Pattern at start        | `{ key: "startsWith" }`                    |
| `endsWith`   | Pattern at end          | `{ key: "endsWith" }`                      |
| `contains`   | Pattern anywhere        | `{ key: "contains" }`                      |
| Custom       | User-defined logic      | `{ key: (val, filters, case) => boolean }` |

**Examples:**

```typescript
// Document filtering
const factory = new KT_FilterChainFactory({
    filename: "endsWith",
    author: null,
});

factory.match(
    { filename: "report.pdf", author: "Alice" },
    { filename: ".pdf", author: "Alice" }
); // true

// Batch filtering with sanitization
const sanitized = factory.sanitize(criteria);
for (let i = 0; i < items.length; i++) {
    if (factory.filter(items[i], sanitized)) {
        results.push(items[i]);
    }
}
```

**📖 Full Documentation:** [FilterChainFactory.md](./docs/FilterChainFactory.md)

---

## KT_Paterns

Classical OOP patterns for ExtendScript.

**Note:** Module name is deliberately spelled "Paterns" (not "Patterns") for historical consistency.

**Import:**

```typescript
import { KT_Core } from "kt-core";
// Access via: KT_Core.patterns
```

### Methods

| Method           | Signature                                                                  | Purpose                            |
| ---------------- | -------------------------------------------------------------------------- | ---------------------------------- |
| `Extend()`       | `(subClass: Function, superClass: Function)`                               | Set up prototype-based inheritance |
| `Mixin()`        | `(receivingClass: Function, givingClass: Function, ...methods?: string[])` | Copy methods between classes       |
| `Clone()`        | `(object: object)`                                                         | Create object clone via prototype  |
| `ExtendObject()` | `(obj: object, extension: object)`                                         | Add properties/methods to object   |
| `Interface()`    | `(name: string, ...methods: string[])`                                     | Define interface contract          |

**Examples:**

```typescript
// Inheritance
class Dog {}
class Animal {}
KT_Core.patterns.Extend(Dog, Animal);

// Mixins
class Swimmable {}
KT_Core.patterns.Mixin(Dog, Swimmable);

// Cloning
const clone = KT_Core.patterns.Clone(original);

// Extension
KT_Core.patterns.ExtendObject(obj, newProps);

// Interface
const Drawable = KT_Core.patterns.Interface("Drawable", "draw", "clear");
Drawable.ensureImplements(myObject);
```

**📖 Full Documentation:** [patterns.md](./docs/patterns.md)

---

## Batch Utilities

Simple batch job creation for collections.

**Import:**

```typescript
import { createBatchJob } from "kt-core/src/batch";
```

### Function

| Function           | Signature                                               | Returns       | Description              |
| ------------------ | ------------------------------------------------------- | ------------- | ------------------------ |
| `createBatchJob()` | `(collection: any[], method: Function, ...args: any[])` | `() => any[]` | Create batch job closure |

**How It Works:**
Returns a function that applies a method to each item in a collection with specified arguments.

**Example:**

```typescript
const items = [
    {
        value: 10,
        add(x) {
            return this.value + x;
        },
    },
    {
        value: 20,
        add(x) {
            return this.value + x;
        },
    },
];

const batch = createBatchJob(
    items,
    function (x) {
        return this.add(x);
    },
    5
);

const results = batch(); // [15, 25]
```

**📖 Full Documentation:** [batch.md](./docs/batch.md)

---

## Type Definitions

### Filter-Related Types

```typescript
// FilterChainFactory types
type FilterFn = (
    itemValue: any,
    filters: any[],
    caseSensitive: boolean
) => boolean;

type FilterTemplate = {
    [key: string]: FilterFn | null | undefined;
};
```

### Utility Types

```typescript
// Pattern Interface (from Interface())
interface PatternInterface {
    name: string;
    methods: string[];
    ensureImplements(obj: any): void;
}
```

---

## Polyfills Included

The library includes automatic polyfills for ExtendScript environments:

- `json2.js` - JSON stringify/parse
- `es-shim.js` - ES2015+ polyfills for IE6

These are automatically included via `@include` directives in `src/index.ts`.

---

## Module Extension Pattern

Extend the library at runtime:

```typescript
import { KT_Core } from "kt-core";

class MyUtils {
    doSomething() {
        /* ... */
    }
}

KT_Core.Module("MyUtils", new MyUtils());

// Access later
KT_Core.MyUtils.doSomething();
```

---

## Import Examples

```typescript
// Main module
import { KT_Core } from "kt-core";

// Individual utilities
import { KT_StringUtils } from "kt-core";
import { KT_FilterChainFactory } from "kt-core";
import { KT_Paterns } from "kt-core";

// Batch utilities
import { createBatchJob } from "kt-core/src/batch";

// Access patterns through core
const patterns = KT_Core.patterns; // KT_Paterns
```

---

## Version

Current version: **1.1.1**

See [package.json](./package.json) for version and dependency information.

---

## Related Documentation

- 📖 [Main README](./README.md)
- 📖 [Module Documentation Index](./docs)
    - [KT_Core](./docs/KtCore.md)
    - [String Utilities](./docs/stringUtils.md)
    - [Filter Chain Factory](./docs/FilterChainFactory.md)
    - [Patterns](./docs/patterns.md)
    - [Batch Utilities](./docs/batch.md)
- 📖 [Contributing Guide](./CONTRIBUTING.md)
- 📖 [Copilot Instructions](./github/copilot-instructions.md) - Detailed development guidelines
