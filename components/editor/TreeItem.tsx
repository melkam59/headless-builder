'use client';

import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TreeItemProps {
  title: string;
  icon?: React.ReactNode;
  subtitle?: string;
  isSelected: boolean;
  onClick: () => void;
  level: number;
  children?: React.ReactNode;
}

export default function TreeItem({
  title,
  icon,
  subtitle,
  isSelected,
  onClick,
  level,
  children,
}: TreeItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = !!children;

  return (
    <div>
      <div
        onClick={onClick}
        style={{ paddingLeft: `${level * 8}px` }}
        className={cn(
          'group flex items-center gap-1.5 px-2 py-1.5 rounded-md cursor-pointer text-sm transition-colors',
          isSelected
            ? 'bg-violet-50 text-violet-700 font-medium'
            : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
        )}
      >
        {hasChildren ? (
          <button
            onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
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
        ) : (
          <span className="w-4 shrink-0" />
        )}
        {icon && (
          <span className={cn('shrink-0', isSelected ? 'text-violet-500' : 'text-zinc-400')}>
            {icon}
          </span>
        )}
        <span className="truncate">{title}</span>
        {subtitle && (
          <span className={cn('text-xs ml-1 truncate', isSelected ? 'text-violet-400' : 'text-zinc-400')}>
            – {subtitle}
          </span>
        )}
      </div>
      {isExpanded && hasChildren && (
        <div className="ml-3 border-l border-zinc-200 pl-2 space-y-0.5 mt-0.5">
          {children}
        </div>
      )}
    </div>
  );
}
