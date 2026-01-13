import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Clock, Gavel, TrendingUp, Users, DollarSign, Play, Pause, SkipForward } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Bid } from '../types';

export const LiveAuction: React.FC = () => {
  const {
    auction,
    setAuction,
    players,
    setPlayers,
    currentUser,
    teams,
    updateTeam,
    bids,
    addBid,
    addNotification,
    currentPlayerIndex,
    setCurrentPlayerIndex,
    timeLeft,
    setTimeLeft,
    isTimerRunning,
    setIsTimerRunning,
  } = useApp();

  const [bidAmount, setBidAmount] = useState(0);

  const currentPlayer = auction?.playerIds[currentPlayerIndex]
    ? players.find(p => p.id === auction.playerIds[currentPlayerIndex])
    : null;

  const currentPlayerBids = bids.filter(b => b.playerId === currentPlayer?.id).sort((a, b) => b.timestamp - a.timestamp);
  const highestBid = currentPlayerBids[0];
  const userTeam = teams.find(t => t.ownerId === currentUser?.id);

  // Timer Logic
  useEffect(() => {
    if (isTimerRunning && timeLeft > 0 && auction?.status === 'live') {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && auction?.status === 'live' && currentPlayer) {
      // Auto-sell to highest bidder
      handleSoldPlayer();
    }
  }, [isTimerRunning, timeLeft, auction?.status]);

  // Initialize bid amount when player changes
  useEffect(() => {
    if (currentPlayer) {
      const minBid = highestBid 
        ? highestBid.amount + (auction?.rules.minBidIncrement || 5000)
        : currentPlayer.basePrice;
      setBidAmount(minBid);
    }
  }, [currentPlayer, highestBid, auction]);

  const handleStartAuction = () => {
    if (auction) {
      setAuction({ ...auction, status: 'live', startTime: Date.now() });
      setIsTimerRunning(true);
      setTimeLeft(auction.rules.bidTimeout);
      addNotification({
        userId: 'all',
        type: 'auction_start',
        title: 'Auction Started!',
        message: `${auction.name} has begun. Happy bidding!`,
        read: false,
      });
    }
  };

  const handlePauseAuction = () => {
    if (auction) {
      setAuction({ ...auction, status: 'paused' });
      setIsTimerRunning(false);
    }
  };

  const handleResumeAuction = () => {
    if (auction) {
      setAuction({ ...auction, status: 'live' });
      setIsTimerRunning(true);
    }
  };

  const handlePlaceBid = () => {
    if (!currentPlayer || !currentUser || !userTeam || !auction) return;

    const minBid = highestBid 
      ? highestBid.amount + auction.rules.minBidIncrement
      : currentPlayer.basePrice;

    if (bidAmount < minBid) {
      alert(`Minimum bid is ₹${minBid.toLocaleString('en-IN')}`);
      return;
    }

    if (bidAmount > userTeam.remainingBudget) {
      alert('Insufficient budget!');
      return;
    }

    const newBid: Bid = {
      id: `bid-${Date.now()}`,
      playerId: currentPlayer.id,
      auctionId: auction.id,
      bidderId: currentUser.id,
      bidderName: currentUser.name,
      amount: bidAmount,
      timestamp: Date.now(),
    };

    addBid(newBid);
    
    // Notify previous bidder they've been outbid
    if (highestBid) {
      addNotification({
        userId: highestBid.bidderId,
        type: 'outbid',
        title: 'You have been outbid!',
        message: `${currentUser.name} bid ₹${bidAmount.toLocaleString('en-IN')} for ${currentPlayer.name}`,
        read: false,
      });
    }

    // Reset timer
    setTimeLeft(auction.rules.bidTimeout);
    
    // Update bid amount to next increment
    setBidAmount(bidAmount + auction.rules.minBidIncrement);
  };

  const handleSoldPlayer = () => {
    if (!currentPlayer || !auction) return;

    if (highestBid) {
      // Sold to highest bidder
      const winningTeam = teams.find(t => t.ownerId === highestBid.bidderId);
      if (winningTeam) {
        const updatedPlayer = {
          ...currentPlayer,
          soldTo: winningTeam.name,
          soldPrice: highestBid.amount,
        };

        setPlayers(players.map(p => p.id === currentPlayer.id ? updatedPlayer : p));
        
        updateTeam(winningTeam.id, {
          players: [...winningTeam.players, updatedPlayer],
          remainingBudget: winningTeam.remainingBudget - highestBid.amount,
        });

        addNotification({
          userId: highestBid.bidderId,
          type: 'won',
          title: 'Player Acquired!',
          message: `Congratulations! You won ${currentPlayer.name} for ₹${highestBid.amount.toLocaleString('en-IN')}`,
          read: false,
        });
      }
    }

    // Move to next player
    handleNextPlayer();
  };

  const handleNextPlayer = () => {
    if (!auction) return;

    if (currentPlayerIndex < auction.playerIds.length - 1) {
      setCurrentPlayerIndex(currentPlayerIndex + 1);
      setTimeLeft(auction.rules.bidTimeout);
    } else {
      // Auction complete
      setAuction({ ...auction, status: 'completed', endTime: Date.now() });
      setIsTimerRunning(false);
      addNotification({
        userId: 'all',
        type: 'auction_end',
        title: 'Auction Completed!',
        message: 'All players have been auctioned. Check the results!',
        read: false,
      });
    }
  };

  if (!auction) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">No Auction Available</h2>
          <p className="text-gray-600">Please wait for an auction to be scheduled.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Trophy className="h-12 w-12 text-yellow-400" />
            {auction.name}
          </h1>
          <p className="text-gray-300 text-xl">{auction.description}</p>
        </motion.div>

        {/* Status Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-2xl p-6 mb-8"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className={`h-4 w-4 rounded-full ${
                auction.status === 'live' ? 'bg-red-500 animate-pulse' :
                auction.status === 'paused' ? 'bg-yellow-500' :
                auction.status === 'completed' ? 'bg-green-500' :
                'bg-gray-400'
              }`}></div>
              <span className="text-2xl font-bold text-gray-900 capitalize">{auction.status}</span>
            </div>

            {currentUser?.role === 'admin' && (
              <div className="flex gap-2">
                {auction.status === 'draft' && (
                  <button
                    onClick={handleStartAuction}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                  >
                    <Play className="h-5 w-5" />
                    Start Auction
                  </button>
                )}
                {auction.status === 'live' && (
                  <button
                    onClick={handlePauseAuction}
                    className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                  >
                    <Pause className="h-5 w-5" />
                    Pause
                  </button>
                )}
                {auction.status === 'paused' && (
                  <button
                    onClick={handleResumeAuction}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                  >
                    <Play className="h-5 w-5" />
                    Resume
                  </button>
                )}
                {auction.status === 'live' && (
                  <>
                    <button
                      onClick={handleSoldPlayer}
                      className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                    >
                      <Gavel className="h-5 w-5" />
                      Sold
                    </button>
                    <button
                      onClick={handleNextPlayer}
                      className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                    >
                      <SkipForward className="h-5 w-5" />
                      Skip
                    </button>
                  </>
                )}
              </div>
            )}

            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-sm text-gray-600">Player</p>
                <p className="text-2xl font-bold text-gray-900">
                  {currentPlayerIndex + 1} / {auction.playerIds.length}
                </p>
              </div>
              {auction.status === 'live' && (
                <div className="text-center">
                  <p className="text-sm text-gray-600">Time Left</p>
                  <div className="flex items-center gap-2">
                    <Clock className={`h-6 w-6 ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-indigo-600'}`} />
                    <p className={`text-3xl font-bold ${timeLeft <= 10 ? 'text-red-500' : 'text-indigo-600'}`}>
                      {timeLeft}s
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Current Player Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            {currentPlayer ? (
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="relative h-96 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <img
                    src={currentPlayer.avatar}
                    alt={currentPlayer.name}
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-80 w-80 rounded-full border-8 border-white shadow-2xl"
                  />
                  {currentPlayer.isCaptain && (
                    <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-6 py-3 rounded-full font-bold text-lg flex items-center gap-2">
                      <Trophy className="h-6 w-6" />
                      CAPTAIN
                    </div>
                  )}
                </div>

                <div className="p-8">
                  <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center">{currentPlayer.name}</h2>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4">
                      <p className="text-sm text-gray-600">Entity</p>
                      <p className="text-lg font-bold text-gray-900">{currentPlayer.entity}</p>
                    </div>
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4">
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="text-lg font-bold text-gray-900">{currentPlayer.location}</p>
                    </div>
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4">
                      <p className="text-sm text-gray-600">Department</p>
                      <p className="text-lg font-bold text-gray-900">{currentPlayer.department}</p>
                    </div>
                    <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4">
                      <p className="text-sm text-gray-600">Criteria</p>
                      <p className="text-lg font-bold text-gray-900">{currentPlayer.criteria}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Games & Ratings</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {currentPlayer.games.map((game, idx) => (
                        <div key={idx} className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm font-semibold text-gray-700">{game.game}</p>
                          <p className="text-2xl font-bold text-indigo-600">{game.rating}/10</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg text-gray-600">Base Price</span>
                      <span className="text-3xl font-bold text-indigo-600">
                        ₹{currentPlayer.basePrice.toLocaleString('en-IN')}
                      </span>
                    </div>
                    
                    {highestBid && (
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm text-gray-600">Current Highest Bid</p>
                            <p className="text-sm font-semibold text-gray-700">{highestBid.bidderName}</p>
                          </div>
                          <p className="text-3xl font-bold text-green-600">
                            ₹{highestBid.amount.toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                    )}

                    {auction.status === 'live' && currentUser?.role === 'bidder' && userTeam && (
                      <div className="mt-6 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Your Bid Amount
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="number"
                              value={bidAmount}
                              onChange={(e) => setBidAmount(Number(e.target.value))}
                              step={auction.rules.minBidIncrement}
                              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-xl font-bold"
                            />
                            <button
                              onClick={handlePlaceBid}
                              disabled={bidAmount > userTeam.remainingBudget}
                              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105 disabled:scale-100"
                            >
                              <Gavel className="h-6 w-6" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Your Budget: ₹{userTeam.remainingBudget.toLocaleString('en-IN')}</span>
                          <span className="text-gray-600">Min Increment: ₹{auction.rules.minBidIncrement.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-2xl p-12 text-center">
                <Trophy className="h-24 w-24 text-gray-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Auction Completed!</h3>
                <p className="text-gray-600">All players have been auctioned.</p>
              </div>
            )}
          </motion.div>

          {/* Sidebar - Bid History & Teams */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Bid History */}
            <div className="bg-white rounded-2xl shadow-2xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-indigo-600" />
                Bid History
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                <AnimatePresence>
                  {currentPlayerBids.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No bids yet</p>
                  ) : (
                    currentPlayerBids.map((bid, index) => (
                      <motion.div
                        key={bid.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className={`p-3 rounded-lg ${
                          index === 0 ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300' : 'bg-gray-50'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-900">{bid.bidderName}</span>
                          <span className={`font-bold ${index === 0 ? 'text-green-600 text-lg' : 'text-gray-700'}`}>
                            ₹{bid.amount.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(bid.timestamp).toLocaleTimeString()}
                        </p>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Teams Overview */}
            <div className="bg-white rounded-2xl shadow-2xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="h-6 w-6 text-purple-600" />
                Teams
              </h3>
              <div className="space-y-3">
                {teams.map((team) => (
                  <div key={team.id} className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-gray-900">{team.name}</h4>
                      <span className="text-sm bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-semibold">
                        {team.players.length}/{team.maxPlayers}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <DollarSign className="h-4 w-4" />
                      <span>₹{team.remainingBudget.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
