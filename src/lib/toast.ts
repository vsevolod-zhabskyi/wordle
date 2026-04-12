import { toast as sonnerToast, type ExternalToast } from 'sonner';

const TOAST_POSITION = 'top-center';
const TOAST_DURATION = 3000;

type ToastPromiseOptions<T> = Parameters<typeof sonnerToast.promise<T>>[1];

export function toast(message: string, options: ExternalToast = {}) {
  sonnerToast(message, {
    position: TOAST_POSITION,
    duration: TOAST_DURATION,
    ...options,
  });
}

export function toastPromise<T>(
  promise: Promise<T>,
  options: ToastPromiseOptions<T> = {},
) {
  sonnerToast.promise(promise, {
    position: TOAST_POSITION,
    duration: TOAST_DURATION,
    ...options,
  });
}
