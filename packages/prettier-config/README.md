# Prettier Configuration

This package provides a custom [Prettier](https://prettier.io/) configuration to maintain consistent code formatting across your projects.

## Installation

Install the package using your package manager of choice:

```bash
npm install --save-dev prettier @jakoblierman/prettier-config
```

```bash
yarn add --dev prettier @jakoblierman/prettier-config
```

```bash
pnpm add --save-dev prettier @jakoblierman/prettier-config
```

## Usage

Create a `.prettierrc` file in your project's root and extend this configuration:

```json
"@jakoblierman/prettier-config"
```

Alternatively, add the following to your `package.json`:

```json
{
  "prettier": "@jakoblierman/prettier-config"
}
```

Now, your project will use this configuration for Prettier formatting.

For more information, see the [Prettier configuration docs](https://prettier.io/docs/en/configuration.html#sharing-configurations).

### Add NPM scripts (optional)

Add the following scripts to your `package.json`:

```json
{
  "scripts": {
    "format": "prettier --check --ignore-unknown .",
    "format:fix": "prettier --write --ignore-unknown ."
  }
}
```

### Add commit hook (optional)

To automatically format your code before committing, install the [Husky](https://typicode.github.io/husky/) package using [this guide](https://typicode.github.io/husky/getting-started.html).

Install the [lint-staged](https://github.com/lint-staged/lint-staged) package.
This package runs scripts on files that are staged in Git.

Extend your `.lintstagedrc` file with the following:

```json
{
  "*": ["prettier --write"]
}
```

Run lint-staged on every commit by configuring a Husky hook:

```bash
npx husky add .husky/pre-commit "npx lint-staged"
```

Now, your code will be formatted before every commit.

## Rules

This configuration extends the Vercel Prettier configuration.
You can learn more about Vercel's engineering style guides on their GitHub repository: [vercel/style-guide](https://github.com/vercel/style-guide).

Feel free to customize the configuration to match your coding style and project requirements.

## Plugins

This configuration includes several plugins by default:

- prettier-plugin-tailwindcss
- prettier-plugin-sh
- prettier-plugin-packagejson
- prettier-plugin-properties
- prettier-plugin-prisma
- prettier-plugin-embed
- prettier-plugin-sql
