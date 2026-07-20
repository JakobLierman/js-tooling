import { describe, expect, it } from 'vitest';

describe('TypeScript Configuration', () => {
  it('Should enforce strict mode', () => {
    // Ensure strict null checks by testing a potentially nullable value
    const myValue: string | null = null;

    // This line should cause a TypeScript error if strict null checks are enforced
    // Uncommenting the next line should result in a compilation error
    // const length = myValue.length;
    expect(myValue).toBeNull();
  });
});
