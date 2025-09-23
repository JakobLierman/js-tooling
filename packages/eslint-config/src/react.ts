import { defineConfig } from 'eslint/config';
import reactPlugin from 'eslint-plugin-react';
import { configs as reactHooksPluginConfigs } from 'eslint-plugin-react-hooks';
import baseConfig from '.';

const recommendedConfig = reactPlugin.configs.flat['recommended'];
if (!recommendedConfig) throw new Error('Recommended config not found');

const jsxRuntimeConfig = reactPlugin.configs.flat['jsx-runtime'];
if (!jsxRuntimeConfig) throw new Error('JSX runtime config not found');

const config = defineConfig(
  baseConfig,
  recommendedConfig,
  jsxRuntimeConfig,
  reactHooksPluginConfigs['recommended-latest'],
  // TODO: XSS plugin
  {
    settings: {
      react: { version: 'detect' },
    },
    rules: {
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
