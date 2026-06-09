import { describe, expect, test } from 'vitest';
import config from './index';

describe('Prettier Configuration', () => {
  test('Should export a valid Prettier configuration', () => {
    expect(config).toBeDefined();
    expect(typeof config).toBe('object');
  });

  test('Should have required plugins array', () => {
    expect(config).toHaveProperty('plugins');
    expect(Array.isArray(config.plugins)).toBe(true);

    const plugins = config.plugins as string[];
    const pluginBasenames = [
      'prettier-plugin-sh',
      'prettier-plugin-packagejson',
      'prettier-plugin-properties',
      'prettier-plugin-prisma',
      'prettier-plugin-embed',
      'prettier-plugin-sql',
      'prettier-plugin-tailwindcss',
    ];

    for (const name of pluginBasenames) {
      expect(plugins.some((plugin) => plugin.includes(name))).toBe(true);
    }
  });

  test('Should have tailwindFunctions configuration', () => {
    expect(config).toHaveProperty('tailwindFunctions');
    expect(Array.isArray(config['tailwindFunctions'])).toBe(true);
    expect(config['tailwindFunctions']).toContain('clsx');
    expect(config['tailwindFunctions']).toContain('cn');
    expect(config['tailwindFunctions']).toContain('classnames');
    expect(config['tailwindFunctions']).toContain('twMerge');
    expect(config['tailwindFunctions']).toContain('twJoin');
  });

  test('Should have SQL plugin configuration', () => {
    expect(config).toHaveProperty('keywordCase');
    expect(config['keywordCase']).toBe('upper');
  });

  test('Should have tailwindcss plugin as last plugin', () => {
    const plugins = config.plugins as string[];
    const lastPlugin = plugins.at(-1);
    expect(lastPlugin).toContain('prettier-plugin-tailwindcss');
  });
});
