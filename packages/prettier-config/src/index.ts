import { createRequire } from 'node:module';
import { type Config } from 'prettier';
import { type SqlBaseOptions } from 'prettier-plugin-sql';

const require = createRequire(import.meta.url);

const pluginNames = [
  'prettier-plugin-sh',
  'prettier-plugin-packagejson',
  'prettier-plugin-properties',
  'prettier-plugin-prisma',
  'prettier-plugin-embed',
  'prettier-plugin-sql',
  'prettier-plugin-tailwindcss', // Must come last
] as const;

const prettierPluginSqlConfig: SqlBaseOptions = {
  keywordCase: 'upper',
};

const config: Config = {
  endOfLine: 'lf',
  tabWidth: 2,
  printWidth: 80,
  useTabs: false,
  singleQuote: true,
  plugins: pluginNames.map((name) => require.resolve(name)),
  tailwindFunctions: ['clsx', 'cn', 'classnames', 'twMerge', 'twJoin'],
  ...prettierPluginSqlConfig,
};

export default config;
