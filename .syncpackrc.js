// @ts-check
/**
 * The configuration file for Syncpack.
 * @see https://jamiemason.github.io/syncpack/
 * @type {import("syncpack").RcFile}
 */
export default {
  versionGroups: [
    {
      label: 'use workspace protocol when developing local packages',
      dependencies: ['$LOCAL'],
      dependencyTypes: ['prod', 'dev'],
      pinVersion: 'workspace:*',
    },
    {
      label: '@types packages should only be under devDependencies',
      dependencies: ['@types/**'],
      dependencyTypes: ['!dev', '!overrides', '!pnpmOverrides', '!resolutions'],
      isBanned: true,
    },
    {
      label:
        'ensure all packages use whatever @t3-oss/env version the env package is using',
      dependencyTypes: ['!peer'],
      dependencies: ['@t3-oss/env-core', '@t3-oss/env-nextjs'],
      packages: ['**'],
      snapTo: ['@bdcs/env'],
    },
    {
      label: 'all Vite dependencies should all have the same version',
      dependencyTypes: ['!peer'],
      dependencies: ['vite', 'vitest', '@vitejs/**', '@vitest/**'],
    },
  ],
  semverGroups: [
    {
      label: 'use ~ range for production dependencies',
      range: '~',
      dependencyTypes: ['prod', 'resolutions'],
      dependencies: ['**'],
      packages: ['**'],
    },
    {
      label: 'use ~ range for all personal dependencies',
      range: '~',
      dependencies: ['@jakoblierman/**'],
      packages: ['**'],
    },
  ],
  customTypes: {
    packageManager: {
      path: 'packageManager',
      strategy: 'name@version',
    },
    nodeEngine: {
      path: 'engines.node',
      strategy: 'version',
    },
  },
  sortPackages: true,
  sortFirst: [
    'name',
    'description',
    'keywords',
    'version',
    'private',
    'homepage',
    'author',
    'contributors',
    'repository',
    'bugs',
    'license',
    'type',
    'engines',
    'cpu',
    'os',
    'publishConfig',
    'main',
    'module',
    'types',
    'files',
    'exports',
    'scripts',
    'dependencies',
    'devDependencies',
    'peerDependencies',
    'optionalDependencies',
    'resolutions',
    'overrides',
    'pnpmOverrides',
    'workspaces',
    'packageManager',
  ],
};
