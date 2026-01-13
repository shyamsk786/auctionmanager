import { Player, Auction, User, Team, GameRating } from '../types';

const corporateFirstNames = [
  'Rajesh', 'Priya', 'Amit', 'Sneha', 'Vikram', 'Anjali', 'Arjun', 'Divya',
  'Karthik', 'Meera', 'Rohan', 'Kavya', 'Aditya', 'Ishita', 'Sanjay', 'Pooja',
  'Rahul', 'Nisha', 'Deepak', 'Riya', 'Manish', 'Shreya', 'Akash', 'Priyanka'
];

const corporateLastNames = [
  'Sharma', 'Verma', 'Patel', 'Kumar', 'Singh', 'Reddy', 'Iyer', 'Nair',
  'Gupta', 'Desai', 'Mehta', 'Agarwal', 'Joshi', 'Rao', 'Chopra', 'Malhotra'
];

const DEPARTMENTS = ['Engineering', 'Product', 'Sales', 'Marketing', 'HR', 'Finance', 'Operations'];
const LOCATIONS = ['Mumbai', 'Bengaluru', 'Delhi', 'Hyderabad', 'Pune', 'Chennai', 'Gurgaon'];
const MATCH_TEAMS = [
  'Mumbai Mavericks',
  'Bengaluru Blitz',
  'Delhi Dynamos',
  'Hyderabad Hurricanes',
  'Chennai Chargers',
  'Pune Panthers',
  'Kolkata Knights',
  'Jaipur Jaguars',
  'Lucknow Legends',
  'Goa Guardians',
  'Noida Nomads',
  'Indore Invincibles'
];
const GAME_SET: Array<GameRating['game']> = ['Cricket', 'Chess', 'Throwball', 'Table Tennis', 'Pool'];

const pickRandom = <T,>(source: T[]): T => source[Math.floor(Math.random() * source.length)];
const shuffle = <T,>(source: T[]) => [...source].sort(() => Math.random() - 0.5);

const COMPANY = 'AuctionSpot Enterprises';

const generatePlayer = (id: number, isCaptain: boolean = false): Player => {
  const firstName = pickRandom(corporateFirstNames);
  const lastName = pickRandom(corporateLastNames);
  const name = `${firstName} ${lastName}`;
  const matchTeam = pickRandom(MATCH_TEAMS);

  const games = shuffle(GAME_SET)
    .slice(0, Math.floor(Math.random() * 3) + 2)
    .map((game) => ({ game, rating: Math.floor(Math.random() * 6) + 5 })); // 5-10 scale

  const criteriaOptions: Array<Player['criteria']> = ['Elite', 'Professional', 'Intermediate', 'Beginner'];
  const genderOptions: Array<Player['gender']> = ['Male', 'Female'];
  const employmentOptions: Array<Player['employmentType']> = ['Full-time', 'Part-time', 'Contract'];

  return {
    id: `player-${id}`,
    name,
    entity: COMPANY,
    department: pickRandom(DEPARTMENTS),
    location: pickRandom(LOCATIONS),
    matchTeam,
    criteria: pickRandom(criteriaOptions),
    gender: pickRandom(genderOptions),
    employmentType: pickRandom(employmentOptions),
    games,
    isCaptain,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}-${id}`,
    brief: isCaptain
      ? `${firstName} leads the ${matchTeam} contingent with ruthless clarity and 360° tactical awareness across multi-sport grids.`
      : `${firstName} brings enterprise grit to ${matchTeam} with dependable execution and a passion for ${games[0].game}.`,
    basePrice: Math.floor(Math.random() * 40) + 10, // 10 - 49 credits
  };
};

const TOTAL_PLAYERS = 240;
const TOTAL_CAPTAINS = 20;

export const mockPlayers: Player[] = Array.from({ length: TOTAL_PLAYERS }, (_, index) =>
  generatePlayer(index + 1, index < TOTAL_CAPTAINS)
);

export const mockTeams: Team[] = [
  {
    id: 'team-1',
    name: 'Mumbai Mavericks',
    ownerId: 'user-1',
    ownerName: 'Rajesh Sharma',
    budget: 500,
    remainingBudget: 500,
    players: [],
    maxPlayers: 11,
  },
  {
    id: 'team-2',
    name: 'Bengaluru Blitz',
    ownerId: 'user-2',
    ownerName: 'Priya Verma',
    budget: 500,
    remainingBudget: 500,
    players: [],
    maxPlayers: 11,
  },
  {
    id: 'team-3',
    name: 'Delhi Dynamos',
    ownerId: 'user-3',
    ownerName: 'Amit Patel',
    budget: 500,
    remainingBudget: 500,
    players: [],
    maxPlayers: 11,
  },
  {
    id: 'team-4',
    name: 'Hyderabad Hurricanes',
    ownerId: 'user-4',
    ownerName: 'Sneha Kumar',
    budget: 500,
    remainingBudget: 500,
    players: [],
    maxPlayers: 11,
  },
];

export const mockAuction: Auction = {
  id: 'auction-1',
  name: 'AuctionSpot Premier Credits Auction',
  description: 'Enterprise-grade live auction where squads draft Indian athletes with credit precision.',
  status: 'draft',
  playerIds: mockPlayers.filter((p) => !p.isCaptain).map((p) => p.id),
  rules: {
    minBidIncrement: 5,
    maxPlayersPerTeam: 11,
    initialBudget: 500,
    bidTimeout: 30,
    allowAutoBid: true,
  },
  teams: mockTeams,
};

export const mockUsers: User[] = [
  {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@sportsbid.com',
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
  },
  {
    id: 'user-1',
    name: 'Rajesh Sharma',
    email: 'rajesh.sharma@example.com',
    role: 'bidder',
    teamName: 'Mumbai Mavericks',
    budget: 500,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh',
  },
  {
    id: 'user-2',
    name: 'Priya Verma',
    email: 'priya.verma@example.com',
    role: 'bidder',
    teamName: 'Bengaluru Blitz',
    budget: 500,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
  },
  {
    id: 'user-3',
    name: 'Amit Patel',
    email: 'amit.patel@example.com',
    role: 'bidder',
    teamName: 'Delhi Dynamos',
    budget: 500,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amit',
  },
  {
    id: 'user-4',
    name: 'Sneha Kumar',
    email: 'sneha.kumar@example.com',
    role: 'bidder',
    teamName: 'Hyderabad Hurricanes',
    budget: 500,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha',
  },
];
