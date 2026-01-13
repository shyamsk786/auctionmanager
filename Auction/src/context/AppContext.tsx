import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Player, Auction, Bid, Notification, Team, AutoBid } from '../types';
import { mockPlayers, mockAuction, mockTeams } from '../data/mockData';

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  players: Player[];
  setPlayers: (players: Player[]) => void;
  auction: Auction | null;
  setAuction: (auction: Auction | null) => void;
  bids: Bid[];
  addBid: (bid: Bid) => void;
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  markNotificationRead: (id: string) => void;
  teams: Team[];
  updateTeam: (teamId: string, updates: Partial<Team>) => void;
  autoBids: AutoBid[];
  setAutoBid: (autoBid: AutoBid) => void;
  removeAutoBid: (playerId: string) => void;
  currentPlayerIndex: number;
  setCurrentPlayerIndex: (index: number) => void;
  timeLeft: number;
  setTimeLeft: (time: number) => void;
  isTimerRunning: boolean;
  setIsTimerRunning: (running: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [players, setPlayers] = useState<Player[]>(mockPlayers);
  const [auction, setAuction] = useState<Auction | null>(mockAuction);
  const [bids, setBids] = useState<Bid[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [teams, setTeams] = useState<Team[]>(mockTeams);
  const [autoBids, setAutoBids] = useState<AutoBid[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const addBid = (bid: Bid) => {
    setBids(prev => [...prev, bid]);
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const updateTeam = (teamId: string, updates: Partial<Team>) => {
    setTeams(prev =>
      prev.map(team =>
        team.id === teamId ? { ...team, ...updates } : team
      )
    );
  };

  const setAutoBid = (autoBid: AutoBid) => {
    setAutoBids(prev => {
      const existing = prev.find(ab => ab.playerId === autoBid.playerId);
      if (existing) {
        return prev.map(ab =>
          ab.playerId === autoBid.playerId ? autoBid : ab
        );
      }
      return [...prev, autoBid];
    });
  };

  const removeAutoBid = (playerId: string) => {
    setAutoBids(prev => prev.filter(ab => ab.playerId !== playerId));
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        players,
        setPlayers,
        auction,
        setAuction,
        bids,
        addBid,
        notifications,
        addNotification,
        markNotificationRead,
        teams,
        updateTeam,
        autoBids,
        setAutoBid,
        removeAutoBid,
        currentPlayerIndex,
        setCurrentPlayerIndex,
        timeLeft,
        setTimeLeft,
        isTimerRunning,
        setIsTimerRunning,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
