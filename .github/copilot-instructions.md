# KT-Core: AI Coding Agent Instructions

## Project Overview

**kt-core** is a TypeScript utility library designed for **Adobe ExtendScript** environments (IE 6-compatible). It provides core utilities and patterns for scripting Adobe applications. The codebase targets ES2015 but builds down to IE6-compatible JavaScript with polyfills.

### Key Purpose

- Foundation framework for KT ecosystem libraries (e.g., `kt-ae-project-tools`, `kt-io`)
- Core utilities for Adobe ExtendScript scripting
- Modular, extensible architecture for pattern-based development
- String manipulation, filtering, and object utilities
- Polyfill infrastructure for IE6-compatible output

---

## 📋 Quick Reference: ExtendScript Compatibility Do's & Don'ts

⚠️ **CRITICAL - Do NOT:**

- Use spread operator on objects (`{ ...obj }`) - breaks ExtendScript transpilation
- Use Array/Object methods: `forEach`, `map`, `filter`, `reduce`, etc.
- Use Promises, async/await, or other modern ES6+ features
- Assume RegExp works like modern JavaScript
- Omit `caseSensitive` boolean parameters in string utilities

✅ **ALWAYS:**

- Use `for` loops instead of Array methods
- For array type check use instanceof: `if (obj instanceof Array) { ... }`
- Escape special regex characters when converting strings to RegExp
- Handle both `string` and `RegExp` inputs in string utilities
- Include polyfills via `@include` directives at module top
- Use `__` prefix for private methods/classes
- Write comments and variable names in English

---

## Architecture & Component Boundaries

### Core Components

**1. KtCore Module (`src/KtCore.ts`)**

- Singleton instance providing base module container
- Entry point: `KT_Core` export
- Provides `Module()` method for extending the library at runtime
- Contains reference to `KT_Paterns` for pattern utilities
- Not a complex class; acts as a namespace/container

**2. Pattern System (`src/patterns.ts`)**

- Object-oriented programming patterns: `Extend`, `Mixin`, `Clone`, `ExtendObject`
- Classical prototypal inheritance patterns (NOT class-based where possible)
- Used throughout codebase for extending behavior
- Example: `Extend(subClass, superClass)` - uses temporary constructor for prototype chain
- Export: `KT_Paterns` (note: spelled "Paterns" not "Patterns")

**3. String Utilities (`src/stringUtils.ts`)**

- Case-sensitive/insensitive string operations
- **Critical**: Handles both `string` and `RegExp` inputs consistently
- Methods: `startsWith()`, `endsWith()`, `contains()`, `match()`, `replace()`
- Pattern escape logic: Must escape special regex chars when converting strings to RegExp
- RegExp flag handling: Reconstructs flags from properties since ExtendScript has limited RegExp support
- Export: `KT_StringUtils`

**4. Filter Chain Factory (`src/FilterChainFactory.ts`)**

- Advanced filtering system for collections
- Template-based: Constructor accepts `FilterTemplate` (dictionary of filter functions)
- Built-in modes: `exact`, `startsWith`, `endsWith`, `contains`, `match`
- Each filter mode supports multiple filters and RegExp patterns
- Chains filters with AND/OR/NOT logic
- Used in `createFilterChain()` - returns chainable object with filter methods
- Export: `KT_FilterChainFactory`

### Library Dependencies (`src/lib/`)

**Critical Polyfills:**

- `json2.js` - JSON stringify/parse (must include, ExtendScript may not have it)
- `es-shim.ts/js` - ES2015+ polyfills for IE6 compatibility
- Both are included via `@include` directives at top of `src/index.ts`

### Batch Utilities (`src/batch.ts`)

- Utility function `createBatchJob()` for bulk operations on collections
- Simple iteration pattern - not heavily used

---

## Development Workflows & Build System

### Build Commands

```bash
npm run build              # Full production build
npm run build-tests       # Build test suite (uglified, minified)
npm run debug-build-tests # Build test suite (unminified for debugging)
```

