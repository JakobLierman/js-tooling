import { defineConfig } from 'eslint/config';
import nextPlugin from '@next/eslint-plugin-next';
import reactConfig from './react';

const config = defineConfig(
  reactConfig,
  {
    plugins: { '@next/next': nextPlugin },
    rules: {
      // eslint-disable-next-line import/no-named-as-default-member -- No.
      ...nextPlugin.configs.recommended.rules,
      // eslint-disable-next-line import/no-named-as-default-member -- No.
      ...nextPlugin.configs['core-web-vitals'].rules,
    },
  },
  { ignores: ['.next/**', 'next-env.d.ts'] },
);

export default config;
