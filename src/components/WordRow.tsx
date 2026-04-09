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
  return (
    <div className="flex gap-2">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-md border-2 border-black text-center text-3xl uppercase transition duration-200 dark:border-neutral-300',
            {
              'dark:border-none!': isPassed,
              'border-3!':
                isCurrentGuess && !isEnd && index === currentLetterIndex,
              'bg-gray-400! dark:bg-stone-800!': isPassed,
              'bg-yellow-400! dark:bg-yellow-600!':
                isPassed && answer.includes(guess[index]),
              'bg-green-400! dark:bg-green-600!':
                isPassed &&
                (index ===
                  answer.split('').findIndex((char) => char === guess[index]) ||
                  index ===
                    answer
                      .split('')
                      .findLastIndex((char) => char === guess[index])),
            },
          )}
        >
          {guess[index]}
        </div>
      ))}
    </div>
  );
}

export default WordRow;
