import { defineConfig } from 'eslint/config';
import { type ConfigObject } from '@eslint/core';
import { configs as turboPluginConfigs } from 'eslint-plugin-turbo';
import { importNoExtraneousDependenciesConfig } from './import-no-extraneous-dependencies';

const turboRecommendedConfig = turboPluginConfigs?.['flat/recommended'] as
  | ConfigObject
  | undefined;
if (!turboRecommendedConfig)
  throw new Error('Turbo recommended config not found');

const config: ConfigObject[] = defineConfig(turboRecommendedConfig, {
  rules: {
    'turbo/no-undeclared-env-vars': ['error', { allowList: ['CI', 'TZ'] }],
    'import/no-extraneous-dependencies': [
      'error',
      {
        ...importNoExtraneousDependenciesConfig,
        packageDir: ['.', '../..'], // Package directories for monorepos
      },
    ],
  },
});

export default config;
