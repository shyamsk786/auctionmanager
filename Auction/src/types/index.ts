export type UserRole = 'admin' | 'bidder' | 'viewer';

export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract';

export type Gender = 'Male' | 'Female' | 'Other';

export type PlayerCriteria = 'Elite' | 'Professional' | 'Intermediate' | 'Beginner';

export type GameType = 'Cricket' | 'Chess' | 'Throwball' | 'Table Tennis' | 'Pool';

export type AuctionStatus = 'draft' | 'scheduled' | 'live' | 'paused' | 'completed';

export type BidStatus = 'pending' | 'winning' | 'outbid' | 'won' | 'lost';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  teamName?: string;
  budget?: number;
  avatar?: string;
}

export interface GameRating {
  game: GameType;
  rating: number;
}

export interface Player {
  id: string;
  name: string;
  entity: string;
  department: string;
  location: string;
  matchTeam: string;
  criteria: PlayerCriteria;
  gender: Gender;
  employmentType: EmploymentType;
  games: GameRating[];
  isCaptain?: boolean;
  avatar?: string;
  brief?: string;
  basePrice: number;
  currentBid?: number;
  soldTo?: string;
  soldPrice?: number;
}

export interface Bid {
  id: string;
  playerId: string;
  auctionId: string;
  bidderId: string;
  bidderName: string;
  amount: number;
  timestamp: number;
  isAutoBid?: boolean;
}

export interface Auction {
  id: string;
  name: string;
  description: string;
  status: AuctionStatus;
  scheduledTime?: number;
  startTime?: number;
  endTime?: number;
  currentPlayerId?: string;
  playerIds: string[];
  rules: AuctionRules;
  teams: Team[];
}

export interface AuctionRules {
  minBidIncrement: number;
  maxPlayersPerTeam: number;
  initialBudget: number;
  bidTimeout: number; // in seconds
  allowAutoBid: boolean;
}

export interface Team {
  id: string;
  name: string;
  ownerId: string;
  ownerName: string;
  budget: number;
  remainingBudget: number;
  players: Player[];
  maxPlayers: number;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'bid' | 'outbid' | 'won' | 'auction_start' | 'auction_end' | 'info';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  link?: string;
}

export interface AutoBid {
  playerId: string;
  maxAmount: number;
  active: boolean;
}
