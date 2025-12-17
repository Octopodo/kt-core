# KT-Core 📦

TypeScript utility library for Adobe ExtendScript environments (IE6-compatible). Provides core utilities and patterns for scripting Adobe applications.

## Installation

```bash
npm install kt-core
```

## Quick Start

```typescript
import { KT_Core, KT_StringUtils, KT_FilterChainFactory } from "kt-core";

// String matching
KT_StringUtils.startsWith("HelloWorld", "Hello"); // true

// Filtering
const factory = new KT_FilterChainFactory({ name: "startsWith" });
factory.match({ name: "John" }, { name: "Jo" }); // true

// Patterns via core
KT_Core.patterns.Extend(Dog, Animal);
```

## Documentation

See `/docs` folder for detailed module documentation:

- [KT_Core](./docs/KtCore.md)
- [KT_StringUtils](./docs/stringUtils.md)
- [KT_FilterChainFactory](./docs/FilterChainFactory.md)
- [Patterns](./docs/patterns.md)

## Compatibility

Built for ExtendScript with IE6 polyfills. No modern features like Promises or spread operators.

## License

MIT © 2024 Miguel de Mendoza
