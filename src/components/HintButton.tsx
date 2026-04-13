import React, { useState } from 'react';
import { WandSparkles } from 'lucide-react';

import { getHint } from '@/services/hintService.ts';
import { toast, toastPromise } from '@/lib/toast.ts';

interface HintButtonProps {
  answer: string;
  hint: string | null;
  setHint: React.Dispatch<React.SetStateAction<string | null>>;
}

const HintButton = ({ answer, hint, setHint }: HintButtonProps) => {
  const [isHintLoading, setIsHintLoading] = useState(false);

  const handleHint = () => {
    if (isHintLoading) return;

    if (hint) {
      toast(hint);
      return;
    }

    setIsHintLoading(true);

    toastPromise(getHint(answer), {
      loading: 'Thinking...',
      success: (data: string) => {
        setHint(data);
        return `${data}`;
      },
      finally: () => setIsHintLoading(false),
      error: 'Try kitty :)',
      duration: 5000,
    });
  };

  return (
    <button onClick={handleHint} className="cursor-pointer">
      <WandSparkles size={32} />
    </button>
  );
};

export default HintButton;
