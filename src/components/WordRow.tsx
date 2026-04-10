import { cn } from '../lib/utils.ts';
import { WORD_LENGTH } from '../lib/constants.ts';

interface WordRowProps {
  isPassed: boolean;
  answer: string;
  guess: string[];
  currentLetterIndex: number;
  isCurrentGuess: boolean;
  isEnd: boolean;
}

const wrongClassName = 'bg-gray-400! dark:bg-stone-800!';
const mismatchedClassName = 'bg-yellow-400! dark:bg-yellow-600!';
const correctClassName = 'bg-green-400! dark:bg-green-600!';

function getPassedLetterClassName(guess: string[], answer: string[]) {
  const classNames = Array(WORD_LENGTH).fill(wrongClassName);
  const answerCount: Record<string, number> = {};
  const guessCount: Record<string, number> = {};

  answer.forEach((char) => {
    answerCount[char] = (answerCount[char] || 0) + 1;
  });
  // Filling classNames for correct chars
  guess.forEach((char, index) => {
    if (answer[index] === char) {
      guessCount[char] = (guessCount[char] || 0) + 1;
      classNames[index] = correctClassName;
    }
  });
  // Filling classNames for mismatched chars
  guess.forEach((char, index) => {
    if (
      (answerCount[char] || 0) > 0 &&
      char !== answer[index] &&
      (guessCount[char] || 0) < answerCount[char]
    ) {
      guessCount[char] = (guessCount[char] || 0) + 1;
      classNames[index] = mismatchedClassName;
    }
  });

  return classNames;
}

function WordRow({
  isPassed,
  answer,
  guess,
  currentLetterIndex,
  isCurrentGuess,
  isEnd,
}: WordRowProps) {
  const passedLetterClassName = isPassed
    ? getPassedLetterClassName(guess, answer.split(''))
    : Array(WORD_LENGTH).fill('');

  const cells = Array.from({ length: WORD_LENGTH });

  return (
    <div className="flex gap-2">
      {cells.map((_, index) => {
        return (
          <div
            key={index}
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-md border-2 border-neutral-800 text-center text-3xl uppercase transition duration-200 dark:border-none dark:bg-neutral-700',
              passedLetterClassName[index],
              {
                'dark:border-none!': isPassed,
                'border-3!':
                  isCurrentGuess && !isEnd && index === currentLetterIndex,
              },
            )}
          >
            {guess[index]}
          </div>
        );
      })}
    </div>
  );
}

export default WordRow;
