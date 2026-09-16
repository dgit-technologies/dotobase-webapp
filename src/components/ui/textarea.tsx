import { forwardRef, TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helper?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, helper, className, id, ...props },
  ref
) {
  const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={textareaId} className="text-sm font-medium text-[#0E1B2A]">
          {label}
          {props.required && <span className="ml-1 text-[#D14343]">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        aria-invalid={!!error}
        aria-describedby={error ? `${textareaId}-error` : undefined}
        rows={4}
        className={cn(
          'w-full rounded-lg border bg-white px-3 py-2 text-sm text-[#0E1B2A]',
          'placeholder:text-[#6E7C91] resize-y',
          'transition-colors duration-200',
          'focus:outline-none focus:ring-2 focus:ring-[#8BD2F2]/30 focus:border-[#8BD2F2]',
          'disabled:bg-[#FAFCFF] disabled:cursor-not-allowed disabled:opacity-60',
          error ? 'border-[#D14343]' : 'border-[#E3EDF7]',
          className
        )}
        {...props}
      />
      {error && (
        <p id={`${textareaId}-error`} className="text-xs text-[#D14343]">{error}</p>
      )}
      {helper && !error && (
        <p className="text-xs text-[#6E7C91]">{helper}</p>
      )}
    </div>
  );
});

export default Textarea;
