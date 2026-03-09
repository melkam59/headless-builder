'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface HeaderSettingsProps {
  settings: any;
  onUpdate: (updates: any) => void;
}

export default function HeaderSettings({ settings, onUpdate }: HeaderSettingsProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Header</h2>
      
      <div className="space-y-6">
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Sticky Header
          </Label>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">Enable sticky header on scroll</p>
            <button
              onClick={() => onUpdate({ stickyHeader: !settings?.stickyHeader })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings?.stickyHeader ? 'bg-black' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings?.stickyHeader ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Transparent Header
          </Label>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">Make header transparent</p>
            <button
              onClick={() => onUpdate({ transparentHeader: !settings?.transparentHeader })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings?.transparentHeader ? 'bg-black' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings?.transparentHeader ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
