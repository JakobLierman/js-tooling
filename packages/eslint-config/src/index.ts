import { defineConfig, globalIgnores } from 'eslint/config';
import { type ConfigObject } from '@eslint/core';
import eslint from '@eslint/js';
import { configs as tseslintConfigs, parser } from 'typescript-eslint';
import nodePlugin from 'eslint-plugin-n';
import importPlugin from 'eslint-plugin-import';
import { configs as regexpPluginConfigs } from 'eslint-plugin-regexp';
import jsdocPlugin from 'eslint-plugin-jsdoc';
import unicornPlugin from 'eslint-plugin-unicorn';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';
import stylisticPlugin from '@stylistic/eslint-plugin';
import prettierPluginRecommended from 'eslint-plugin-prettier/recommended';
import eslintCommentsPlugin from '@eslint-community/eslint-plugin-eslint-comments';
import eslintCommentsPluginConfigs from '@eslint-community/eslint-plugin-eslint-comments/configs';
import { importNoExtraneousDependenciesConfig } from './import-no-extraneous-dependencies';

export const typescriptFiles = ['**/*.ts', '**/*.tsx', '**/*.cts', '**/*.mts'];
export const testFiles = [
  '**/*.test.*',
  '**/*.spec.*',
  '**/test/**',
  '**/tests/**',
];

const config: ConfigObject[] = defineConfig(
  globalIgnores(
    [
      'node_modules/',
      'dist/',
      'coverage/',
      'build/',
      'out/',
      'public/',
      'tmp/',
    ].flatMap((dir) => [dir, `**/${dir}`]),
  ),
  { files: ['**/*.{js,jsx,ts,tsx,mjs,cjs}'] },
  eslint.configs.recommended,
  nodePlugin.configs['flat/recommended'],
  importPlugin.flatConfigs.recommended,
  regexpPluginConfigs['flat/recommended'],
  jsdocPlugin.configs['flat/recommended'],
  unicornPlugin.configs.recommended,
  stylisticPlugin.configs.recommended,
  {
    plugins: {
      'unused-imports': unusedImportsPlugin,
      stylistic: stylisticPlugin,
      '@eslint-community/eslint-comments': eslintCommentsPlugin,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    settings: {
      'import/resolver': {
        typescript: { alwaysTryTypes: true }, // Always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`
        node: true,
      },
    },
    rules: {
      'dot-notation': ['error', { allowKeywords: false }],
      'func-style': ['warn', 'expression'],
      'newline-before-return': 'error',
      'no-case-declarations': 'off', // Too strict, even for my liking
      'no-duplicate-imports': ['error', { allowSeparateTypeImports: false }],
      'no-restricted-syntax': [
        'error',
        {
          selector: 'LabeledStatement',
          message:
            'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
        },
        {
          selector: 'WithStatement',
          message:
            '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
        },
      ],
      'no-void': ['warn', { allowAsStatement: true }],
      // eslint-plugin-n
      'n/no-missing-import': 'off', // Cannot handle Typescript path aliases
      'n/no-unsupported-features/node-builtins': 'warn',
      'n/no-unpublished-import': 'off', // Can't seem to configure this properly
      // eslint-plugin-import
      'import/extensions': 'off',
      'import/order': ['error'], // TODO: Finetune (https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/order.md)
      'import/no-default-export': 'off',
      'import/no-unresolved': 'error',
      'import/prefer-default-export': 'off', // Well, I simply don't prefer it
      'import/no-extraneous-dependencies': [
        'error',
        importNoExtraneousDependenciesConfig,
      ],
      // eslint-plugin-jsdoc
      'jsdoc/no-defaults': 'off', // Some editors like this syntax, and extra documentation can't hurt
      'jsdoc/require-param': ['warn', { checkDestructured: false }], // Disable destructured checks, as they are not always necessary
      'jsdoc/check-param-names': ['warn', { checkDestructured: false }], // Disable destructured checks, as they are not always necessary
      // eslint-plugin-unicorn
      'unicorn/no-array-callback-reference': 'off', // Don't like this rule in their opinionated configuration
      'unicorn/no-array-reduce': 'off',
      'unicorn/no-useless-undefined': 'off',
      'unicorn/switch-case-braces': 'off',
      'unicorn/prefer-global-this': 'off',
      'unicorn/prevent-abbreviations': 'off',
      // @eslint-community/eslint-plugin-eslint-comments
      '@eslint-community/eslint-comments/require-description': 'warn',
      // eslint-plugin-unused-imports
      'no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
      // eslint-plugin-stylistic
      '@stylistic/padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: 'return' },
      ],
      // @eslint-community/eslint-plugin-eslint-comments
      ...eslintCommentsPluginConfigs.recommended.rules,
    },
  },
  {
    files: typescriptFiles, // TypeScript files extensions
    extends: [
      tseslintConfigs.strictTypeChecked,
      tseslintConfigs.stylisticTypeChecked,
      jsdocPlugin.configs['flat/recommended-typescript'],
      importPlugin.flatConfigs.typescript,
    ],
    languageOptions: {
      parser,
      parserOptions: {
        projectService: true,
      },
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          format: ['UPPER_CASE'],
          selector: 'enumMember',
        },
      ],
      '@typescript-eslint/no-confusing-void-expression': [
        'error',
        { ignoreArrowShorthand: true, ignoreVoidOperator: true },
      ],
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/no-misused-promises': [
        'error',
        { checksVoidReturn: { attributes: false } },
      ],
      '@typescript-eslint/no-unnecessary-type-parameters': 'off', // https://typescript-eslint.io/rules/no-unnecessary-type-parameters/#when-not-to-use-it
      '@typescript-eslint/return-await': [
        'error',
        'error-handling-correctness-only',
      ],
      // eslint-plugin-unused-imports
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
  {
    files: testFiles, // Test files
    rules: {
      // typescript-eslint
      '@typescript-eslint/unbound-method': 'off',
    },
  },
  prettierPluginRecommended, // Must be last
);

export default config;
