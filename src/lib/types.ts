import React from 'react';
import type { LucideProps } from 'lucide-react';

export interface LetterStatus {
  wrong: Set<string>;
  correct: Set<string>;
  mismatched: Set<string>;
}

export type LucideIcon = React.FC<LucideProps>;
