import { WORD_LENGTHS } from '@/lib/constants.ts';

export interface LetterStatus {
  wrong: Record<string, true>;
  correct: Record<string, true>;
  mismatched: Record<string, true>;
}

export type WordLength = (typeof WORD_LENGTHS)[number];
