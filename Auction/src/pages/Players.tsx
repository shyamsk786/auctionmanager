import React, { useState, useMemo } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { PlayerCard } from '../components/PlayerCard';
import { GameType } from '../types';

export const Players: React.FC = () => {
  const { players } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState<GameType | 'all'>('all');

  const gameFilters: Array<GameType | 'all'> = [
    'all',
    'Cricket',
    'Chess',
    'Throwball',
    'Table Tennis',
    'Pool',
  ];

  const filteredPlayers = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return players.filter(player => {
      const matchesSearch =
        player.name.toLowerCase().includes(query) ||
        player.matchTeam.toLowerCase().includes(query) ||
        player.department.toLowerCase().includes(query) ||
        player.location.toLowerCase().includes(query);

      const matchesGame = selectedGame === 'all' || 
                         player.games.some(g => g.game === selectedGame);

      return matchesSearch && matchesGame;
    });
  }, [players, searchQuery, selectedGame]);

  const captain = filteredPlayers.find(p => p.isCaptain);
  const regularPlayers = filteredPlayers.filter(p => !p.isCaptain);

  return (
    <div className="min-h-screen bg-[#050b19] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 glass-panel p-6"
        >
          <p className="text-white/40 uppercase tracking-[0.3em] text-xs mb-2">Roster Intelligence</p>
          <h1 className="text-white text-xl font-semibold">{players.length} Active Indian Athletes</h1>
          <p className="text-white/60 text-sm">Search, filter & scout multi-sport profiles</p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-6 mb-8"
        >
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/30" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, entity, department, location"
                className="w-full pl-10 pr-10 py-3 bg-[#0f1b34] border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:border-[#64d9ff]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full"
                >
                  <X className="h-4 w-4 text-white/40" />
                </button>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3 text-white/60 text-xs uppercase tracking-[0.3em]">
                <Filter className="h-4 w-4" />
                <span>Games</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {gameFilters.map((game) => (
                  <button
                    key={game}
                    onClick={() => setSelectedGame(game)}
                    className={`px-4 py-2 rounded-full text-xs tracking-[0.2em] uppercase transition-all ${
                      selectedGame === game
                        ? 'bg-white text-[#050b19]'
                        : 'bg-white/5 text-white/60 hover:text-white'
                    }`}
                  >
                    {game === 'all' ? 'All' : game}
                  </button>
                ))}
                {selectedGame !== 'all' && (
                  <button
                    onClick={() => setSelectedGame('all')}
                    className="px-4 py-2 rounded-full text-xs uppercase tracking-[0.2em] bg-[#2c1a1a] text-[#ff8b8b]"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            <div className="text-white/50 text-xs uppercase tracking-[0.3em]">
              Showing {filteredPlayers.length} / {players.length} profiles
            </div>
          </div>
        </motion.div>

        {/* Captain Card (if exists in filtered results) */}
        {captain && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="glass-panel p-4 border border-[#64d9ff]/30 flex items-center justify-between">
              <div>
                <p className="text-white/40 text-xs uppercase tracking-[0.3em]">Captain Spotlight</p>
                <h2 className="text-white text-lg font-semibold">{captain.name}</h2>
              </div>
              <span className="badge-soft">Primary Captain</span>
            </div>
            <div className="mt-4">
              <PlayerCard player={captain} />
            </div>
          </motion.div>
        )}

        {/* Players Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-white text-sm uppercase tracking-[0.3em] mb-4">
            {captain ? 'Complete Roster' : 'Roster'}
          </h2>
          
          <AnimatePresence>
            {filteredPlayers.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-16 text-white/50"
              >
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-white text-base font-semibold mb-2">No players match this filter</h3>
                <p className="text-white/50 text-sm">Adjust filters to explore more profiles</p>
              </motion.div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {regularPlayers.map((player, index) => (
                  <motion.div
                    key={player.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    layout
                  >
                    <PlayerCard player={player} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};
