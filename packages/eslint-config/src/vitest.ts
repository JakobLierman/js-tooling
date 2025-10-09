import { type ESLint } from 'eslint';
import { defineConfig } from 'eslint/config';
import { type ConfigObject } from '@eslint/core';
import vitestPlugin from '@vitest/eslint-plugin';
import { testFiles } from '.';

const config: ConfigObject[] = defineConfig({
  files: testFiles,
  plugins: { vitest: vitestPlugin as unknown as ESLint.Plugin },
  rules: vitestPlugin.configs.recommended.rules,
  settings: {
    vitest: { typecheck: true },
  },
  languageOptions: {
    globals: vitestPlugin.environments.env.globals,
  },
});

export default config;
