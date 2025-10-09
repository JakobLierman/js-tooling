import { describe, expect, it } from 'vitest';
import config from './turborepo';

describe('Turborepo ESLint Configuration', () => {
  it('should be a valid ESLint configuration', () => {
    expect(config).toBeDefined();
    expect(Array.isArray(config)).toBe(true);
  });

  it('should include Turborepo plugin configuration', () => {
    const turboConfig = config.find(
      (item) =>
        item.plugins?.['turbo'] ?? item.rules?.['turbo/no-undeclared-env-vars'],
    );
    expect(turboConfig).toBeDefined();
  });

  describe('Turborepo-specific rules', () => {
    it('should have turbo/no-undeclared-env-vars rule configured', () => {
      const turboConfig = config.find(
        (item) => item.rules?.['turbo/no-undeclared-env-vars'],
      );
      expect(turboConfig?.rules?.['turbo/no-undeclared-env-vars']).toBe(
        'error',
      );
    });

    it('should have import/no-extraneous-dependencies rule configured for monorepo', () => {
      const turboConfig = config.find(
        (item) => item.rules?.['import/no-extraneous-dependencies'],
      );
      expect(turboConfig?.rules?.['import/no-extraneous-dependencies']).toEqual(
        [
          'error',
          {
            devDependencies: [
              '**/test/*',
              '**/tests/*',
              '**/spec/*',
              '**/scripts/*',
              '**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts}',
              '**/*.config.{js,mjs,cjs,ts,mts,cts}',
              '*tailwind*.{js,mjs,cjs,ts,mts,cts}',
              '**/.storybook/*',
            ],
            packageDir: ['.', '../..'], // Package directories for monorepos
          },
        ],
      );
    });
  });

  describe('Configuration structure', () => {
    it('should include Turborepo recommended config', () => {
      // The config should include Turborepo's recommended rules
      const hasTurboRules = config.some(
        (item) =>
          item.rules &&
          Object.keys(item.rules).some((rule) => rule.startsWith('turbo/')),
      );
      expect(hasTurboRules).toBe(true);
    });

    it('should have proper monorepo package directory configuration', () => {
      const turboConfig = config.find(
        (item) => item.rules?.['import/no-extraneous-dependencies'],
      );
      const ruleConfig =
        turboConfig?.rules?.['import/no-extraneous-dependencies'];
      expect(Array.isArray(ruleConfig)).toBe(true);
      // @ts-expect-error - ruleConfig is an array
      expect(ruleConfig?.[1]).toBeDefined();
      // @ts-expect-error - ruleConfig is an array
      expect(ruleConfig?.[1]).toBeInstanceOf(Object);
      // @ts-expect-error - ruleConfig is an array
      expect(ruleConfig?.[1]).toHaveProperty('packageDir');
      // @ts-expect-error - ruleConfig is an array
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- should be defined
      expect(ruleConfig?.[1]?.packageDir).toBeDefined();
      // @ts-expect-error - ruleConfig is an array
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- should be defined
      expect(ruleConfig?.[1]?.packageDir).toEqual(['.', '../..']);
    });
  });

  describe('Environment variables', () => {
    it('should have turbo rule configured', () => {
      const turboConfig = config.find(
        (item) => item.rules?.['turbo/no-undeclared-env-vars'],
      );
      expect(turboConfig?.rules?.['turbo/no-undeclared-env-vars']).toBe(
        'error',
      );
    });
  });

  describe('Import rules for monorepo', () => {
    it('should have devDependencies patterns for test files', () => {
      const turboConfig = config.find(
        (item) => item.rules?.['import/no-extraneous-dependencies'],
      );
      const ruleConfig =
        turboConfig?.rules?.['import/no-extraneous-dependencies'];
      // @ts-expect-error - ruleConfig is an array
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- should be defined
      expect(ruleConfig?.[1]?.devDependencies).toContain('**/test/*');
      // @ts-expect-error - ruleConfig is an array
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- should be defined
      expect(ruleConfig?.[1]?.devDependencies).toContain('**/tests/*');
      // @ts-expect-error - ruleConfig is an array
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- should be defined
      expect(ruleConfig?.[1]?.devDependencies).toContain('**/spec/*');
    });

    it('should have devDependencies patterns for config files', () => {
      const turboConfig = config.find(
        (item) => item.rules?.['import/no-extraneous-dependencies'],
      );
      const ruleConfig =
        turboConfig?.rules?.['import/no-extraneous-dependencies'];
      // @ts-expect-error - ruleConfig is an array
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- should be defined
      expect(ruleConfig?.[1]?.devDependencies).toContain(
        '**/*.config.{js,mjs,cjs,ts,mts,cts}',
      );
    });

    it('should have devDependencies patterns for test spec files', () => {
      const turboConfig = config.find(
        (item) => item.rules?.['import/no-extraneous-dependencies'],
      );
      const ruleConfig =
        turboConfig?.rules?.['import/no-extraneous-dependencies'];
      // @ts-expect-error - ruleConfig is an array
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- should be defined
      expect(ruleConfig?.[1]?.devDependencies).toContain(
        '**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts}',
      );
    });

    it('should have devDependencies patterns for Tailwind config files', () => {
      const turboConfig = config.find(
        (item) => item.rules?.['import/no-extraneous-dependencies'],
      );
      const ruleConfig =
        turboConfig?.rules?.['import/no-extraneous-dependencies'];
      // @ts-expect-error - ruleConfig is an array
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- should be defined
      expect(ruleConfig?.[1]?.devDependencies).toContain(
        '*tailwind*.{js,mjs,cjs,ts,mts,cts}',
      );
    });
  });

  describe('Rule validation', () => {
    it('should have valid turbo rule configurations', () => {
      const turboConfig = config.find(
        (item) => item.rules?.['turbo/no-undeclared-env-vars'],
      );
      expect(turboConfig).toBeDefined();

      const ruleConfig = turboConfig?.rules?.['turbo/no-undeclared-env-vars'];
      expect(typeof ruleConfig).toBe('string');
      expect(ruleConfig).toBe('error');
    });

    it('should have valid import rule configurations', () => {
      const turboConfig = config.find(
        (item) => item.rules?.['import/no-extraneous-dependencies'],
      );
      expect(turboConfig).toBeDefined();

      const ruleConfig =
        turboConfig?.rules?.['import/no-extraneous-dependencies'];
      expect(Array.isArray(ruleConfig)).toBe(true);
      // @ts-expect-error - ruleConfig is an array
      expect(ruleConfig?.[0]).toBe('error');
      // @ts-expect-error - ruleConfig is an array
      expect(typeof ruleConfig?.[1]).toBe('object');
    });
  });
});
