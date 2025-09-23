import { defineConfig } from 'eslint/config';
import turboPlugin from 'eslint-plugin-turbo';
import { importNoExtraneousDependenciesConfig } from '.';

const config = defineConfig(turboPlugin.configs['flat/recommended'], {
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
