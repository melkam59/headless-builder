import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans overflow-x-hidden">
      {/* Gradient orbs */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] rounded-full bg-violet-600/20 blur-[120px]" />
        <div className="absolute top-[30%] right-[10%] w-[400px] h-[400px] rounded-full bg-indigo-500/15 blur-[100px]" />
        <div className="absolute bottom-[10%] left-[10%] w-[500px] h-[500px] rounded-full bg-purple-700/15 blur-[120px]" />
      </div>

      {/* Nav */}
      <header className="relative z-10 flex items-center justify-between px-8 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>Link
          </div>
          <span className="text-lg font-bold tracking-tight">Buildify</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm text-zinc-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#how" className="hover:text-white transition-colors">How it works</a>
          <a href="#themes" className="hover:text-white transition-colors">Themes</a>
        </nav>
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" className="px-4 py-2 text-sm text-zinc-400 hover:text-white hover:bg-white/5">
            <Link href="/dashboard">Dashboard</Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className="px-4 py-2 text-sm font-medium bg-white text-black rounded-full hover:bg-zinc-100"
          >
            <Link href="/editor">Start building</Link>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-20 pb-32 max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-xs text-zinc-400 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Now in early access — build your store today
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.05] tracking-tight mb-6 bg-gradient-to-b from-white via-white to-zinc-400 bg-clip-text text-transparent">
          Build your store,<br />
          <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            your way.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-10 leading-relaxed">
          A powerful drag-and-drop store builder for merchants who want full control.
          Customize every section, launch fast, and sell more.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Button
            asChild
            variant="ghost"
            className="group h-12 gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold px-7 rounded-full transition-all duration-200 shadow-lg shadow-violet-700/30"
          >
            <Link href="/editor">
              Open the Editor
              <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className="h-12 gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 font-medium px-7 rounded-full transition-all duration-200"
          >
            <Link href="/dashboard">View Dashboard</Link>
          </Button>
        </div>

        {/* Editor preview mockup */}
        <div className="relative mt-20 w-full max-w-4xl mx-auto">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0a] z-10 pointer-events-none" style={{ top: '60%' }} />
          <div className="rounded-2xl border border-white/10 bg-zinc-900/80 overflow-hidden shadow-2xl shadow-black/50">
            {/* Fake toolbar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-zinc-950/50">
              <div className="w-3 h-3 rounded-full bg-zinc-700" />
              <div className="w-3 h-3 rounded-full bg-zinc-700" />
              <div className="w-3 h-3 rounded-full bg-zinc-700" />
              <div className="flex-1 mx-4">
                <div className="bg-zinc-800 rounded-md h-5 w-48 mx-auto" />
              </div>
            </div>
            {/* Fake editor layout */}
            <div className="flex h-64">
              {/* Fake sidebar */}
              <div className="w-44 border-r border-white/5 p-3 space-y-1.5">
                {["Header", "Hero", "Collection List", "Product Grid", "Footer"].map((s) => (
                  <div key={s} className={`h-7 rounded-md px-2 flex items-center text-xs ${s === "Hero" ? "bg-violet-600/30 text-violet-300" : "bg-zinc-800/50 text-zinc-500"}`}>
                    {s}
                  </div>
                ))}
              </div>
              {/* Fake preview */}
              <div className="flex-1 bg-zinc-800/30 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <div className="h-4 bg-zinc-700/50 rounded w-40 mx-auto" />
                  <div className="h-3 bg-zinc-700/40 rounded w-28 mx-auto" />
                  <div className="h-8 bg-violet-600/40 rounded-full w-24 mx-auto mt-3" />
                </div>
              </div>
              {/* Fake right panel */}
              <div className="w-48 border-l border-white/5 p-3 space-y-2">
                <div className="h-3 bg-zinc-700/60 rounded w-20" />
                <div className="h-7 bg-zinc-800 rounded w-full" />
                <div className="h-3 bg-zinc-700/60 rounded w-16 mt-2" />
                <div className="h-7 bg-zinc-800 rounded w-full" />
                <div className="h-3 bg-zinc-700/60 rounded w-24 mt-2" />
                <div className="h-7 bg-zinc-800 rounded w-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 px-6 py-24 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to launch</h2>
          <p className="text-zinc-400 max-w-xl mx-auto">All the tools to build, customize, and grow your store in one place.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm0 8a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zm12 0a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              ),
              title: "Drag & Drop Editor",
              desc: "Visually build and rearrange sections. No code required — what you see is what your customers get.",
            },
            {
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              ),
              title: "Theme Customization",
              desc: "Tweak colors, typography, layouts, and more. Every setting updates your live preview instantly.",
            },
            {
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              ),
              title: "Responsive Preview",
              desc: "Switch between desktop, tablet, and mobile views to make sure your store looks great on every device.",
            },
            {
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              ),
              title: "Built to Scale",
              desc: "Powered by Next.js and PostgreSQL. Production-grade from day one — fast, reliable, and secure.",
            },
            {
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              ),
              title: "Product Management",
              desc: "Organise products into collections. Control what's featured, what's on sale, and how it's displayed.",
            },
            {
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              ),
              title: "Instant Save",
              desc: "Changes are saved automatically to the database. Come back anytime — your store is always where you left it.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="group p-6 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center mb-4 group-hover:bg-violet-600/30 transition-colors">
                {f.icon}
              </div>
              <h3 className="font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="relative z-10 px-6 py-24 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Three steps to your store</h2>
          <p className="text-zinc-400 max-w-lg mx-auto">Going from zero to live store has never been this fast.</p>
        </div>
        <div className="space-y-6">
          {[
            { step: "01", title: "Pick a theme", desc: "Start from the Horizon theme or choose from upcoming presets. Everything is a starting point — nothing is locked in." },
            { step: "02", title: "Customize sections", desc: "Open the editor and adjust your header, hero, products, footer, and more. Every change reflects live in the preview." },
            { step: "03", title: "Publish and sell", desc: "When you're happy, publish your store. Your settings are saved, your store is live, and your customers can shop." },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-6 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <span className="text-4xl font-black text-white/10 leading-none mt-1 select-none">{item.step}</span>
              <div>
                <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 py-32 max-w-3xl mx-auto text-center">
        <div className="rounded-3xl bg-gradient-to-br from-violet-700/30 to-indigo-700/20 border border-violet-500/20 p-14">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to start building?</h2>
          <p className="text-zinc-400 mb-8 max-w-md mx-auto">
            Jump into the editor and start shaping your store right now. No sign-up needed.
          </p>
          <Link
            href="/editor"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold px-8 py-4 rounded-full transition-all duration-200 shadow-lg shadow-violet-800/40"
          >
            Open Editor
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 px-8 py-8 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-500 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span>Buildify</span>
        </div>
        <p>© 2026 Buildify. Built step by step.</p>
      </footer>
    </div>
  );
}
