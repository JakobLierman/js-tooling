import { type Config } from 'prettier';
import { type SqlBaseOptions } from 'prettier-plugin-sql';

const prettierPluginSqlConfig: SqlBaseOptions = {
  keywordCase: 'upper',
};

const config: Config = {
  endOfLine: 'lf',
  tabWidth: 2,
  printWidth: 80,
  useTabs: false,
  singleQuote: true,
  plugins: [
    'prettier-plugin-sh',
    'prettier-plugin-packagejson',
    'prettier-plugin-properties',
    'prettier-plugin-prisma',
    'prettier-plugin-embed',
    'prettier-plugin-sql',
    'prettier-plugin-tailwindcss', // Must come last
  ],
  tailwindFunctions: ['clsx', 'cn', 'classnames', 'twMerge', 'twJoin'],
  ...prettierPluginSqlConfig,
};

export default config;
