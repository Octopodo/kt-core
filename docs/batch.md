# Batch Utilities Documentation

Simple utility for creating batch jobs that execute methods on multiple items in a collection.

## Table of Contents

- [Overview](#overview)
- [API Reference](#api-reference)
- [Function](#function)
- [Usage Examples](#usage-examples)
- [Comparison with Alternatives](#comparison-with-alternatives)

## Overview

The `createBatchJob()` function provides a lightweight utility for applying operations to multiple items in a collection. It returns a function that, when called, applies a method to each item with the specified arguments.

### Key Features

✨ **Lightweight**: Minimal overhead, pure utility function  
✨ **Flexible**: Works with any method and arguments  
✨ **Returns**: Collects all results in an array  
✨ **ExtendScript Compatible**: Uses traditional for loops, no modern syntax

## API Reference

### Function Signature

```typescript
function createBatchJob(
    collection: any[],
    method: (...args: any[]) => any,
    ...args: any[]
): () => any[];
```

## Function

### `createBatchJob()`

Create a batch job function that applies a method to each item in a collection.

**Signature:**

```typescript
function createBatchJob(
    collection: any[],
    method: (...args: any[]) => any,
    ...args: any[]
): () => any[];
```

**Parameters:**

| Parameter    | Type       | Description                     |
| ------------ | ---------- | ------------------------------- |
| `collection` | `any[]`    | Array of items to operate on    |
| `method`     | `Function` | Method to apply to each item    |
| `...args`    | `any[]`    | Arguments to pass to the method |

**Returns:** A function that, when called, returns an array of results

**How It Works:**

1. Accepts a collection and a method
2. Returns a closure function
3. When called, the function:
    - Iterates through each item in the collection
    - Calls the method with the item as `this` context
    - Passes additional arguments to the method
    - Collects results in an array
    - Returns the results array

**Example:**

```typescript
import { createBatchJob } from "kt-core/src/batch";

const item1 = {
    value: 10,
    add(x) {
        return this.value + x;
    },
};
const item2 = {
    value: 20,
    add(x) {
        return this.value + x;
    },
};
const item3 = {
    value: 30,
    add(x) {
        return this.value + x;
    },
};

const collection = [item1, item2, item3];

// Create batch job
const batch = createBatchJob(collection, function () {
    return this.add(5);
});

// Execute batch
const results = batch(); // [15, 25, 35]
```

## Usage Examples

### Example 1: Data Transformation

```typescript
import { createBatchJob } from "kt-core/src/batch";

const data = [
    {
        id: 1,
        value: "hello",
        toUpper() {
            return this.value.toUpperCase();
        },
    },
    {
        id: 2,
        value: "world",
        toUpper() {
            return this.value.toUpperCase();
        },
    },
];

const transform = createBatchJob(data, function () {
    return this.toUpper();
});

const results = transform(); // ["HELLO", "WORLD"]
```

### Example 2: Collecting Property Values

```typescript
const objects = [
    {
        id: 1,
        getName() {
            return `Object-${this.id}`;
        },
    },
    {
        id: 2,
        getName() {
            return `Object-${this.id}`;
        },
    },
    {
        id: 3,
        getName() {
            return `Object-${this.id}`;
        },
    },
];

const getNames = createBatchJob(objects, function () {
    return this.getName();
});

const names = getNames(); // ["Object-1", "Object-2", "Object-3"]
```

### Example 3: Batch Calculations

```typescript
class Vector {
    constructor(
        public x: number,
        public y: number
    ) {}
    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
}

const vectors = [new Vector(3, 4), new Vector(5, 12), new Vector(8, 15)];

const calculateMagnitudes = createBatchJob(vectors, function () {
    return this.magnitude();
});

const magnitudes = calculateMagnitudes(); // [5, 13, 17]
```

### Example 4: Method Invocation with Arguments

```typescript
class Calculator {
    value: number;
    constructor(init: number) {
        this.value = init;
    }
    add(x: number) {
        return this.value + x;
    }
    multiply(x: number) {
        return this.value * x;
    }
}

const calculators = [
    new Calculator(10),
    new Calculator(20),
    new Calculator(30),
];

// Add 5 to each
const addBatch = createBatchJob(
    calculators,
    function (x) {
        return this.add(x);
    },
    5
);

const added = addBatch(); // [15, 25, 35]

// Multiply by 2
const multiplyBatch = createBatchJob(
    calculators,
    function (x) {
        return this.multiply(x);
    },
    2
);

const multiplied = multiplyBatch(); // [20, 40, 60]
```

### Example 5: State Updates

```typescript
class Counter {
    count: number;
    constructor(init: number) {
        this.count = init;
    }
    increment() {
        this.count++;
        return this.count;
    }
    getValue() {
        return this.count;
    }
}

const counters = [new Counter(0), new Counter(10), new Counter(100)];

// Increment all counters
const incrementBatch = createBatchJob(counters, function () {
    return this.increment();
});

const results = incrementBatch(); // [1, 11, 101]

// Get values
const getValuesBatch = createBatchJob(counters, function () {
    return this.getValue();
});

const values = getValuesBatch(); // [1, 11, 101]
```

## Comparison with Alternatives

### vs. Array.prototype.map()

```typescript
// Using createBatchJob
const batch = createBatchJob(items, function () {
    return this.method();
});
const results = batch();

// Using Array.map (ES5+, not ExtendScript compatible)
const results = items.map((item) => item.method());
```

**Advantages of createBatchJob:**

- ExtendScript compatible
- Works in IE6-compatible environments
- No dependency on modern Array methods
- Explicit closure for deferred execution

**Disadvantages:**

- Returns a function (requires calling it)
- Less convenient API
- Requires items to have methods as properties

### vs. Manual For Loop

```typescript
// Using createBatchJob
const batch = createBatchJob(items, function () {
    return this.getValue();
});
const results = batch();

// Manual for loop
const results = [];
for (let i = 0; i < items.length; i++) {
    results.push(items[i].getValue());
}
```

**Advantages of createBatchJob:**

- Encapsulates the iteration pattern
- Captures context at creation time
- Reusable batch function
- Cleaner, more declarative

**Disadvantages:**

- Slight overhead from closure
- Less explicit about what's happening

## Performance Notes

### Time Complexity

- **Creation**: O(1) - just captures parameters
- **Execution**: O(n) where n is the collection size
- **Space**: O(n) for results array

### When to Use

✅ **Good Use Cases:**

- Applying the same operation to many items
- Need to execute batch multiple times
- Want to separate batch definition from execution
- Working with objects that have methods

❌ **Poor Use Cases:**

- One-time transformations
- Simple data mapping
- Large arrays where even() overhead matters
- Simple property access (use manual loop instead)

### Optimization Tips

1. **Reuse Batch Functions**: Create once, execute multiple times

    ```typescript
    const batch = createBatchJob(items, function () {
        return this.process();
    });
    const results1 = batch();
    const results2 = batch(); // Reuse
    ```

2. **Prefer Manual Loops for Simple Cases**

    ```typescript
    // For simple property access, manual loop is cleaner
    const values = [];
    for (let i = 0; i < items.length; i++) {
        values.push(items[i].value);
    }
    ```

3. **Use with {@link KT_FilterChainFactory} for Filtered Batches**

    ```typescript
    const factory = new KT_FilterChainFactory(template);

    // Filter items first
    const filtered = [];
    for (let i = 0; i < items.length; i++) {
        if (factory.match(items[i], criteria)) {
            filtered.push(items[i]);
        }
    }

    // Then batch
    const batch = createBatchJob(filtered, function () {
        return this.process();
    });
    const results = batch();
    ```

## Related Documentation

- 📖 [Main README](../README.md)
- 📖 [Filter Chain Factory Documentation](./FilterChainFactory.md) - For selective batch operations
- 📖 [KT_Core Documentation](./KtCore.md)
