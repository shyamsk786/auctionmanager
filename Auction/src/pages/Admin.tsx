import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Trophy, TrendingUp, Settings, BarChart3, DollarSign } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Admin: React.FC = () => {
  const { players, teams, auction, bids } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'analytics'>('overview');

  const soldPlayers = players.filter(p => p.soldTo);
  const unsoldPlayers = players.filter(p => !p.soldTo);
  const totalBidsValue = bids.reduce((acc, bid) => acc + bid.amount, 0);

  const stats = [
    {
      title: 'Total Players',
      value: players.length,
      change: `${soldPlayers.length} Sold`,
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Total Teams',
      value: teams.length,
      change: 'Active',
      icon: Trophy,
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Total Bids',
      value: bids.length,
      change: `₹${totalBidsValue.toLocaleString('en-IN')}`,
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Auction Status',
      value: auction?.status || 'N/A',
      change: auction?.status === 'live' ? 'LIVE NOW' : 'Waiting',
      icon: Settings,
      color: 'from-orange-500 to-red-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600 text-lg">Manage your auction platform</p>
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
                <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.change}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'overview'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'users'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Teams & Users
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'analytics'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Analytics
            </button>
          </div>

          <div className="p-8">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Auction Info */}
                {auction && (
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border-l-4 border-indigo-600">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">{auction.name}</h2>
                    <p className="text-gray-700 mb-4">{auction.description}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <p className="text-xl font-bold text-indigo-600 capitalize">{auction.status}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total Players</p>
                        <p className="text-xl font-bold text-gray-900">{auction.playerIds.length}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Players Sold</p>
                        <p className="text-xl font-bold text-green-600">{soldPlayers.length}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Unsold</p>
                        <p className="text-xl font-bold text-orange-600">{unsoldPlayers.length}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <ActionCard
                    title="Setup New Auction"
                    description="Configure and schedule auctions"
                    icon={Settings}
                    href="/auction-setup"
                  />
                  <ActionCard
                    title="View Live Auction"
                    description="Monitor ongoing auction"
                    icon={Trophy}
                    href="/live-auction"
                  />
                  <ActionCard
                    title="Player Database"
                    description="Manage player profiles"
                    icon={Users}
                    href="/players"
                  />
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Team Overview</h2>
                {teams.map((team) => (
                  <div
                    key={team.id}
                    className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{team.name}</h3>
                        <p className="text-gray-600">{team.ownerName}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Players</p>
                        <p className="text-2xl font-bold text-indigo-600">
                          {team.players.length}/{team.maxPlayers}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-xs text-gray-600">Total Budget</p>
                        <p className="text-lg font-bold text-gray-900">
                          ₹{team.budget.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-xs text-gray-600">Spent</p>
                        <p className="text-lg font-bold text-red-600">
                          ₹{(team.budget - team.remainingBudget).toLocaleString('en-IN')}
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-xs text-gray-600">Remaining</p>
                        <p className="text-lg font-bold text-green-600">
                          ₹{team.remainingBudget.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <BarChart3 className="h-7 w-7 text-indigo-600" />
                  Auction Analytics
                </h2>

                {/* Top Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border-l-4 border-blue-500">
                    <p className="text-sm text-gray-600 mb-2">Total Money Spent</p>
                    <p className="text-3xl font-bold text-blue-600">
                      ₹{teams.reduce((acc, t) => acc + (t.budget - t.remainingBudget), 0).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border-l-4 border-purple-500">
                    <p className="text-sm text-gray-600 mb-2">Average Player Price</p>
                    <p className="text-3xl font-bold text-purple-600">
                      ₹{soldPlayers.length > 0 
                        ? (soldPlayers.reduce((acc, p) => acc + (p.soldPrice || 0), 0) / soldPlayers.length).toLocaleString('en-IN')
                        : 0
                      }
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-l-4 border-green-500">
                    <p className="text-sm text-gray-600 mb-2">Highest Bid</p>
                    <p className="text-3xl font-bold text-green-600">
                      ₹{soldPlayers.length > 0
                        ? Math.max(...soldPlayers.map(p => p.soldPrice || 0)).toLocaleString('en-IN')
                        : 0
                      }
                    </p>
                  </div>
                </div>

                {/* Most Expensive Players */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <DollarSign className="h-6 w-6 text-yellow-500" />
                    Most Expensive Players
                  </h3>
                  <div className="space-y-3">
                    {soldPlayers
                      .sort((a, b) => (b.soldPrice || 0) - (a.soldPrice || 0))
                      .slice(0, 5)
                      .map((player, index) => (
                        <div
                          key={player.id}
                          className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                              index === 0 ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' :
                              'bg-gray-300 text-gray-700'
                            }`}>
                              {index + 1}
                            </div>
                            <img
                              src={player.avatar}
                              alt={player.name}
                              className="h-12 w-12 rounded-full ring-2 ring-indigo-500"
                            />
                            <div>
                              <h4 className="font-bold text-gray-900">{player.name}</h4>
                              <p className="text-sm text-gray-600">{player.soldTo}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-indigo-600">
                              ₹{player.soldPrice?.toLocaleString('en-IN')}
                            </p>
                            <p className="text-sm text-green-600">
                              +{(((player.soldPrice || 0) - player.basePrice) / player.basePrice * 100).toFixed(0)}%
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ActionCard: React.FC<{
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
}> = ({ title, description, icon: Icon, href }) => (
  <a
    href={href}
    className="block bg-gradient-to-r from-gray-50 to-gray-100 hover:shadow-lg rounded-xl p-6 transition-all transform hover:scale-105"
  >
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 inline-flex p-3 rounded-lg mb-4">
      <Icon className="h-6 w-6 text-white" />
    </div>
    <h3 className="font-bold text-lg text-gray-900 mb-2">{title}</h3>
    <p className="text-sm text-gray-600">{description}</p>
  </a>
);
