import { type ESLint } from 'eslint';
import { defineConfig } from 'eslint/config';
import vitestPlugin from '@vitest/eslint-plugin';
import { testFiles } from '.';

const config = defineConfig({
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
