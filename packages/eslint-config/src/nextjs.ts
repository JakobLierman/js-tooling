import { FlatCompat } from '@eslint/eslintrc';
import { defineConfig } from 'eslint/config';
import reactConfig from './react';

const compat = new FlatCompat({ baseDirectory: import.meta.dirname });

const config = defineConfig(
  reactConfig,
  compat.config({
    extends: ['next/core-web-vitals', 'next/typescript'],
  }),
  { ignores: ['.next/**', 'next-env.d.ts'] },
);

export default config;
