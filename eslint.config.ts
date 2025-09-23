import { defineConfig } from 'eslint/config';
import jakoblierman from '@jakoblierman/eslint-config';

export default defineConfig(
  // Although not ideal, we lint globally to ensure we don't have circular dependencies
  jakoblierman,
);
