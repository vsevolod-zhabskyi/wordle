import type { WordLength } from '@/lib/types.ts';

import letters4Words from '@/4_letter_words.json';
import letters5Words from '@/5_letter_words.json';
import letters6Words from '@/6_letter_words.json';

export const MAX_GUESSES = 6;

export const WORD_LENGTHS = [4, 5, 6] as const;

export const WORD_LISTS: Record<
  WordLength,
  { list: Array<string>; set: Set<string> }
> = {
  4: {
    list: letters4Words,
    set: new Set(letters4Words),
  },
  5: {
    list: letters5Words,
    set: new Set(letters5Words),
  },
  6: {
    list: letters6Words,
    set: new Set(letters6Words),
  },
};
