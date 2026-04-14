import { useEffect } from 'react';

import { usePersistentState } from '@/hooks/usePersistentState.ts';
import { toast } from '@/lib/toast.ts';
import { MAX_GUESSES, WORD_LISTS } from '@/lib/constants.ts';
import type { LetterStatus, WordLength } from '@/lib/types.ts';

const getAnswer = (wordList: Array<string>) => {
  return wordList[Math.floor(Math.random() * wordList.length)];
};

const getGuessesInitialState: (wordLength: WordLength) => string[][] = (
  wordLength,
) => {
  return Array.from({ length: MAX_GUESSES }, () => Array(wordLength).fill(''));
};

const getLetterStatusInitialState: () => LetterStatus = () => ({
  wrong: {},
  correct: {},
  mismatched: {},
});

export function useWordleGame(wordLength: WordLength) {
  const answersSet = WORD_LISTS[wordLength].set;
  const answersList = WORD_LISTS[wordLength].list;
  const [answer, setAnswer] = usePersistentState<string>(
    'answer',
    () => getAnswer(answersList),
    {
      encrypt: true,
    },
  );
  const [currentWordIndex, setCurrentWordIndex] = usePersistentState(
    'currentWordIndex',
    0,
  );
  const [currentLetterIndex, setCurrentLetterIndex] = usePersistentState(
    'currentLetterIndex',
    0,
  );
  const [guesses, setGuesses] = usePersistentState<string[][]>('guesses', () =>
    getGuessesInitialState(wordLength),
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

  useEffect(() => {
    if (!isWin && currentWordIndex >= MAX_GUESSES) {
      setIsLose(true);
    }
  }, [currentWordIndex]);

  const handleEnter = () => {
    const answerSplit = answer.split('');
    const guessSplit = guesses[currentWordIndex];
    const guessJoined = guesses[currentWordIndex]?.join('');

    if (guessJoined.length < wordLength) return;

    if (!answersSet.has(guessJoined)) {
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
    setCurrentLetterIndex((prev) => (prev <= wordLength - 1 ? prev + 1 : prev));
  }

  const restart = (newWordlength: WordLength = wordLength) => {
    setAnswer(getAnswer(WORD_LISTS[newWordlength].list));
    setGuesses(getGuessesInitialState(newWordlength));
    setCurrentWordIndex(0);
    setCurrentLetterIndex(0);
    setIsWin(false);
    setIsLose(false);
    setLetterStatus(getLetterStatusInitialState());
  };

  return {
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
  };
}
