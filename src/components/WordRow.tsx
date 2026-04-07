import { cn } from '../lib/utils.ts';

interface WordRowProps {
  isPassed: boolean;
  answer: string;
  word: string[];
}

function WordRow({ isPassed, answer, word }: WordRowProps) {
  return (
    <div className="flex gap-2 p-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className={cn(
            'flex h-10 w-10 items-center justify-center border-2 border-black text-center text-4xl uppercase transition duration-200',
            {
              'bg-gray-400!': isPassed,
              'bg-yellow-400!': isPassed && answer.includes(word[index]),
              'bg-green-400!':
                isPassed &&
                (index ===
                  answer.split('').findIndex((char) => char === word[index]) ||
                  index ===
                    answer
                      .split('')
                      .findLastIndex((char) => char === word[index])),
            },
          )}
        >
          <span className="relative bottom-0.5">{word[index]}</span>
        </div>
      ))}
    </div>
  );
}

export default WordRow;
