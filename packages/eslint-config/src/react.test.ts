import { describe, expect, it } from 'vitest';
import config from './react';
import baseConfig from '.';

describe('React ESLint Configuration', () => {
  it('should be a valid ESLint configuration', () => {
    expect(config).toBeDefined();
    expect(Array.isArray(config)).toBe(true);
  });

  it('should extend base configuration', () => {
    expect(config.length).toBeGreaterThan(baseConfig.length);

    // `react.ts` composes from `baseConfig` first
    for (const [idx, baseItem] of baseConfig.entries()) {
      expect(config[idx]).toEqual(baseItem);
    }
  });

  it('should include @eslint-react rules (strict-type-checked)', () => {
    const hasEslintReactRules = config.some(
      (item) =>
        item.rules &&
        Object.keys(item.rules).some(
          (rule) =>
            rule.startsWith('@eslint-react/') || rule.startsWith('react/'),
        ),
    );

    expect(hasEslintReactRules).toBe(true);
  });

  it('should include React Hooks rules', () => {
    const hasHooksRules = config.some(
      (item) =>
        item.rules &&
        Object.keys(item.rules).some((rule) => rule.startsWith('react-hooks/')),
    );

    expect(hasHooksRules).toBe(true);
  });

  describe('Unicorn rules overrides', () => {
    it('should have unicorn/consistent-function-scoping rule disabled', () => {
      const overrideConfig = config
        .toReversed()
        .find((item) => item.rules?.['unicorn/consistent-function-scoping']);

      expect(
        overrideConfig?.rules?.['unicorn/consistent-function-scoping'],
      ).toBe('off');
    });
  });

  it('should not rely on legacy eslint-plugin-react settings', () => {
    const hasLegacyReactSettings = config.some(
      (item) => item.settings?.['react'],
    );
    expect(hasLegacyReactSettings).toBe(false);
  });
});
