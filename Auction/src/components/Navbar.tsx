import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Trophy, Bell, LogOut, Menu, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar: React.FC = () => {
  const { currentUser, setCurrentUser, notifications } = useApp();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const isActive = (path: string) => location.pathname === path;

  if (!currentUser) return null;

  return (
    <nav className="bg-[#050b19]/95 backdrop-blur-xl border-b border-white/10 text-white shadow-2xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-[#111f3d] border border-white/10 p-2 rounded-xl group-hover:scale-110 transition-transform shadow-lg">
              <Trophy className="h-5 w-5 text-[#64d9ff]" />
            </div>
            <span className="text-lg font-semibold tracking-[0.2em] uppercase text-white">
              AUCTIONSPOT LIVE
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLink to="/" active={isActive('/')}>Command</NavLink>
            {currentUser.role === 'admin' && (
              <>
                <NavLink to="/admin" active={isActive('/admin')}>Control</NavLink>
                <NavLink to="/auction-setup" active={isActive('/auction-setup')}>Rules</NavLink>
              </>
            )}
            {currentUser.role === 'bidder' && (
              <NavLink to="/my-team" active={isActive('/my-team')}>Crew</NavLink>
            )}
            <NavLink to="/players" active={isActive('/players')}>Roster</NavLink>
            <NavLink to="/live-auction" active={isActive('/live-auction')}>Live Room</NavLink>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Bell className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl overflow-hidden"
                  >
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3">
                      <h3 className="text-white font-semibold">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-gray-500 text-center">No notifications</div>
                      ) : (
                        notifications.slice(0, 10).map(notif => (
                          <div
                            key={notif.id}
                            className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${
                              !notif.read ? 'bg-blue-50' : ''
                            }`}
                          >
                            <p className="font-semibold text-gray-900 text-sm">{notif.title}</p>
                            <p className="text-gray-600 text-xs mt-1">{notif.message}</p>
                            <p className="text-gray-400 text-xs mt-1">
                              {new Date(notif.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-3 bg-[#111f3d] border border-white/5 rounded-lg px-3 py-2">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="h-8 w-8 rounded-full ring-2 ring-[#64d9ff]"
              />
              <div className="hidden lg:block">
                <p className="text-sm font-semibold text-white">{currentUser.name}</p>
                <p className="text-xs text-white/50 uppercase">{currentUser.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="h-5 w-5 text-white/70" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 hover:bg-white/10 rounded-lg"
            >
              {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-indigo-950 border-t border-white/10"
          >
            <div className="px-4 py-3 space-y-2">
              <MobileNavLink to="/" active={isActive('/')} onClick={() => setShowMobileMenu(false)}>
                Dashboard
              </MobileNavLink>
              {currentUser.role === 'admin' && (
                <>
                  <MobileNavLink to="/admin" active={isActive('/admin')} onClick={() => setShowMobileMenu(false)}>
                    Admin Panel
                  </MobileNavLink>
                  <MobileNavLink to="/auction-setup" active={isActive('/auction-setup')} onClick={() => setShowMobileMenu(false)}>
                    Setup Auction
                  </MobileNavLink>
                </>
              )}
              {currentUser.role === 'bidder' && (
                <MobileNavLink to="/my-team" active={isActive('/my-team')} onClick={() => setShowMobileMenu(false)}>
                  My Team
                </MobileNavLink>
              )}
              <MobileNavLink to="/players" active={isActive('/players')} onClick={() => setShowMobileMenu(false)}>
                Players
              </MobileNavLink>
              <MobileNavLink to="/live-auction" active={isActive('/live-auction')} onClick={() => setShowMobileMenu(false)}>
                Live Auction
              </MobileNavLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const NavLink: React.FC<{ to: string; active: boolean; children: React.ReactNode }> = ({ to, active, children }) => (
  <Link
    to={to}
    className={`px-4 py-2 rounded-lg font-medium uppercase tracking-wide transition-all ${
      active
        ? 'bg-white/10 text-[#64d9ff]'
        : 'text-white/70 hover:bg-white/5 hover:text-white'
    }`}
  >
    {children}
  </Link>
);

const MobileNavLink: React.FC<{ to: string; active: boolean; children: React.ReactNode; onClick: () => void }> = ({ to, active, children, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`block px-4 py-2 rounded-lg font-semibold uppercase tracking-wide transition-all ${
      active
        ? 'bg-white/10 text-[#64d9ff]'
        : 'text-white/60 hover:bg-white/5 hover:text-white'
    }`}
  >
    {children}
  </Link>
);
