'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface MenuItem {
  id: string;
  label: string;
  link: string;
  submenu?: MenuItem[];
}

interface MenuSettingsProps {
  menuItems: MenuItem[];
  onUpdate: (menuItems: MenuItem[]) => void;
}

export default function MenuSettings({ menuItems, onUpdate }: MenuSettingsProps) {
  const [editingItem, setEditingItem] = useState<string | null>(null);

  const addMenuItem = () => {
    const newItem: MenuItem = {
      id: `menu-${Date.now()}`,
      label: 'New Menu Item',
      link: '#',
      submenu: [],
    };
    onUpdate([...menuItems, newItem]);
  };

  const updateMenuItem = (id: string, updates: Partial<MenuItem>) => {
    const updated = menuItems.map(item =>
      item.id === id ? { ...item, ...updates } : item
    );
    onUpdate(updated);
  };

  const deleteMenuItem = (id: string) => {
    onUpdate(menuItems.filter(item => item.id !== id));
  };

  const addSubmenuItem = (parentId: string) => {
    const updated = menuItems.map(item => {
      if (item.id === parentId) {
        const newSubmenu: MenuItem = {
          id: `submenu-${Date.now()}`,
          label: 'New Submenu Item',
          link: '#',
        };
        return {
          ...item,
          submenu: [...(item.submenu || []), newSubmenu],
        };
      }
      return item;
    });
    onUpdate(updated);
  };

  const updateSubmenuItem = (parentId: string, submenuId: string, updates: Partial<MenuItem>) => {
    const updated = menuItems.map(item => {
      if (item.id === parentId && item.submenu) {
        return {
          ...item,
          submenu: item.submenu.map(sub =>
            sub.id === submenuId ? { ...sub, ...updates } : sub
          ),
        };
      }
      return item;
    });
    onUpdate(updated);
  };

  const deleteSubmenuItem = (parentId: string, submenuId: string) => {
    const updated = menuItems.map(item => {
      if (item.id === parentId && item.submenu) {
        return {
          ...item,
          submenu: item.submenu.filter(sub => sub.id !== submenuId),
        };
      }
      return item;
    });
    onUpdate(updated);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Main Menu</h2>
        <Button onClick={addMenuItem} size="sm" className="bg-black hover:bg-gray-800 text-white">
          Add Item
        </Button>
      </div>

      <div className="space-y-4">
        {menuItems.map((item) => (
          <div key={item.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900">{item.label}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingItem(editingItem === item.id ? null : item.id)}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  {editingItem === item.id ? 'Done' : 'Edit'}
                </button>
                <button
                  onClick={() => deleteMenuItem(item.id)}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>

            {editingItem === item.id && (
              <div className="space-y-3 pt-2 border-t">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-1 block">Label</Label>
                  <Input
                    value={item.label}
                    onChange={(e) => updateMenuItem(item.id, { label: e.target.value })}
                    placeholder="Menu label"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-1 block">Link</Label>
                  <Input
                    value={item.link}
                    onChange={(e) => updateMenuItem(item.id, { link: e.target.value })}
                    placeholder="/collections/all"
                  />
                </div>

                {/* Submenu Items */}
                <div className="pt-3 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-medium text-gray-700">Submenu Items</Label>
                    <Button
                      onClick={() => addSubmenuItem(item.id)}
                      size="sm"
                      variant="outline"
                      className="text-xs"
                    >
                      Add Submenu
                    </Button>
                  </div>

                  {item.submenu && item.submenu.length > 0 && (
                    <div className="space-y-2 pl-4 border-l-2 border-gray-200">
                      {item.submenu.map((subitem) => (
                        <div key={subitem.id} className="bg-gray-50 rounded p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">{subitem.label}</span>
                            <button
                              onClick={() => deleteSubmenuItem(item.id, subitem.id)}
                              className="text-xs text-red-600 hover:text-red-700"
                            >
                              Remove
                            </button>
                          </div>
                          <Input
                            value={subitem.label}
                            onChange={(e) =>
                              updateSubmenuItem(item.id, subitem.id, { label: e.target.value })
                            }
                            placeholder="Submenu label"
                            className="text-sm"
                          />
                          <Input
                            value={subitem.link}
                            onChange={(e) =>
                              updateSubmenuItem(item.id, subitem.id, { link: e.target.value })
                            }
                            placeholder="/collections/new"
                            className="text-sm"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {menuItems.length === 0 && (
          <div className="text-center py-8 text-gray-500 text-sm">
            No menu items yet. Click "Add Item" to create one.
          </div>
        )}
      </div>
    </div>
  );
}
