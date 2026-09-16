import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  leftIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, helper, leftIcon, className, id, ...props },
  ref
) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-[#0E1B2A]">
          {label}
          {props.required && <span className="ml-1 text-[#D14343]">*</span>}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[#6E7C91]">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : helper ? `${inputId}-helper` : undefined}
          className={cn(
            'w-full rounded-lg border bg-white px-3 py-2 text-sm text-[#0E1B2A]',
            'placeholder:text-[#6E7C91]',
            'transition-colors duration-200',
            'focus:outline-none focus:ring-2 focus:ring-[#8BD2F2]/30 focus:border-[#8BD2F2]',
            'disabled:bg-[#FAFCFF] disabled:cursor-not-allowed disabled:opacity-60',
            error
              ? 'border-[#D14343] focus:ring-[#D14343]/30 focus:border-[#D14343]'
              : 'border-[#E3EDF7]',
            !!leftIcon && 'pl-10',
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p id={`${inputId}-error`} className="text-xs text-[#D14343]">{error}</p>
      )}
      {helper && !error && (
        <p id={`${inputId}-helper`} className="text-xs text-[#6E7C91]">{helper}</p>
      )}
    </div>
  );
});

export default Input;
