# TypeScript Configuration

This package provides a custom [TypeScript](https://www.typescriptlang.org/) configuration to maintain consistent TypeScript usage across your projects.

It supports TypeScript **6** and **7** (`peerDependencies`: `~6.0 || ~7.0`).

## Installation

Install the package using your package manager of choice:

```bash
npm install --save-dev typescript @jakoblierman/tsconfig
```

```bash
yarn add --dev typescript @jakoblierman/tsconfig
```

```bash
pnpm add --save-dev typescript @jakoblierman/tsconfig
```

### TypeScript 7 with ESLint (`typescript-eslint`)

TypeScript 7 ships a native `tsc`, but does not yet expose a stable programmatic API. Tools that `import` TypeScript (including `typescript-eslint` / `@jakoblierman/eslint-config`) still need the TypeScript 6 API under the package name `typescript`.

Use Microsoft’s side-by-side install so native type-checking uses 7 while lint keeps 6:

```json
{
  "devDependencies": {
    "@typescript/native": "npm:typescript@~7.0",
    "typescript": "npm:@typescript/typescript6@~6.0"
  }
}
```

- `pnpm exec tsc` / `npx tsc` → TypeScript 7
- `import "typescript"` (ESLint, etc.) → TypeScript 6 API

If you only type-check and do not use type-aware ESLint, you can install `typescript@~7.0` directly.

## Usage

Create a `tsconfig.json` file in your project's root and extend this configuration:

```jsonc
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "@jakoblierman/tsconfig/base.json",
  "compilerOptions": {},
  "include": ["**/*"],
  "exclude": ["node_modules"],
  // Add additional configuration if needed
}
```

Now, your project will use this configuration for TypeScript.

For more information, see the [TypeScript configuration docs](https://www.typescriptlang.org/tsconfig).

### Using path aliases

If you want to use additional path aliases, you'll need to add it to you tsconfig configuration as follows.

> Be aware that paths from the base configuration will be overwritten.

```jsonc
{
  // ...
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      // Add additional path aliases if needed
    },
  },
}
```

## Additional Configuration

This configuration includes additional configurations for:

- React (`@jakoblierman/tsconfig/react.json`)
- Next.js (`@jakoblierman/tsconfig/nextjs.json`)

Feel free to customize the configuration to match your requirements.
