import { useTheme } from '@/hooks/useTheme.ts';
import { MoonIcon, SunIcon } from 'lucide-react';

interface ThemeToggleProps {
  size?: number;
}

const DEFAULT_SIZE = 34;

const ThemeToggle = ({ size }: ThemeToggleProps) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button className="cursor-pointer" onClick={toggleTheme}>
      {isDark ? (
        <SunIcon size={size || DEFAULT_SIZE} />
      ) : (
        <MoonIcon size={size || DEFAULT_SIZE} />
      )}
    </button>
  );
};

export default ThemeToggle;
