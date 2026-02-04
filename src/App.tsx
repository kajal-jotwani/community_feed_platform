import React from 'react';
import { Feed } from './components/feed/Feed';
import { Leaderboard } from './components/leaderboard/Leaderboard';
import { useAuthStore } from './store/useAuthStore';
import { Avatar } from './components/ui/Avatar';
import { Button } from './components/ui/Button';

const App: React.FC = () => {
  const currentUser = useAuthStore(s => s.user);

  return (
    <div className="min-h-screen pb-20 relative">
      {/* Background Decor */}
      <div className="fixed top-20 -left-10 w-40 h-40 bg-[#4ade80] rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
      <div className="fixed bottom-20 -right-10 w-60 h-60 bg-blue-400 rounded-full blur-[120px] opacity-10 pointer-events-none"></div>

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
            {['About', 'Community', 'Resources'].map(item => (
              <a key={item} href="#" className="text-sm font-bold text-gray-400 hover:text-black transition-colors">
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" className="hidden sm:inline-flex">Get in touch</Button>
            <Avatar src={currentUser.avatar} alt={currentUser.name} size="sm" />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 mt-12">
        <div className="mb-12 text-center md:text-left">
          <h2 className="text-5xl md:text-7xl font-black text-black tracking-tighter leading-[0.9]">
            Find <span className="inline-block px-4 py-1 bg-[#fef08a] rounded-full -rotate-2">talks</span> & <br/> 
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
                <Button variant="primary" size="sm">Explore Now</Button>
              </div>
              {/* Decorative Arrow */}
              <div className="absolute -bottom-4 -right-4 text-black opacity-10 transform -rotate-12 group-hover:rotate-0 transition-transform duration-500">
                <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor"><path d="m12 4-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default App;
