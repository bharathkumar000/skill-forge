import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, User, Zap } from 'lucide-react';
import { supabase } from '../supabase';
import bgImage from '../assets/futuristic_bg.png';

interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  rank?: number;
}

const LeaderboardPage: React.FC = () => {
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([
    { id: '1', name: 'CYBER_VIPER', score: 980 },
    { id: '2', name: 'NEON_KNIGHT', score: 950 },
    { id: '3', name: 'CODE_ORACLE', score: 890 },
    { id: '4', name: 'IVC_ADMIN', score: 1000 },
    { id: '5', name: 'GENESIS_BOT', score: 750 },
  ]);

  useEffect(() => {
    const ch = supabase.channel('public:quiz_responses').subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const sorted = [...leaders].sort((a, b) => b.score - a.score).map((l, i) => ({ ...l, rank: i + 1 }));

  return (
    <div className="min-h-screen flex flex-col relative scanline-overlay"
         style={{ background: 'linear-gradient(180deg, #080c14 0%, #0c1a2a 50%, #080c14 100%)' }}>
      <div className="fixed inset-0 opacity-15 pointer-events-none"
           style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        {/* Nav pill */}
        <div className="flex justify-center mt-6">
          <div className="bg-white/[0.03] border border-white/5 rounded-full px-5 py-2 flex items-center gap-5">
            <a href="/" className="text-[10px] tracking-[0.3em] text-gray-500 font-bold uppercase hover:text-cyan-glow transition-colors">Home</a>
            <a href="#" className="text-[10px] tracking-[0.3em] text-gray-500 font-bold uppercase hover:text-cyan-glow transition-colors">About</a>
            <a href="#" className="text-[10px] tracking-[0.3em] text-cyan-glow font-bold uppercase border-t-2 border-cyan-glow pt-1 -mt-1">Achievements</a>
          </div>
        </div>

        <main className="flex-1 flex flex-col items-center px-8 pt-16">
          <div className="w-full max-w-4xl">
            {/* Title */}
            <div className="flex flex-col items-center mb-14">
              <Trophy className="w-12 h-12 text-cyan-glow mb-4" style={{ filter: 'drop-shadow(0 0 15px rgba(0,247,255,0.4))' }} />
              <h1 className="font-display text-4xl md:text-5xl font-black tracking-[0.3em] glow-text uppercase mb-2">LEADERBOARD</h1>
              <p className="text-[10px] tracking-[0.5em] text-gray-500 uppercase font-bold">REAL-TIME RANKING • SYSTEM SYNC: LIVE</p>
            </div>

            {/* Table */}
            <div className="glass-card overflow-hidden border border-cyan-glow/8">
              {/* Header */}
              <div className="flex px-8 py-5 border-b border-cyan-glow/8 bg-cyan-glow/[0.03]">
                <div className="w-20 font-display text-[9px] tracking-[0.4em] text-cyan-glow/50 uppercase font-bold"># RANK</div>
                <div className="flex-1 font-display text-[9px] tracking-[0.4em] text-cyan-glow/50 uppercase font-bold flex items-center gap-2">
                  <User className="w-3 h-3" /> PARTICIPANT
                </div>
                <div className="w-32 text-right font-display text-[9px] tracking-[0.4em] text-cyan-glow/50 uppercase font-bold flex items-center justify-end gap-2">
                  <Zap className="w-3 h-3" /> SCORE
                </div>
              </div>

              {/* Rows */}
              <motion.div layout className="divide-y divide-white/[0.03]">
                <AnimatePresence>
                  {sorted.map((entry, idx) => (
                    <motion.div
                      key={entry.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: idx * 0.08, layout: { type: 'spring', stiffness: 300, damping: 30 } }}
                      className={`flex px-8 py-6 items-center transition-colors group hover:bg-cyan-glow/[0.03] ${idx === 0 ? 'bg-cyan-glow/[0.05]' : ''}`}
                    >
                      <div className={`w-20 font-display text-xl font-black ${idx === 0 ? 'text-cyan-glow' : 'text-gray-700'}`}>
                        {String(entry.rank).padStart(2, '0')}
                      </div>
                      <div className="flex-1 flex items-center gap-4">
                        <div className={`w-9 h-9 rounded-full border flex items-center justify-center text-xs font-bold ${idx === 0 ? 'border-cyan-glow/30 bg-cyan-glow/10 text-cyan-glow' : 'border-white/10 bg-white/5 text-gray-600'}`}>
                          {entry.name[0]}
                        </div>
                        <span className={`font-display text-sm font-bold tracking-[0.15em] ${idx === 0 ? 'text-white' : 'text-gray-400'}`}>{entry.name}</span>
                        {idx === 0 && <span className="text-[8px] px-2 py-0.5 bg-cyan-glow text-black font-bold rounded tracking-wider uppercase">TOP</span>}
                      </div>
                      <div className="w-32 text-right">
                        <span className={`font-display text-2xl font-black ${idx === 0 ? 'glow-text' : 'text-gray-300'}`}>
                          {entry.score.toLocaleString()}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LeaderboardPage;
