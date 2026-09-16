import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';
import Spinner from './spinner';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variants: Record<Variant, string> = {
  primary:   'bg-[#8BD2F2] text-[#0E1B2A] font-semibold hover:bg-[#74C5E9] focus-visible:ring-[#8BD2F2]',
  secondary: 'border border-[#E3EDF7] bg-white text-[#0E1B2A] hover:bg-[#FAFCFF] focus-visible:ring-[#8BD2F2]/30',
  ghost:     'text-[#6E7C91] hover:bg-[#8BD2F2]/15 hover:text-[#0E1B2A] focus-visible:ring-[#8BD2F2]/30',
  danger:    'bg-[#D14343] text-white hover:bg-[#B83B3B] focus-visible:ring-[#D14343]',
};

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-sm gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', loading, disabled, className, children, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium cursor-pointer',
        'transition-colors duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading && <Spinner size="sm" className="text-current" />}
      {children}
    </button>
  );
});

export default Button;
