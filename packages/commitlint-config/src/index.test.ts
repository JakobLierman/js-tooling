import { beforeAll, describe, expect, test } from 'vitest';
import load from '@commitlint/load';
import lint from '@commitlint/lint';
import {
  type QualifiedConfig,
  type LintOutcome,
  type LintOptions,
} from '@commitlint/types';
import config from './index';

describe('Commitlint Configuration', () => {
  /**
   * Load commitlint configuration from the built package
   */
  let commitlintConfig: QualifiedConfig;

  /**
   * Lint commit message with commitlint configuration.
   * @param message Commit message to lint
   * @returns Promise resolving to lint outcome
   */
  const lintWithConfig = (message: string): Promise<LintOutcome> => {
    return lint(message, commitlintConfig.rules, {
      parserOpts: commitlintConfig.parserPreset?.parserOpts,
    } as LintOptions);
  };

  beforeAll(async () => {
    // Load the configuration using the built package
    commitlintConfig = await load(config, {
      cwd: process.cwd(),
    });
  });

  test('Should load commitlint config without errors', async () => {
    expect(commitlintConfig).toBeDefined();
    expect(commitlintConfig).toHaveProperty('extends');
    expect(commitlintConfig.extends).toBeDefined();
    expect(commitlintConfig).toHaveProperty('rules');
    expect(commitlintConfig.rules).toBeDefined();
  });

  test('Should pass linting with valid feat commit message', async () => {
    const result = await lintWithConfig('feat: add new feature');
    expect(result).toHaveProperty('valid', true);
  });

  test('Should pass linting with valid fix commit message', async () => {
    const result = await lintWithConfig('fix: resolve a bug');
    expect(result).toHaveProperty('valid', true);
  });

  test('Should pass linting with valid chore commit message', async () => {
    const result = await lintWithConfig('chore: update dependencies');
    expect(result).toHaveProperty('valid', true);
  });

  test('Should fail linting with missing type in commit message', async () => {
    const result = await lintWithConfig('missing type');
    expect(result).toHaveProperty('valid', false);
  });

  test('Should fail linting with invalid type in commit message', async () => {
    const result = await lintWithConfig('invalid-type: fix something');
    expect(result).toHaveProperty('valid', false);
  });

  test('Should fail linting with missing colon in commit message', async () => {
    const result = await lintWithConfig('missing colon');
    expect(result).toHaveProperty('valid', false);
  });

  // TODO: Fix this test case
  test('Should pass linting with breaking change', async () => {
    const result = await lintWithConfig('feat(api)!: add breaking new feature');
    expect(result).toHaveProperty('valid', true);
  });

  test('Should pass linting with breaking change in commit footer', async () => {
    const result = await lintWithConfig(
      'feat: add amazing new feature\n\nBREAKING CHANGE: it breaks something',
    );
    expect(result).toHaveProperty('valid', true);
  });

  test('Should fail linting with invalid breaking change format', async () => {
    const result = await lintWithConfig('feat!(scope): add new feature');
    expect(result).toHaveProperty('valid', false);
  });

  test('Should pass linting with multiple lines', async () => {
    const result = await lintWithConfig(
      'feat: add new feature\nMore detailed description',
    );
    expect(result).toHaveProperty('valid', true);
  });

  test('Should pass linting with valid test commit message', async () => {
    const result = await lintWithConfig('test: add unit tests');
    expect(result).toHaveProperty('valid', true);
  });

  test('Should pass linting with valid docs commit message', async () => {
    const result = await lintWithConfig('docs: update documentation');
    expect(result).toHaveProperty('valid', true);
  });

  test('Should pass linting with valid style commit message', async () => {
    const result = await lintWithConfig('style: fix code style issues');
    expect(result).toHaveProperty('valid', true);
  });

  test('Should pass linting with valid refactor commit message', async () => {
    const result = await lintWithConfig('refactor: refactor code');
    expect(result).toHaveProperty('valid', true);
  });

  test('Should pass linting with multi-paragraph body and multiple footers', async () => {
    const result = await lintWithConfig(
      'fix: prevent racing of requests\n' +
        '\n' +
        'Introduce a request id and a reference to latest request. Dismiss\n' +
        'incoming responses other than from latest request.\n' +
        '\n' +
        'Remove timeouts which were used to mitigate the racing issue but are\n' +
        'obsolete now.\n' +
        '\n' +
        'Reviewed-by: Z\n' +
        'Refs: #123',
    );
    expect(result).toHaveProperty('valid', true);
  });

  // Add more test cases for different scenarios and commit message variations
});
