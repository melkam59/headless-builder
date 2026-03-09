'use client';

import React from 'react';

interface Block {
  type: string;
  settings: any;
}

interface AnnouncementBarProps {
  settings: any;
  blocks?: Block[];
}

export default function AnnouncementBar({ settings, blocks = [] }: AnnouncementBarProps) {
  const enabled = settings.enabled?.defaultValue ?? true;
  const backgroundColor = settings.backgroundColor?.defaultValue || '#000000';
  const textColor = settings.textColor?.defaultValue || '#ffffff';

  if (!enabled) return null;

  return (
    <div
      className="w-full py-2 px-4 text-center text-sm"
      style={{ backgroundColor, color: textColor }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center space-x-8">
        {blocks.map((block, index) => {
          const text = block.settings.text?.defaultValue || '';
          const link = block.settings.link?.defaultValue || '';

          if (link) {
            return (
              <a
                key={index}
                href={link}
                className="hover:underline"
                style={{ color: textColor }}
              >
                {text}
              </a>
            );
          }

          return <span key={index}>{text}</span>;
        })}
      </div>
    </div>
  );
}
