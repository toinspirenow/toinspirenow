import React from 'react';

export function Dialog({ children }) {
  return <>{children}</>;
}

export function DialogTrigger({ asChild, children }) {
  return <>{children}</>;
}

export function DialogContent({ children, className }) {
  return (
    <div className={`fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50`}>
      <div className={`bg-white p-6 rounded-xl w-full max-w-lg ${className}`}>{children}</div>
    </div>
  );
}
