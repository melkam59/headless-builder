'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ImageCropper from '../ImageCropper';

interface LogoSettings {
  image: string;
  width: number;
  hideOnHomePage: boolean;
  position: 'left' | 'center' | 'right';
  padding: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

interface LogoSettingsProps {
  settings: LogoSettings;
  onUpdate: (updates: Partial<LogoSettings>) => void;
  onUpdatePadding: (side: keyof LogoSettings['padding'], value: number) => void;
}

export default function LogoSettings({
  settings,
  onUpdate,
  onUpdatePadding,
}: LogoSettingsProps) {
  const [showCropper, setShowCropper] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        setUploadedImage(imageUrl);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedImage: string) => {
    onUpdate({ image: croppedImage });
    setShowCropper(false);
    setUploadedImage(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Logo</h2>
      </div>

      {showCropper && uploadedImage && (
        <ImageCropper
          image={uploadedImage}
          onCropComplete={handleCropComplete}
          onCancel={() => {
            setShowCropper(false);
            setUploadedImage(null);
          }}
        />
      )}

      <div className="space-y-6">
        {/* Logo Position */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">Position</Label>
          <div className="flex gap-2">
            {(['left', 'center', 'right'] as const).map((pos) => (
              <button
                key={pos}
                onClick={() => onUpdate({ position: pos })}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  settings.position === pos
                    ? 'bg-gray-200 text-gray-900'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {pos.charAt(0).toUpperCase() + pos.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">Logo Image</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
            {settings.image ? (
              <div className="space-y-2">
                <img src={settings.image} alt="Logo preview" className="max-h-20 mx-auto" />
                <div className="flex gap-2 justify-center">
                  <label className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer">
                    Change
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>
                  <button
                    onClick={() => onUpdate({ image: '' })}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <label className="cursor-pointer">
                <div className="flex flex-col items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm text-gray-600">Click to upload image</span>
                  <span className="text-xs text-gray-400 mt-1">PNG, JPG, SVG up to 10MB</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
            )}
          </div>
        </div>

        {/* Logo Width */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">Logo Width</Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={settings.width}
              onChange={(e) => onUpdate({ width: parseInt(e.target.value) || 120 })}
              className="flex-1"
            />
            <span className="text-sm text-gray-500">px</span>
          </div>
        </div>

        {/* Visibility */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">Visibility</Label>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-700">Hide logo on home page</p>
              <p className="text-xs text-gray-500">Logo will remain visible when sticky header is active</p>
            </div>
            <button
              onClick={() => onUpdate({ hideOnHomePage: !settings.hideOnHomePage })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.hideOnHomePage ? 'bg-black' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.hideOnHomePage ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Desktop Padding */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">Desktop padding</Label>
          <div className="space-y-3">
            {(['top', 'bottom', 'left', 'right'] as const).map((side) => (
              <div key={side} className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-16 capitalize">{side}</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.padding[side]}
                  onChange={(e) => onUpdatePadding(side, parseInt(e.target.value))}
                  className="flex-1"
                />
                <div className="flex items-center gap-1 w-20">
                  <Input
                    type="number"
                    value={settings.padding[side]}
                    onChange={(e) => onUpdatePadding(side, parseInt(e.target.value) || 0)}
                    className="w-full text-sm"
                  />
                  <span className="text-xs text-gray-500">px</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
