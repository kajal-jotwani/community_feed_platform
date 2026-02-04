import React, { useEffect } from 'react';
import { useLeaderboardStore } from '../../store/useLeaderboardStore';
import { Card } from '../ui/Card';

export const Leaderboard: React.FC = () => {
  const { entries, loadLeaderboard } = useLeaderboardStore();

  useEffect(() => {
    loadLeaderboard();
  }, [loadLeaderboard]);

  return (
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
          entries.map((entry) => (
            <div key={entry.user.id} className="flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-black
                  ${entry.rank === 1 ? 'bg-[#fef08a] text-black border-2 border-black' : 'bg-gray-100 text-gray-500'}
                `}>
                  {entry.rank}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-extrabold text-black group-hover:text-blue-600 transition-colors">
                    {entry.user.name}
                  </span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    {entry.user.karma.toLocaleString()} Karma
                  </span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm ring-1 ring-gray-100">
                <img src={entry.user.avatar} alt={entry.user.name} className="w-full h-full object-cover" />
              </div>
            </div>
          ))
        )}
      </div>

      <button className="mt-8 w-full py-3 bg-gray-50 rounded-full text-xs font-black text-gray-500 hover:bg-black hover:text-white transition-all uppercase tracking-widest">
        Show full list
      </button>
    </Card>
  );
};
