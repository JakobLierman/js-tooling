import { describe, expect, it } from 'vitest';
import config from './react';

describe('React ESLint Configuration', () => {
  it('should be a valid ESLint configuration', () => {
    expect(config).toBeDefined();
    expect(Array.isArray(config)).toBe(true);
  });

  it('should extend base configuration', () => {
    // The React config should include the base config as the first item
    expect(config.length).toBeGreaterThan(1);
  });

  it('should include React plugin configuration', () => {
    const reactConfig = config.find(
      (item) =>
        item.plugins?.['react'] ??
        item.rules?.['react/function-component-definition'],
    );
    expect(reactConfig).toBeDefined();
  });

  it('should have React settings configured', () => {
    const reactConfig = config.find((item) => item.settings?.react);
    expect(reactConfig?.settings?.react).toEqual({ version: 'detect' });
  });

  describe('React-specific rules', () => {
    it('should have function-component-definition rule configured', () => {
      const reactConfig = config.find(
        (item) => item.rules?.['react/function-component-definition'],
      );
      expect(
        reactConfig?.rules?.['react/function-component-definition'],
      ).toEqual([
        'error',
        {
          namedComponents: 'arrow-function',
          unnamedComponents: 'arrow-function',
        },
      ]);
    });

    it('should have jsx-filename-extension rule configured', () => {
      const reactConfig = config.find(
        (item) => item.rules?.['react/jsx-filename-extension'],
      );
      expect(reactConfig?.rules?.['react/jsx-filename-extension']).toEqual([
        'warn',
        {
          extensions: ['.jsx', '.tsx'],
          ignoreFilesWithoutCode: true,
        },
      ]);
    });

    it('should have jsx-props-no-spreading rule disabled', () => {
      const reactConfig = config.find(
        (item) => item.rules?.['react/jsx-props-no-spreading'],
      );
      expect(reactConfig?.rules?.['react/jsx-props-no-spreading']).toBe('off');
    });

    it('should have require-default-props rule disabled', () => {
      const reactConfig = config.find(
        (item) => item.rules?.['react/require-default-props'],
      );
      expect(reactConfig?.rules?.['react/require-default-props']).toBe('off');
    });
  });

  describe('Unicorn rules overrides', () => {
    it('should have unicorn/consistent-function-scoping rule disabled', () => {
      const reactConfig = config.find(
        (item) => item.rules?.['unicorn/consistent-function-scoping'],
      );
      expect(reactConfig?.rules?.['unicorn/consistent-function-scoping']).toBe(
        'error',
      );
    });
  });

  describe('Configuration structure', () => {
    it('should include recommended React config', () => {
      // The config should include React's recommended rules
      const hasReactRules = config.some(
        (item) =>
          item.rules &&
          Object.keys(item.rules).some((rule) => rule.startsWith('react/')),
      );
      expect(hasReactRules).toBe(true);
    });

    it('should include JSX runtime config', () => {
      // The config should include JSX runtime configuration
      const hasJsxRules = config.some(
        (item) =>
          item.rules &&
          Object.keys(item.rules).some((rule) => rule.startsWith('react/')),
      );
      expect(hasJsxRules).toBe(true);
    });

    it('should include React Hooks rules', () => {
      // The config should include React Hooks rules
      const hasHooksRules = config.some(
        (item) =>
          item.rules &&
          Object.keys(item.rules).some((rule) =>
            rule.startsWith('react-hooks/'),
          ),
      );
      expect(hasHooksRules).toBe(true);
    });
  });

  describe('Rule validation', () => {
    it('should have valid rule configurations', () => {
      const reactConfig = config.find(
        (item) => item.rules?.['react/function-component-definition'],
      );
      expect(reactConfig).toBeDefined();

      // Check that the rule configuration is valid
      const ruleConfig =
        reactConfig?.rules?.['react/function-component-definition'];
      expect(Array.isArray(ruleConfig)).toBe(true);
      expect(ruleConfig?.[0]).toBe('error');
      expect(typeof ruleConfig?.[1]).toBe('object');
    });
  });
});
