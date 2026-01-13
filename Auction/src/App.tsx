import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Players } from './pages/Players';
import { PlayerProfile } from './pages/PlayerProfile';
import { LiveAuction } from './pages/LiveAuction';
import { MyTeam } from './pages/MyTeam';
import { Admin } from './pages/Admin';
import { AuctionSetup } from './pages/AuctionSetup';

const AppRoutes: React.FC = () => {
  const { currentUser } = useApp();

  if (!currentUser) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/players" element={<Players />} />
        <Route path="/player/:id" element={<PlayerProfile />} />
        <Route path="/live-auction" element={<LiveAuction />} />
        
        {currentUser.role === 'bidder' && (
          <Route path="/my-team" element={<MyTeam />} />
        )}
        
        {currentUser.role === 'admin' && (
          <>
            <Route path="/admin" element={<Admin />} />
            <Route path="/auction-setup" element={<AuctionSetup />} />
          </>
        )}
        
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
};
