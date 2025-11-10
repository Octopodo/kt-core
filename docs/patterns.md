# KT_Paterns Module Documentation

Classical object-oriented programming patterns for ExtendScript environments. Implements prototypal inheritance, mixins, cloning, and interfaces using IE6-compatible techniques.

**Note:** The module name is deliberately spelled `KT_Paterns` (not "Patterns") for historical consistency.

## Table of Contents

- [Overview](#overview)
- [API Reference](#api-reference)
- [Methods](#methods)
- [Usage Examples](#usage-examples)
- [Pattern Implementations](#pattern-implementations)
- [ExtendScript Compatibility](#extendscript-compatibility)

## Overview

`KT_Paterns` provides classical OOP patterns that don't rely on ES6+ features, making them ideal for ExtendScript environments where class syntax and modern features are unavailable or unreliable.

### Key Patterns Included

- **Inheritance**: `Extend()` - Prototype-based inheritance
- **Composition**: `Mixin()` - Copy methods from one class to another
- **Cloning**: `Clone()` - Create object clones using prototype chain
- **Extension**: `ExtendObject()` - Extend existing objects with new properties
- **Interfaces**: `Interface()` - Define and validate method contracts

## API Reference

### All Methods

| Method           | Parameters                                   | Returns     | Purpose                            |
| ---------------- | -------------------------------------------- | ----------- | ---------------------------------- |
| `Extend()`       | `(subClass, superClass)`                     | `void`      | Set up prototype-based inheritance |
| `Mixin()`        | `(receivingClass, givingClass, ...methods?)` | `void`      | Copy methods between classes       |
| `Clone()`        | `(object)`                                   | `object`    | Create a clone via prototype chain |
| `ExtendObject()` | `(obj, extension)`                           | `void`      | Add properties/methods to object   |
| `Interface()`    | `(name, ...methods)`                         | `Interface` | Define interface contract          |

## Methods

### `Extend()`

Establish prototype-based inheritance between a subclass and superclass.

**Signature:**

```typescript
static Extend(subClass: Function, superClass: Function): void
```

**Parameters:**

| Parameter    | Type       | Description                                 |
| ------------ | ---------- | ------------------------------------------- |
| `subClass`   | `Function` | The class that will inherit from superClass |
| `superClass` | `Function` | The parent class to inherit from            |

**How It Works:**

1. Creates a temporary constructor `F`
2. Sets `F.prototype` to `superClass.prototype`
3. Creates an instance of `F` and assigns to `subClass.prototype`
4. Restores `constructor` property to point to `subClass`

This creates a clean prototype chain without calling the superclass constructor.

**Example:**

```typescript
import { KT_Core } from "kt-core";

class Animal {
    constructor(public name: string) {}
    speak(): string {
        return `${this.name} makes a sound`;
    }
}

class Dog {
    bark(): string {
        return "Woof!";
    }
}

// Set up inheritance
KT_Core.patterns.Extend(Dog, Animal);

// Now Dog inherits from Animal
const myDog = new Dog();
myDog.name = "Buddy";
myDog.speak(); // "Buddy makes a sound" (inherited)
myDog.bark(); // "Woof!" (own method)
```

**Prototype Chain After `Extend()`:**

```
Dog instance → Dog.prototype → Animal.prototype → Object.prototype
```

### `Mixin()`

Copy methods from one class to another. Can copy all methods or specific ones.

**Signature:**

```typescript
static Mixin(
    receivingClass: Function,
    givingClass: Function,
    ...methods?: string[]
): void
```

**Parameters:**

| Parameter        | Type       | Description                                                     |
| ---------------- | ---------- | --------------------------------------------------------------- |
| `receivingClass` | `Function` | The class that will receive new methods                         |
| `givingClass`    | `Function` | The class to copy methods from                                  |
| `...methods`     | `string[]` | Optional: specific method names to copy. If omitted, copies all |

**Behavior:**

- Copies methods from `givingClass.prototype` to `receivingClass.prototype`
- Skips methods that already exist in `receivingClass`
- Bound methods execute in context of the receiving instance
- When no methods specified, copies all non-existing methods

**Example:**

```typescript
import { KT_Core } from "kt-core";

class Animal {
    eat(): void {
        console.log("Eating");
    }
}

class Swimmable {
    swim(): void {
        console.log("Swimming");
    }
    dive(): void {
        console.log("Diving");
    }
}

class Duck {}

// Copy all methods from Swimmable to Duck
KT_Core.patterns.Mixin(Duck, Swimmable);

const duck = new Duck();
duck.swim(); // "Swimming"
duck.dive(); // "Diving"

// Copy specific methods only
class Vehicle {}
class ElectricMixin {
    charge(): void {
        console.log("Charging");
    }
    getRange(): number {
        return 300;
    }
}

KT_Core.patterns.Mixin(Vehicle, ElectricMixin, "charge", "getRange");

const car = new Vehicle();
car.charge(); // "Charging"
car.getRange(); // 300
```

**Multiple Mixins:**

```typescript
// Add multiple behaviors to a single class
KT_Core.patterns.Mixin(Robot, Swimmable);
KT_Core.patterns.Mixin(Robot, Flying);
KT_Core.patterns.Mixin(Robot, Combat);
```

### `Clone()`

Create a new object that inherits from the provided object's prototype.

**Signature:**

```typescript
static Clone(object: object): object
```

**Parameters:**

| Parameter | Type     | Description         |
| --------- | -------- | ------------------- |
| `object`  | `object` | The object to clone |

**Returns:** A new object with the same prototype chain

**How It Works:**

1. Creates a temporary constructor `F`
2. Sets `F.prototype` to the source object
3. Returns a new instance of `F`

The result is a shallow clone that shares the prototype chain but has its own instance properties.

**Example:**

```typescript
import { KT_Core } from "kt-core";

const original = {
    name: "Original",
    greet(): string {
        return `Hello from ${this.name}`;
    },
};

// Create a clone
const cloned = KT_Core.patterns.Clone(original);

// Modify clone without affecting original
cloned.name = "Clone";
cloned.greet(); // "Hello from Clone"
original.greet(); // "Hello from Original"

// But they share prototype methods
console.log(cloned.greet === original.greet); // true (same method reference)
```

### `ExtendObject()`

Extend an existing object with new properties and methods.

**Signature:**

```typescript
static ExtendObject(obj: object, extension: object): void
```

**Parameters:**

| Parameter   | Type     | Description                              |
| ----------- | -------- | ---------------------------------------- |
| `obj`       | `object` | The object to extend (modified in-place) |
| `extension` | `object` | The properties/methods to add            |

**Behavior:**

- Adds properties from `extension` to `obj`
- Only adds properties that don't already exist in `obj`
- For function properties, wraps them to preserve `this` context
- Modifies `obj` in-place, no return value

**Example:**

```typescript
import { KT_Core } from "kt-core";

const person = {
    name: "John",
    greet(): string {
        return `Hi, I'm ${this.name}`;
    },
};

const extensions = {
    age: 30,
    introduce(): string {
        return `${this.greet()}. I'm ${this.age} years old.`;
    },
};

KT_Core.patterns.ExtendObject(person, extensions);

console.log(person.age); // 30
console.log(person.introduce()); // "Hi, I'm John. I'm 30 years old."

// Existing properties are not overwritten
const more = { name: "Jane", title: "Developer" };
KT_Core.patterns.ExtendObject(person, more);
console.log(person.name); // "John" (unchanged)
console.log(person.title); // "Developer" (added)
```

### `Interface()`

Define an interface contract that can be validated.

**Signature:**

```typescript
static Interface(name: string, ...methods: string[]): Interface
```

**Parameters:**

| Parameter    | Type       | Description                                         |
| ------------ | ---------- | --------------------------------------------------- |
| `name`       | `string`   | The name of the interface                           |
| `...methods` | `string[]` | Method names that implementing classes must provide |

**Returns:** An `Interface` object with validation capabilities

**Interface Object Methods:**

- `ensureImplements(obj)` - Verify that an object implements all required methods
- `name` - The interface name
- `methods` - Array of required method names

**Example:**

```typescript
import { KT_Core } from "kt-core";

// Define interface contract
const Drawable = KT_Core.patterns.Interface("Drawable", "draw", "clear");

// Implementing class
class Canvas {
    draw(): void {
        console.log("Drawing...");
    }
    clear(): void {
        console.log("Cleared");
    }
}

const canvas = new Canvas();

// Validate implementation
try {
    Drawable.ensureImplements(canvas);
    console.log("Canvas implements Drawable");
} catch (e) {
    console.error(e.message);
}

// This will throw an error
class BrokenCanvas {
    draw(): void {
        console.log("Drawing...");
    }
    // Missing 'clear' method
}

try {
    Drawable.ensureImplements(new BrokenCanvas());
} catch (e) {
    // Error: BrokenCanvas does not implement the required 'clear' method for Drawable
}
```

**Nested Methods:**

```typescript
// Multiple interfaces can be composed
const Renderable = KT_Core.patterns.Interface("Renderable", "render", "update");
const Interactive = KT_Core.patterns.Interface(
    "Interactive",
    "onClick",
    "onHover"
);

// Flatten method lists
const UIElement = KT_Core.patterns.Interface(
    "UIElement",
    Renderable.methods, // Works with nested arrays
    Interactive.methods
);
```

## Usage Examples

### Example 1: Class Hierarchy

```typescript
import { KT_Core } from "kt-core";

// Base class
class Shape {
    constructor(public color: string) {}
    describe(): string {
        return `A ${this.color} shape`;
    }
}

// Subclass
class Circle {
    constructor(public radius: number) {}
    getArea(): number {
        return Math.PI * this.radius * this.radius;
    }
}

// Set up inheritance
KT_Core.patterns.Extend(Circle, Shape);

const circle = new Circle(5);
circle.color = "blue";

console.log(circle.describe()); // "A blue shape" (inherited)
console.log(circle.getArea()); // ~78.54 (own method)
```

### Example 2: Multiple Behaviors with Mixins

```typescript
import { KT_Core } from "kt-core";

class Engine {
    start(): void {
        console.log("Engine started");
    }
    stop(): void {
        console.log("Engine stopped");
    }
}

class Tires {
    inflate(): void {
        console.log("Tires inflated");
    }
}

class Lights {
    on(): void {
        console.log("Lights on");
    }
    off(): void {
        console.log("Lights off");
    }
}

class Car {}

// Compose Car from multiple mixins
KT_Core.patterns.Mixin(Car, Engine);
KT_Core.patterns.Mixin(Car, Tires);
KT_Core.patterns.Mixin(Car, Lights);

const myCar = new Car();
myCar.start(); // "Engine started"
myCar.inflate(); // "Tires inflated"
myCar.on(); // "Lights on"
```

### Example 3: Prototype Chain Cloning

```typescript
import { KT_Core } from "kt-core";

class Logger {
    constructor(public context: string) {}
    log(msg: string): void {
        console.log(`[${this.context}] ${msg}`);
    }
}

const appLogger = new Logger("APP");
appLogger.log("Starting application"); // "[APP] Starting application"

// Create a clone with different context
const moduleLogger = KT_Core.patterns.Clone(appLogger);
moduleLogger.context = "MODULE";
moduleLogger.log("Initializing"); // "[MODULE] Initializing"

// Original unchanged
appLogger.log("Done"); // "[APP] Done"
```

### Example 4: Dynamic Object Enhancement

```typescript
import { KT_Core } from "kt-core";

// Base user object
const user = {
    name: "Alice",
    email: "alice@example.com",
};

// Add admin capabilities
const adminCapabilities = {
    canDelete(): boolean {
        return true;
    },
    canCreate(): boolean {
        return true;
    },
    role: "admin",
};

KT_Core.patterns.ExtendObject(user, adminCapabilities);

console.log(user.canDelete()); // true
console.log(user.role); // "admin"
```

## Pattern Implementations

### Inheritance Pattern (Extend)

```
Traditional Class Syntax (ES6+):
class Child extends Parent {}

Equivalent with KT_Paterns.Extend:
function Child() { /* constructor */ }
function Parent() { /* constructor */ }
KT_Core.patterns.Extend(Child, Parent);
```

### Composition Pattern (Mixin)

```
// Multiple inheritance behavior
KT_Core.patterns.Mixin(Target, Source1);
KT_Core.patterns.Mixin(Target, Source2);
KT_Core.patterns.Mixin(Target, Source3);

// Result: Target has methods from Source1, Source2, Source3
```

### Prototype Chain

```
After Extend(Dog, Animal):

    Dog instance
         ↓
    Dog.prototype ← (modified by Extend)
         ↓
    Animal.prototype ← (where inherited methods live)
         ↓
    Object.prototype
```

## ExtendScript Compatibility

### Why These Patterns Matter

ExtendScript (IE6-compatible JavaScript) doesn't support:

- ES6 class syntax
- Proper prototype chain setup
- Composition patterns

`KT_Paterns` provides workarounds using:

- Function constructors instead of classes
- Manual prototype chain setup
- Explicit mixin copying instead of inheritance

### Performance

- **Extend**: Constant time, runs once per class definition
- **Mixin**: Linear in number of methods being copied
- **Clone**: Constant time, very lightweight
- **ExtendObject**: Linear in number of properties

All patterns are efficient for typical use cases.

## Related Documentation

- 📖 [Main README](../README.md)
- 📖 [KT_Core Documentation](./KtCore.md)
- 📖 [Copilot Instructions](../.github/copilot-instructions.md) - Detailed ExtendScript guidelines
