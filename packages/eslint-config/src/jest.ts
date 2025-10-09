import { defineConfig } from 'eslint/config';
import { type ConfigObject } from '@eslint/core';
import jestPlugin from 'eslint-plugin-jest';

const config: ConfigObject[] = defineConfig(
  jestPlugin.configs['flat/recommended'],
  jestPlugin.configs['flat/style'],
);

export default config;
