import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Calendar, Settings, DollarSign, Users, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Auction, AuctionRules } from '../types';

export const AuctionSetup: React.FC = () => {
  const { auction, setAuction, players } = useApp();
  const navigate = useNavigate();

  const [name, setName] = useState(auction?.name || '');
  const [description, setDescription] = useState(auction?.description || '');
  const [minBidIncrement, setMinBidIncrement] = useState(auction?.rules.minBidIncrement || 5000);
  const [maxPlayersPerTeam, setMaxPlayersPerTeam] = useState(auction?.rules.maxPlayersPerTeam || 11);
  const [initialBudget, setInitialBudget] = useState(auction?.rules.initialBudget || 500000);
  const [bidTimeout, setBidTimeout] = useState(auction?.rules.bidTimeout || 30);
  const [allowAutoBid, setAllowAutoBid] = useState<boolean>(auction?.rules.allowAutoBid ?? true);

  const handleSaveAuction = () => {
    const rules: AuctionRules = {
      minBidIncrement,
      maxPlayersPerTeam,
      initialBudget,
      bidTimeout,
      allowAutoBid,
    };

    const newAuction: Auction = {
      id: auction?.id || `auction-${Date.now()}`,
      name,
      description,
      status: 'draft',
      playerIds: auction?.playerIds || players.map(p => p.id),
      rules,
      teams: auction?.teams || [],
    };

    setAuction(newAuction);
    alert('Auction settings saved successfully!');
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Auction Setup</h1>
          <p className="text-gray-600 text-lg">Configure your auction settings and rules</p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <div className="space-y-8">
            {/* Basic Info Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Calendar className="h-6 w-6 text-indigo-600" />
                Basic Information
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Auction Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Corporate Sports League 2024"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your auction..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Auction Rules Section */}
            <div className="border-t pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Settings className="h-6 w-6 text-purple-600" />
                Auction Rules
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-indigo-600 p-2 rounded-lg">
                      <DollarSign className="h-5 w-5 text-white" />
                    </div>
                    <label className="block text-sm font-bold text-gray-900">
                      Minimum Bid Increment
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">₹</span>
                    <input
                      type="number"
                      value={minBidIncrement}
                      onChange={(e) => setMinBidIncrement(Number(e.target.value))}
                      step="1000"
                      min="1000"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    Minimum amount each bid must increase
                  </p>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-blue-600 p-2 rounded-lg">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <label className="block text-sm font-bold text-gray-900">
                      Max Players Per Team
                    </label>
                  </div>
                  <input
                    type="number"
                    value={maxPlayersPerTeam}
                    onChange={(e) => setMaxPlayersPerTeam(Number(e.target.value))}
                    min="1"
                    max="20"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-600 mt-2">
                    Maximum squad size for each team
                  </p>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-green-600 p-2 rounded-lg">
                      <DollarSign className="h-5 w-5 text-white" />
                    </div>
                    <label className="block text-sm font-bold text-gray-900">
                      Initial Team Budget
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">₹</span>
                    <input
                      type="number"
                      value={initialBudget}
                      onChange={(e) => setInitialBudget(Number(e.target.value))}
                      step="50000"
                      min="100000"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    Starting budget for each team
                  </p>
                </div>

                <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-orange-600 p-2 rounded-lg">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                    <label className="block text-sm font-bold text-gray-900">
                      Bid Timeout (seconds)
                    </label>
                  </div>
                  <input
                    type="number"
                    value={bidTimeout}
                    onChange={(e) => setBidTimeout(Number(e.target.value))}
                    min="10"
                    max="120"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-600 mt-2">
                    Time limit for each player auction
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allowAutoBid}
                    onChange={(e) => setAllowAutoBid(e.target.checked)}
                    className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <span className="text-gray-900 font-medium">
                    Allow Auto-Bidding
                  </span>
                </label>
                <p className="text-sm text-gray-600 ml-8 mt-1">
                  Enable teams to set automatic bids up to a maximum amount
                </p>
              </div>
            </div>

            {/* Summary Section */}
            <div className="border-t pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Summary</h2>
              
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border-l-4 border-indigo-600">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Total Players</p>
                    <p className="text-2xl font-bold text-gray-900">{players.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Budget Per Team</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ₹{initialBudget.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Squad Size</p>
                    <p className="text-2xl font-bold text-gray-900">{maxPlayersPerTeam}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Min Increment</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ₹{minBidIncrement.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Timer</p>
                    <p className="text-2xl font-bold text-gray-900">{bidTimeout}s</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Auto-Bid</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {allowAutoBid ? '✓ Enabled' : '✗ Disabled'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleSaveAuction}
                disabled={!name}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-8 rounded-lg transition-all transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
              >
                <Save className="h-5 w-5" />
                Save Auction Settings
              </button>
              <button
                onClick={() => navigate('/admin')}
                className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>

        {/* Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-white rounded-xl shadow p-6 border-l-4 border-blue-500">
            <h3 className="font-bold text-gray-900 mb-2">💡 Tip: Budget Planning</h3>
            <p className="text-sm text-gray-600">
              Set initial budget considering total players and max squad size. Recommended: ₹5,00,000 for 11 players.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 border-l-4 border-purple-500">
            <h3 className="font-bold text-gray-900 mb-2">⏱️ Tip: Timer Settings</h3>
            <p className="text-sm text-gray-600">
              30 seconds is ideal for fast-paced auctions. Increase to 60s for strategic bidding.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 border-l-4 border-green-500">
            <h3 className="font-bold text-gray-900 mb-2">🎯 Tip: Bid Increment</h3>
            <p className="text-sm text-gray-600">
              Keep increment at 1-2% of initial budget for competitive bidding without runaway prices.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
