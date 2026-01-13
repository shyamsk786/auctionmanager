import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Mail, Lock, UserCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { mockUsers } from '../data/mockData';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const { setCurrentUser } = useApp();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple authentication - in production, this would be a proper API call
    const user = mockUsers.find(u => u.email === email);
    
    if (user) {
      setCurrentUser(user);
      navigate('/');
    } else {
      alert('User not found. Try: admin@sportsbid.com or rajesh.sharma@example.com');
    }
  };

  const quickLogin = (userEmail: string) => {
    const user = mockUsers.find(u => u.email === userEmail);
    if (user) {
      setCurrentUser(user);
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-[#050b19] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.6]" style={{ backgroundImage: 'url("https://auctionspot.in/assets/bg-grid.svg")', backgroundSize: 'cover' }}></div>
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-[#7c5dfa] via-[#64d9ff] to-transparent"
            style={{
              width: Math.random() * 200 + 80,
              height: Math.random() * 200 + 80,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.12,
              filter: 'blur(40px)'
            }}
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 30 + 20,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative max-w-md w-full"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#0f1b34] border border-white/10 rounded-2xl mb-4 shadow-2xl">
            <Trophy className="h-8 w-8 text-[#64d9ff]" />
          </div>
          <p className="text-white/60 tracking-[0.3em] uppercase text-xs">Enterprise Sports Exchange</p>
          <h1 className="text-white text-2xl font-semibold mt-2 mb-1">AuctionSpot Live</h1>
          <p className="text-white/50 text-sm">Command your auctions with precision</p>
        </div>

        <div className="glass-panel p-8">
          <div className="text-left mb-6">
            <p className="text-white/40 uppercase tracking-[0.3em] text-xs">Secure Access</p>
            <h2 className="text-white text-xl font-semibold">{isLogin ? 'Sign Into Command Deck' : 'Create New Access'}</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-medium text-white/60 mb-2 uppercase tracking-[0.25em]">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#0f1b34] border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:border-[#64d9ff] focus:ring-0"
                  placeholder="rajesh.sharma@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-white/60 mb-2 uppercase tracking-[0.25em]">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#0f1b34] border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:border-[#64d9ff] focus:ring-0"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#64d9ff] to-[#7c5dfa] hover:from-[#7c5dfa] hover:to-[#64d9ff] text-[#050b19] font-semibold py-3 px-4 rounded-lg transition-all tracking-[0.3em] uppercase"
            >
              {isLogin ? 'Enter Command' : 'Create Access'}
            </button>
          </form>

          <div className="pt-6 border-t border-white/10">
            <div className="relative mb-6 text-center">
              <span className="text-white/40 uppercase tracking-[0.3em] text-xs">Quick Access</span>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => quickLogin('admin@sportsbid.com')}
                className="w-full flex items-center justify-between bg-[#0f1b34] border border-white/10 text-white py-3 px-4 rounded-lg hover:border-[#64d9ff]/60 transition-all"
              >
                <span className="flex items-center gap-2 text-xs uppercase tracking-[0.2em]">
                  <UserCircle className="h-4 w-4" /> Admin
                </span>
                <span className="text-white/40 text-xs">HQ Oversight</span>
              </button>
              <button
                onClick={() => quickLogin('rajesh.sharma@example.com')}
                className="w-full flex items-center justify-between bg-[#0f1b34] border border-white/10 text-white py-3 px-4 rounded-lg hover:border-[#64d9ff]/60 transition-all"
              >
                <span className="flex items-center gap-2 text-xs uppercase tracking-[0.2em]">
                  <UserCircle className="h-4 w-4" /> Rajesh
                </span>
                <span className="text-white/40 text-xs">Bid Captain</span>
              </button>
              <button
                onClick={() => quickLogin('priya.verma@example.com')}
                className="w-full flex items-center justify-between bg-[#0f1b34] border border-white/10 text-white py-3 px-4 rounded-lg hover:border-[#64d9ff]/60 transition-all"
              >
                <span className="flex items-center gap-2 text-xs uppercase tracking-[0.2em]">
                  <UserCircle className="h-4 w-4" /> Priya
                </span>
                <span className="text-white/40 text-xs">Bid Strategist</span>
              </button>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-[#64d9ff] hover:text-white font-medium text-xs tracking-[0.3em] uppercase"
              >
                {isLogin ? 'Request New Access' : 'Back to Login' }
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-white/30 mt-8 text-xs tracking-[0.3em] uppercase">
          © 2024 AuctionSpot. India Sports Exchange.
        </p>
      </motion.div>
    </div>
  );
};
