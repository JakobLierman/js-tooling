import { type UserConfig } from '@commitlint/types';

/**
 * Commitlint configuration that extends the conventional commit configuration.
 * This ensures consistent and meaningful commit messages following the conventional commits specification.
 */
const config: UserConfig = {
  extends: ['@commitlint/config-conventional'],
};

export default config;
