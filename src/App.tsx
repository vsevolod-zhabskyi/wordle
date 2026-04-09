import { useEffect, useState } from 'react';
import type { LetterStatus } from './lib/types.ts';

import allAnswers from './answers.json';

import { RefreshCcw } from 'lucide-react';
import WordRow from './components/WordRow.tsx';
import Keyboard from './components/Keyboard.tsx';
import ThemeToggle from './components/ThemeToggle.tsx';

const getAnswer = () => {
  return allAnswers[Math.floor(Math.random() * allAnswers.length)];
};

const getGuessesInitialState = () => {
  return Array.from({ length: 6 }, () => Array(5).fill(''));
};

const getLetterStatusInitialState: () => LetterStatus = () => ({
  wrong: new Set(),
  correct: new Set(),
  mismatched: new Set(),
});

function App() {
  const [answers] = useState<Set<string>>(new Set(allAnswers));
  const [answer, setAnswer] = useState<string>(getAnswer);
  const [isWin, setIsWin] = useState(false);
  const [isLose, setIsLose] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [guesses, setGuesses] = useState<string[][]>(getGuessesInitialState);
  const [letterStatus, setLetterStatus] = useState<LetterStatus>(
    getLetterStatusInitialState,
  );

  useEffect(() => {
    if (!isWin && currentWordIndex >= 6) {
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

    if (guessJoined.length < 5) return;

    if (!answers.has(guessJoined)) {
      alert(`No such word as ${guessJoined}`);
      return;
    }

    setLetterStatus((prev) => {
      const newLetterStatus = { ...prev };
      for (let i = 0; i < guessSplit.length; i++) {
        if (!answerSplit.includes(guessSplit[i])) {
          newLetterStatus.wrong.add(guessSplit[i]);
        }
        if (
          answerSplit.includes(guessSplit[i]) &&
          guessSplit[i] !== answerSplit[i]
        ) {
          newLetterStatus.mismatched.add(guessSplit[i]);
        }
        if (guessSplit[i] === answerSplit[i]) {
          newLetterStatus.mismatched.delete(guessSplit[i]);
          newLetterStatus.correct.add(guessSplit[i]);
        }
      }
      return newLetterStatus;
    });

    if (guessJoined === answer) {
      setIsWin(true);
    }

    setCurrentWordIndex((prev) => (prev <= 5 ? prev + 1 : prev));
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
    setCurrentLetterIndex((prev) => (prev <= 4 ? prev + 1 : prev));
  }

  const restart = () => {
    setAnswer(getAnswer());
    setGuesses(getGuessesInitialState());
    setCurrentWordIndex(0);
    setCurrentLetterIndex(0);
    setIsWin(false);
    setIsLose(false);
    setLetterStatus(getLetterStatusInitialState());
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center dark:bg-neutral-900 dark:text-neutral-300">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <button onClick={restart} className="mb-10 cursor-pointer">
        <RefreshCcw size={34} />
      </button>

      <div className="flex flex-col gap-2">
        {Array.from({ length: 6 }).map((_, index) => (
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

      <div className="flex h-20 items-center justify-center py-3 text-4xl font-bold">
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
  );
}

export default App;
