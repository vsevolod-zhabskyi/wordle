import { useEffect, useRef } from 'react';

interface KeyboardProps {
  onEnter: () => void;
  onLetter: (letter: string) => void;
  onBackspace: () => void;
  isBlocked: boolean;
}

export function useKeyboard({
  onEnter,
  onLetter,
  onBackspace,
  isBlocked,
}: KeyboardProps) {
  const handlersRef = useRef<KeyboardProps | null>(null);

  handlersRef.current = {
    onEnter,
    onLetter,
    onBackspace,
    isBlocked,
  };

  function handleKeyDown(e: KeyboardEvent) {
    if (e.ctrlKey || e.metaKey) return;

    if (!handlersRef.current) return;

    const { onEnter, onLetter, onBackspace, isBlocked } = handlersRef.current;

    if (isBlocked) return;

    if (e.code.startsWith('Key')) {
      const letter = e.code.replace('Key', '').toLowerCase();
      onLetter(letter);
      return;
    }

    if (e.key === 'Enter') {
      onEnter();
      return;
    }

    if (e.key === 'Backspace') {
      onBackspace();
      return;
    }
  }

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      handleKeyDown(e);
    };

    window.addEventListener('keydown', listener);

    return () => {
      window.removeEventListener('keydown', listener);
    };
  }, []);
}
