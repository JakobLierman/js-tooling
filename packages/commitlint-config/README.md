# Commitlint Configuration

This package provides a custom [commitlint](https://commitlint.js.org/#/) configuration to ensure consistent and meaningful commit messages in your projects.

## Installation

Install the package using your package manager of choice:

```bash
npm install --save-dev @commitlint/cli @jakoblierman/commitlint-config
```

```bash
yarn add --dev @commitlint/cli @jakoblierman/commitlint-config
```

```bash
pnpm add --save-dev @commitlint/cli @jakoblierman/commitlint-config
```

## Usage

To use this configuration, add the following to your `commitlint.config.js`:

```javascript
module.exports = {
  extends: ['@jakoblierman/commitlint-config'],
  // Add additional rules or overrides if needed
};
```

### Add commit hook

To automatically format your code before committing, install the [Husky](https://typicode.github.io/husky/) package using [this guide](https://typicode.github.io/husky/getting-started.html).

Run the following command to install the commit-msg hook:

```bash
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit "$1"'
```

Now, commitlint will use the rules defined in this package to validate your commit messages.

## Rules

This configuration extends the [conventional commit](https://www.conventionalcommits.org/en/v1.0.0/) configuration.

At this time, no additional rules are defined.

Feel free to customize the configuration by extending or overriding rules to suit your project's needs.

## Example

Here's an example of a commit message that adheres to this configuration:

```
feat(api): add new endpoint for user authentication
```
