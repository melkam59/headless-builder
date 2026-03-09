'use client';

import { useEffect, useState } from 'react';
import AnnouncementBar from '@/components/sections/AnnouncementBar';
import Header from '@/components/sections/Header';
import Hero from '@/components/sections/Hero';
import CollectionList from '@/components/sections/CollectionList';
import ProductGrid from '@/components/sections/ProductGrid';
import ImageWithText from '@/components/sections/ImageWithText';
import Testimonials from '@/components/sections/Testimonials';
import Newsletter from '@/components/sections/Newsletter';
import Footer from '@/components/sections/Footer';
import themeData from '@/themes/horizon-theme.json';

export default function PreviewPage() {
  const [sections, setSections] = useState(themeData.sections);
  const [logoSettings, setLogoSettings] = useState<any>({
    image: '',
    width: 120,
    hideOnHomePage: false,
    position: 'left',
    padding: { top: 24, bottom: 26, left: 4, right: 0 },
  });
  const [headerSettings, setHeaderSettings] = useState<any>(null);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [heroSettings, setHeroSettings] = useState<any>(null);

  useEffect(() => {
    // Listen for updates from editor
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'UPDATE_THEME') {
        const { section, settings } = event.data;
        
        if (section === 'logo' && settings.logo) {
          setLogoSettings(settings.logo);
        } else if (section === 'header' && settings.header) {
          setHeaderSettings(settings.header);
        } else if (section === 'menu' && settings.menu) {
          setMenuItems(settings.menu);
        } else if (section === 'hero' && settings.hero) {
          setHeroSettings(settings.hero);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Update sections with dynamic settings
  const updatedSections = sections.map(section => {
    if (section.type === 'header') {
      // Convert menu items to blocks format
      const menuBlocks = menuItems.length > 0 ? menuItems.map(item => ({
        type: 'menuItem',
        settings: {
          label: { defaultValue: item.label },
          link: { defaultValue: item.link },
        },
        blocks: item.submenu?.map((sub: any) => ({
          type: 'submenuItem',
          settings: {
            label: { defaultValue: sub.label },
            link: { defaultValue: sub.link },
            image: { defaultValue: '' },
          },
        })) || [],
      })) : section.blocks;

      return {
        ...section,
        blocks: menuBlocks,
        settings: {
          ...section.settings,
          logoImage: { ...section.settings.logoImage, defaultValue: logoSettings.image },
          logoWidth: { ...section.settings.logoWidth, defaultValue: logoSettings.width },
          logoPosition: logoSettings.position,
          logoPadding: logoSettings.padding,
          ...(headerSettings && {
            stickyHeader: { ...section.settings.stickyHeader, defaultValue: headerSettings.stickyHeader },
            transparentHeader: { ...section.settings.transparentHeader, defaultValue: headerSettings.transparentHeader },
          }),
        }
      };
    }
    if (section.type === 'hero' && heroSettings) {
      return {
        ...section,
        settings: {
          ...section.settings,
          backgroundImage: { ...section.settings.backgroundImage, defaultValue: heroSettings.backgroundImage },
          height: { ...section.settings.height, defaultValue: heroSettings.height },
          overlayOpacity: { ...section.settings.overlayOpacity, defaultValue: heroSettings.overlayOpacity },
        }
      };
    }
    return section;
  });

  return (
    <main className="min-h-screen">
      {updatedSections.map((section, index) => {
        switch (section.type) {
          case 'announcementBar':
            return <AnnouncementBar key={index} settings={section.settings} blocks={section.blocks} />;
          case 'header':
            return <Header key={index} settings={section.settings} blocks={section.blocks} />;
          case 'hero':
            return <Hero key={index} settings={section.settings} blocks={section.blocks} />;
          case 'collectionList':
            return <CollectionList key={index} settings={section.settings} blocks={section.blocks} />;
          case 'productGrid':
            return <ProductGrid key={index} settings={section.settings} />;
          case 'imageWithText':
            return <ImageWithText key={index} settings={section.settings} blocks={section.blocks} />;
          case 'testimonials':
            return <Testimonials key={index} settings={section.settings} blocks={section.blocks} />;
          case 'newsletter':
            return <Newsletter key={index} settings={section.settings} />;
          case 'footer':
            return <Footer key={index} settings={section.settings} blocks={section.blocks} />;
          default:
            return null;
        }
      })}
    </main>
  );
}
