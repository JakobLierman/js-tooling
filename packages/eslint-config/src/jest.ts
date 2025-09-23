import { defineConfig } from 'eslint/config';
import jestPlugin from 'eslint-plugin-jest';

const config = defineConfig(
  jestPlugin.configs['flat/recommended'],
  jestPlugin.configs['flat/style'],
);

export default config;
