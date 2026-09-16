'use client';

import { Toaster as SonnerToaster, toast as sonnerToast } from 'sonner';

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        classNames: {
          toast: 'font-sans text-sm rounded-xl border border-[#E3EDF7] shadow-lg',
          title: 'text-[#0E1B2A] font-medium',
          description: 'text-[#6E7C91]',
          success: 'border-[#22A06B]/20 bg-[#E6F6F0]',
          error: 'border-[#D14343]/20 bg-[#FCEAEA]',
        },
      }}
    />
  );
}

export const toast = {
  success: (message: string, description?: string) =>
    sonnerToast.success(message, { description }),
  error: (message: string, description?: string) =>
    sonnerToast.error(message, { description }),
  info: (message: string, description?: string) =>
    sonnerToast(message, { description }),
  warning: (message: string, description?: string) =>
    sonnerToast.warning ? sonnerToast.warning(message, { description }) : sonnerToast(message, { description }),
  loading: (message: string) =>
    sonnerToast.loading(message),
  dismiss: sonnerToast.dismiss,
};
