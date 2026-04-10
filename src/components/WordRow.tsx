import { cn } from '../lib/utils.ts';

interface WordRowProps {
  isPassed: boolean;
  answer: string;
  guess: string[];
  currentLetterIndex: number;
  isCurrentGuess: boolean;
  isEnd: boolean;
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
    ? getPassedLetterClassName()
    : Array(WORD_LENGTH).fill('');

  function getPassedLetterClassName() {
    const answerSplit = answer.split('');
    const wrongClassName = 'bg-gray-400! dark:bg-stone-800!';
    const mismatchedClassName = 'bg-yellow-400! dark:bg-yellow-600!';
    const correctClassName = 'bg-green-400! dark:bg-green-600!';
    const classNames = Array(WORD_LENGTH).fill(wrongClassName);
    const answerCount: Record<string, number> = {};
    const guessCount: Record<string, number> = {};

    answerSplit.forEach((char) => {
      answerCount[char] = (answerCount[char] || 0) + 1;
    });
    // Filling classNames for correct chars
    guess.forEach((char, index) => {
      if (answerSplit[index] === char) {
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

  return (
    <div className="flex gap-2">
      {Array.from({ length: WORD_LENGTH }).map((_, index) => {
        return (
          <div
            key={index}
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-md border-2 border-black text-center text-3xl uppercase transition duration-200 dark:border-neutral-300',
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
