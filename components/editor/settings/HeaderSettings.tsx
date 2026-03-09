'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

interface HeaderSettingsProps {
  settings: any;
  onUpdate: (updates: any) => void;
}

export default function HeaderSettings({ settings, onUpdate }: HeaderSettingsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-sm font-semibold text-zinc-900">Header</h2>
        <p className="text-xs text-zinc-500 mt-0.5">Behaviour & layout options</p>
      </div>

      <Separator />

      {/* Sticky Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <Label className="text-sm font-medium text-zinc-800">Sticky header</Label>
          <p className="text-xs text-zinc-500 mt-0.5">Stays fixed at top while scrolling</p>
        </div>
        <Switch
          checked={!!settings?.stickyHeader}
          onCheckedChange={(checked) => onUpdate({ stickyHeader: checked })}
        />
      </div>

      {/* Transparent Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <Label className="text-sm font-medium text-zinc-800">Transparent header</Label>
          <p className="text-xs text-zinc-500 mt-0.5">Clear background over hero section</p>
        </div>
        <Switch
          checked={!!settings?.transparentHeader}
          onCheckedChange={(checked) => onUpdate({ transparentHeader: checked })}
        />
      </div>
    </div>
  );
}
