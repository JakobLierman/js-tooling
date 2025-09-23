import { defineConfig } from 'tsup';

export default defineConfig((options) => ({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: process.env['NODE_ENV'] === 'production' || 'inline',
  minify: !options.watch,
  treeshake: true,
  clean: true,
}));
