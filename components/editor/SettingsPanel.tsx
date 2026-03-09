'use client';

import { MousePointer2 } from 'lucide-react';
import LogoSettings from './settings/LogoSettings';
import HeaderSettings from './settings/HeaderSettings';
import HeroSettings from './settings/HeroSettings';
import MenuSettings from './settings/MenuSettings';

interface SettingsPanelProps {
  selectedItem: string | null;
  settings: any;
  onUpdate: (updates: any) => void;
}

const sectionLabel = (key: string) =>
  key.replace(/([A-Z])/g, ' $1').replace(/^\w/, (c) => c.toUpperCase()).trim();

export default function SettingsPanel({ selectedItem, settings, onUpdate }: SettingsPanelProps) {
  if (!selectedItem) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-16 text-center px-6">
        <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center mb-3">
          <MousePointer2 className="w-5 h-5 text-zinc-400" />
        </div>
        <p className="text-sm font-medium text-zinc-700">Nothing selected</p>
        <p className="text-xs text-zinc-400 mt-1">Click a section on the left to edit its settings</p>
      </div>
    );
  }

  switch (selectedItem) {
    case 'logo':
      return (
        <LogoSettings
          settings={settings.logo}
          onUpdate={(updates) => onUpdate({ logo: { ...settings.logo, ...updates } })}
          onUpdatePadding={(side, value) =>
            onUpdate({ logo: { ...settings.logo, padding: { ...settings.logo.padding, [side]: value } } })
          }
        />
      );

    case 'header':
    case 'headerMain':
      return (
        <HeaderSettings
          settings={settings.header}
          onUpdate={(updates) => onUpdate({ header: { ...settings.header, ...updates } })}
        />
      );

    case 'menu':
      return (
        <MenuSettings
          menuItems={settings.menu || []}
          onUpdate={(menuItems) => onUpdate({ menu: menuItems })}
        />
      );

    case 'hero':
      return (
        <HeroSettings
          settings={settings.hero}
          onUpdate={(updates) => onUpdate({ hero: { ...settings.hero, ...updates } })}
        />
      );

    case 'announcementBar':
    case 'collectionList':
    case 'productGrid':
    case 'footer':
      return (
        <div className="space-y-3">
          <div>
            <h2 className="text-sm font-semibold text-zinc-900">{sectionLabel(selectedItem)}</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Settings coming soon</p>
          </div>
          <div className="rounded-lg bg-zinc-50 border border-zinc-200 p-4 text-xs text-zinc-500">
            This section will have customizable settings in a future update.
          </div>
        </div>
      );

    default:
      return (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-zinc-900">{sectionLabel(selectedItem)}</h2>
          <p className="text-xs text-zinc-500">No settings configured for this item yet.</p>
        </div>
      );
  }
}
