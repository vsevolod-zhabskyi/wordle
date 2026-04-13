import type { WordLength } from '@/lib/types.ts';

import Letters4Words from '@/4_letter_words.json';
import Letters5Words from '@/5_letter_words.json';
import Letters6Words from '@/6_letter_words.json';

export const WORD_LENGTH = 5;
export const MAX_GUESSES = 6;

export const WORD_LENGTHS = [4, 5, 6] as const;

export const WORD_LISTS: Record<WordLength, Set<string>> = {
  4: new Set(Letters4Words),
  5: new Set(Letters5Words),
  6: new Set(Letters6Words),
};
