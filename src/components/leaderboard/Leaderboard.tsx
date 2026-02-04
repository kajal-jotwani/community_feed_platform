import React, { useEffect } from 'react';
import { useLeaderboardStore } from '../../store/useLeaderboardStore';
import { Card } from '../ui/Card';

export const Leaderboard: React.FC = () => {
  const {
    entries,
    fullEntries,
    fullListOpen,
    loadLeaderboard,
    loadLeaderboardFull,
    setFullListOpen,
  } = useLeaderboardStore();

  useEffect(() => {
    loadLeaderboard();
  }, [loadLeaderboard]);

  const handleShowFullList = () => {
    loadLeaderboardFull();
  };

  const renderEntry = (entry: { rank: number; user: { id: number; name: string; karma: number; avatar: string } }) => (
    <div key={entry.user.id} className="flex items-center justify-between group py-2">
      <div className="flex items-center gap-4">
        <div
          className={`
            w-8 h-8 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0
            ${entry.rank === 1 ? 'bg-[#fef08a] text-black border-2 border-black' : 'bg-gray-100 text-gray-500'}
          `}
        >
          {entry.rank}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-extrabold text-black group-hover:text-blue-600 transition-colors truncate">
            {entry.user.name}
          </span>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            {entry.user.karma.toLocaleString()} Karma
          </span>
        </div>
      </div>
      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm ring-1 ring-gray-100 flex-shrink-0">
        <img src={entry.user.avatar} alt={entry.user.name} className="w-full h-full object-cover" />
      </div>
    </div>
  );

  return (
    <>
      <Card className="sticky top-28">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-black text-black tracking-tight">
            Trainers
          </h3>
          <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
            Top 5
          </span>
        </div>

        <div className="space-y-6">
          {entries.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">No leaderboard data yet</p>
          ) : (
            entries.map((entry) => renderEntry(entry))
          )}
        </div>

        <button
          type="button"
          onClick={handleShowFullList}
          className="mt-8 w-full py-3 bg-gray-50 rounded-full text-xs font-black text-gray-500 hover:bg-black hover:text-white transition-all uppercase tracking-widest"
        >
          Show full list
        </button>
      </Card>

      {fullListOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={() => setFullListOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Full leaderboard"
        >
          <div
            className="bg-white rounded-[2.5rem] border border-gray-200/50 shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-black text-black tracking-tight">
                Full leaderboard
              </h3>
              <button
                type="button"
                onClick={() => setFullListOpen(false)}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 hover:text-black transition-colors"
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-1">
              {fullEntries.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">No entries</p>
              ) : (
                fullEntries.map((entry) => renderEntry(entry))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
