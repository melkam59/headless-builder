'use client';

import LogoSettings from './settings/LogoSettings';
import HeaderSettings from './settings/HeaderSettings';
import HeroSettings from './settings/HeroSettings';
import MenuSettings from './settings/MenuSettings';

interface SettingsPanelProps {
  selectedItem: string | null;
  settings: any;
  onUpdate: (updates: any) => void;
}

export default function SettingsPanel({
  selectedItem,
  settings,
  onUpdate,
}: SettingsPanelProps) {
  if (!selectedItem) {
    return (
      <div className="text-center py-12">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-12 h-12 mx-auto text-gray-400 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
          />
        </svg>
        <p className="text-sm text-gray-600">
          Select a section to customize
        </p>
      </div>
    );
  }

  // Route to appropriate settings component
  switch (selectedItem) {
    case 'logo':
      return (
        <LogoSettings
          settings={settings.logo}
          onUpdate={(updates) => onUpdate({ logo: { ...settings.logo, ...updates } })}
          onUpdatePadding={(side, value) => 
            onUpdate({ 
              logo: { 
                ...settings.logo, 
                padding: { ...settings.logo.padding, [side]: value } 
              } 
            })
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
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {selectedItem.replace(/([A-Z])/g, ' $1').trim()}
          </h2>
          <p className="text-sm text-gray-600">
            Settings for this section coming soon...
          </p>
        </div>
      );
    default:
      return (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {selectedItem}
          </h2>
          <p className="text-sm text-gray-600">
            Settings panel not configured yet.
          </p>
        </div>
      );
  }
}

