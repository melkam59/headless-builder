'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Store, FileText, Settings, Zap, ExternalLink, LayoutTemplate,
  ChevronRight, Globe, Plus, Pencil, Trash2, ExternalLink as LinkIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type Section = 'themes' | 'pages' | 'preferences';
const VALID_SECTIONS: Section[] = ['themes', 'pages', 'preferences'];

const navItems: { id: Section; label: string; icon: React.ReactNode }[] = [
  { id: 'themes', label: 'Themes', icon: <LayoutTemplate className="w-4 h-4" /> },
  { id: 'pages', label: 'Pages', icon: <FileText className="w-4 h-4" /> },
  { id: 'preferences', label: 'Preferences', icon: <Settings className="w-4 h-4" /> },
];

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center bg-zinc-50"><div className="w-6 h-6 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" /></div>}>
      <DashboardContent />
    </Suspense>
  )
}

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab') as Section | null;
  const activeSection: Section = tabParam && VALID_SECTIONS.includes(tabParam) ? tabParam : 'themes';

  const setActiveSection = (section: Section) => {
    router.replace(`/dashboard?tab=${section}`, { scroll: false });
  };

  return (
    <div className="flex h-screen bg-zinc-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-zinc-200 flex flex-col shadow-sm">
        <div className="px-4 py-4 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-violet-600 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-zinc-900 text-sm">My Store</span>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <nav className="p-2 space-y-0.5">
            <div className="px-2 pt-3 pb-1 text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" /> Sales channels
            </div>

            <div className="mb-1">
              <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-zinc-800 rounded-md bg-zinc-100">
                <Store className="w-4 h-4 text-zinc-500" />
                Online Store
                <ChevronRight className="w-3.5 h-3.5 ml-auto text-zinc-400" />
              </div>

              <div className="ml-5 mt-0.5 border-l border-zinc-200 pl-2 space-y-0.5">
                {navItems.map((item) => (
                  <Button
                    key={item.id}
                    type="button"
                    variant="ghost"
                    onClick={() => setActiveSection(item.id)}
                    className={cn(
                      'w-full justify-start gap-2 px-2 py-1.5 text-sm rounded-md transition-colors',
                      activeSection === item.id
                        ? 'bg-violet-50 text-violet-700 font-medium'
                        : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                    )}
                  >
                    <span className={activeSection === item.id ? 'text-violet-500' : 'text-zinc-400'}>
                      {item.icon}
                    </span>
                    {item.label}
                  </Button>
                ))}
              </div>
            </div>
          </nav>
        </ScrollArea>

        <div className="p-3 border-t border-zinc-100">
          <Link href="/" className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-600 transition-colors">
            <ExternalLink className="w-3.5 h-3.5" /> Back to home
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <ScrollArea className="h-full">
          <div className="p-8 max-w-5xl">
            {activeSection === 'themes' && <ThemesSection />}
            {activeSection === 'pages' && <PagesSection />}
            {activeSection === 'preferences' && <PlaceholderSection title="Preferences" desc="Configure your store settings." />}
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}

// ─── Themes Section ────────────────────────────────────────────────────────────

function ThemesSection() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Themes</h1>
        <p className="text-sm text-zinc-500 mt-1">Manage and customize your store theme</p>
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-zinc-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <LayoutTemplate className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-zinc-900">Horizon Theme</h3>
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">Active</Badge>
              </div>
              <p className="text-xs text-zinc-500">Current live theme</p>
            </div>
          </div>
          <Link href="/editor">
            <Button className="bg-violet-600 hover:bg-violet-700 text-white gap-2" size="sm">
              <Settings className="w-3.5 h-3.5" /> Customize
            </Button>
          </Link>
        </div>

        <div className="bg-zinc-100" style={{ height: '560px' }}>
          <iframe src="/preview" className="w-full h-full" title="Theme Preview" />
        </div>
      </div>
    </div>
  );
}

// ─── Pages Section ─────────────────────────────────────────────────────────────

interface PageRow {
  id: number
  handle: string
  title: string
  createdAt: string
  updatedAt: string
}

