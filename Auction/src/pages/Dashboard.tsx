import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Users, Calendar, TrendingUp, Clock, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';

export const Dashboard: React.FC = () => {
  const { currentUser, auction, teams, players } = useApp();
  const navigate = useNavigate();

  const userTeam = teams.find(t => t.ownerId === currentUser?.id);
  const soldPlayers = players.filter(p => p.soldTo);
  const unsoldPlayers = players.filter(p => !p.soldTo);

  const stats = [
    {
      title: 'Total Players',
      value: players.length,
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      change: '+12%',
    },
    {
      title: 'Total Teams',
      value: teams.length,
      icon: Trophy,
      color: 'from-purple-500 to-pink-500',
      change: '+5%',
    },
    {
      title: 'Players Sold',
      value: soldPlayers.length,
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500',
      change: `${soldPlayers.length}/${players.length}`,
    },
    {
      title: 'Auction Status',
      value: auction?.status || 'N/A',
      icon: Clock,
      color: 'from-orange-500 to-red-500',
      change: auction?.status === 'live' ? 'LIVE' : 'Upcoming',
    },
  ];

  if (currentUser?.role === 'bidder' && userTeam) {
    stats.push({
      title: 'My Budget',
      value: `₹${userTeam.remainingBudget.toLocaleString('en-IN')}`,
      icon: DollarSign,
      color: 'from-yellow-500 to-orange-500',
      change: `${userTeam.players.length}/${userTeam.maxPlayers} Players`,
    });
  }

  return (
    <div className="min-h-screen bg-[#050b19]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-white">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 bg-[#0f1b34] border border-white/5 rounded-2xl p-6 shadow-2xl"
        >
          <p className="text-white/40 uppercase tracking-[0.4em] text-xs mb-2">Command Console</p>
          <h1 className="text-xl font-semibold text-white mb-2">
            Namaste, {currentUser?.name} 👋
          </h1>
          <p className="text-white/60 text-sm">
            {currentUser?.role === 'admin'
              ? 'Oversee all auctions, teams, and compliance in real time'
              : currentUser?.role === 'bidder'
              ? `Crew Captain: ${userTeam?.name} • Calibrate bids & squad strategy`
              : 'Monitor live auctions and player intelligence'}
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glow-card p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 rounded-xl bg-white/5">
                  <stat.icon className="h-4 w-4 text-[#64d9ff]" />
                </div>
                <span className="text-xs text-white/40 uppercase tracking-[0.3em]">{stat.change}</span>
              </div>
              <h3 className="text-white/60 text-xs uppercase tracking-[0.3em] mb-1">{stat.title}</h3>
              <p className="text-white text-lg font-semibold">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-panel p-6 mb-8"
        >
          <h2 className="text-white text-sm font-semibold uppercase tracking-[0.3em] mb-4">Mission Shortcuts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <ActionCard
              title="Player Grid"
              description="Search & scout complete roster"
              icon={Users}
              color="from-blue-500 to-cyan-500"
              onClick={() => navigate('/players')}
            />
            <ActionCard
              title="Auction Deck"
              description={auction?.status === 'live' ? 'Live room armed & active' : 'Standby for live room'}
              icon={Trophy}
              color="from-purple-500 to-pink-500"
              onClick={() => navigate('/live-auction')}
              highlight={auction?.status === 'live'}
            />
            {currentUser?.role === 'bidder' && (
              <ActionCard
                title="Team Capsule"
                description={`Crew strength ${userTeam?.players.length || 0}/${userTeam?.maxPlayers}`}
                icon={Calendar}
                color="from-green-500 to-emerald-500"
                onClick={() => navigate('/my-team')}
              />
            )}
            {currentUser?.role === 'admin' && (
              <ActionCard
                title="Admin Ops"
                description="Control auctions & tournaments"
                icon={Calendar}
                color="from-red-500 to-orange-500"
                onClick={() => navigate('/admin')}
              />
            )}
          </div>
        </motion.div>

        {/* Auction Overview */}
        {auction && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glow-card p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white/40 uppercase tracking-[0.3em] text-xs">Current Mission</p>
                <h2 className="text-white text-lg font-semibold">{auction.name}</h2>
              </div>
              <span className="badge-soft capitalize flex items-center gap-2">
                {auction.status === 'live' && <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>}
                {auction.status}
              </span>
            </div>
            <p className="text-white/60 text-sm mb-5">{auction.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/5 rounded-xl p-4">
                <p className="text-white/40 text-xs uppercase tracking-[0.3em]">Budget / Team</p>
                <p className="text-white text-lg font-semibold">₹{auction.rules.initialBudget.toLocaleString('en-IN')}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4">
                <p className="text-white/40 text-xs uppercase tracking-[0.3em]">Players Active</p>
                <p className="text-white text-lg font-semibold">{unsoldPlayers.length} / {players.length}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4">
                <p className="text-white/40 text-xs uppercase tracking-[0.3em]">Timer Window</p>
                <p className="text-white text-lg font-semibold">{auction.rules.bidTimeout}s</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 glass-panel p-6"
        >
          <h2 className="text-white text-sm uppercase tracking-[0.3em] mb-4">Squad Stack Rankings</h2>
          <div className="space-y-3">
            {teams
              .sort((a, b) => b.players.length - a.players.length)
              .map((team, index) => (
                <div
                  key={team.id}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs uppercase tracking-widest bg-white/10 text-white/70">
                      #{index + 1}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-sm">{team.name}</h3>
                      <p className="text-white/40 text-xs">{team.ownerName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-sm font-semibold">{team.players.length} Players</p>
                    <p className="text-white/50 text-xs">₹{team.remainingBudget.toLocaleString('en-IN')} balance</p>
                  </div>
                </div>
              ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const ActionCard: React.FC<{
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  onClick: () => void;
  highlight?: boolean;
}> = ({ title, description, icon: Icon, color, onClick, highlight }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`p-6 rounded-xl text-left transition-all ${
      highlight
        ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white animate-pulse'
        : 'bg-gradient-to-r from-gray-50 to-gray-100 hover:shadow-lg'
    }`}
  >
    <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${color} mb-4`}>
      <Icon className="h-6 w-6 text-white" />
    </div>
    <h3 className={`font-bold text-lg mb-2 ${highlight ? 'text-white' : 'text-gray-900'}`}>
      {title}
    </h3>
    <p className={`text-sm ${highlight ? 'text-white/90' : 'text-gray-600'}`}>
      {description}
    </p>
  </motion.button>
);
