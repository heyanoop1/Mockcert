import { describe, expect, it } from 'vitest';
import { cn } from './utils';

describe('cn', () => {
  it('merges class names and preserves the latest conflicting style', () => {
    expect(cn('px-2', 'px-4', 'font-bold')).toContain('px-4');
    expect(cn('text-slate-900', 'text-brand-600')).toContain('text-brand-600');
  });
});
