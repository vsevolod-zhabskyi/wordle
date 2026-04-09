import { cn } from '../lib/utils.ts';

interface WordRowProps {
  isPassed: boolean;
  answer: string;
  guess: string[];
  currentLetterIndex: number;
  isCurrentGuess: boolean;
}

function WordRow({
  isPassed,
  answer,
  guess,
  currentLetterIndex,
  isCurrentGuess,
}: WordRowProps) {
  return (
    <div className="flex gap-2">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className={cn(
            'flex h-10 w-10 items-center justify-center border-2 border-black text-center text-4xl uppercase transition duration-200',
            {
              'border-3!': isCurrentGuess && index === currentLetterIndex,
              'bg-gray-400!': isPassed,
              'bg-yellow-400!': isPassed && answer.includes(guess[index]),
              'bg-green-400!':
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
          <span className="relative bottom-0.5">{guess[index]}</span>
        </div>
      ))}
    </div>
  );
}

export default WordRow;
