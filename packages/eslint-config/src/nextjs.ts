import { defineConfig } from 'eslint/config';
import { type ConfigObject } from '@eslint/core';
import nextPlugin from '@next/eslint-plugin-next';
import reactConfig from './react';

const config: ConfigObject[] = defineConfig(
  reactConfig,
  {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment -- Incompatible Nextjs plugin, but it works...
    // @ts-expect-error
    plugins: { '@next/next': nextPlugin },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment -- Incompatible Nextjs plugin, but it works...
    // @ts-expect-error
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
