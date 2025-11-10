# KT-Core Documentation Overview

Welcome to the KT-Core documentation! This is the foundation library for the KT ecosystem, providing essential utilities for Adobe ExtendScript development.

## 📚 Documentation Structure

### Starting Points

1. **[README.md](./README.md)** - Start here!
    - Project overview
    - Quick examples
    - Installation instructions
    - Key features

2. **[API.md](./docs/API.md)** - API Reference
    - Complete API index
    - All methods and signatures
    - Quick lookup reference

3. **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Contributing Guide
    - How to develop new features
    - Code standards and patterns
    - ExtendScript compatibility rules
    - Testing and documentation requirements

### Module Documentation

Each module has detailed documentation in the `/docs` folder:

#### 🔗 [KT_Core](./docs/KtCore.md)

The main singleton container providing module composition and pattern access.

**What it does:**

- Singleton instance for accessing all utilities
- Runtime module registration system
- Entry point for the library

**Key methods:**

- `Module(name, module)` - Register modules
- `init()` - Initialize core
- `patterns` - Access pattern utilities

#### 🔤 [String Utilities](./docs/stringUtils.md)

Advanced string matching with case sensitivity and RegExp support.

**What it does:**

- Pattern matching (startsWith, endsWith, contains)
- Exact equality checking
- RegExp support with automatic escaping
- Case sensitivity control

**Key methods:**

- `startsWith()` - Check string prefix
- `endsWith()` - Check string suffix
- `contains()` - Check substring
- `equals()` - Exact match
- `match()` - Pattern matching with flags

#### 🎯 [Filter Chain Factory](./docs/FilterChainFactory.md)

Advanced collection filtering with template-based customization.

**What it does:**

- Template-based filtering system
- Built-in filter modes (exact, startsWith, endsWith, contains)
- Custom filter support
- Batch filtering with reusable filters

**Key methods:**

- `match(item, options, caseSensitive?)` - Filter a single item
- `filter(item, sanitized, caseSensitive?)` - Apply pre-sanitized filters
- `sanitize(options)` - Normalize filter options

#### 🏛️ [Patterns](./docs/patterns.md)

Classical OOP patterns for ExtendScript (no ES6 class syntax).

**What it does:**

- Prototype-based inheritance (Extend)
- Method composition (Mixin)
- Object cloning (Clone)
- Object extension (ExtendObject)
- Interface contracts (Interface)

**Key methods:**

- `Extend(subClass, superClass)` - Inheritance
- `Mixin(receivingClass, givingClass, ...methods?)` - Composition
- `Clone(object)` - Prototype cloning
- `ExtendObject(obj, extension)` - Object extension
- `Interface(name, ...methods)` - Define contracts

#### 📦 [Batch Utilities](./docs/batch.md)

Lightweight batch operations on collections.

**What it does:**

- Create reusable batch job functions
- Apply methods to collection items
- Collect results efficiently

**Key functions:**

- `createBatchJob(collection, method, ...args)` - Create batch function

## 🎓 Learning Paths

### For New Users

