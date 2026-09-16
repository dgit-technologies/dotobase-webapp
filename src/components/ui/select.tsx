import { forwardRef, SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helper?: string;
  options: SelectOption[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, error, helper, options, placeholder, className, id, ...props },
  ref
) {
  const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-[#0E1B2A]">
          {label}
          {props.required && <span className="ml-1 text-[#D14343]">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          aria-invalid={!!error}
          className={cn(
            'w-full appearance-none rounded-lg border bg-white px-3 py-2 pr-9 text-sm text-[#0E1B2A]',
            'transition-colors duration-200 cursor-pointer',
            'focus:outline-none focus:ring-2 focus:ring-[#8BD2F2]/30 focus:border-[#8BD2F2]',
            'disabled:bg-[#FAFCFF] disabled:cursor-not-allowed disabled:opacity-60',
            error ? 'border-[#D14343]' : 'border-[#E3EDF7]',
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>{placeholder}</option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#6E7C91]"
        />
      </div>
      {error && <p className="text-xs text-[#D14343]">{error}</p>}
      {helper && !error && <p className="text-xs text-[#6E7C91]">{helper}</p>}
    </div>
  );
});

export default Select;
