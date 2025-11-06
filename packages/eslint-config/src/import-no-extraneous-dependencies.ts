export const importNoExtraneousDependenciesConfig = {
  devDependencies: [
    '**/{test,tests,spec}/*',
    '**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts}',
    '**/scripts/*',
    '**/*.config.{js,mjs,cjs,ts,mts,cts}',
    '*tailwind*.{js,mjs,cjs,ts,mts,cts}',
    '**/.storybook/*',
  ],
};
