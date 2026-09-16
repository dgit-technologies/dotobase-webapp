import { cn } from '@/lib/utils/cn';

type Variant = 'default' | 'success' | 'error' | 'warning' | 'info' | 'outline';

interface BadgeProps {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
}

const variants: Record<Variant, string> = {
  default:  'bg-[#8BD2F2]/20 text-[#0E1B2A]',
  success:  'bg-[#E6F6F0] text-[#22A06B]',
  error:    'bg-[#FCEAEA] text-[#D14343]',
  warning:  'bg-[#FEF3E2] text-[#B45309]',
  info:     'bg-[#8BD2F2]/20 text-[#0E1B2A]',
  outline:  'border border-[#E3EDF7] text-[#6E7C91] bg-transparent',
};

export default function Badge({ variant = 'default', className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
