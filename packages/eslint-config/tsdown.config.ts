import { defineConfig } from 'tsdown';

export default defineConfig((options) => ({
  entry: [
    'src/index.ts',
    'src/react.ts',
    'src/nextjs.ts',
    'src/turborepo.ts',
    'src/vitest.ts',
    'src/jest.ts',
  ],
  format: ['esm'],
  dts: true,
  sourcemap: process.env['NODE_ENV'] === 'production' || 'inline',
  minify: !options.watch,
  treeshake: true,
  clean: true,
}));
