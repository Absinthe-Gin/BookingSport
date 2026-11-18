import type { ButtonHTMLAttributes } from 'react';
import { Spinner } from '@/components/feedback/States';

type Variant = 'primary' | 'accent' | 'outline' | 'white' | 'teal' | 'ghost';

const variants: Record<Variant, string> = {
  primary: 'bg-primary text-white hover:bg-primary-dark',
  accent: 'bg-accent text-white hover:bg-accent-dark',
  outline: 'border border-primary text-primary bg-white hover:bg-primary-soft',
  white: 'bg-white text-primary-deep hover:bg-white/90',
  teal: 'bg-teal text-white hover:brightness-95',
  ghost: 'text-primary hover:bg-primary-soft',
};

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  loading?: boolean;
}

export function Button({ variant = 'primary', loading, className = '', children, disabled, type = 'button', ...rest }: Props) {
  return (
    <button type={type} disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded font-bold transition-colors disabled:opacity-60 ${variants[variant]} ${className}`} {...rest}>
      {loading && <Spinner size={18} className="[&_span]:bg-current" />}
      {children}
    </button>
  );
}
