import React, { useState } from 'react';
import { Feed } from './components/feed/Feed';
import { Leaderboard } from './components/leaderboard/Leaderboard';
import { useAuthStore } from './store/useAuthStore';
import { Avatar } from './components/ui/Avatar';
import { Button } from './components/ui/Button';

const NAV_ITEMS: { id: string; label: string; content: string }[] = [
  {
    id: 'about',
    label: 'About',
    content:
      'Playto is a community for product engineers and startup builders. We share talks, trainings, and ideas to move faster and ship better.',
  },
  {
    id: 'community',
    label: 'Community',
    content:
      'Join discussions, share your work, and learn from others. Everyone here is building something—from side projects to high-growth products.',
  },
  {
    id: 'resources',
    label: 'Resources',
    content:
      'Curated articles, templates, and guides for management and engineering. More coming soon.',
  },
];

const App: React.FC = () => {
  const currentUser = useAuthStore((s) => s.user);
  const [navModal, setNavModal] = useState<string | null>(null);

  return (
    <div className="min-h-screen pb-20 relative overflow-x-hidden">
      {/* Animated background orbs */}
      <div className="fixed top-20 -left-10 w-40 h-40 bg-[#4ade80] rounded-full blur-[100px] opacity-20 pointer-events-none bg-float-slow bg-pulse-soft" />
      <div className="fixed bottom-20 -right-10 w-60 h-60 bg-blue-400 rounded-full blur-[120px] opacity-10 pointer-events-none bg-float-slower" />
      <div className="fixed top-1/2 left-1/3 w-32 h-32 bg-amber-200 rounded-full blur-[80px] opacity-15 pointer-events-none bg-float-slow" style={{ animationDelay: '-4s' }} />
      <div className="fixed bottom-1/3 right-1/4 w-48 h-48 bg-indigo-300 rounded-full blur-[90px] opacity-10 pointer-events-none bg-float-slower" style={{ animationDelay: '-6s' }} />

      {/* Floating Navbar */}
      <nav className="max-w-5xl mx-auto px-4 pt-6 sticky top-0 z-50">
        <div className="bg-white/90 backdrop-blur-xl border border-white/50 shadow-[0_10px_40px_rgba(0,0,0,0.05)] rounded-full h-16 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
              <span className="text-white font-black text-lg">P</span>
            </div>
            <h1 className="text-xl font-extrabold text-black tracking-tighter uppercase">
              Playto
            </h1>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setNavModal(navModal === item.id ? null : item.id)}
                className="text-sm font-bold text-gray-400 hover:text-black transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" className="hidden sm:inline-flex">
              Get in touch
            </Button>
            <Avatar src={currentUser.avatar} alt={currentUser.name} size="sm" />
          </div>
        </div>
      </nav>

      {/* Nav modal (About / Community / Resources) */}
      {navModal && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
          onClick={() => setNavModal(null)}
          role="dialog"
          aria-modal="true"
          aria-label={NAV_ITEMS.find((i) => i.id === navModal)?.label}
        >
          <div
            className="bg-white rounded-[2.5rem] border border-gray-200/50 shadow-2xl max-w-lg w-full p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-black text-black tracking-tight">
                {NAV_ITEMS.find((i) => i.id === navModal)?.label}
              </h3>
              <button
                type="button"
                onClick={() => setNavModal(null)}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600"
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-gray-600 leading-relaxed">
              {NAV_ITEMS.find((i) => i.id === navModal)?.content}
            </p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 mt-12">
        <div className="mb-12 text-center md:text-left">
          <h2 className="text-5xl md:text-7xl font-black text-black tracking-tighter leading-[0.9]">
            Find <span className="inline-block px-4 py-1 bg-[#fef08a] rounded-full -rotate-2">talks</span> & <br />
            <span className="text-blue-600">trainings</span>.
          </h2>
          <p className="mt-6 text-lg text-gray-500 max-w-lg font-medium">
            Join the collective of product engineers building the future of high-speed startups.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8">
            <Feed />
          </div>

          <aside className="hidden lg:block lg:col-span-4 space-y-8">
            <Leaderboard />

            <div className="bg-[#4ade80] rounded-[2.5rem] p-8 relative overflow-hidden group">
              <div className="relative z-10">
                <h3 className="text-2xl font-black text-black mb-3">Seminar topics</h3>
                <p className="text-black/70 text-sm font-semibold mb-6">
                  Explore our curated paths for management and engineering.
                </p>
                {/* Explore Now not wired to any action yet — uncomment when you add a handler
                <Button variant="primary" size="sm">Explore Now</Button>
                */}
              </div>
              <div className="absolute -bottom-4 -right-4 text-black opacity-10 transform -rotate-12 group-hover:rotate-0 transition-transform duration-500">
                <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor">
                  <path d="m12 4-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
                </svg>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default App;
