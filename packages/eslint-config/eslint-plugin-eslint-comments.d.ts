// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair -- Disable for entire file
/* eslint-disable no-duplicate-imports -- Declaration file doesn't work otherwise */
// TODO: Use package types (https://github.com/eslint-community/eslint-plugin-eslint-comments/issues/214)

declare module '@eslint-community/eslint-plugin-eslint-comments' {
  import { type ESLint } from 'eslint';
  const plugin: ESLint.Plugin;
  export = { ...plugin };
}

declare module '@eslint-community/eslint-plugin-eslint-comments/configs' {
  import { type Linter } from 'eslint';
  const recommended: Linter.Config;
  export = { recommended };
}
