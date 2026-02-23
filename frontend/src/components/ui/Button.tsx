import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    isLoading?: boolean;
}

export function Button({ className, variant = 'primary', isLoading, children, disabled, ...props }: ButtonProps) {
    const baseStyles = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2';

    const variants = {
        primary: 'bg-slate-900 text-slate-50 hover:bg-slate-900/90 shadow',
        secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-100/80',
        danger: 'bg-red-500 text-slate-50 hover:bg-red-500/90 shadow-sm',
        ghost: 'hover:bg-slate-100 hover:text-slate-900',
    };

    return (
        <button
            className={cn(baseStyles, variants[variant], className)}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> : null}
            {children}
        </button>
    );
}
