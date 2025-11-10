# KT_StringUtils Module Documentation

Comprehensive string utility functions with support for case sensitivity and both string and RegExp patterns. Fully compatible with ExtendScript.

## Table of Contents

- [Overview](#overview)
- [API Reference](#api-reference)
- [Methods](#methods)
- [Usage Examples](#usage-examples)
- [Extended Features](#extended-features)
- [ExtendScript Compatibility](#extendscript-compatibility)

## Overview

`KT_StringUtils` provides a robust set of string manipulation utilities designed specifically for ExtendScript environments. All methods handle:

- **Case Sensitivity Control**: Optional `caseSensitive` parameter (default: `true`)
- **Dual Input Types**: Accept both `string` and `RegExp` patterns
- **RegExp Safety**: Special character escaping and flag reconstruction
- **IE6 Compatibility**: No modern JavaScript features, ExtendScript-friendly

### Key Features

✨ Built-in pattern matching without external dependencies  
✨ Consistent API across all methods  
✨ Automatic RegExp flag handling for ExtendScript  
✨ Edge case handling (empty strings, null values)

## API Reference

### All Methods

| Method         | Parameters                              | Returns   | Description                         |
| -------------- | --------------------------------------- | --------- | ----------------------------------- |
| `startsWith()` | `(str, search, caseSensitive?)`         | `boolean` | Check if string starts with pattern |
| `endsWith()`   | `(str, search, caseSensitive?)`         | `boolean` | Check if string ends with pattern   |
| `contains()`   | `(str, search, caseSensitive?)`         | `boolean` | Check if string contains pattern    |
| `equals()`     | `(str, search, caseSensitive?)`         | `boolean` | Check exact equality                |
| `match()`      | `(str, search, caseSensitive?, flags?)` | `boolean` | Match with optional regex flags     |

## Methods

### `startsWith()`

Check if a string begins with a specified pattern.

**Signature:**

```typescript
static startsWith(
    str: string,
    search: string | RegExp,
    caseSensitive?: boolean
): boolean
```

**Parameters:**

| Parameter       | Type               | Default | Description                 |
| --------------- | ------------------ | ------- | --------------------------- |
| `str`           | `string`           | -       | The string to search within |
| `search`        | `string \| RegExp` | -       | The pattern to find         |
| `caseSensitive` | `boolean`          | `true`  | Whether to respect case     |

**Returns:** `true` if string starts with the pattern, `false` otherwise

**Edge Cases:**

- Empty search string returns `false`
- Search pattern longer than string returns `false`
- Pattern is anchored to start of string

**Example:**

```typescript
import { KT_StringUtils } from "kt-core";

KT_StringUtils.startsWith("HelloWorld", "Hello"); // true
KT_StringUtils.startsWith("HelloWorld", "hello", false); // true (case-insensitive)
KT_StringUtils.startsWith("HelloWorld", "World"); // false
KT_StringUtils.startsWith("Test", ""); // false (empty pattern)

// RegExp support
const regex = /^hello/i;
KT_StringUtils.startsWith("HelloWorld", regex); // true
```

### `endsWith()`

Check if a string ends with a specified pattern.

**Signature:**

```typescript
static endsWith(
    str: string,
    search: string | RegExp,
    caseSensitive?: boolean
): boolean
```

**Parameters:**

| Parameter       | Type               | Default | Description                 |
| --------------- | ------------------ | ------- | --------------------------- |
| `str`           | `string`           | -       | The string to search within |
| `search`        | `string \| RegExp` | -       | The pattern to find         |
| `caseSensitive` | `boolean`          | `true`  | Whether to respect case     |

**Returns:** `true` if string ends with the pattern, `false` otherwise

**Edge Cases:**

- Empty search string returns `false`
- Search pattern longer than string returns `false`
- Pattern is anchored to end of string

**Example:**

```typescript
KT_StringUtils.endsWith("HelloWorld", "World"); // true
KT_StringUtils.endsWith("HelloWorld", "world", false); // true (case-insensitive)
KT_StringUtils.endsWith("HelloWorld", "Hello"); // false
KT_StringUtils.endsWith("file.jpg", ".JPG", false); // true

// RegExp support
const regex = /world$/i;
KT_StringUtils.endsWith("HelloWorld", regex); // true
```

### `contains()`

Check if a string contains a specified pattern anywhere.

**Signature:**

```typescript
static contains(
    str: string,
    search: string | RegExp,
    caseSensitive?: boolean
): boolean
```

**Parameters:**

| Parameter       | Type               | Default | Description                 |
| --------------- | ------------------ | ------- | --------------------------- |
| `str`           | `string`           | -       | The string to search within |
| `search`        | `string \| RegExp` | -       | The pattern to find         |
| `caseSensitive` | `boolean`          | `true`  | Whether to respect case     |

**Returns:** `true` if pattern is found anywhere in the string, `false` otherwise

**Edge Cases:**

- Empty search string returns `false`
- Search pattern longer than string returns `false`
- Pattern can match anywhere in the string (no anchors)

**Example:**

```typescript
KT_StringUtils.contains("HelloWorld", "World"); // true
KT_StringUtils.contains("HelloWorld", "lo"); // true
KT_StringUtils.contains("HelloWorld", "world", false); // true (case-insensitive)
KT_StringUtils.contains("Test", "xyz"); // false

// RegExp support
const regex = /wo\w+d/i;
KT_StringUtils.contains("HelloWorld", regex); // true (matches "World")
```

### `equals()`

Check if a string exactly equals a specified pattern.

**Signature:**

```typescript
static equals(
    str: string,
    search: string | RegExp,
    caseSensitive?: boolean
): boolean
```

**Parameters:**

| Parameter       | Type               | Default | Description             |
| --------------- | ------------------ | ------- | ----------------------- |
| `str`           | `string`           | -       | The string to check     |
| `search`        | `string \| RegExp` | -       | The pattern to match    |
| `caseSensitive` | `boolean`          | `true`  | Whether to respect case |

**Returns:** `true` if string exactly matches the pattern, `false` otherwise

**Edge Cases:**

- If `search` is string and lengths differ, returns `false` immediately
- Case-insensitivity is applied before comparison

**Example:**

```typescript
KT_StringUtils.equals("Adobe", "Adobe"); // true
KT_StringUtils.equals("Adobe", "adobe", false); // true (case-insensitive)
KT_StringUtils.equals("Adobe", "adobe", true); // false (case-sensitive)
KT_StringUtils.equals("Test", "Testing"); // false (different lengths)

// RegExp with exact anchor
const regex = /^adobe$/i;
KT_StringUtils.equals("Adobe", regex); // true
```

### `match()`

Match a string against a pattern with optional additional regex flags.

**Signature:**

```typescript
static match(
    str: string,
    search: string | RegExp,
    caseSensitive?: boolean,
    flags?: string
): boolean
```

**Parameters:**

| Parameter       | Type               | Default     | Description                     |
| --------------- | ------------------ | ----------- | ------------------------------- |
| `str`           | `string`           | -           | The string to search within     |
| `search`        | `string \| RegExp` | -           | The pattern to match            |
| `caseSensitive` | `boolean`          | `true`      | Whether to respect case         |
| `flags`         | `string`           | `undefined` | Additional regex flags to apply |

**Returns:** `true` if the pattern matches, `false` otherwise

**Flags:**

- `"i"` - Case insensitive (added automatically if `caseSensitive` is false)
- `"g"` - Global (match all)
- `"m"` - Multiline
- Custom flags can be combined

**Example:**

```typescript
// Basic matching
KT_StringUtils.match("HelloWorld", /World/); // true
KT_StringUtils.match("HelloWorld", /world/, false); // true (case-insensitive)

// With additional flags
KT_StringUtils.match("test\nTEST", /^test/, true, "m"); // true (multiline)
KT_StringUtils.match("abc", /a.c/); // true

// String pattern with flags
KT_StringUtils.match("Test123", "test", false, ""); // true
```

## Usage Examples

### Basic String Checking

```typescript
import { KT_StringUtils } from "kt-core";

// File type checking
const isImageFile = (filename: string): boolean => {
    return (
        KT_StringUtils.endsWith(filename, ".jpg", false) ||
        KT_StringUtils.endsWith(filename, ".png", false)
    );
};

isImageFile("photo.JPG"); // true
isImageFile("photo.png"); // true
isImageFile("data.json"); // false
```

### Path and URL Handling

```typescript
// Check for absolute path
const isAbsolutePath = (path: string): boolean => {
    return (
        KT_StringUtils.startsWith(path, "//", true) ||
        KT_StringUtils.startsWith(path, "C:\\", false)
    );
};

// Check for valid URL
const isValidURL = (url: string): boolean => {
    return (
        KT_StringUtils.startsWith(url, "http://") ||
        KT_StringUtils.startsWith(url, "https://")
    );
};
```

### Case-Insensitive Filtering

```typescript
// Search with case flexibility
function findInArray(arr: string[], search: string): string[] {
    const results: string[] = [];
    for (let i = 0; i < arr.length; i++) {
        if (KT_StringUtils.contains(arr[i], search, false)) {
            results.push(arr[i]);
        }
    }
    return results;
}

const items = ["Adobe", "Audition", "Premiere"];
findInArray(items, "aud"); // ["Adobe", "Audition"]
```

### RegExp Pattern Matching

```typescript
// Email-like pattern
const emailRegex = /.+@.+\..+/;
KT_StringUtils.match("user@example.com", emailRegex); // true

// Version number pattern
const versionRegex = /^\d+\.\d+\.\d+$/;
KT_StringUtils.equals("1.0.0", versionRegex); // true
KT_StringUtils.equals("1.0", versionRegex); // false
```

## Extended Features

### RegExp Flag Reconstruction

When a RegExp is passed, the utility automatically:

1. Extracts flags from the RegExp object properties (`global`, `ignoreCase`, `multiline`)
2. Combines them into a flag string
3. Adds case-insensitivity flag if needed
4. Reconstructs a new RegExp with proper anchors

**Why This Matters:**
ExtendScript has limited RegExp support, so flags must be manually reconstructed and special characters must be escaped.

### Special Character Escaping

When converting string patterns to RegExp, the following characters are automatically escaped:

- `. * + ? ^ $ { } ( ) | [ ] \`

This prevents unintended regex behavior:

```typescript
// The dot won't be treated as "any character"
KT_StringUtils.contains("file.txt", ".txt"); // true

// Without escaping, this would match "fileAtxt"
KT_StringUtils.contains("fileAtxt", ".txt"); // false ✓
```

## ExtendScript Compatibility

### What's Different

`KT_StringUtils` handles ExtendScript's RegExp limitations transparently:

✅ **Supported:**

- String patterns with special characters
- Both string and RegExp inputs
- Case sensitivity control
- Modern-looking API (though ExtendScript-compatible internally)

⚠️ **Limitations Handled:**

- ExtendScript RegExp is limited (handled internally with escaping)
- No `String.prototype` methods used (uses static methods)
- All code uses `for` loops instead of Array methods

### Performance Considerations

- **String Input**: More efficient than RegExp (no parsing overhead)
- **RegExp Input**: RegExp is parsed each time (recommended for complex patterns)
- **Large Arrays**: Use with loops for collection filtering (see `KT_FilterChainFactory` for advanced filtering)

## Related Documentation

- 📖 [Main README](../README.md)
- 📖 [Filter Chain Factory Documentation](./FilterChainFactory.md) - Advanced filtering with string utilities
- 📖 [KT_Core Documentation](./KtCore.md)
