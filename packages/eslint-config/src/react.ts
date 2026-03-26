import { defineConfig } from 'eslint/config';
import { type ConfigObject } from '@eslint/core';
import reactPlugin from '@eslint-react/eslint-plugin';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import baseConfig from '.';

const config: ConfigObject[] = defineConfig(
  baseConfig,
  reactPlugin.configs['strict-type-checked'],
  reactHooksPlugin.configs.flat['recommended-latest'],
  // TODO: XSS plugin
  // TODO: a11y plugin
  {
    rules: {
      'unicorn/consistent-function-scoping': 'off',
    },
  },
);

export default config;
