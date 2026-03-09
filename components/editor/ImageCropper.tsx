'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ImageCropperProps {
  image: string;
  onCropComplete: (croppedImage: string) => void;
  onCancel: () => void;
}

export default function ImageCropper({
  image,
  onCropComplete,
  onCancel,
}: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 50, y: 50, width: 300, height: 150 });

  const handleCrop = () => {
    const canvas = document.createElement('canvas');
    const img = new Image();
    img.onload = () => {
      canvas.width = crop.width;
      canvas.height = crop.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(
          img,
          crop.x,
          crop.y,
          crop.width,
          crop.height,
          0,
          0,
          crop.width,
          crop.height
        );
        onCropComplete(canvas.toDataURL());
      }
    };
    img.src = image;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-auto">
        <h3 className="text-lg font-semibold mb-4">Crop Logo</h3>
        
        <div className="relative bg-gray-100 rounded-lg overflow-hidden mb-4" style={{ height: '400px' }}>
          <img
            src={image}
            alt="Crop preview"
            className="w-full h-full object-contain"
          />
          <div
            className="absolute border-2 border-blue-500 bg-blue-500 bg-opacity-20 cursor-move"
            style={{
              left: `${crop.x}px`,
              top: `${crop.y}px`,
              width: `${crop.width}px`,
              height: `${crop.height}px`,
            }}
          >
            <div className="absolute -right-1 -bottom-1 w-3 h-3 bg-blue-500 rounded-full cursor-se-resize" />
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-3">
            <Label className="w-20 text-sm">Width:</Label>
            <Input
              type="number"
              min="50"
              max="800"
              value={crop.width}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (!isNaN(val) && val > 0) {
                  setCrop({ ...crop, width: val });
                }
              }}
              className="flex-1"
            />
            <span className="text-sm text-gray-500">px</span>
          </div>
          <div className="flex items-center gap-3">
            <Label className="w-20 text-sm">Height:</Label>
            <Input
              type="number"
              min="50"
              max="800"
              value={crop.height}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (!isNaN(val) && val > 0) {
                  setCrop({ ...crop, height: val });
                }
              }}
              className="flex-1"
            />
            <span className="text-sm text-gray-500">px</span>
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleCrop} className="bg-black hover:bg-gray-800 text-white">
            Apply Crop
          </Button>
        </div>
      </div>
    </div>
  );
}
