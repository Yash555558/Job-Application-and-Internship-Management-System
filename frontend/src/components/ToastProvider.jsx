import React from 'react';
import { Toaster } from 'react-hot-toast';

const ToastProvider = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          fontSize: '14px',
        },
        success: {
          style: {
            background: '#10b981',
            color: 'white',
          },
        },
        error: {
          style: {
            background: '#ef4444',
            color: 'white',
          },
        },
      }}
    />
  );
};

export default ToastProvider;