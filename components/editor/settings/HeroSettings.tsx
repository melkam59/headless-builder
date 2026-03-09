'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

interface HeroSettingsProps {
  settings: any;
  onUpdate: (updates: any) => void;
}

export default function HeroSettings({ settings, onUpdate }: HeroSettingsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-sm font-semibold text-zinc-900">Hero Section</h2>
        <p className="text-xs text-zinc-500 mt-0.5">Background and layout</p>
      </div>

      <Separator />

      {/* Background Image */}
      <div className="space-y-1.5">
        <Label className="text-sm font-medium text-zinc-800">Background image URL</Label>
        <Input
          type="text"
          placeholder="https://..."
          value={settings?.backgroundImage || ''}
          onChange={(e) => onUpdate({ backgroundImage: e.target.value })}
          className="text-sm"
        />
      </div>

      {/* Height */}
      <div className="space-y-1.5">
        <Label className="text-sm font-medium text-zinc-800">Section height</Label>
        <Select
          value={settings?.height || 'large'}
          onValueChange={(v) => onUpdate({ height: v })}
        >
          <SelectTrigger className="text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="small">Small</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="large">Large</SelectItem>
            <SelectItem value="full-screen">Full screen</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Overlay Opacity */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-zinc-800">Overlay opacity</Label>
          <span className="text-sm font-medium text-violet-600 tabular-nums">
            {settings?.overlayOpacity ?? 30}%
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={settings?.overlayOpacity ?? 30}
          onChange={(e) => onUpdate({ overlayOpacity: parseInt(e.target.value) })}
          className="w-full h-1.5 rounded-full appearance-none bg-zinc-200 accent-violet-600 cursor-pointer"
        />
        <div className="flex justify-between text-xs text-zinc-400">
          <span>0%</span><span>50%</span><span>100%</span>
        </div>
      </div>
    </div>
  );
}
