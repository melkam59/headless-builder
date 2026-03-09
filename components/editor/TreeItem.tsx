'use client';

import { useState } from 'react';

interface TreeItemProps {
  title: string;
  icon: string;
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
        className={`flex items-center px-2 py-1.5 rounded cursor-pointer hover:bg-gray-50 ${
          isSelected ? 'bg-gray-100' : ''
        }`}
        style={{ marginLeft: `${level * 12}px` }}
        onClick={onClick}
      >
        {hasChildren && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="p-0.5 hover:bg-gray-200 rounded mr-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`w-3 h-3 text-gray-500 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
        {!hasChildren && <div className="w-4 mr-1" />}
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16" />
        </svg>
        <div className="flex-1">
          <span className="text-sm text-gray-700">{title}</span>
          {subtitle && <span className="text-xs text-gray-400 ml-1">– {subtitle}</span>}
        </div>
      </div>
      {isExpanded && hasChildren && <div className="mt-1">{children}</div>}
    </div>
  );
}
