import { type Configuration } from 'lint-staged';

/**
 * Lint-staged configuration.
 * @see https://github.com/lint-staged/lint-staged
 */
const config: Configuration = {
  '*': ['prettier --write --ignore-unknown'], // Format all files
  'package.json': () => [
    'syncpack format', // Format package.json
    'syncpack lint', // Lint package.json
    'pnpm install --frozen-lockfile --no-save', // Check if package.json is in sync with lockfile
  ],
  '*.{js,jsx,ts,tsx}': [
    'eslint --cache --cache-file node_modules/.cache/.eslintcache --fix', // Lint and fix JavaScript and TypeScript files
  ],
};

export default config;
