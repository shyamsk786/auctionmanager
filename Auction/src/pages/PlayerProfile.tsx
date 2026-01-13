import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, MapPin, Briefcase, Award, User as UserIcon, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';

export const PlayerProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { players } = useApp();

  const player = players.find((p) => p.id === id);

  if (!player) {
    return (
      <div className="min-h-screen bg-[#050b19] flex items-center justify-center text-white">
        <div className="glass-panel p-8 rounded-3xl text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-white/40 mb-4">Profile Offline</p>
          <h2 className="text-base font-semibold mb-4">Player not found</h2>
          <button
            onClick={() => navigate('/players')}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#64d9ff] to-[#7c5dfa] text-[#050b19] font-semibold uppercase tracking-[0.3em]"
          >
            Back to Roster
          </button>
        </div>
      </div>
    );
  }

  const avgRating = player.games.reduce((acc, g) => acc + g.rating, 0) / player.games.length;

  const getRatingAccent = (rating: number) => {
    if (rating >= 8) return 'text-emerald-300';
    if (rating >= 5) return 'text-amber-300';
    return 'text-rose-300';
  };

  const getRatingBar = (rating: number) => {
    if (rating >= 8) return 'from-emerald-400 to-emerald-500';
    if (rating >= 5) return 'from-amber-300 to-amber-500';
    return 'from-rose-400 to-rose-500';
  };

  return (
    <div className="min-h-screen bg-[#050b19] text-white py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/players')}
          className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 text-xs uppercase tracking-[0.4em]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Roster
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel overflow-hidden rounded-3xl border border-[#64d9ff]/20"
        >
          <div className="relative">
            <div className="h-64 bg-gradient-to-r from-[#050b19] via-[#0f1b34] to-[#050b19]">
              <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'url("https://auctionspot.in/assets/bg-grid.svg")' }} />
            </div>
            <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
              <div className="relative">
                <div className="h-40 w-40 rounded-full border-4 border-[#64d9ff]/50 bg-[#030712] p-2">
                  <img src={player.avatar} alt={player.name} className="h-full w-full rounded-full object-cover" />
                </div>
                <div className="absolute inset-0 rounded-full blur-3xl bg-[#64d9ff]/30" />
                {player.isCaptain && (
                  <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#fbbf24] to-[#f97316] px-6 py-1 rounded-full text-[10px] font-semibold tracking-[0.35em] text-[#050b19] flex items-center gap-2">
                    <Trophy className="h-3 w-3" /> Captain
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="pt-24 pb-8 px-6 text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-[#64d9ff]">{player.matchTeam}</p>
            <h1 className="text-2xl font-semibold mt-2 mb-2">{player.name}</h1>
            <div className="flex items-center justify-center gap-2 flex-wrap text-[11px] uppercase tracking-[0.3em]">
              <span className="px-4 py-1 rounded-full bg-white/10 border border-white/10">{player.criteria}</span>
              <span className="px-4 py-1 rounded-full bg-white/10 border border-white/10">{player.gender}</span>
              <span className="px-4 py-1 rounded-full bg-white/10 border border-white/10">{player.employmentType}</span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <div className="glass-panel p-6 border border-white/5 rounded-2xl">
              <p className="text-xs uppercase tracking-[0.3em] text-white/40 mb-4">Profile intel</p>
              <div className="grid gap-4">
                <InfoItem icon={Briefcase} label="Match Department" value={player.department} />
                <InfoItem icon={MapPin} label="Base Location" value={player.location} />
                <InfoItem icon={Award} label="Player Criteria" value={player.criteria} />
                <InfoItem icon={UserIcon} label="Gender" value={player.gender} />
                <InfoItem icon={Calendar} label="Employment" value={player.employmentType} />
              </div>
            </div>

            <div className="glass-panel p-6 border border-white/5 rounded-2xl">
              <p className="text-xs uppercase tracking-[0.3em] text-white/40 mb-4">Auction Snapshot</p>
              <div className="space-y-4">
                <div className="bg-[#0f1b34] rounded-xl p-4 border border-white/5">
                  <p className="text-white/50 text-xs">Base Credits</p>
                  <p className="text-lg font-semibold">{player.basePrice} Credits</p>
                </div>
                {player.soldTo ? (
                  <div className="bg-[#0f1b34] rounded-xl p-4 border border-emerald-500/20">
                    <p className="text-emerald-300 text-xs">Allocated To</p>
                    <p className="text-base font-semibold">{player.soldTo}</p>
                    <p className="text-emerald-200 text-sm mt-1">Winning Bid: {player.soldPrice} Credits</p>
                  </div>
                ) : (
                  <div className="bg-[#0f1b34] rounded-xl p-4 border border-white/5 text-center">
                    <p className="text-white/60 text-sm">Available in Credit Auction</p>
                    {player.isCaptain && (
                      <p className="text-amber-300 text-xs mt-2 uppercase tracking-[0.35em]">Captain - Not Auction Eligible</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial{{ opacity: 0, x: 20 }}
            animate{{ opacity: 1, x: 0 }}
            transition{{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="glass-panel p-6 border border-white/5 rounded-2xl">
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex-1 min-w-[140px] bg-[#0f1b34] rounded-xl p-4 border border-white/5">
                  <p className="text-xs text-white/40 uppercase tracking-[0.35em]">Games Played</p>
                  <p className="text-xl font-semibold mt-1">{player.games.length}</p>
                </div>
                <div className="flex-1 min-w-[140px] bg-[#0f1b34] rounded-xl p-4 border border-white/5">
                  <p className="text-xs text-white/40 uppercase tracking-[0.35em]">Average Rating</p>
                  <p className="text-xl font-semibold mt-1">{avgRating.toFixed(1)}/10</p>
                </div>
              </div>

              <div className="space-y-4">
                {player.games.map((game, index) => (
                  <motion.div
                    key={game.game}
                    initial={{ opacity: 0, y: 10 }}
                    animate{{ opacity: 1, y: 0 }}
                    transition{{ delay: 0.3 + index * 0.05 }}
                    className="bg-[#0f1b34] p-4 rounded-xl border border-white/5"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-xs uppercase tracking-[0.2em]">
                          {game.game.slice(0, 2)}
                        </span>
                        <p className="text-base font-semibold">{game.game}</p>
                      </div>
                      <span className={`text-lg font-semibold ${getRatingAccent(game.rating)}`}>
                        {game.rating}/10
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${getRatingBar(game.rating)}`}
                        style={{ width: `${(game.rating / 10) * 100}%` }}
                      ></div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {player.brief && (
              <div className="glass-panel p-6 border border-white/5 rounded-2xl">
                <p className="text-xs uppercase tracking-[0.35em] text-white/40 mb-3">Player Brief</p>
                <div className="bg-[#0f1b34] border border-white/5 rounded-2xl p-5 relative">
                  <span className="absolute -top-3 left-6 text-4xl text-[#7c5dfa]/30">“</span>
                  <p className="text-sm leading-relaxed text-white/80">{player.brief}</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const InfoItem: React.FC<{
  icon: React.ElementType;
  label: string;
  value: string;
}> = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3">
    <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
      <Icon className="h-4 w-4 text-[#64d9ff]" />
    </div>
    <div className="flex-1">
      <p className="text-[11px] uppercase tracking-[0.3em] text-white/40">{label}</p>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  </div>
);
