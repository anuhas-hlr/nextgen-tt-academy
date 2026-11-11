import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
}

export function Button({ variant = 'primary', className = '', children, ...props }: ButtonProps) {
  const base = "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition disabled:opacity-50";
  const variants = {
    primary: "bg-brand-600 text-white hover:bg-brand-500",
    secondary: "bg-slate-800 text-slate-100 hover:bg-slate-700",
    outline: "border border-slate-700 text-slate-300 hover:bg-slate-800",
    danger: "bg-red-600 text-white hover:bg-red-500",
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
