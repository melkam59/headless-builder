'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff, Trash2, ChevronDown, ChevronUp, Plus } from 'lucide-react';

interface MenuItem {
  id: string;
  label: string;
  link: string;
  visible: boolean;
  submenu?: MenuItem[];
}

interface MenuSettingsProps {
  menuItems: MenuItem[];
  onUpdate: (menuItems: MenuItem[]) => void;
}

export default function MenuSettings({ menuItems, onUpdate }: MenuSettingsProps) {
  const [editingItem, setEditingItem] = useState<string | null>(null);

  const addMenuItem = () => {
    onUpdate([...menuItems, { id: `menu-${Date.now()}`, label: 'New Item', link: '#', visible: true, submenu: [] }]);
  };

  const updateMenuItem = (id: string, updates: Partial<MenuItem>) =>
    onUpdate(menuItems.map((item) => (item.id === id ? { ...item, ...updates } : item)));

  const deleteMenuItem = (id: string) => onUpdate(menuItems.filter((item) => item.id !== id));

  const toggleVisibility = (id: string) =>
    onUpdate(menuItems.map((item) => (item.id === id ? { ...item, visible: !item.visible } : item)));

  const addSubmenuItem = (parentId: string) =>
    onUpdate(
      menuItems.map((item) =>
        item.id === parentId
          ? { ...item, submenu: [...(item.submenu || []), { id: `sub-${Date.now()}`, label: 'Submenu Item', link: '#', visible: true }] }
          : item
      )
    );

  const updateSubmenuItem = (parentId: string, subId: string, updates: Partial<MenuItem>) =>
    onUpdate(
      menuItems.map((item) =>
        item.id === parentId && item.submenu
          ? { ...item, submenu: item.submenu.map((s) => (s.id === subId ? { ...s, ...updates } : s)) }
          : item
      )
    );

  const deleteSubmenuItem = (parentId: string, subId: string) =>
    onUpdate(
      menuItems.map((item) =>
        item.id === parentId && item.submenu
          ? { ...item, submenu: item.submenu.filter((s) => s.id !== subId) }
          : item
      )
    );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-zinc-900">Main menu</h2>
          <p className="text-xs text-zinc-500 mt-0.5">{menuItems.length} item{menuItems.length !== 1 ? 's' : ''}</p>
        </div>
        <Button size="sm" onClick={addMenuItem} className="bg-violet-600 hover:bg-violet-700 text-white h-7 text-xs gap-1">
          <Plus className="w-3 h-3" /> Add item
        </Button>
      </div>

      <Separator />

      <div className="space-y-2">
        {menuItems.length === 0 && (
          <p className="text-center py-6 text-sm text-zinc-400">No items yet. Click &quot;Add item&quot; to start.</p>
        )}

        {menuItems.map((item) => (
          <div key={item.id} className={`rounded-lg border transition-opacity ${item.visible ? 'border-zinc-200' : 'border-zinc-200 opacity-50'}`}>
            {/* Row */}
            <div className="flex items-center gap-2 px-3 py-2.5">
              <button onClick={() => toggleVisibility(item.id)} className="text-zinc-400 hover:text-zinc-600 transition-colors shrink-0">
                {item.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <span className="flex-1 text-sm font-medium text-zinc-800 truncate">{item.label}</span>
              {item.submenu && item.submenu.length > 0 && (
                <Badge variant="secondary" className="text-xs">{item.submenu.length}</Badge>
              )}
              <button
                onClick={() => setEditingItem(editingItem === item.id ? null : item.id)}
                className="text-xs text-violet-600 hover:text-violet-700 font-medium"
              >
                {editingItem === item.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              <button onClick={() => deleteMenuItem(item.id)} className="text-zinc-300 hover:text-red-500 transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Edit panel */}
            {editingItem === item.id && (
              <div className="px-3 pb-3 space-y-3 border-t border-zinc-100 pt-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs text-zinc-600">Label</Label>
                    <Input value={item.label} onChange={(e) => updateMenuItem(item.id, { label: e.target.value })} className="h-7 text-sm" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-zinc-600">Link</Label>
                    <Input value={item.link} onChange={(e) => updateMenuItem(item.id, { link: e.target.value })} className="h-7 text-sm" placeholder="/collections/all" />
                  </div>
                </div>

                {/* Submenu */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-zinc-600">Submenu items</span>
                    <Button size="sm" variant="outline" onClick={() => addSubmenuItem(item.id)} className="h-6 text-xs gap-1">
                      <Plus className="w-3 h-3" /> Add
                    </Button>
                  </div>
                  {item.submenu?.map((sub) => (
                    <div key={sub.id} className="bg-zinc-50 rounded-md p-2 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-zinc-500">{sub.label}</span>
                        <button onClick={() => deleteSubmenuItem(item.id, sub.id)} className="text-zinc-300 hover:text-red-500">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <Input value={sub.label} onChange={(e) => updateSubmenuItem(item.id, sub.id, { label: e.target.value })} className="h-6 text-xs" placeholder="Label" />
                      <Input value={sub.link} onChange={(e) => updateSubmenuItem(item.id, sub.id, { link: e.target.value })} className="h-6 text-xs" placeholder="/page" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