### Build Toolchain

- **Primary**: Vite + Rollup (via `vite.config.ts` and `vite.es.config.ts`)
- **TypeScript**: ES2015 target, CommonJS modules (tsconfig.json)
- **Babel**: Transpiles to IE6 compatibility via `@babel/preset-env`
- **Configuration**: Dual Vite configs handle both standard and ExtendScript builds
- **Key files**: `kt.config.json` controls test build output (minify, uglify, watch settings)

### Testing Framework

- **kt-testing-suite-core**: Custom testing framework (similar to Jest/Mocha syntax)
- Test files: `test/*.test.ts` or `test/*.test.jsx`
- Entry: `test/index.test.ts` imports specific test files
- Test output: Compiled to `dist.test/index.test.js`
- Test runner invoked via: `runTests()` from `kt-testing-suite-core`

**Example test pattern** (from `string.test.ts`):

```typescript
import { describe, it, expect } from "kt-testing-suite-core";

describe("Feature Name", () => {
    it("should test behavior", () => {
        expect(result).toBe(expected);
    });
});
```

---

## Project-Specific Conventions

### Naming & Structure Patterns

- **Exports prefixed with `KT_`**: `KT_Core`, `KT_StringUtils`, `KT_FilterChainFactory`, `KT_Paterns`
- **Private members/classes**: Use `__` prefix (double underscore)
    - Example: `class __KT_Core` (not exported internally), method `__sanitizeValue()`
- **Singleton Pattern**: Classes like `__KT_StringUtils` instantiated as `const KT_StringUtils = new __KT_StringUtils()`
- **Comments & Code**: Always write in English, even if asked otherwise
- **Variable/Function Names**: Always use English identifiers for long-term maintainability

### ExtendScript Compatibility Requirements

**🔴 Critical Incompatibilities:**

- **No spread operator on objects**: `{ ...obj }` breaks transpilation (arrays OK)
- **No Array methods**: Never use `forEach`, `map`, `filter`, `reduce` - use `for` loops instead
- **No Object modertn methods**: Never use Object.keys, Object.assign, etc.

- **No modern features**: No Promises, async/await, Symbols, Proxies, etc.

**⚠️ Limited Features Requiring Special Handling:**

- **RegExp limitations**: ExtendScript has reduced RegExp support
    - Must manually extract and reconstruct flags (see `stringUtils.ts` pattern)
    - Always escape special regex chars when converting strings to RegExp
    - Example: `search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")`
- **Case sensitivity handling**: Many utilities require explicit `caseSensitive: boolean` parameter
    - This is not optional - handle case sensitivity consistently across similar methods
- **Polyfills required**: json2.js and es-shim.js must be included via `@include` directives

### Code Style Examples

**✅ Correct - for loops and no spread:**

```typescript
const result: any = {};
for (let key in source) {
    if (source.hasOwnProperty(key)) {
        result[key] = source[key];
    }
}
```

**❌ Incorrect - uses spread and modern syntax:**

```typescript
const result = { ...source };
const mapped = source.map((item) => item.value);
```

**✅ Correct - explicit case handling:**

```typescript
static startsWith(str: string, search: string, caseSensitive: boolean): boolean {
    const s = caseSensitive ? str : str.toLowerCase();
    const p = caseSensitive ? search : search.toLowerCase();
    return s.indexOf(p) === 0;
}
```

**❌ Incorrect - ignores case sensitivity:**

```typescript
static startsWith(str: string, search: string): boolean {
    return str.indexOf(search) === 0;  // Doesn't respect case parameter
}
```

### Module Extension Pattern

Use `KT_Core.Module(name, module)` to add new modules at runtime:

```typescript
KT_Core.Module("NewUtils", new KT_NewUtils());
// Access later as: KT_Core.NewUtils
```

### Filter Chain Usage Pattern

