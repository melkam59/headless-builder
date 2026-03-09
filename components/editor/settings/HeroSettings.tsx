'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface HeroSettingsProps {
  settings: any;
  onUpdate: (updates: any) => void;
}

export default function HeroSettings({ settings, onUpdate }: HeroSettingsProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Hero Section</h2>
      
      <div className="space-y-6">
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Background Image
          </Label>
          <Input
            type="text"
            placeholder="Enter image URL"
            value={settings?.backgroundImage || ''}
            onChange={(e) => onUpdate({ backgroundImage: e.target.value })}
          />
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Section Height
          </Label>
          <select
            value={settings?.height || 'large'}
            onChange={(e) => onUpdate({ height: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
            <option value="full-screen">Full Screen</option>
          </select>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Overlay Opacity
          </Label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="0"
              max="100"
              value={settings?.overlayOpacity || 30}
              onChange={(e) => onUpdate({ overlayOpacity: parseInt(e.target.value) })}
              className="flex-1"
            />
            <span className="text-sm text-gray-600 w-12">{settings?.overlayOpacity || 30}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
