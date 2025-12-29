# KT_Units

Robust, scalable, and host-agnostic unit system for Adobe After Effects and Premiere Pro.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
    - [Unit Specializations](#unit-specializations)
- [Key Concepts](#key-concepts)
    - [Context-Aware Conversions](#context-aware-conversions)
    - [Universal Arithmetic](#universal-arithmetic)
- [API Reference](#api-reference)
    - [KT_Unit Properties](#kt_unit-properties)
    - [KT_Unit Methods](#kt_unit-methods)
    - [Math Operations](#math-operations)
- [Specialized Adobe Units](#specialized-adobe-units)
    - [KT_Time](#kt_time)
    - [KT_Color](#kt_color)
    - [KT_Rect](#kt_rect)
    - [KT_Timecode (Utility)](#kt_timecode-utility)

## Overview

The `KT_Units` module provides a comprehensive framework for handling various unit types (Time, Pixels, Vectors, Colors, etc.) with automatic conversion, arithmetic support, and cross-application compatibility. It follows the **Open/Closed Principle**, allowing for new unit types to be added without modifying existing code.

## Architecture

The system uses a tiered inheritance structure to optimize performance and type safety:

- **KT_Unit<T>**: Base abstract class for all units. Handles identity and basic conversion logic.
- **KT_ScalarUnit**: Specialized base for 1D values (numbers). Implements scalar arithmetic.
- **KT_VectorUnit**: Specialized base for ND values (arrays). Implements component-wise math and scalar broadcasting.

### Unit Specializations

| Unit          | Parent          | Value Type | Description                                                       |
| ------------- | --------------- | ---------- | ----------------------------------------------------------------- |
| `KT_Scalar`   | `KT_ScalarUnit` | `number`   | Generic 1D unit (px, %, etc.).                                    |
| `KT_Vector2D` | `KT_VectorUnit` | `number[]` | 2D vector for positions or scales.                                |
| `KT_Vector3D` | `KT_VectorUnit` | `number[]` | 3D vector for 3D positions.                                       |
| `KT_Time`     | `KT_Scalar`     | `number`   | Time in `seconds` or `frames`. Supports context-aware conversion. |
| `KT_FPS`      | `KT_Scalar`     | `number`   | Frame rate helper.                                                |
| `KT_Percent`  | `KT_ScalarUnit` | `number`   | Universal unit. Calculates absolute values based on context.      |
| `KT_Angle`    | `KT_ScalarUnit` | `number`   | Rotation math (`deg` vs `rad`).                                   |
| `KT_Color`    | `KT_VectorUnit` | `number[]` | RGBA colors. Supports `decimal` (0-1) and `8bit` (0-255).         |
| `KT_Rect`     | `KT_VectorUnit` | `number[]` | Rectangle [x, y, w, h] with center calculation helpers.           |

---

## Key Concepts

### Context-Aware Conversions

Some units (like `KT_Time` or `KT_Percent`) require environmental context (FPS, reference size) to perform conversions during calculations.

```typescript
const oneSecond = KT_Time.seconds(1);
const frames = oneSecond.to("frames", 24); // Context = 24 fps
```

### Universal Arithmetic

Units can interact with each other even across different hierarchies if the unit being transformed knows how to convert itself to the target type.

```typescript
const position = new KT_Vector2D([100, 100], "px");
const shift = new KT_Percent(10);

// Move 10% relative to a 1920x1080 screen
const newPos = position.add(shift, [1920, 1080]);
```

---

## API Reference

### KT_Unit Properties

| Name    | Type     | Description                                  |
| ------- | -------- | -------------------------------------------- |
| `value` | `T`      | The underlying value (number or number[]).   |
| `type`  | `string` | The unit identifier (e.g., "px", "seconds"). |

### KT_Unit Methods

#### `to(targetType, context?)`

Converts current unit to another type. **Returns**: `KT_Unit<any>`.

| Name         | Type     | Default     | Description                                               |
| ------------ | -------- | ----------- | --------------------------------------------------------- |
| `targetType` | `string` | -           | The unit type to convert into.                            |
| `context`    | `any`    | `undefined` | Optional conversion factors (FPS, base dimensions, etc.). |

**Example**:

```typescript
const pixels = new KT_Scalar(100, "px");
const percentage = pixels.to("percent", 1000); // 10%
```

#### `toString()`

Returns human-readable string. **Returns**: `string`.

**Example**:

```typescript
console.log(KT_Time.seconds(5).toString()); // "5 seconds"
```

#### `equals(unit, context?)`

Compares two units after conversion. **Returns**: `boolean`.

| Name      | Type      | Default     | Description                          |
| --------- | --------- | ----------- | ------------------------------------ |
| `unit`    | `KT_Unit` | -           | The unit to compare against.         |
| `context` | `any`     | `undefined` | Optional context for the conversion. |

**Example**:

```typescript
const t1 = KT_Time.seconds(1);
const t2 = KT_Time.frames(24);
console.log(t1.equals(t2, 24)); // true
```

---

### Math Operations

Available in `KT_ScalarUnit` and `KT_VectorUnit`.

#### `add(unit, context?)` / `sub(unit, context?)`

Performs addition or subtraction. **Returns**: `New Subclass Instance`.

| Name      | Type      | Default     | Description                                    |
| --------- | --------- | ----------- | ---------------------------------------------- |
| `unit`    | `KT_Unit` | -           | The unit operand to apply.                     |
| `context` | `any`     | `undefined` | Optional context for the automatic conversion. |

**Example**:

```typescript
const pos = new KT_Vector2D([0, 0], "px");
const offset = new KT_Vector2D([10, 10], "px");
const result = pos.add(offset); // [10, 10]
```

#### `mul(operand, context?)` / `div(operand, context?)`

Performs multiplication or division. **Returns**: `New Subclass Instance`.

| Name      | Type                | Default     | Description                               |
| --------- | ------------------- | ----------- | ----------------------------------------- |
| `operand` | `KT_Unit \| number` | -           | The unit or scalar to multiply/divide by. |
| `context` | `any`               | `undefined` | Optional context for conversion.          |

**Example**:

```typescript
const size = new KT_Vector2D([100, 100], "px");
const doubled = size.mul(2); // [200, 200]
```

---

## Specialized Adobe Units

### KT_Time

| Static Method  | Arguments     | Returns   | Description                     |
| -------------- | ------------- | --------- | ------------------------------- |
| `seconds(val)` | `val: number` | `KT_Time` | Creates a time unit in seconds. |
| `frames(val)`  | `val: number` | `KT_Time` | Creates a time unit in frames.  |

**Example**:

```typescript
const t = KT_Time.seconds(2).add(KT_Time.frames(10), 24); // 2.416s
```

### KT_Color

**Accessors:** `r()`, `g()`, `b()`, `a()`. **Returns**: `number`.

#### `to(targetType)`

Converts between color spaces. **Returns**: `KT_Color`.

| Name         | Type                  | Default | Description                 |
| ------------ | --------------------- | ------- | --------------------------- |
| `targetType` | `"decimal" \| "8bit"` | -       | Target normalization space. |

**Example**:

```typescript
const white = KT_Color.fromRGBA(1, 1, 1, 1, "decimal");
const bit8 = white.to("8bit"); // [255, 255, 255, 255]
```

### KT_Rect

**Accessors:** `x()`, `y()`, `width()`, `height()`, `centerX()`, `centerY()`. **Returns**: `number`.

#### `from(x, y, w, h)`

Static factory method. **Returns**: `KT_Rect`.

| Name | Type     | Default | Description   |
| ---- | -------- | ------- | ------------- |
| `x`  | `number` | -       | X coordinate. |
| `y`  | `number` | -       | Y coordinate. |
| `w`  | `number` | -       | Width.        |
| `h`  | `number` | -       | Height.       |

**Example**:

```typescript
const box = KT_Rect.from(0, 0, 1920, 1080);
console.log(box.centerX()); // 960
```

### KT_Timecode (Utility)

#### `toTime(tc, fps)`

Parses a timecode string. **Returns**: `KT_Time`.

| Name  | Type     | Default | Description                             |
| ----- | -------- | ------- | --------------------------------------- |
| `tc`  | `string` | -       | Format: "HH:MM:SS:FF" or "HH:MM:SS;FF". |
| `fps` | `number` | -       | Frame rate for parsing.                 |

**Example**:

```typescript
const time = KT_Timecode.toTime("00:00:01:00", 24); // 1.0s
```

#### `toString(time, fps)`

Formats time to string. **Returns**: `string`.

| Name   | Type      | Default | Description                |
| ------ | --------- | ------- | -------------------------- |
| `time` | `KT_Time` | -       | The time object to format. |
| `fps`  | `number`  | -       | Frame rate for formatting. |

**Example**:

```typescript
const tc = KT_Timecode.toString(KT_Time.seconds(1), 24); // "00:00:01:00"
```
