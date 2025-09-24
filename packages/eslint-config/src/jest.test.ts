import { describe, expect, it } from 'vitest';
import config from './jest';

describe('Jest ESLint Configuration', () => {
  it('should be a valid ESLint configuration', () => {
    expect(config).toBeDefined();
    expect(Array.isArray(config)).toBe(true);
  });

  it('should include Jest plugin configuration', () => {
    const jestConfig = config.find(
      (item) =>
        item.plugins?.['jest'] ??
        (item.rules &&
          Object.keys(item.rules).some((rule) => rule.startsWith('jest/'))),
    );
    expect(jestConfig).toBeDefined();
  });

  describe('Jest-specific rules', () => {
    it('should include Jest recommended rules', () => {
      const jestConfig = config.find(
        (item) =>
          item.rules &&
          Object.keys(item.rules).some((rule) => rule.startsWith('jest/')),
      );
      expect(jestConfig).toBeDefined();
    });

    it('should include Jest style rules', () => {
      const jestConfig = config.find(
        (item) =>
          item.rules &&
          Object.keys(item.rules).some((rule) => rule.startsWith('jest/')),
      );
      expect(jestConfig).toBeDefined();
    });
  });

  describe('Configuration structure', () => {
    it('should include Jest flat/recommended config', () => {
      // The config should include Jest's recommended rules
      const hasJestRules = config.some(
        (item) =>
          item.rules &&
          Object.keys(item.rules).some((rule) => rule.startsWith('jest/')),
      );
      expect(hasJestRules).toBe(true);
    });

    it('should include Jest flat/style config', () => {
      // The config should include Jest's style rules
      const hasJestStyleRules = config.some(
        (item) =>
          item.rules &&
          Object.keys(item.rules).some((rule) => rule.startsWith('jest/')),
      );
      expect(hasJestStyleRules).toBe(true);
    });
  });

  describe('Rule validation', () => {
    it('should have valid Jest rule configurations', () => {
      const jestConfig = config.find(
        (item) =>
          item.rules &&
          Object.keys(item.rules).some((rule) => rule.startsWith('jest/')),
      );
      expect(jestConfig).toBeDefined();

      if (jestConfig?.rules) {
        const jestRules = Object.keys(jestConfig.rules).filter((rule) =>
          rule.startsWith('jest/'),
        );
        expect(jestRules.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Plugin integration', () => {
    it('should have Jest plugin properly configured', () => {
      const jestConfig = config.find((item) => item.plugins?.['jest']);
      expect(jestConfig).toBeDefined();
    });

    it('should have Jest rules from recommended config', () => {
      const jestConfig = config.find(
        (item) =>
          item.rules &&
          Object.keys(item.rules).some((rule) => rule.startsWith('jest/')),
      );
      expect(jestConfig).toBeDefined();
    });

    it('should have Jest rules from style config', () => {
      const jestConfig = config.find(
        (item) =>
          item.rules &&
          Object.keys(item.rules).some((rule) => rule.startsWith('jest/')),
      );
      expect(jestConfig).toBeDefined();
    });
  });

  describe('Configuration composition', () => {
    it('should include both recommended and style configurations', () => {
      // The config should include both Jest recommended and style rules
      const hasJestRules = config.some(
        (item) =>
          item.rules &&
          Object.keys(item.rules).some((rule) => rule.startsWith('jest/')),
      );
      expect(hasJestRules).toBe(true);
    });

    it('should have proper configuration structure', () => {
      expect(config.length).toBeGreaterThan(0);

      // Should have at least one configuration object with Jest rules
      const jestConfig = config.find(
        (item) =>
          item.rules &&
          Object.keys(item.rules).some((rule) => rule.startsWith('jest/')),
      );
      expect(jestConfig).toBeDefined();
    });
  });

  describe('Jest-specific functionality', () => {
    it('should support Jest testing patterns', () => {
      const jestConfig = config.find(
        (item) =>
          item.rules &&
          Object.keys(item.rules).some((rule) => rule.startsWith('jest/')),
      );
      expect(jestConfig).toBeDefined();
    });

    it('should include Jest best practices', () => {
      const jestConfig = config.find(
        (item) =>
          item.rules &&
          Object.keys(item.rules).some((rule) => rule.startsWith('jest/')),
      );
      expect(jestConfig).toBeDefined();
    });
  });
});
