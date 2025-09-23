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
