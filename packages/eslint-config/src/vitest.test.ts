import { describe, expect, it } from 'vitest';
import config from './vitest';

describe('Vitest ESLint Configuration', () => {
  it('should be a valid ESLint configuration', () => {
    expect(config).toBeDefined();
    expect(Array.isArray(config)).toBe(true);
  });

  it('should target test files', () => {
    const vitestConfig = config.find((item) => item.files);
    expect(vitestConfig?.files).toEqual([
      '**/*.test.*',
      '**/*.spec.*',
      '**/test/**',
      '**/tests/**',
    ]);
  });

  it('should include Vitest plugin configuration', () => {
    const vitestConfig = config.find(
      (item) =>
        item.plugins?.['vitest'] ??
        (item.rules &&
          Object.keys(item.rules).some((rule) => rule.startsWith('vitest/'))),
    );
    expect(vitestConfig).toBeDefined();
  });

  it('should have Vitest settings configured', () => {
    const vitestConfig = config.find((item) => item.settings?.vitest);
    expect(vitestConfig?.settings?.vitest).toEqual({ typecheck: true });
  });

  it('should have Vitest globals configured', () => {
    const vitestConfig = config.find((item) => item.languageOptions?.globals);
    expect(vitestConfig?.languageOptions?.globals).toBeDefined();
  });

  describe('Vitest-specific rules', () => {
    it('should include Vitest recommended rules', () => {
      const vitestConfig = config.find(
        (item) =>
          item.rules &&
          Object.keys(item.rules).some((rule) => rule.startsWith('vitest/')),
      );
      expect(vitestConfig).toBeDefined();
    });

    it('should have Vitest plugin configured', () => {
      const vitestConfig = config.find((item) => item.plugins?.['vitest']);
      expect(vitestConfig).toBeDefined();
    });
  });

  describe('Configuration structure', () => {
    it('should target correct test file patterns', () => {
      const vitestConfig = config.find((item) => item.files);
      expect(vitestConfig?.files).toContain('**/*.test.*');
      expect(vitestConfig?.files).toContain('**/*.spec.*');
      expect(vitestConfig?.files).toContain('**/test/**');
      expect(vitestConfig?.files).toContain('**/tests/**');
    });

    it('should have proper language options', () => {
      const vitestConfig = config.find((item) => item.languageOptions?.globals);
      expect(vitestConfig?.languageOptions?.globals).toBeDefined();
    });

    it('should have proper settings', () => {
      const vitestConfig = config.find((item) => item.settings?.vitest);
      expect(vitestConfig?.settings?.vitest).toEqual({ typecheck: true });
    });
  });

  describe('File patterns', () => {
    it('should match test files with .test. extension', () => {
      const vitestConfig = config.find((item) => item.files);
      expect(vitestConfig?.files).toContain('**/*.test.*');
    });

    it('should match test files with .spec. extension', () => {
      const vitestConfig = config.find((item) => item.files);
      expect(vitestConfig?.files).toContain('**/*.spec.*');
    });

    it('should match test directories', () => {
      const vitestConfig = config.find((item) => item.files);
      expect(vitestConfig?.files).toContain('**/test/**');
      expect(vitestConfig?.files).toContain('**/tests/**');
    });
  });

  describe('Rule validation', () => {
    it('should have valid Vitest rule configurations', () => {
      const vitestConfig = config.find(
        (item) =>
          item.rules &&
          Object.keys(item.rules).some((rule) => rule.startsWith('vitest/')),
      );
      expect(vitestConfig).toBeDefined();

      if (vitestConfig?.rules) {
        const vitestRules = Object.keys(vitestConfig.rules).filter((rule) =>
          rule.startsWith('vitest/'),
        );
        expect(vitestRules.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Environment configuration', () => {
    it('should have Vitest globals available', () => {
      const vitestConfig = config.find((item) => item.languageOptions?.globals);
      expect(vitestConfig?.languageOptions?.globals).toBeDefined();
    });

    it('should have typecheck enabled in settings', () => {
      const vitestConfig = config.find((item) => item.settings?.vitest);
      expect(vitestConfig?.settings?.vitest?.typecheck).toBe(true);
    });
  });

  describe('Plugin integration', () => {
    it('should have Vitest plugin properly configured', () => {
      const vitestConfig = config.find((item) => item.plugins?.['vitest']);
      expect(vitestConfig).toBeDefined();
    });

    it('should have Vitest rules from recommended config', () => {
      const vitestConfig = config.find(
        (item) =>
          item.rules &&
          Object.keys(item.rules).some((rule) => rule.startsWith('vitest/')),
      );
      expect(vitestConfig).toBeDefined();
    });
  });
});
