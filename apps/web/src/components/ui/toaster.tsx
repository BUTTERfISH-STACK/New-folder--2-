'use client';

import { Toaster as HotToaster } from 'react-hot-toast';

export function Toaster() {
  return (
    <HotToaster
      position="bottom-center"
      toastOptions={{
        className: 'glass-card',
        duration: 3000,
        style: {
          background: 'rgba(0, 0, 0, 0.8)',
          color: '#fff',
          border: '1px solid rgba(212, 175, 55, 0.3)',
          backdropFilter: 'blur(20px)',
        },
        success: {
          iconTheme: {
            primary: '#d4af37',
            secondary: '#000',
          },
        },
        error: {
          iconTheme: {
            primary: '#e07a5f',
            secondary: '#000',
          },
        },
      }}
    />
  );
}
