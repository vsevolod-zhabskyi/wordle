import { useEffect, useState } from 'react';
import { RefreshCcw } from 'lucide-react';

import type { LetterStatus, WordLength } from '@/lib/types.ts';
import { MAX_GUESSES, WORD_LISTS } from '@/lib/constants.ts';
import { useWordleGame } from '@/hooks/useWordleGame.ts';
import { useKeyboard } from '@/hooks/useKeyboard.ts';
import { usePersistentState } from '@/hooks/usePersistentState.ts';
import { toast } from '@/lib/toast.ts';

import ToasterProvider from '@/providers/ToasterProvider.tsx';
import WordRow from '@/components/WordRow.tsx';
import Keyboard from '@/components/Keyboard.tsx';
import ThemeToggle from '@/components/ThemeToggle.tsx';
import HintButton from '@/components/HintButton.tsx';
import SettingsModal from '@/components/SettingsModal.tsx';

function App() {
  const [wordLength, setWordLength] = usePersistentState<WordLength>(
    'wordLength',
    5,
    { encrypt: true },
  );
  const [hint, setHint] = useState<string | null>(null);
  const {
    answer,
    guesses,
    currentWordIndex,
    currentLetterIndex,
    inputLetter,
    handleEnter,
    handleBackspace,
    letterStatus,
    restart,
    isWin,
    isLose,
  } = useWordleGame(wordLength);
  useKeyboard({
    onEnter: handleEnter,
    onBackspace: handleBackspace,
    onLetter: inputLetter,
    isBlocked: isWin || isLose,
  });

  const onWordLengthSelect = (wordLength: WordLength) => {
    setWordLength(wordLength);
    setHint(null);
    restart(wordLength);
  };

  const onRestart = () => {
    restart();
    setHint(null);
  };

  return (
    <>
      <ToasterProvider />

      <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-100 p-6 text-neutral-800 dark:bg-neutral-900 dark:text-neutral-300">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>

        <div className="mb-10 flex w-58 items-center justify-around gap-2">
          <SettingsModal
            wordLength={wordLength}
            onWordLengthSelect={onWordLengthSelect}
          />
          <button onClick={onRestart} className="cursor-pointer">
            <RefreshCcw size={34} />
          </button>
          <HintButton answer={answer} hint={hint} setHint={setHint} />
        </div>

        <div className="flex flex-col gap-2">
          {Array.from({ length: MAX_GUESSES }).map((_, index) => (
            <WordRow
              key={index}
              wordLength={wordLength}
              guess={guesses[index]}
              isPassed={index < currentWordIndex}
              answer={answer}
              currentLetterIndex={currentLetterIndex}
              isCurrentGuess={currentWordIndex === index}
              isEnd={isWin || isLose}
            />
          ))}
        </div>

        <div className="flex h-22 items-center justify-center py-3 text-4xl font-bold">
          {isWin && <span>Yup! It's {answer}</span>}
          {isLose && <span>Sorry! It's {answer}</span>}
        </div>

        <Keyboard
          onLetter={inputLetter}
          onBackspace={handleBackspace}
          onEnter={handleEnter}
          letterStatus={letterStatus}
          isEnd={isWin || isLose}
        />
      </div>
    </>
  );
}

export default App;
