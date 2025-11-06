import { defineConfig } from 'eslint/config';
import { type ConfigObject } from '@eslint/core';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import baseConfig from '.';

const recommendedConfig = reactPlugin.configs.flat['recommended'];
if (!recommendedConfig) throw new Error('Recommended config not found');

const jsxRuntimeConfig = reactPlugin.configs.flat['jsx-runtime'];
if (!jsxRuntimeConfig) throw new Error('JSX runtime config not found');

const config: ConfigObject[] = defineConfig(
  baseConfig,
  recommendedConfig,
  jsxRuntimeConfig,
  reactHooksPlugin.configs.flat['recommended-latest'],
  // TODO: XSS plugin
  // TODO: a11y plugin
  {
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      'react/prop-types': 'off', // Does not work well with TypeScript
      'react/function-component-definition': [
        'error',
        {
          namedComponents: 'arrow-function',
          unnamedComponents: 'arrow-function',
        },
      ],
      'react/jsx-filename-extension': [
        'warn',
        {
          extensions: ['.jsx', '.tsx'],
          ignoreFilesWithoutCode: true,
        },
      ],
      'react/jsx-props-no-spreading': 'off',
      'react/require-default-props': 'off',
      'unicorn/consistent-function-scoping': 'off',
    },
  },
);

export default config;
