import { useEffect, useRef, useState } from 'react';
import { isLetter } from './lib/utils.ts';
import allAnswers from './answers.json';

import WordRow from './components/WordRow.tsx';

function App() {
  const [answers] = useState<Set<string>>(new Set(allAnswers));
  const [answer] = useState<string>(
    allAnswers[Math.floor(Math.random() * allAnswers.length)],
  );
  const [isWin, setIsWin] = useState(false);
  const [isLose, setIsLose] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [inputtedWords, setInputtedWords] = useState<string[][]>(
    Array.from({ length: 6 }, () => Array(5).fill('')),
  );
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleLetterDown(e: KeyboardEvent) {
      if (isWin) return;

      if (!isLetter(e.key)) {
        return;
      }

      const letterValue = e.key.toLowerCase();

      inputLetter(letterValue);
    }

    document.addEventListener('keydown', handleLetterDown);

    return () => document.removeEventListener('keydown', handleLetterDown);
  }, [currentWordIndex, currentLetterIndex]);

  useEffect(() => {
    const enterListener = (e: KeyboardEvent) => {
      if (e.key !== 'Enter') return;

      const guess = inputtedWords[currentWordIndex]?.join('');

      if (guess.length < 5) return;

      if (!answers.has(guess)) {
        alert(`No such word as ${guess}`);
        return;
      }

      if (guess === answer) {
        setIsWin(true);
      }

      setCurrentWordIndex((prev) => (prev <= 5 ? prev + 1 : prev));
      setCurrentLetterIndex(0);
    };

    const backspaceListener = (e: KeyboardEvent) => {
      if (e.key !== 'Backspace') return;

      setInputtedWords((prev) =>
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

    document.addEventListener('keydown', enterListener);
    document.addEventListener('keydown', backspaceListener);
    return () => {
      document.removeEventListener('keydown', enterListener);
      document.removeEventListener('keydown', backspaceListener);
    };
  }, [inputtedWords, currentWordIndex, currentLetterIndex]);

  useEffect(() => {
    if (!isWin && currentWordIndex >= 6) {
      setIsLose(true);
    }
  }, [currentWordIndex]);

  function inputLetter(letter: string) {
    setInputtedWords((prev) =>
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

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div
        className="flex flex-col gap-2"
        onClick={() => inputRef.current?.focus()}
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <WordRow
            key={index}
            word={inputtedWords[index]}
            isPassed={index < currentWordIndex}
            answer={answer}
          />
        ))}
      </div>
      <div className="h-13 pt-3 text-4xl font-bold">
        {isWin && <span>Yup! It's {answer}</span>}
        {isLose && <span>Sorry! It's {answer}</span>}
      </div>
      <input ref={inputRef} className="absolute opacity-0" autoFocus />
    </div>
  );
}

export default App;
