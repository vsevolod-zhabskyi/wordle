import React from 'react';
import { Dialog } from 'radix-ui';
import { Settings } from 'lucide-react';

import { WORD_LENGTHS } from '@/lib/constants.ts';
import { cn } from '@/lib/utils.ts';
import type { WordLength } from '@/lib/types.ts';

interface SettingsModalProps {
  wordLength: number;
  setWordLength: React.Dispatch<React.SetStateAction<WordLength>>;
}

function SettingsModal({ wordLength, setWordLength }: SettingsModalProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="cursor-pointer">
          <Settings size={34} />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />

        <Dialog.Content className="fixed top-2/5 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="rounded-lg border-2 border-neutral-800 bg-neutral-100 p-4 text-neutral-800 dark:border-none dark:bg-neutral-900 dark:text-neutral-300">
            <Dialog.Title className="mb-2">Select word length</Dialog.Title>

            <div className="flex items-center justify-center gap-2">
              {WORD_LENGTHS.map((wl) => (
                <Dialog.Close key={wl} asChild>
                  <button
                    onClick={() => setWordLength(wl)}
                    disabled={wl === wordLength}
                    className={cn(
                      'cursor-pointer rounded-md border border-neutral-800 bg-neutral-200 px-3 py-2 dark:border-none dark:border-neutral-300 dark:bg-stone-800',
                      { 'cursor-default bg-neutral-400': wl === wordLength },
                    )}
                  >
                    {wl}
                  </button>
                </Dialog.Close>
              ))}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default SettingsModal;
