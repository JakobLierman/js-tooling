# Custom TypeScript Configuration

This package provides a custom [TypeScript](https://www.typescriptlang.org/) configuration to maintain consistent TypeScript usage across your projects.

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

## Usage

Create a `tsconfig.json` file in your project's root and extend this configuration:

```jsonc
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "@jakoblierman/tsconfig/base.json",
  "compilerOptions": {
    "baseUrl": "./",
  },
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
      "@/*": ["src/*"],
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
