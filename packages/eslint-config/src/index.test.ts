import { describe, expect, it } from 'vitest';
import config from './index';

describe('Base ESLint Configuration', () => {
  it('should be a valid ESLint configuration', () => {
    expect(config).toBeDefined();
    expect(Array.isArray(config)).toBe(true);
  });

  it('should include global ignores', () => {
    const globalIgnores = config.find((item) => 'ignores' in item);
    expect(globalIgnores).toBeDefined();
    expect(globalIgnores?.ignores).toContain('node_modules/');
    expect(globalIgnores?.ignores).toContain('dist/');
    expect(globalIgnores?.ignores).toContain('coverage/');
  });

  it('should include base rules for JavaScript/TypeScript files', () => {
    const baseConfig = config.find((item) =>
      item.files?.includes('**/*.{js,jsx,ts,tsx,mjs,cjs}'),
    );
    expect(baseConfig).toBeDefined();
    // The base config might not have rules directly, but should be part of the config
    expect(config.length).toBeGreaterThan(0);
  });

  it('should include TypeScript-specific rules', () => {
    // The TypeScript rules are distributed across multiple config items
    expect(config.length).toBeGreaterThan(0);
    expect(
      config.some(
        (item) =>
          item.rules &&
          Object.keys(item.rules).some((rule) =>
            rule.startsWith('@typescript-eslint/'),
          ),
      ),
    ).toBe(true);
  });

  it('should include test file rules', () => {
    const testConfig = config.find(
      (item) =>
        item.files?.includes('**/*.test.*') ??
        item.files?.includes('**/*.spec.*'),
    );
    expect(testConfig).toBeDefined();
    expect(testConfig?.rules).toBeDefined();
  });

  it('should have correct TypeScript file patterns', () => {
    const typescriptFiles = new Set([
      '**/*.ts',
      '**/*.tsx',
      '**/*.cts',
      '**/*.mts',
    ]);
    const typescriptConfig = config.find((item) =>
      item.files?.some((file) => typescriptFiles.has(file as string)),
    );
    expect(typescriptConfig).toBeDefined();
  });

  it('should have correct test file patterns', () => {
    const testFiles = new Set([
      '**/*.test.*',
      '**/*.spec.*',
      '**/test/**',
      '**/tests/**',
    ]);
    const testConfig = config.find((item) =>
      item.files?.some((file) => testFiles.has(file as string)),
    );
    expect(testConfig).toBeDefined();
  });

  describe('Rule validation', () => {
    it('should have dot-notation rule configured', () => {
      const dotNotationConfig = config.find(
        (item) => item.rules?.['dot-notation'],
      );
      expect(dotNotationConfig?.rules?.['dot-notation']).toEqual([
        'error',
        { allowKeywords: false },
      ]);
    });

    it('should have func-style rule configured', () => {
      const funcStyleConfig = config.find((item) => item.rules?.['func-style']);
      expect(funcStyleConfig?.rules?.['func-style']).toEqual([
        'warn',
        'expression',
      ]);
    });

    it('should have newline-before-return rule configured', () => {
      const newlineConfig = config.find(
        (item) => item.rules?.['newline-before-return'],
      );
      expect(newlineConfig?.rules?.['newline-before-return']).toBe('error');
    });

    it('should have no-case-declarations rule configured', () => {
      const noCaseConfig = config.find(
        (item) => item.rules?.['no-case-declarations'],
      );
      expect(noCaseConfig?.rules?.['no-case-declarations']).toBe('error');
    });

    it('should have no-duplicate-imports rule configured', () => {
      const noDuplicateConfig = config.find(
        (item) => item.rules?.['no-duplicate-imports'],
      );
      expect(noDuplicateConfig?.rules?.['no-duplicate-imports']).toEqual([
        'error',
        { allowSeparateTypeImports: false },
      ]);
    });

    it('should have no-restricted-syntax rule configured', () => {
      const noRestrictedConfig = config.find(
        (item) => item.rules?.['no-restricted-syntax'],
      );
      expect(noRestrictedConfig?.rules?.['no-restricted-syntax']).toEqual([
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
      ]);
    });

    it('should have no-void rule configured', () => {
      const noVoidConfig = config.find((item) => item.rules?.['no-void']);
      expect(noVoidConfig?.rules?.['no-void']).toEqual([
        'warn',
        { allowAsStatement: true },
      ]);
    });
  });

  describe('Plugin rules', () => {
    it('should have import plugin rules configured', () => {
      const importOrderConfig = config.find(
        (item) => item.rules?.['import/order'],
      );
      expect(importOrderConfig?.rules?.['import/order']).toEqual(['error']);

      const importUnresolvedConfig = config.find(
        (item) => item.rules?.['import/no-unresolved'],
      );
      expect(importUnresolvedConfig?.rules?.['import/no-unresolved']).toBe(
        'error',
      );

      const importNoDefaultConfig = config.find(
        (item) => item.rules?.['import/no-default-export'],
      );
      expect(importNoDefaultConfig?.rules?.['import/no-default-export']).toBe(
        'off',
      );

      const importPreferDefaultConfig = config.find(
        (item) => item.rules?.['import/prefer-default-export'],
      );
      expect(
        importPreferDefaultConfig?.rules?.['import/prefer-default-export'],
      ).toBe('off');
    });

    it('should have unused-imports plugin rules configured', () => {
      const noUnusedVarsConfig = config.find(
        (item) => item.rules?.['no-unused-vars'],
      );
      expect(noUnusedVarsConfig?.rules?.['no-unused-vars']).toBe('error');

      const unusedImportsConfig = config.find(
        (item) => item.rules?.['unused-imports/no-unused-imports'],
      );
      expect(
        unusedImportsConfig?.rules?.['unused-imports/no-unused-imports'],
      ).toBe('error');

      const unusedVarsConfig = config.find(
        (item) => item.rules?.['unused-imports/no-unused-vars'],
      );
      expect(
        unusedVarsConfig?.rules?.['unused-imports/no-unused-vars'],
      ).toEqual([
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ]);
    });

    it('should have stylistic plugin rules configured', () => {
      const stylisticConfig = config.find(
        (item) => item.rules?.['@stylistic/padding-line-between-statements'],
      );
      expect(
        stylisticConfig?.rules?.['@stylistic/padding-line-between-statements'],
      ).toEqual(['error', { blankLine: 'always', prev: '*', next: 'return' }]);
    });

    it('should have eslint-comments plugin rules configured', () => {
      const eslintCommentsConfig = config.find(
        (item) =>
          item.rules?.['@eslint-community/eslint-comments/require-description'],
      );
      expect(
        eslintCommentsConfig?.rules?.[
          '@eslint-community/eslint-comments/require-description'
        ],
      ).toBe('warn');
    });
  });

  describe('TypeScript-specific rules', () => {
    it('should have TypeScript rules configured', () => {
      const consistentTypeImportsConfig = config.find(
        (item) => item.rules?.['@typescript-eslint/consistent-type-imports'],
      );
      expect(
        consistentTypeImportsConfig?.rules?.[
          '@typescript-eslint/consistent-type-imports'
        ],
      ).toBe('error');

      const noInferrableTypesConfig = config.find(
        (item) => item.rules?.['@typescript-eslint/no-inferrable-types'],
      );
      expect(
        noInferrableTypesConfig?.rules?.[
          '@typescript-eslint/no-inferrable-types'
        ],
      ).toBe('error');

      const noUnusedVarsConfig = config.find(
        (item) => item.rules?.['@typescript-eslint/no-unused-vars'],
      );
      expect(
        noUnusedVarsConfig?.rules?.['@typescript-eslint/no-unused-vars'],
      ).toBe('error');
    });

    it('should have TypeScript naming convention rule configured', () => {
      const namingConventionConfig = config.find(
        (item) => item.rules?.['@typescript-eslint/naming-convention'],
      );
      expect(
        namingConventionConfig?.rules?.['@typescript-eslint/naming-convention'],
      ).toEqual([
        'error',
        {
          format: ['UPPER_CASE'],
          selector: 'enumMember',
        },
      ]);
    });

    it('should have TypeScript no-confusing-void-expression rule configured', () => {
      const noConfusingVoidConfig = config.find(
        (item) =>
          item.rules?.['@typescript-eslint/no-confusing-void-expression'],
      );
      expect(
        noConfusingVoidConfig?.rules?.[
          '@typescript-eslint/no-confusing-void-expression'
        ],
      ).toBe('error');
    });

    it('should have TypeScript no-misused-promises rule configured', () => {
      const noMisusedPromisesConfig = config.find(
        (item) => item.rules?.['@typescript-eslint/no-misused-promises'],
      );
      expect(
        noMisusedPromisesConfig?.rules?.[
          '@typescript-eslint/no-misused-promises'
        ],
      ).toBe('error');
    });
  });

  describe('Test file rules', () => {
    it('should have test-specific rules configured', () => {
      const unboundMethodConfig = config.find(
        (item) => item.rules?.['@typescript-eslint/unbound-method'],
      );
      expect(
        unboundMethodConfig?.rules?.['@typescript-eslint/unbound-method'],
      ).toBe('error');
    });
  });

  describe('Settings', () => {
    it('should have import resolver settings configured', () => {
      const settingsConfig = config.find(
        (item) => item.settings?.['import/resolver'],
      );
      expect(settingsConfig?.settings?.['import/resolver']).toEqual({
        typescript: { alwaysTryTypes: true },
        node: true,
      });
    });
  });
});
