import { defineConfig } from 'eslint/config';
import { configs as turboPluginConfigs } from 'eslint-plugin-turbo';
import { importNoExtraneousDependenciesConfig } from './import-no-extraneous-dependencies';

const config = defineConfig(turboPluginConfigs['flat/recommended'], {
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