1. Read [README.md](./README.md) - Get overview
2. Check [Quick Start](./README.md#quick-start) - See basic usage
3. Read [API.md](./docs/API.md) - Understand what's available
4. Explore [Examples](./README.md#examples) - See real use cases

### For Developers

1. Read [CONTRIBUTING.md](./CONTRIBUTING.md) - Understand process
2. Review [copilot-instructions.md](./.github/copilot-instructions.md) - Learn ExtendScript rules
3. Study existing modules in `src/` - Understand patterns
4. Review test files in `test/` - See test patterns
5. Check out [Development Workflows](./CONTRIBUTING.md#development-workflow)

### For Extending the Library

1. Read [Module Extension Pattern](./docs/KtCore.md#module-extension-pattern)
2. Review [KT_Core documentation](./docs/KtCore.md#module-system)
3. Look at [Adding a New Utility Class](./github/copilot-instructions.md#adding-a-new-utility-class)
4. Follow the [Contributing guide](./CONTRIBUTING.md)

### For Advanced Users

1. Study [Filter Chain Factory](./docs/FilterChainFactory.md) - Complex filtering
2. Learn [OOP Patterns](./docs/patterns.md) - Design patterns
3. Review [Advanced Examples](./docs/patterns.md#usage-examples) - Complex use cases
4. Check [Batch Performance](./docs/batch.md#performance-notes) - Optimization

## 🚀 Common Tasks

### Task: Add a New Utility Module

1. Create `src/MyUtil.ts` with class `__KT_MyUtil`
2. Export as `KT_MyUtil` in `src/index.ts`
3. Create tests in `test/myUtil.test.ts`
4. Create documentation in `docs/myUtil.md`
5. Update README.md with reference

See [Adding a New Utility Class](./github/copilot-instructions.md#adding-a-new-utility-class)

### Task: Add a Custom Filter Mode

1. Create custom filter function matching `FilterFn` signature
2. Add to FilterChainFactory template
3. Add tests
4. Document with examples

See [Adding Filter Modes](./github/copilot-instructions.md#adding-filter-modes)

### Task: Use KT-Core in Your Project

```typescript
import {
    KT_Core,
    KT_StringUtils,
    KT_FilterChainFactory,
    KT_Paterns,
} from "kt-core";

// Use utilities...
```

### Task: Extend KT_Core with Custom Module

```typescript
import { KT_Core } from "kt-core";

class MyUtils {
    /* ... */
}

KT_Core.Module("MyUtils", new MyUtils());
// Access as: KT_Core.MyUtils
```

## ⚠️ Important Notes

### ExtendScript Compatibility

KT-Core is built specifically for Adobe ExtendScript (IE6-compatible). The library:

✅ **Supports:**

- ES2015 syntax (compiles to IE6 JavaScript)
- Polyfills for modern features
- RegExp patterns (with compatibility layer)
- String matching with case sensitivity

❌ **Does NOT Support:**

- Spread operators on objects
- Array methods (map, filter, forEach, etc.)
- Modern Object methods (Object.keys, Object.assign, etc.)
- Promises, async/await
- ES6 class syntax issues in ExtendScript

**Read [copilot-instructions.md](./.github/copilot-instructions.md) for detailed compatibility guidelines.**

### Version Information

- **Current Version:** 1.1.1
- **Node.js Requirement:** 14+
- **TypeScript Version:** 4.6.4+
- **Target Environment:** Adobe ExtendScript (IE6-compatible)

## 📚 Document Index

| Document                                                     | Purpose                                 |
| ------------------------------------------------------------ | --------------------------------------- |
| [README.md](./README.md)                                     | Project overview, quick start, examples |
| [API.md](./docs/API.md)                                      | Complete API reference and index        |
| [CONTRIBUTING.md](./CONTRIBUTING.md)                         | Development guide and standards         |
| [KtCore.md](./docs/KtCore.md)                                | KT_Core module documentation            |
| [stringUtils.md](./docs/stringUtils.md)                      | String utilities documentation          |
| [FilterChainFactory.md](./docs/FilterChainFactory.md)        | Filter chain documentation              |
| [patterns.md](./docs/patterns.md)                            | OOP patterns documentation              |
| [batch.md](./docs/batch.md)                                  | Batch utilities documentation           |
| [copilot-instructions.md](./.github/copilot-instructions.md) | Detailed development guidelines         |

## 🔗 External Resources

- **Repository:** https://github.com/Octopodo/kt-core
- **npm:** https://www.npmjs.com/package/kt-core
- **Related Projects:**
    - [kt-ae-project-tools](https://github.com/Octopodo/kt-ae-project-tools)
    - [kt-io](https://github.com/Octopodo/kt-io)
    - [kt-testing-suite-core](https://github.com/Octopodo/kt-testing-suite-core)

## 💡 Tips for Success

1. **Always check TypeScript errors** - Strict mode catches many issues early
2. **Test in ExtendScript** - Simulator or actual Adobe app
3. **Review existing code** - Patterns are established for good reasons
4. **Ask for review** - Better to get feedback early in development
5. **Keep it simple** - Simple, readable code is better than clever code
6. **Write tests first** - TDD helps clarify requirements
7. **Document as you code** - Don't postpone documentation

## 🤝 Getting Help

- **Documentation:** Start with the relevant module documentation
- **Examples:** Check existing modules and tests
- **Code Review:** Open a PR for detailed feedback
- **Issues:** Open a GitHub issue for bugs or feature requests

## 📝 License

MIT © 2024 Miguel de Mendoza

---

**Happy coding! 🎉**

If you have questions or suggestions about the documentation, please open an issue on GitHub.
