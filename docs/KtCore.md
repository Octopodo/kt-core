# KT_Core Module Documentation

The `KT_Core` module is the central singleton container for the kt-core library. It provides the main entry point and module composition system.

## Table of Contents

- [Overview](#overview)
- [API Reference](#api-reference)
- [Properties](#properties)
- [Methods](#methods)
- [Usage Examples](#usage-examples)
- [Module System](#module-system)

## Overview

`KT_Core` is a singleton instance that serves as the root container for all kt-core functionality. It provides:

- Access to the pattern system via `patterns` property
- Runtime module registration via the `Module()` method
- Initialization and diagnostic methods

### Instance

```typescript
import { KT_Core } from "kt-core";

// KT_Core is a singleton - always refers to the same instance
```

## API Reference

### Properties

#### `patterns`

**Type:** `KT_Paterns`

Reference to the pattern system for object-oriented programming utilities.

**Example:**

```typescript
const extended = KT_Core.patterns.Extend(Dog, Animal);
const cloned = KT_Core.patterns.Clone(originalObject);
```

## Methods

### `init()`

Initialize the KT_Core module and return its name.

**Signature:**

```typescript
init(): string
```

**Returns:** `"KtCore"` - The module name

**Example:**

```typescript
const moduleName = KT_Core.init();
console.log(moduleName); // "KtCore"
```

### `Module(name, module)`

Register a new module with the KT_Core container at runtime. This allows for composition and extension of the library.

**Signature:**

```typescript
Module(name: string, module: any): void
```

**Parameters:**

| Parameter | Type     | Description                           |
| --------- | -------- | ------------------------------------- |
| `name`    | `string` | Unique identifier for the module      |
| `module`  | `any`    | Module instance or object to register |

**Behavior:**

- If a module with the same name already exists, the new module is NOT registered and a warning is written to the ExtendScript console (`$.writeln()`)
- The module becomes accessible as `KT_Core[name]`

**Example:**

```typescript
import { KT_Core } from "kt-core";

class CustomUtils {
    greet(name: string): string {
        return `Hello, ${name}!`;
    }
}

KT_Core.Module("Utils", new CustomUtils());

// Access the module
const result = KT_Core.Utils.greet("World"); // "Hello, World!"
```

### `salute()`

Display library information via an alert dialog. Used for diagnostics and verification.

**Signature:**

```typescript
salute(): void
```

**Behavior:**

- Shows an alert with library name and version (JSON format)
- Shows an alert greeting message

**Example:**

```typescript
KT_Core.salute();
// Alert 1: {"name":"KtCore","version":"1.0.0"}
// Alert 2: "Hello from KtCore"
```

## Usage Examples

### Basic Usage

```typescript
import { KT_Core, KT_StringUtils } from "kt-core";

// Access patterns through KT_Core
class Animal {
    constructor(public name: string) {}
}

class Dog {
    bark(): string {
        return "Woof!";
    }
}

KT_Core.patterns.Extend(Dog, Animal);

const myDog = new Dog();
myDog.name = "Buddy";
myDog.bark(); // "Woof!"
```

### Runtime Module Composition

```typescript
import { KT_Core } from "kt-core";

// Define custom utilities
class DateUtils {
    getCurrentYear(): number {
        return new Date().getFullYear();
    }
}

class MathUtils {
    add(a: number, b: number): number {
        return a + b;
    }
}

// Register multiple modules
KT_Core.Module("DateUtils", new DateUtils());
KT_Core.Module("MathUtils", new MathUtils());

// Use them
const year = KT_Core.DateUtils.getCurrentYear();
const sum = KT_Core.MathUtils.add(5, 3); // 8

// Attempt to register duplicate (will not register)
KT_Core.Module("DateUtils", new SomethingElse());
// Console: "Module DateUtils already exists"
```

### Building a Plugin Architecture

```typescript
import { KT_Core } from "kt-core";

// Base plugin interface
interface Plugin {
    name: string;
    execute(): void;
}

// Create plugins
class ExportPlugin implements Plugin {
    name = "Exporter";
    execute() {
        console.log("Exporting...");
    }
}

class ValidationPlugin implements Plugin {
    name = "Validator";
    execute() {
        console.log("Validating...");
    }
}

// Register plugins at runtime
KT_Core.Module("Exporter", new ExportPlugin());
KT_Core.Module("Validator", new ValidationPlugin());

// Use plugins
KT_Core.Exporter.execute(); // "Exporting..."
KT_Core.Validator.execute(); // "Validating..."
```

## Module System

### Design Pattern

The `KT_Core` module system follows a **registry pattern**, allowing:

1. **Loose Coupling**: Modules are independent and can be registered dynamically
2. **Runtime Composition**: Extend functionality without modifying core code
3. **Name-based Access**: Access modules via `KT_Core[moduleName]`
4. **Conflict Prevention**: Duplicate module names trigger a warning instead of silent overwrite

### Module Registration Flow

```
Define Module
    ↓
Create Instance
    ↓
Call KT_Core.Module(name, instance)
    ↓
Check: Does name already exist?
  ├─→ YES: Log warning, return
  └─→ NO: Register module, assign to KT_Core[name]
```

### Best Practices

1. **Namespace Convention**: Use descriptive names that indicate the module's purpose

    ```typescript
    KT_Core.Module("FileUtils", ...);     // ✅ Good
    KT_Core.Module("Utils", ...);         // ⚠️ Too generic
    ```

2. **Module Initialization**: Instantiate modules before registering

    ```typescript
    const utils = new CustomUtils();
    KT_Core.Module("Custom", utils); // ✅ Correct
    KT_Core.Module("Custom", CustomUtils); // ❌ Wrong - pass instance, not class
    ```

3. **Access Pattern**: Use type assertion if needed for TypeScript
    ```typescript
    const utils = (KT_Core as any).CustomUtils as CustomUtils;
    ```

## Related Documentation

- 📖 [Main README](../README.md)
- 📖 [Patterns Documentation](./patterns.md)
- 📖 [String Utilities Documentation](./stringUtils.md)
