'use client';

import { createContext, useContext, useState } from 'react';
import { cn } from '@/lib/utils/cn';

interface Tab {
  value: string;
  label: string;
  disabled?: boolean;
}

interface TabsContextValue {
  active: string;
  setActive: (v: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error('Tabs components must be used inside <Tabs>');
  return ctx;
}

interface TabsProps {
  defaultValue: string;
  children: React.ReactNode;
  className?: string;
}

interface TabsListProps {
  tabs: Tab[];
  className?: string;
}

interface TabsPanelProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export function TabsList({ tabs, className }: TabsListProps) {
  const { active, setActive } = useTabsContext();
  return (
    <div role="tablist" className={cn('flex border-b border-[#E3EDF7]', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          role="tab"
          aria-selected={active === tab.value}
          aria-disabled={tab.disabled}
          disabled={tab.disabled}
          onClick={() => setActive(tab.value)}
          className={cn(
            'px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer',
            'border-b-2 -mb-px',
            active === tab.value
              ? 'border-[#8BD2F2] text-[#0E1B2A] font-semibold'
              : 'border-transparent text-[#6E7C91] hover:text-[#0E1B2A]',
            tab.disabled && 'opacity-40 cursor-not-allowed'
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export function TabsPanel({ value, children, className }: TabsPanelProps) {
  const { active } = useTabsContext();
  if (active !== value) return null;
  return (
    <div role="tabpanel" className={cn('py-4', className)}>
      {children}
    </div>
  );
}

export default function Tabs({ defaultValue, children, className }: TabsProps) {
  const [active, setActive] = useState(defaultValue);
  return (
    <TabsContext.Provider value={{ active, setActive }}>
      <div className={cn('w-full', className)}>{children}</div>
    </TabsContext.Provider>
  );
}