function toHandle(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function PagesSection() {
  const router = useRouter()
  const [pageList, setPageList] = useState<PageRow[]>([])
  const [loading, setLoading] = useState(true)

  // Create dialog state
  const [createOpen, setCreateOpen] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newHandle, setNewHandle] = useState('')
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')

  const fetchPages = useCallback(async () => {
    try {
      const res = await fetch('/api/pages')
      const data = await res.json()
      setPageList(Array.isArray(data) ? data : [])
    } catch {
      setPageList([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchPages() }, [fetchPages])

  const handleTitleChange = (v: string) => {
    setNewTitle(v)
    setNewHandle(toHandle(v))
    setCreateError('')
  }

  const createPage = async () => {
    if (!newTitle.trim() || !newHandle.trim()) return
    setCreating(true)
    setCreateError('')
    try {
      const res = await fetch('/api/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle.trim(), handle: newHandle.trim() }),
      })
      if (!res.ok) {
        const err = await res.json()
        setCreateError(err.error || 'Failed to create page')
        return
      }
      setCreateOpen(false)
      router.push(`/editor?pageHandle=${newHandle.trim()}`)
    } catch {
      setCreateError('Network error')
    } finally {
      setCreating(false)
    }
  }

  const deletePage = async (handle: string) => {
    await fetch(`/api/pages?handle=${handle}`, { method: 'DELETE' })
    fetchPages()
  }

  const nonIndexPages = pageList.filter((p) => p.handle !== 'index')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Pages</h1>
          <p className="text-sm text-zinc-500 mt-1">Manage your store pages</p>
        </div>

        <Dialog open={createOpen} onOpenChange={(open) => { setCreateOpen(open); if (!open) { setCreateError(''); setNewTitle(''); setNewHandle('') } }}>
          <DialogTrigger asChild>
            <Button className="bg-violet-600 hover:bg-violet-700 text-white gap-2" size="sm">
              <Plus className="w-3.5 h-3.5" /> Add page
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create page</DialogTitle>
              <DialogDescription>Add a new page to your online store.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label htmlFor="page-title">Title</Label>
                <Input
                  id="page-title"
                  placeholder="About Us"
                  value={newTitle}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && createPage()}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="page-handle">
                  Handle <span className="text-zinc-400 font-normal">(URL slug)</span>
                </Label>
                <div className="flex items-center rounded-md border border-zinc-200 bg-zinc-50 text-sm overflow-hidden">
                  <span className="px-3 py-2 text-zinc-400 border-r border-zinc-200 select-none">/pages/</span>
                  <Input
                    id="page-handle"
                    value={newHandle}
                    onChange={(e) => setNewHandle(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    className="border-0 bg-transparent focus-visible:ring-0 rounded-none"
                    placeholder="about-us"
                  />
                </div>
              </div>
              {createError && <p className="text-xs text-red-500">{createError}</p>}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
              <Button
                onClick={createPage}
                disabled={creating || !newTitle.trim() || !newHandle.trim()}
                className="bg-violet-600 hover:bg-violet-700 text-white"
              >
                {creating ? 'Creating…' : 'Create page'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-5 h-5 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : nonIndexPages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-6">
            <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center mb-3">
              <FileText className="w-5 h-5 text-zinc-400" />
            </div>
            <p className="text-sm font-medium text-zinc-700">No pages yet</p>
            <p className="text-xs text-zinc-400 mt-1">
              Create pages like About, Contact, or FAQ and link them in your nav.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-zinc-50/60">
                <TableHead className="text-xs font-semibold text-zinc-500">Title</TableHead>
                <TableHead className="text-xs font-semibold text-zinc-500">URL</TableHead>
                <TableHead className="text-xs font-semibold text-zinc-500">Last updated</TableHead>
                <TableHead className="w-[120px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {nonIndexPages.map((page) => (
                <TableRow key={page.id} className="hover:bg-zinc-50/50">
                  <TableCell className="font-medium text-zinc-900 text-sm">{page.title}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <Badge variant="secondary" className="font-mono text-xs">
                        /pages/{page.handle}
                      </Badge>
                      <a
                        href={`/pages/${page.handle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-400 hover:text-violet-600 transition-colors"
                        title="Open page"
                      >
                        <LinkIcon className="w-3 h-3" />
                      </a>
                    </div>
                  </TableCell>
                  <TableCell className="text-zinc-500 text-xs">
                    {new Date(page.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/editor?pageHandle=${page.handle}`}>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-zinc-400 hover:text-violet-600">
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-zinc-400 hover:text-red-500">
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete "{page.title}"?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete the page at <strong>/pages/{page.handle}</strong>. You can't undo this.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deletePage(page.handle)}
                              className="bg-red-500 hover:bg-red-600 text-white"
                            >
                              Delete page
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Separator />
      <div>
        <p className="text-xs text-zinc-400">
          💡 Tip: After creating a page, add it to your navigation via <strong>Themes → Customize → Header → Menu Items</strong>.
        </p>
      </div>
    </div>
  );
}

// ─── Placeholder ───────────────────────────────────────────────────────────────

function PlaceholderSection({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">{title}</h1>
        <p className="text-sm text-zinc-500 mt-1">{desc}</p>
      </div>
      <div className="bg-white rounded-xl border border-zinc-200 p-8 text-center">
        <p className="text-sm text-zinc-400">Coming soon…</p>
      </div>
    </div>
  );
}