```typescript
const template = {
    byName: (val, filters, caseSensitive) => /* logic */,
    byType: (val, filters, caseSensitive) => /* logic */
};
const factory = new KT_FilterChainFactory(template);
const chain = factory.createFilterChain();
```

---

## Integration Points & External Dependencies

### Dependencies

- `types-for-adobe`: Type definitions for Adobe ExtendScript API
- `typescript ^4.6.4`: Strict type checking required
- `kt-extendscript-builder`: Build tool wrapper (via npm scripts)
- `kt-testing-suite-core`: Test framework
- Referenced in downstream projects: `kt-ae-project-tools`, `kt-io` (see ecosystem)

### Ecosystem Integration

This library serves as the foundation for other KT packages. It provides:

- **Pattern system** for object-oriented programming in ExtendScript environments
- **String utilities** used by downstream libraries for text operations
- **Filter chain factory** for collection processing patterns
- **Module extension system** allowing runtime composition of functionality

### Critical Type Definitions

- `types-for-adobe/shared/global` - Adobe global objects (alert, $.writeln, etc.)
- `types-for-adobe/shared/JavaScript` - JavaScript API extensions in ExtendScript
- `src/lib/json2.d.ts` - JSON types for polyfill
- `src/lib/es-shim.ts` - ES2015 shimmed types

### Adobe ExtendScript API Usage

- `alert()` - Show dialog (see `KtCore.ts` salute method)
- `$.writeln()` - Log to ESTK console (used in error checking)

---

## Common Development Tasks

### Adding a New Utility Class

1. Create `src/NewUtil.ts` with class `KT_NewUtil`
2. Use `__` prefix for private methods
3. Add test file: `test/newUtil.test.ts` using `kt-testing-suite-core`
4. Import in `src/index.ts` and export `KT_NewUtil`
5. For case-sensitive operations, follow `stringUtils.ts` pattern

### Adding Filter Modes

1. In `FilterChainFactory.ts`, add to `commonModes` object
2. Must match signature: `(itemValue: any, filters: any[], caseSensitive: boolean) => boolean`
3. Handle both string and RegExp filters
4. Add corresponding test

### Debugging Tests

```bash
npm run debug-build-tests  # Builds without minification
# Check dist.test/index.test.js for readable output
```

---

## Important Don'ts

- ❌ **Do NOT** modify `tsconfig.json` or `kt.config.json` unless explicitly instructed
- ❌ **Do NOT** write tests unless specifically asked
- ❌ **Do NOT** write documentation unless specifically asked
- ❌ **Do NOT** use spread operator on objects: `{ ...obj }`
- ❌ **Do NOT** use Array methods like `forEach`, `map`, `filter`, `reduce`
- ❌ **Do NOT** use modern JavaScript features (Promises, async/await, etc.)
- ❌ **Do NOT** assume ExtendScript RegExp behaves like modern JavaScript

---

## Key Files Reference

- **Entry point**: `src/index.ts` (includes polyfills, exports all public APIs)
- **Config**: `kt.config.json` (test build settings), `tsconfig.json` (strict mode), `vite.es.config.ts` (ExtendScript compilation)
- **Patterns reference**: `src/patterns.ts` - understand before extending with OOP patterns
- **String utilities reference**: `src/stringUtils.ts` - understand case sensitivity & RegExp handling before writing similar utilities

---

## Writing documentation guidelines

- Documentation consists on one md file at the root of the project and more detailed docs on docs folder for each module
- When writing docs for the root md file, write a brief project overview, some relevant examples of usage and links to the docs folder and other repos used in this project
- Follow the existing documentation style in the codebase
- When documenting functions always write a brief description, include parameter types, defaults(if any) and return types clearly in a table format
- Always include an index of contents at the start of the documentation file
- If a type is on this codebase, try to link to it using the format `{@link TypeName}`
- For document modules use the KT_Project.moduleName format to refer to them. Look at KT_Project.ts for reference.
- On api indexes dont use KT_Project.moduleName format, just the method name
- Use emojis wisely to highlight important sections or notes
