import { configDefaults, defineProject } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineProject({
  test: {
    environment: 'node',
    exclude: [...configDefaults.exclude, '**/e2e/**'],
  },
  plugins: [tsconfigPaths()],
});
