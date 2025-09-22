import * as fs from 'node:fs';
import * as yaml from 'yaml';
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

/**
 * Gets the directories from the workspace yaml file.
 * @example
 * ```yaml
 * # pnpm-workspace.yaml
 * packages:
 *  - 'apps/*'
 *  - 'packages/*'
 * ```
 * ```typescript
 * const directories = getDirectories();
 * console.log(directories);
 * // ['apps/*', 'packages/*']
 * ```
 * @returns The directories list.
 */
const getDirectories = (): string[] => {
  // Read the workspace yaml file.
  const workspaceFile = 'pnpm-workspace.yaml';
  const fileContents = fs.readFileSync(workspaceFile, 'utf8');
  // Read the directories list from the workspace yaml file.
  const yamlContents = yaml.parse(fileContents) as {
    packages: string[];
  };

  return yamlContents.packages;
};

/**
 * Adds a config file to the input path, so we consider only packages with a config file as valid project.
 * @param input The input path.
 * @returns The path with the config file.
 */
const addConfigFile = (input: string): string =>
  `${input}/vitest.config.{mts,ts}`;

/**
 * Vitest configuration for all packages and projects.
 * @see [Vitest documentation](https://vitest.dev/config/)
 */
export default defineConfig({
  test: {
    projects: getDirectories().map((directory) => addConfigFile(directory)),
    reporters: process.env['GITHUB_ACTIONS']
      ? [['default', { summary: false }], 'github-actions']
      : 'default',
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ['json-summary', 'json'],
      reportOnFailure: true,
      // 60% considered acceptable, 75% commendable, and 90% exemplary
      // @see https://testing.googleblog.com/2020/08/code-coverage-best-practices.html
      thresholds: {
        // TODO: Enable thresholds
        // lines: 75,
        // branches: 75,
        // functions: 75,
        // statements: 75,
        autoUpdate: process.env['CI'] !== 'true',
      },
    },
  },
  plugins: [tsconfigPaths()],
});
