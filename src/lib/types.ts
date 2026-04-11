export interface LetterStatus {
  wrong: Record<string, true>;
  correct: Record<string, true>;
  mismatched: Record<string, true>;
}
