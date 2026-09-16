import { cn } from '@/lib/utils/cn';

type Size = 'sm' | 'md' | 'lg';

interface AvatarProps {
  name?: string;
  src?: string;
  size?: Size;
  className?: string;
}

const sizes: Record<Size, string> = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

export default function Avatar({ name = '', src, size = 'md', className }: AvatarProps) {
  return (
    <div
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full',
        'bg-[#8BD2F2]/25 font-semibold text-[#0E1B2A]',
        sizes[size],
        className
      )}
      aria-label={name}
    >
      {src ? (
        <img src={src} alt={name} className="h-full w-full object-cover" />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  );
}
