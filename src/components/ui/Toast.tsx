'use client';

import { Toaster } from 'react-hot-toast';

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#0F1E33',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '12px',
          fontSize: '14px',
          backdropFilter: 'blur(10px)',
        },
        success: {
          iconTheme: {
            primary: '#D4AF37',
            secondary: '#0F1E33',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#0F1E33',
          },
        },
      }}
    />
  );
}
