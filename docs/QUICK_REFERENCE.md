# KT-Core Quick Reference

Concise reference for common operations with KT-Core.

## Installation

```bash
npm install kt-core
```

## Imports

```typescript
// Main module
import { KT_Core } from "kt-core";

// Individual utilities
import { KT_StringUtils } from "kt-core";
import { KT_FilterChainFactory } from "kt-core";
import { KT_Paterns } from "kt-core";

// Batch utilities
import { createBatchJob } from "kt-core/src/batch";
```

## String Utilities

```typescript
import { KT_StringUtils } from "kt-core";

// Check prefix
KT_StringUtils.startsWith("HelloWorld", "Hello"); // true
KT_StringUtils.startsWith("HelloWorld", "hello", false); // true (case-insensitive)

// Check suffix
KT_StringUtils.endsWith("file.txt", ".txt"); // true
KT_StringUtils.endsWith("file.txt", ".TXT", false); // true

// Check contains
KT_StringUtils.contains("HelloWorld", "World"); // true
KT_StringUtils.contains("HelloWorld", "world", false); // true

// Exact match
KT_StringUtils.equals("Adobe", "Adobe"); // true
KT_StringUtils.equals("Adobe", "adobe", false); // true

// Pattern matching with flags
KT_StringUtils.match("test123", "test"); // true
KT_StringUtils.match("TEST", "test", false); // true (case-insensitive)

// RegExp support (all methods)
const regex = /^hello/i;
KT_StringUtils.startsWith("HelloWorld", regex); // true
```

## Filter Chain Factory

```typescript
import { KT_FilterChainFactory } from "kt-core";

// Define filter template
const template = {
    name: null, // Use 'exact' mode
    extension: "endsWith", // Use 'endsWith' mode
    size: (value, filters) => value <= filters[0], // Custom mode
};

const factory = new KT_FilterChainFactory(template);

// Match single item
const item = { name: "report.pdf", extension: "pdf", size: 1024 };
factory.match(item, { name: "report", extension: ".pdf" }); // true

// Filter multiple items
const items = [
    { name: "report.pdf", extension: "pdf", size: 2048 },
    { name: "data.xlsx", extension: "xlsx", size: 4096 },
];

const sanitized = factory.sanitize({ extension: ".pdf" });
for (let i = 0; i < items.length; i++) {
    if (factory.filter(items[i], sanitized)) {
        console.log("Match:", items[i].name);
    }
}
```

## OOP Patterns

```typescript
import { KT_Core } from "kt-core";

// Inheritance
class Dog {}
class Animal {}
KT_Core.patterns.Extend(Dog, Animal);

// Mixins - all methods
class Swimmable {
    swim() {
        console.log("Swimming");
    }
}
KT_Core.patterns.Mixin(Dog, Swimmable);

// Mixins - specific methods
class Flying {
    fly() {
        console.log("Flying");
    }
    land() {
        console.log("Landing");
    }
}
KT_Core.patterns.Mixin(Dog, Flying, "fly"); // Only fly, not land

// Clone objects
const original = { name: "Original" };
const cloned = KT_Core.patterns.Clone(original);
cloned.name = "Clone";

// Extend object
const obj = { a: 1 };
KT_Core.patterns.ExtendObject(obj, { b: 2, method() {} });

// Define interface
const Drawable = KT_Core.patterns.Interface("Drawable", "draw", "clear");
try {
    Drawable.ensureImplements(myObject);
} catch (e) {
    console.error("Does not implement interface");
}
```

## Module Extension

```typescript
import { KT_Core } from "kt-core";

// Create custom module
class MyUtils {
    greet(name) {
        return `Hello, ${name}!`;
    }
}

// Register with KT_Core
KT_Core.Module("MyUtils", new MyUtils());

// Use anywhere
const greeting = KT_Core.MyUtils.greet("World");
```

## Batch Operations

```typescript
import { createBatchJob } from "kt-core/src/batch";

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

// Create batch job
const batch = createBatchJob(
    items,
    function (x) {
        return this.add(x);
    },
    5
);

// Execute batch
const results = batch(); // [15, 25]
```

## Common Patterns

### Filter Collection

```typescript
import { KT_FilterChainFactory } from "kt-core";

const factory = new KT_FilterChainFactory({
    name: null,
});

const items = [{ name: "Alice" }, { name: "Bob" }, { name: "Charlie" }];

const results = [];
const sanitized = factory.sanitize({ name: "alice" });
for (let i = 0; i < items.length; i++) {
    if (factory.filter(items[i], sanitized, false)) {
        results.push(items[i]);
    }
}
```

