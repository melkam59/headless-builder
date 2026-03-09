'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TreeSectionProps {
  title: string;
  icon?: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  isSelected: boolean;
  onSelect: () => void;
  children?: React.ReactNode;
}

export default function TreeSection({
  title,
  icon,
  isExpanded,
  onToggle,
  isSelected,
  onSelect,
  children,
}: TreeSectionProps) {
  return (
    <div>
      <div
        onClick={onSelect}
        className={cn(
          'group flex items-center gap-1.5 px-2 py-1.5 rounded-md cursor-pointer text-sm transition-colors',
          isSelected
            ? 'bg-violet-50 text-violet-700 font-medium'
            : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
        )}
      >
        <button
          onClick={(e) => { e.stopPropagation(); onToggle(); }}
          className="p-0.5 rounded hover:bg-zinc-200 transition-colors shrink-0"
        >
          <ChevronRight
            className={cn(
              'w-3.5 h-3.5 transition-transform text-zinc-400',
              isExpanded && 'rotate-90',
              isSelected && 'text-violet-500'
            )}
          />
        </button>
        {icon && <span className={cn('shrink-0', isSelected ? 'text-violet-500' : 'text-zinc-400')}>{icon}</span>}
        <span className="truncate">{title}</span>
      </div>
      {isExpanded && children && (
        <div className="ml-3 mt-0.5 border-l border-zinc-200 pl-2 space-y-0.5">
          {children}
        </div>
      )}
    </div>
  );
}
