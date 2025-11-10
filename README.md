# KT-Core 📦

A robust TypeScript utility library designed for **Adobe ExtendScript** environments (IE 6-compatible). KT-Core provides essential utilities and design patterns for scripting Adobe applications, serving as the foundation for the KT ecosystem.

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [API Overview](#api-overview)
- [Examples](#examples)
- [Documentation](#documentation)
- [ExtendScript Compatibility](#extendscript-compatibility)
- [Contributing](#contributing)
- [License](#license)

## Overview

**kt-core** is built for Adobe ExtendScript environments where traditional JavaScript features are limited. It compiles TypeScript (ES2015) down to IE6-compatible JavaScript with polyfills, enabling modern development practices while maintaining maximum compatibility.

### Use Cases

- 🎬 Building scripts for Adobe After Effects, Illustrator, InDesign, etc.
- 🏗️ Creating reusable utility libraries (e.g., `kt-ae-project-tools`, `kt-io`)
- 📝 String manipulation with advanced filtering
- 🔗 Object-oriented programming patterns in ExtendScript
- 🎯 Collection filtering with chainable API

## Key Features

✨ **Core Utilities**

- Pattern-based object-oriented programming (`Extend`, `Mixin`, `Clone`)
- Advanced string utilities with case sensitivity control
- Powerful filter chain system for collections
- Batch operation utilities

🛡️ **Reliability**

- Built-in polyfills for ES2015+ features
- Strict TypeScript compilation
- Comprehensive type safety
- Extensively tested for ExtendScript compatibility

🔧 **Developer Experience**

- Singleton module system for composition
- Clean, chainable API
- Well-documented with IntelliSense support
- Easy integration with downstream projects

## Installation

```bash
npm install kt-core
```

## Quick Start

```typescript
import {
    KT_Core,
    KT_StringUtils,
    KT_FilterChainFactory,
    KT_Paterns,
} from "kt-core";

// Use string utilities
const hasPrefix = KT_StringUtils.startsWith("HelloWorld", "Hello"); // true
const contains = KT_StringUtils.contains("HelloWorld", "World", true); // true

// Use pattern-based OOP
class Animal {
    constructor(public name: string) {}
}

class Dog {
    bark() {
        return "Woof!";
    }
}

KT_Paterns.Extend(Dog, Animal);
KT_Paterns.Mixin(Dog, SomethingElse, "method1", "method2");

// Extend KT_Core with custom modules
KT_Core.Module("CustomUtils", new MyCustomUtilsClass());
```

## API Overview

### 🔗 {@link KT_Core}

The main singleton container providing access to all utilities and pattern system.

| Method                 | Description                                      |
| ---------------------- | ------------------------------------------------ |
| `patterns`             | Reference to {@link KT_Paterns} for OOP patterns |
| `Module(name, module)` | Register a new module at runtime                 |
| `init()`               | Initialize the core (returns module name)        |

### 🔤 {@link KT_StringUtils}

Advanced string utilities with case sensitivity and RegExp support.

| Method         | Parameters                                                                         | Returns   | Description                                      |
| -------------- | ---------------------------------------------------------------------------------- | --------- | ------------------------------------------------ |
| `startsWith()` | `(str: string, search: string \| RegExp, caseSensitive?: boolean)`                 | `boolean` | Check if string starts with pattern              |
| `endsWith()`   | `(str: string, search: string \| RegExp, caseSensitive?: boolean)`                 | `boolean` | Check if string ends with pattern                |
| `contains()`   | `(str: string, search: string \| RegExp, caseSensitive?: boolean)`                 | `boolean` | Check if string contains pattern                 |
| `match()`      | `(str: string, search: string \| RegExp, caseSensitive?: boolean, flags?: string)` | `boolean` | Match string against pattern with optional flags |
| `equals()`     | `(str: string, search: string \| RegExp, caseSensitive?: boolean)`                 | `boolean` | Check exact equality with pattern support        |

### 🎯 {@link KT_FilterChainFactory}

Build complex filter chains for collection processing.

| Method                                   | Description                                 |
| ---------------------------------------- | ------------------------------------------- |
| `constructor(template: FilterTemplate)`  | Create factory with custom filter modes     |
| `sanitize(options)`                      | Convert options to normalized filter object |
| `match(item, options, caseSensitive)`    | Check if item matches filter options        |
| `filter(item, sanitized, caseSensitive)` | Apply sanitized filters to item             |

### 🏛️ {@link KT_Paterns}

Classical OOP patterns for ExtendScript environments.

| Method                                           | Description                               |
| ------------------------------------------------ | ----------------------------------------- |
| `Extend(subClass, superClass)`                   | Prototype-based inheritance               |
| `Mixin(receivingClass, givingClass, ...methods)` | Copy methods from one class to another    |
| `Clone(object)`                                  | Create clone of object using prototype    |
| `ExtendObject(obj, extension)`                   | Extend object with new properties/methods |
| `Interface(name, ...methods)`                    | Define interface contract                 |

## Examples

### String Matching

```typescript
import { KT_StringUtils } from "kt-core";

// Case-insensitive matching
KT_StringUtils.startsWith("HELLO", "hello", false); // true

// RegExp support
const regex = /^hello/i;
KT_StringUtils.match("Hello World", regex); // true

// Exact matching
KT_StringUtils.equals("Adobe", "adobe", false); // true
```

### Filter Chain Usage

```typescript
import { KT_FilterChainFactory } from "kt-core";

const filterTemplate = {
    name: (item, filters, caseSensitive) => {
        // Custom filter logic
        return filters.includes(item.name);
    },
    type: null, // Use built-in 'exact' mode
};

const factory = new KT_FilterChainFactory(filterTemplate);
const item = { name: "Document", type: "PDF" };

const matches = factory.match(item, { name: "Document" }); // true
```

### OOP Patterns

```typescript
import { KT_Paterns } from "kt-core";

class Vehicle {
    constructor(public make: string) {}
}

class Car {
    doors = 4;
}

// Inheritance
KT_Paterns.Extend(Car, Vehicle);

// Mixins
KT_Paterns.Mixin(Car, ElectricMixin, "charge", "getRange");

const myCar = new Car("Toyota");
myCar.charge(); // From ElectricMixin
```

## Documentation

For detailed documentation of each module, see the `/docs` folder:

- 📖 [Core Module Documentation](./docs/KtCore.md)
- 📖 [String Utilities Documentation](./docs/stringUtils.md)
- 📖 [Filter Chain Factory Documentation](./docs/FilterChainFactory.md)
- 📖 [Patterns Documentation](./docs/patterns.md)
- 📖 [Batch Utilities Documentation](./docs/batch.md)

## ExtendScript Compatibility

KT-Core is specifically built for ExtendScript environments. Key compatibility features:

✅ **What's Supported**

- ES2015 syntax (compiles to IE6 JavaScript)
- Arrow functions, classes, template literals
- Polyfilled Array/Object methods
- Modern RegExp features (with ExtendScript compatibility layer)

⚠️ **Important Limitations**

- No spread operator on objects (`{ ...obj }`) - use alternative patterns
- No Promises or async/await
- Array methods built with traditional `for` loops internally
- ExtendScript RegExp has limited support (handled internally)

See the [copilot-instructions.md](./github/copilot-instructions.md) for detailed compatibility guidelines.

## Contributing

This is a core library for the KT ecosystem. When contributing:

1. Maintain backward compatibility
2. Ensure IE6/ExtendScript compatibility
3. Add tests for new functionality
4. Follow the existing code style
5. Update documentation for API changes

## License

MIT © 2024 Miguel de Mendoza

## Related Projects

- 🎬 [kt-ae-project-tools](https://github.com/Octopodo/kt-ae-project-tools) - Adobe After Effects project utilities
- 📁 [kt-io](https://github.com/Octopodo/kt-io) - File system operations for ExtendScript
- 🧪 [kt-testing-suite-core](https://github.com/Octopodo/kt-testing-suite-core) - Testing framework for this library