### Find Items by Property

```typescript
import { KT_StringUtils } from "kt-core";

const items = [
    { filename: "report.pdf" },
    { filename: "data.xlsx" },
    { filename: "slides.pdf" },
];

const pdfs = [];
for (let i = 0; i < items.length; i++) {
    if (KT_StringUtils.endsWith(items[i].filename, ".pdf")) {
        pdfs.push(items[i]);
    }
}
```

### Process Items with Mixin Behavior

```typescript
import { KT_Core } from "kt-core";
import { createBatchJob } from "kt-core/src/batch";

class Handler {
    process() {
        return "processed";
    }
}

class Item {}

// Add processing capability
KT_Core.patterns.Mixin(Item, Handler);

const items = [new Item(), new Item(), new Item()];

// Batch process
const batch = createBatchJob(items, function () {
    return this.process();
});

const results = batch(); // ["processed", "processed", "processed"]
```

## Built-in Filter Modes

| Mode         | Logic            | Example                             |
| ------------ | ---------------- | ----------------------------------- |
| `exact`      | Exact equality   | `{ status: null }`                  |
| `startsWith` | Pattern at start | `{ path: "startsWith" }`            |
| `endsWith`   | Pattern at end   | `{ file: "endsWith" }`              |
| `contains`   | Pattern anywhere | `{ desc: "contains" }`              |
| Custom       | User function    | `{ priority: (v, f) => v >= f[0] }` |

## Case Sensitivity

```typescript
// All string methods support case sensitivity
KT_StringUtils.startsWith("HELLO", "hello", true); // false (case-sensitive)
KT_StringUtils.startsWith("HELLO", "hello", false); // true (case-insensitive)

// Default is case-sensitive (true)
KT_StringUtils.startsWith("HELLO", "hello"); // false

// All filter methods support case sensitivity
factory.match(item, options, true); // case-sensitive
factory.match(item, options, false); // case-insensitive
factory.match(item, options); // default: case-insensitive
```

## RegExp Usage

```typescript
import { KT_StringUtils } from "kt-core";

// String patterns (automatically escaped)
KT_StringUtils.contains("file.txt", ".txt"); // true

// RegExp patterns (used directly)
const regex = /\.txt$/i;
KT_StringUtils.endsWith("file.TXT", regex); // true

// Mixing string and RegExp in filters
const factory = new KT_FilterChainFactory({
    name: null,
});

factory.match({ name: "HelloWorld" }, { name: [/hello/i, "World"] }); // true - accepts both string and RegExp
```

## Error Handling

```typescript
// Most methods return boolean - no exceptions
const result = KT_StringUtils.startsWith("test", "x"); // false, not error

// Interface validation throws
try {
    const Interface1 = KT_Core.patterns.Interface("I", "method1", "method2");
    Interface1.ensureImplements(incompleteObject);
} catch (e) {
    // Handle missing methods
}

// Module registration logs warning (doesn't throw)
KT_Core.Module("Utils", new Utils1());
KT_Core.Module("Utils", new Utils2()); // Logs warning, doesn't replace
```

## Performance Tips

1. **Reuse sanitized filters:**

    ```typescript
    const sanitized = factory.sanitize(criteria); // Once
    for (let i = 0; i < items.length; i++) {
        // Reuse
        factory.filter(items[i], sanitized);
    }
    ```

2. **Use filter before batch:**

    ```typescript
    // Filter first, then batch on smaller set
    const filtered = filterItems(items, criteria);
    const batch = createBatchJob(filtered, method);
    ```

3. **Cache regex patterns:**
    ```typescript
    const regex = /pattern/i;
    for (let i = 0; i < items.length; i++) {
        KT_StringUtils.match(items[i].text, regex);
    }
    ```

## ExtendScript Compatibility

✅ **DO:**

- Use `for` loops instead of `forEach`, `map`, `filter`
- Check types with `instanceof`
- Escape special characters in regex

❌ **DON'T:**

- Use spread operator on objects: `{ ...obj }`
- Use modern Array methods
- Use Promises or async/await

## Related Documentation

- 📖 [Full API Reference](./docs/API.md)
- 📖 [Main README](./README.md)
- 📖 [Module Documentation](./docs/INDEX.md)
- 📖 [Contributing Guide](./CONTRIBUTING.md)
