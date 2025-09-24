export const importNoExtraneousDependenciesConfig = {
  devDependencies: [
    '**/test/*',
    '**/tests/*',
    '**/spec/*',
    '**/scripts/*',
    '**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts}',
    '**/*.config.{js,mjs,cjs,ts,mts,cts}',
    '*tailwind*.{js,mjs,cjs,ts,mts,cts}',
  ],
};
