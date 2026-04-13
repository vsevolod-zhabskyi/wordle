import { useEffect, useState } from 'react';
import { RefreshCcw } from 'lucide-react';

import type { LetterStatus } from '@/lib/types.ts';
import { MAX_GUESSES, WORD_LENGTH } from '@/lib/constants.ts';
import { usePersistentState } from '@/hooks/usePersistentState.ts';
import { toast } from '@/lib/toast.ts';

import allAnswers from '@/answers.json';

import ToasterProvider from '@/providers/ToasterProvider.tsx';
import WordRow from '@/components/WordRow.tsx';
import Keyboard from '@/components/Keyboard.tsx';
import ThemeToggle from '@/components/ThemeToggle.tsx';
import HintButton from '@/components/HintButton.tsx';

const getAnswer = () => {
  return allAnswers[Math.floor(Math.random() * allAnswers.length)];
};

const getGuessesInitialState: () => string[][] = () => {
  return Array.from({ length: MAX_GUESSES }, () => Array(WORD_LENGTH).fill(''));
};

const getLetterStatusInitialState: () => LetterStatus = () => ({
  wrong: {},
  correct: {},
  mismatched: {},
});

function App() {
  const [answers] = useState<Set<string>>(new Set(allAnswers));
  const [answer, setAnswer] = usePersistentState<string>('answer', getAnswer, {
    encrypt: true,
  });
  const [currentWordIndex, setCurrentWordIndex] = usePersistentState(
    'currentWordIndex',
    0,
  );
  const [currentLetterIndex, setCurrentLetterIndex] = usePersistentState(
    'currentLetterIndex',
    0,
  );
  const [guesses, setGuesses] = usePersistentState<string[][]>(
    'guesses',
    getGuessesInitialState,
  );
  const [letterStatus, setLetterStatus] = usePersistentState<LetterStatus>(
    'letterStatus',
    getLetterStatusInitialState,
  );
  const [isWin, setIsWin] = usePersistentState('isWin', false, {
    encrypt: true,
  });
  const [isLose, setIsLose] = usePersistentState('isLose', false, {
    encrypt: true,
  });
  const [hint, setHint] = useState<string | null>(null);

  useEffect(() => {
    if (!isWin && currentWordIndex >= MAX_GUESSES) {
      setIsLose(true);
    }
  }, [currentWordIndex]);

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      handleKeyDown(e);
    };

    window.addEventListener('keydown', listener);

    return () => {
      window.removeEventListener('keydown', listener);
    };
  }, [isWin, isLose, currentWordIndex, currentLetterIndex, answer]);

  const handleEnter = () => {
    const answerSplit = answer.split('');
    const guessSplit = guesses[currentWordIndex];
    const guessJoined = guesses[currentWordIndex]?.join('');

    if (guessJoined.length < WORD_LENGTH) return;

    if (!answers.has(guessJoined)) {
      toast(`No such word in the dictionary :(`);
      return;
    }

    setLetterStatus((prev) => {
      const newLetterStatus = structuredClone(prev);

      for (let i = 0; i < guessSplit.length; i++) {
        const guessChar = guessSplit[i];
        const answerChar = answerSplit[i];
        const isInAnswer = answerSplit.includes(guessChar);

        if (!isInAnswer) {
          newLetterStatus.wrong[guessChar] = true;
        }
        if (isInAnswer && guessChar !== answerChar) {
          newLetterStatus.mismatched[guessChar] = true;
        }
        if (guessChar === answerChar) {
          delete newLetterStatus.mismatched[guessChar];
          newLetterStatus.correct[guessChar] = true;
        }
      }
      return newLetterStatus;
    });

    if (guessJoined === answer) {
      setIsWin(true);
    }

    setCurrentWordIndex((prev) => (prev <= MAX_GUESSES - 1 ? prev + 1 : prev));
    setCurrentLetterIndex(0);
  };

  const handleBackspace = () => {
    setGuesses((prev) =>
      prev.map((word, wordIndex) =>
        wordIndex === currentWordIndex
          ? word.map((char, charIndex) =>
              charIndex === currentLetterIndex - 1 ? '' : char,
            )
          : word,
      ),
    );
    setCurrentLetterIndex((prev) => (prev <= 0 ? prev : prev - 1));
  };

  function handleKeyDown(e: KeyboardEvent) {
    if (isWin || isLose) return;

    if (e.ctrlKey || e.metaKey) return;

    if (e.code.startsWith('Key')) {
      const letter = e.code.replace('Key', '').toLowerCase();
      inputLetter(letter);
      return;
    }

    if (e.key === 'Enter') {
      handleEnter();
      return;
    }

    if (e.key === 'Backspace') {
      handleBackspace();
      return;
    }
  }

  function inputLetter(letter: string) {
    if (isWin || isLose) return;

    setGuesses((prev) =>
      prev.map((word, wordIndex) =>
        wordIndex === currentWordIndex
          ? word.map((char, charIndex) =>
              charIndex === currentLetterIndex ? letter : char,
            )
          : word,
      ),
    );
    setCurrentLetterIndex((prev) =>
      prev <= WORD_LENGTH - 1 ? prev + 1 : prev,
    );
  }

  const restart = () => {
    setAnswer(getAnswer());
    setGuesses(getGuessesInitialState());
    setCurrentWordIndex(0);
    setCurrentLetterIndex(0);
    setIsWin(false);
    setIsLose(false);
    setLetterStatus(getLetterStatusInitialState());
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
          {/*<button className="cursor-pointer">*/}
          {/*  <Settings size={34} />*/}
          {/*</button>*/}
          <button onClick={restart} className="cursor-pointer">
            <RefreshCcw size={34} />
          </button>
          <HintButton answer={answer} hint={hint} setHint={setHint} />
        </div>

        <div className="flex flex-col gap-2">
          {Array.from({ length: MAX_GUESSES }).map((_, index) => (
            <WordRow
              key={index}
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
