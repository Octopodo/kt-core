# Contributing to KT-Core

Thank you for your interest in contributing to KT-Core! This guide explains how to develop features, fix bugs, and maintain compatibility with the ExtendScript ecosystem.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Style & Standards](#code-style--standards)
- [ExtendScript Compatibility](#extendscript-compatibility)
- [Testing](#testing)
- [Documentation](#documentation)
- [Submitting Changes](#submitting-changes)

## Getting Started

### Prerequisites

- Node.js 14+ and npm
- TypeScript knowledge
- Understanding of ExtendScript limitations
- Familiarity with the [Copilot Instructions](./.github/copilot-instructions.md)

### Setup

```bash
# Clone the repository
git clone https://github.com/Octopodo/kt-core.git
cd kt-core

# Install dependencies
npm install

# Build the project
npm run build

# Build tests
npm run build-tests
```

## Development Workflow

### 1. Feature Development

**Before starting:**

- Check existing issues and PRs to avoid duplication
- Open a discussion for significant changes
- Ensure the feature fits the library's scope

**Creating a feature:**

```bash
# Create a feature branch
git checkout -b feature/my-feature-name

# Make changes following the code standards
# Test thoroughly (see Testing section)

# Build to verify no errors
npm run build

# Commit with clear messages
git commit -m "feat: add new utility function"
```

**Code Structure:**

```
src/
  MyNewUtil.ts          # Implementation
  index.ts              # Export here
test/
  myNewUtil.test.ts     # Tests
docs/
  myNewUtil.md          # Documentation
```

### 2. Bug Fixes

```bash
# Create a fix branch
git checkout -b fix/bug-description

# Reproduce the bug with a test
# Fix the bug
# Run tests to verify

npm run build-tests
npm run debug-build-tests
```

### 3. Documentation Updates

- Update module docs when adding features
- Update main README.md for major changes
- Keep examples current and accurate
- Update contributing guide for process changes

## Code Style & Standards

### TypeScript Configuration

- Strict mode enabled (tsconfig.json)
- Target: ES2015 (compiles to IE6)
- CommonJS modules
- No external runtime dependencies

### Naming Conventions

```typescript
// ✅ Public exports: KT_ prefix
export const KT_MyModule = new __KT_MyModule();

// ✅ Private classes/methods: __ prefix
class __KT_MyModule {
    private __internalMethod() {}
}

// ✅ Descriptive, English-only names
const maxRetryAttempts = 3; // Good
const maxTentative = 3; // Poor (ambiguous)
const maxIntentos = 3; // Wrong (not English)
```

### Function Structure

```typescript
// Prefer arrow functions for utils
static myUtility = (param: string): boolean => {
    // Implementation
};

// Clear parameter documentation
/**
 * Check if string matches pattern
 * @param str The string to search
 * @param pattern Pattern to match (string or RegExp)
 * @param caseSensitive Whether to respect case (default: true)
 */
static match = (
    str: string,
    pattern: string | RegExp,
    caseSensitive: boolean = true
): boolean => {
    // Implementation
};
```

### Documentation Comments

```typescript
/**
 * Brief description of what this does
 *
 * More detailed explanation if needed
 *
 * @example
 * const result = method(param);
 *
 * @param param Description and type
 * @returns What it returns
 */
```

### Formatting

- Use Prettier (configured in project)
- Run before committing: `npm run format`
- 4-space indentation
- Clear variable naming

## ExtendScript Compatibility

### ⚠️ Critical - DO NOT USE

❌ **Spread operator on objects:**

```typescript
const copy = { ...original }; // BREAKS transpilation
```

❌ **Array methods:**

```typescript
items.forEach((item) => {}); // Not available
items.map((item) => item.x); // Not available
items.filter((item) => {}); // Not available
```

❌ **Object methods:**

```typescript
Object.keys(obj); // Not available
Object.assign(target, src); // Not available
```

❌ **Modern features:**

```typescript
async function test() {} // Not supported
await promise; // Not supported
const value = ref?.prop; // Optional chaining - risky
```

### ✅ DO USE

✅ **For loops instead of .forEach():**

```typescript
for (let i = 0; i < items.length; i++) {
    // Process items[i]
}
```

✅ **Manual object copying:**

```typescript
const copy: any = {};
for (let key in source) {
    if (source.hasOwnProperty(key)) {
        copy[key] = source[key];
    }
}
```

✅ **instanceof for type checking:**

```typescript
if (obj instanceof Array) {
}
if (obj instanceof RegExp) {
}
```

✅ **Traditional class patterns:**

```typescript
function MyClass() {
    this.prop = value;
}
MyClass.prototype.method = function () {};
```

### RegExp Handling

ExtendScript RegExp is limited. Always:

1. **Escape special characters** when converting strings to RegExp
2. **Extract flags** from RegExp objects and reconstruct them
3. **Test thoroughly** with different patterns

```typescript
// Helper: Escape special regex characters
private static escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Helper: Get flags as string (ExtendScript pattern)
private static getFlags(regex: RegExp): string {
    return (
        (regex.global ? "g" : "") +
        (regex.ignoreCase ? "i" : "") +
        (regex.multiline ? "m" : "")
    );
}
```

### Case Sensitivity

When writing string utilities, **always** handle case sensitivity:

```typescript
// ❌ Wrong: ignores case parameter
static startsWith(str: string, search: string): boolean {
    return str.indexOf(search) === 0;
}

// ✅ Correct: respects case sensitivity
static startsWith(
    str: string,
    search: string,
    caseSensitive: boolean = true
): boolean {
    const s = caseSensitive ? str : str.toLowerCase();
    const p = caseSensitive ? search : search.toLowerCase();
    return s.indexOf(p) === 0;
}
```

## Testing

### Test File Structure

```typescript
import { describe, it, expect } from "kt-testing-suite-core";

describe("MyModule", () => {
    it("should do something specific", () => {
        const result = MyModule.method("input");
        expect(result).toBe("expected");
    });

    it("should handle edge cases", () => {
        expect(MyModule.method("")).toBe(false);
        expect(MyModule.method(null)).toBe(false);
    });
});
```

### Running Tests

```bash
# Build and run tests
npm run build-tests

# Build unminified (for debugging)
npm run debug-build-tests

# Output location: dist.test/index.test.js
```

### What to Test

- ✅ Normal cases
- ✅ Edge cases (empty strings, null, undefined)
- ✅ RegExp patterns
- ✅ Case sensitivity parameters
- ✅ Performance (for critical utilities)
- ✅ Error handling

### Test Coverage Goals

- Aim for 90%+ line coverage
- Test all public methods
- Test both happy path and error cases
- Include regression tests for bug fixes

## Documentation

### Module Documentation

Every public module needs documentation in `/docs/`:

1. **API Reference**: Method signatures and parameters
2. **Usage Examples**: Multiple realistic examples
3. **Advanced Patterns**: Non-obvious uses
4. **Related Documentation**: Links to related modules

### Documentation Template

```markdown
# Module Name Documentation

Brief description.

## Table of Contents

- [Overview](#overview)
- [API Reference](#api-reference)
- [Methods](#methods)
- [Usage Examples](#usage-examples)

## Overview

What this module does and key features.

## API Reference

Summary table of all public methods.

## Methods

Detailed documentation for each method:

- Signature
- Parameters table
- Returns
- Examples

## Usage Examples

3-5 realistic examples showing different use cases.
```

### README Updates

Update the main README.md if:

- Adding new public module
- Changing public API
- New major feature

## Submitting Changes

### Before Submitting

```bash
# Build everything
npm run build
npm run build-tests

# Verify tests pass (check console output)
npm run build-tests

# Check for TypeScript errors
# (Should see no errors in IDE)

# Format code
npm run format
```

### Commit Message Guidelines

```
<type>: <subject>

<body>

<footer>
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `refactor`: Code restructuring
- `test`: Adding/updating tests
- `chore`: Build, dependencies, etc.

**Examples:**

```
feat: add startsWith method to StringUtils
fix: handle null values in FilterChainFactory
docs: add KtCore module documentation
test: add edge case tests for patterns
```

### Pull Request Process

1. **Create descriptive PR title:**
    - Link related issues
    - Summarize changes clearly

2. **PR Description Should Include:**
    - What changed and why
    - Any breaking changes
    - Testing performed
    - Links to related PRs/issues

3. **Verification:**
    - Code builds without errors
    - All tests pass
    - No TypeScript errors
    - Code is formatted

4. **Review Process:**
    - Wait for review feedback
    - Address comments
    - Ensure ExtendScript compatibility
    - Update docs if needed

## Key Files Reference

- `tsconfig.json` - TypeScript configuration (strict mode)
- `kt.config.json` - Build configuration
- `vite.config.ts` - Standard build config
- `vite.es.config.ts` - ExtendScript build config
- `.github/copilot-instructions.md` - Detailed guidelines

## Questions?

- Check [copilot-instructions.md](./.github/copilot-instructions.md) for detailed guidelines
- Review existing modules for patterns
- Open a discussion for clarification

## Code of Conduct

- Be respectful and inclusive
- Use English in code and comments
- Provide constructive feedback
- Help maintain code quality
- Respect ExtendScript compatibility needs

---

Thank you for contributing to KT-Core! 🙏
