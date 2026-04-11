import { toast as sonnerToast } from 'sonner';

export function toast(message: string) {
  sonnerToast(message, {
    duration: 3000,
    position: 'top-center',
  });
}
