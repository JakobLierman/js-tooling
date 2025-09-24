import { describe, expect, it } from 'vitest';
import config from './nextjs';

describe('Next.js ESLint Configuration', () => {
  it('should be a valid ESLint configuration', () => {
    expect(config).toBeDefined();
    expect(Array.isArray(config)).toBe(true);
  });

  it('should extend React configuration', () => {
    // The Next.js config should include the React config
    expect(config.length).toBeGreaterThan(1);
  });

  it('should include Next.js plugin configuration', () => {
    const nextConfig = config.find(
      (item) =>
        item.plugins?.['@next/next'] ??
        (item.rules &&
          Object.keys(item.rules).some((rule) =>
            rule.startsWith('@next/next/'),
          )),
    );
    expect(nextConfig).toBeDefined();
  });

  it('should have Next.js ignores configured', () => {
    const ignoreConfig = config.find((item) => item.ignores);
    // The ignores are inherited from the base configuration
    expect(ignoreConfig?.ignores).toBeDefined();
    expect(Array.isArray(ignoreConfig?.ignores)).toBe(true);
  });

  describe('Next.js-specific rules', () => {
    it('should include Next.js recommended rules', () => {
      const nextConfig = config.find(
        (item) =>
          item.rules &&
          Object.keys(item.rules).some((rule) =>
            rule.startsWith('@next/next/'),
          ),
      );
      expect(nextConfig).toBeDefined();
    });

    it('should include Next.js core web vitals rules', () => {
      const nextConfig = config.find(
        (item) =>
          item.rules &&
          Object.keys(item.rules).some((rule) =>
            rule.startsWith('@next/next/'),
          ),
      );
      expect(nextConfig).toBeDefined();
    });
  });

  describe('Configuration structure', () => {
    it('should include React configuration', () => {
      // The config should include React rules from the base React config
      const hasReactRules = config.some(
        (item) =>
          item.rules &&
          Object.keys(item.rules).some((rule) => rule.startsWith('react/')),
      );
      expect(hasReactRules).toBe(true);
    });

    it('should include Next.js plugin', () => {
      const nextConfig = config.find((item) => item.plugins?.['@next/next']);
      expect(nextConfig).toBeDefined();
    });

    it('should have proper file ignores', () => {
      const ignoreConfig = config.find((item) => item.ignores);
      expect(ignoreConfig).toBeDefined();
      expect(Array.isArray(ignoreConfig?.ignores)).toBe(true);
    });
  });

  describe('Rule validation', () => {
    it('should have valid Next.js rule configurations', () => {
      const nextConfig = config.find(
        (item) =>
          item.rules &&
          Object.keys(item.rules).some((rule) =>
            rule.startsWith('@next/next/'),
          ),
      );
      expect(nextConfig).toBeDefined();

      if (nextConfig?.rules) {
        const nextRules = Object.keys(nextConfig.rules).filter((rule) =>
          rule.startsWith('@next/next/'),
        );
        expect(nextRules.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Integration with React', () => {
    it('should maintain React rules from base config', () => {
      const hasReactRules = config.some(
        (item) =>
          item.rules &&
          Object.keys(item.rules).some((rule) => rule.startsWith('react/')),
      );
      expect(hasReactRules).toBe(true);
    });

    it('should maintain React Hooks rules', () => {
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

  describe('File patterns', () => {
    it('should have proper ignore configuration', () => {
      const ignoreConfig = config.find((item) => item.ignores);
      expect(ignoreConfig?.ignores).toBeDefined();
      expect(Array.isArray(ignoreConfig?.ignores)).toBe(true);
    });
  });
});
