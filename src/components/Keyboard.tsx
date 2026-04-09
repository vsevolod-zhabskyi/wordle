import { cn } from '../lib/utils.ts';
import type { LetterStatus } from '../lib/types.ts';
import { type LucideIcon, Check, Undo2 } from 'lucide-react';

interface KeyboardProps {
  onLetter: (letter: string) => void;
  onBackspace: () => void;
  onEnter: () => void;
  letterStatus: LetterStatus;
  isEnd: boolean;
}

interface Key {
  key?: string;
  icon?: LucideIcon;
  action: () => void;
  className?: string;
}

const Keyboard = ({
  onLetter,
  onBackspace,
  onEnter,
  letterStatus,
  isEnd,
}: KeyboardProps) => {
  const getKeyClassName = (key: string) => {
    if (letterStatus.wrong.has(key)) {
      return 'bg-gray-400 hover:bg-gray-500 active:bg-gray-600 disabled:hover:bg-gray-400 disabled:active:bg-gray-400';
    }
    if (letterStatus.correct.has(key)) {
      return 'bg-green-400 hover:bg-green-500 active:bg-green-600 disabled:hover:bg-green-400 disabled:active:bg-green-400';
    }
    if (letterStatus.mismatched.has(key)) {
      return 'bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-600 disabled:hover:bg-yellow-400 disabled:active:bg-yellow-400';
    }
    return '';
  };

  const keys: Key[][] = [
    [
      {
        key: 'q',
        action: () => onLetter('q'),
      },
      {
        key: 'w',
        action: () => onLetter('w'),
      },
      {
        key: 'e',
        action: () => onLetter('e'),
      },
      {
        key: 'r',
        action: () => onLetter('r'),
      },
      {
        key: 't',
        action: () => onLetter('t'),
      },
      {
        key: 'y',
        action: () => onLetter('y'),
      },
      {
        key: 'u',
        action: () => onLetter('u'),
      },
      {
        key: 'i',
        action: () => onLetter('i'),
      },
      {
        key: 'o',
        action: () => onLetter('o'),
      },
      {
        key: 'p',
        action: () => onLetter('p'),
      },
    ],
    [
      {
        key: 'a',
        action: () => onLetter('a'),
      },
      {
        key: 's',
        action: () => onLetter('s'),
      },
      {
        key: 'd',
        action: () => onLetter('d'),
      },
      {
        key: 'f',
        action: () => onLetter('f'),
      },
      {
        key: 'g',
        action: () => onLetter('g'),
      },
      {
        key: 'h',
        action: () => onLetter('h'),
      },
      {
        key: 'j',
        action: () => onLetter('j'),
      },
      {
        key: 'k',
        action: () => onLetter('k'),
      },
      {
        key: 'l',
        action: () => onLetter('l'),
      },
    ],
    [
      {
        icon: Check,
        action: onEnter,
      },
      {
        key: 'z',
        action: () => onLetter('z'),
      },
      {
        key: 'x',
        action: () => onLetter('x'),
      },
      {
        key: 'c',
        action: () => onLetter('c'),
      },
      {
        key: 'v',
        action: () => onLetter('v'),
      },
      {
        key: 'b',
        action: () => onLetter('b'),
      },
      {
        key: 'n',
        action: () => onLetter('n'),
      },
      {
        key: 'm',
        action: () => onLetter('m'),
      },
      {
        icon: Undo2,
        action: onBackspace,
      },
    ],
  ];

  return (
    <div className="flex flex-col items-center gap-1 md:gap-2">
      {keys.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-1 md:gap-2">
          {row.map(({ key, icon, action, className }, keyIndex) => {
            const Icon = icon;

            return (
              <button
                key={keyIndex}
                onClick={action}
                disabled={isEnd}
                className={cn(
                  'flex h-10 w-[8vw] max-w-10 cursor-pointer items-center justify-center border-2 border-black bg-gray-300 p-0.5 text-[1rem] font-bold uppercase transition duration-200 hover:bg-gray-400 active:bg-gray-500 md:w-10 md:text-lg',
                  className,
                  'disabled:cursor-default disabled:hover:bg-gray-300 disabled:active:bg-gray-300',
                  getKeyClassName(key || ''),
                )}
              >
                {key || (Icon && <Icon />)}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
