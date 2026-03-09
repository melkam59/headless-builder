'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ImageIcon, X } from 'lucide-react';
import ImageCropper from '../ImageCropper';
import { cn } from '@/lib/utils';

interface LogoSettings {
  storeName: string;
  image: string;
  width: number;
  hideOnHomePage: boolean;
  position: 'left' | 'center' | 'right';
  padding: { top: number; bottom: number; left: number; right: number };
}

interface LogoSettingsProps {
  settings: LogoSettings;
  onUpdate: (updates: Partial<LogoSettings>) => void;
  onUpdatePadding: (side: keyof LogoSettings['padding'], value: number) => void;
}

export default function LogoSettings({ settings, onUpdate, onUpdatePadding }: LogoSettingsProps) {
  const [showCropper, setShowCropper] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setUploadedImage(ev.target?.result as string);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = (cropped: string) => {
    onUpdate({ image: cropped });
    setShowCropper(false);
    setUploadedImage(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-sm font-semibold text-zinc-900">Logo</h2>
        <p className="text-xs text-zinc-500 mt-0.5">Image, size and position</p>
      </div>

      <Separator />

      {showCropper && uploadedImage && (
        <ImageCropper
          image={uploadedImage}
          onCropComplete={handleCropComplete}
          onCancel={() => { setShowCropper(false); setUploadedImage(null); }}
        />
      )}

      {/* Store name — shown when no image */}
      <div className="space-y-1.5">
        <Label className="text-sm font-medium text-zinc-800">Store name</Label>
        <Input
          type="text"
          placeholder="My Store"
          value={settings.storeName ?? ''}
          onChange={(e) => onUpdate({ storeName: e.target.value })}
          className="text-sm"
        />
        <p className="text-xs text-zinc-400">Shown as logo text when no image is set</p>
      </div>

      {/* Position */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-zinc-800">Position</Label>
        <div className="flex gap-2">
          {(['left', 'center', 'right'] as const).map((pos) => (
            <button
              key={pos}
              onClick={() => onUpdate({ position: pos })}
              className={cn(
                'flex-1 py-2 text-sm rounded-md border transition-colors font-medium capitalize',
                settings.position === pos
                  ? 'border-violet-500 bg-violet-50 text-violet-700'
                  : 'border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50'
              )}
            >
              {pos}
            </button>
          ))}
        </div>
      </div>

      {/* Image Upload */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-zinc-800">Logo image</Label>
        <div className={cn(
          'rounded-lg border-2 border-dashed p-4 text-center transition-colors',
          settings.image ? 'border-zinc-200' : 'border-zinc-300 hover:border-violet-300'
        )}>
          {settings.image ? (
            <div className="flex flex-col items-center gap-2">
              <img src={settings.image} alt="Logo" className="max-h-16 mx-auto object-contain" />
              <div className="flex gap-3 text-xs">
                <label className="text-violet-600 hover:text-violet-700 cursor-pointer font-medium">
                  Change
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                </label>
                <button onClick={() => onUpdate({ image: '' })} className="text-red-500 hover:text-red-600 font-medium flex items-center gap-1">
                  <X className="w-3 h-3" /> Remove
                </button>
              </div>
            </div>
          ) : (
            <label className="cursor-pointer flex flex-col items-center gap-1.5">
              <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-zinc-400" />
              </div>
              <span className="text-sm text-zinc-600 font-medium">Click to upload</span>
              <span className="text-xs text-zinc-400">PNG, JPG, SVG</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
            </label>
          )}
        </div>
      </div>

      {/* Width */}
      <div className="space-y-1.5">
        <Label className="text-sm font-medium text-zinc-800">Logo width</Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            value={settings.width}
            onChange={(e) => onUpdate({ width: parseInt(e.target.value) || 120 })}
            className="text-sm"
          />
          <span className="text-sm text-zinc-400 shrink-0">px</span>
        </div>
      </div>

      {/* Visibility */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <Label className="text-sm font-medium text-zinc-800">Hide on home page</Label>
          <p className="text-xs text-zinc-500 mt-0.5">Stays visible when sticky header is active</p>
        </div>
        <Switch
          checked={!!settings.hideOnHomePage}
          onCheckedChange={(checked) => onUpdate({ hideOnHomePage: checked })}
        />
      </div>

      <Separator />

      {/* Padding */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-zinc-800">Desktop padding</Label>
        {(['top', 'bottom', 'left', 'right'] as const).map((side) => (
          <div key={side} className="flex items-center gap-3">
            <span className="text-xs text-zinc-500 w-12 capitalize">{side}</span>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.padding[side]}
              onChange={(e) => onUpdatePadding(side, parseInt(e.target.value))}
              className="flex-1 h-1.5 rounded-full appearance-none bg-zinc-200 accent-violet-600 cursor-pointer"
            />
            <div className="flex items-center gap-1 w-16">
              <Input
                type="number"
                value={settings.padding[side]}
                onChange={(e) => onUpdatePadding(side, parseInt(e.target.value) || 0)}
                className="text-xs h-7 px-2"
              />
              <span className="text-xs text-zinc-400">px</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
