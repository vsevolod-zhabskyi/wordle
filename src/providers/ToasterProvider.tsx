import { Toaster } from 'sonner';

function ToasterProvider() {
  return (
    <Toaster
      toastOptions={{
        className:
          'bg-neutral-200! text-neutral-800! border-neutral-800! dark:bg-neutral-700! dark:text-neutral-300! dark:border-none!',
      }}
    />
  );
}

export default ToasterProvider;
