import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Users, DollarSign, Award, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PlayerCard } from '../components/PlayerCard';

export const MyTeam: React.FC = () => {
  const { currentUser, teams, auction } = useApp();

  const userTeam = teams.find(t => t.ownerId === currentUser?.id);

  if (!userTeam) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Team Not Found</h2>
          <p className="text-gray-600">You don't have a team assigned yet.</p>
        </div>
      </div>
    );
  }

  const teamValue = userTeam.players.reduce((acc, p) => acc + (p.soldPrice || p.basePrice), 0);
  const avgRating = userTeam.players.length > 0
    ? userTeam.players.reduce((acc, p) => {
        const playerAvg = p.games.reduce((sum, g) => sum + g.rating, 0) / p.games.length;
        return acc + playerAvg;
      }, 0) / userTeam.players.length
    : 0;

  const stats = [
    {
      title: 'Team Budget',
      value: `₹${userTeam.budget.toLocaleString('en-IN')}`,
      icon: DollarSign,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Remaining Budget',
      value: `₹${userTeam.remainingBudget.toLocaleString('en-IN')}`,
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Players Acquired',
      value: `${userTeam.players.length}/${userTeam.maxPlayers}`,
      icon: Users,
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Team Value',
      value: `₹${teamValue.toLocaleString('en-IN')}`,
      icon: Trophy,
      color: 'from-orange-500 to-red-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Team Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 rounded-3xl shadow-2xl overflow-hidden mb-8"
        >
          <div className="p-8 text-white">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-5xl font-bold mb-2">{userTeam.name}</h1>
                <p className="text-xl text-gray-200">Owned by {userTeam.ownerName}</p>
              </div>
              <div className="bg-white/20 p-6 rounded-2xl backdrop-blur-sm">
                <Trophy className="h-16 w-16" />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-sm text-gray-200 mb-1">Average Rating</p>
                <p className="text-3xl font-bold">{avgRating.toFixed(1)}/10</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-sm text-gray-200 mb-1">Squad Size</p>
                <p className="text-3xl font-bold">{userTeam.players.length}</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-sm text-gray-200 mb-1">Budget Spent</p>
                <p className="text-3xl font-bold">
                  {(((userTeam.budget - userTeam.remainingBudget) / userTeam.budget) * 100).toFixed(0)}%
                </p>
              </div>
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-sm text-gray-200 mb-1">Slots Left</p>
                <p className="text-3xl font-bold">{userTeam.maxPlayers - userTeam.players.length}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <div className={`h-2 bg-gradient-to-r ${stat.color}`}></div>
              <div className="p-6">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${stat.color} mb-4`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-gray-500 text-sm font-medium mb-1">{stat.title}</h3>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Players Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Award className="h-8 w-8 text-indigo-600" />
              My Squad
            </h2>
            {auction && auction.status === 'live' && (
              <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg font-semibold flex items-center gap-2">
                <span className="h-3 w-3 bg-red-500 rounded-full animate-pulse"></span>
                Auction is LIVE
              </div>
            )}
          </div>

          {userTeam.players.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <Users className="h-24 w-24 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Players Yet</h3>
              <p className="text-gray-600 mb-6">
                Start bidding in the auction to build your dream team!
              </p>
              <a
                href="/live-auction"
                className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105"
              >
                Go to Live Auction
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userTeam.players.map((player, index) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <PlayerCard player={player} />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Budget Breakdown */}
        {userTeam.players.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 bg-white rounded-2xl shadow-lg p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Budget Breakdown</h2>
            
            <div className="space-y-4">
              {userTeam.players.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={player.avatar}
                      alt={player.name}
                      className="h-12 w-12 rounded-full ring-2 ring-indigo-500"
                    />
                    <div>
                      <h3 className="font-bold text-gray-900">{player.name}</h3>
                      <p className="text-sm text-gray-600">{player.criteria}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-indigo-600 text-xl">
                      ₹{(player.soldPrice || player.basePrice).toLocaleString('en-IN')}
                    </p>
                    {player.soldPrice && player.soldPrice > player.basePrice && (
                      <p className="text-sm text-green-600">
                        +₹{(player.soldPrice - player.basePrice).toLocaleString('en-IN')} over base
                      </p>
                    )}
                  </div>
                </div>
              ))}

              <div className="border-t-2 pt-4 mt-4">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span className="text-gray-900">Total Spent</span>
                  <span className="text-indigo-600">
                    ₹{(userTeam.budget - userTeam.remainingBudget).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xl font-bold mt-2">
                  <span className="text-gray-900">Remaining</span>
                  <span className="text-green-600">
                    ₹{userTeam.remainingBudget.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Budget Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Budget Utilization</span>
                <span>
                  {(((userTeam.budget - userTeam.remainingBudget) / userTeam.budget) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((userTeam.budget - userTeam.remainingBudget) / userTeam.budget) * 100}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
