import express from "express";
import cors from "cors";
import { randomUUID } from "crypto";

// --- Types ---------------------------------------------------------------

type UserRole = "admin" | "bidder" | "viewer";

type GameType =
  | "Cricket"
  | "Football"
  | "Basketball"
  | "Tennis"
  | "Badminton"
  | "Hockey";

type Gender = "Male" | "Female" | "Other";

type EmploymentType = "Full-time" | "Part-time" | "Contract";

type PlayerCriteria = "Elite" | "Professional" | "Intermediate" | "Beginner";

type AuctionStatus =
  | "draft"
  | "scheduled"
  | "live"
  | "paused"
  | "completed"
  | "archived";

type NotificationType =
  | "bid"
  | "outbid"
  | "won"
  | "auction_start"
  | "auction_end"
  | "info";

interface GameRating {
  game: GameType;
  rating: number; // 1-10
}

interface Player {
  id: string;
  name: string;
  entity: string;
  department: string;
  location: string;
  criteria: PlayerCriteria;
  gender: Gender;
  employmentType: EmploymentType;
  games: GameRating[];
  isCaptain?: boolean;
  avatar: string;
  brief: string;
  sportCategory: GameType;
  basePrice: number;
  currentBid?: number;
  soldTo?: string;
  soldPrice?: number;
}

interface Team {
  id: string;
  name: string;
  ownerId: string;
  ownerName: string;
  location: string;
  budget: number;
  remainingBudget: number;
  players: string[]; // player IDs
  captainId?: string;
  sportFocus: GameType[];
}

interface AuctionRules {
  minBidIncrement: number;
  maxPlayersPerTeam: number;
  initialBudget: number;
  bidTimeout: number; // seconds
  allowAutoBid: boolean;
  maxAutoBidPercentage: number; // % of remaining budget
  leagueName: string;
}

interface AuctionTimelineStage {
  key:
    | "auction_setup"
    | "team_registration"
    | "auction_start"
    | "bidding_process"
    | "player_allocation"
    | "auction_continuation"
    | "post_auction_results"
    | "tournament_integration";
  title: string;
  description: string;
  status: "pending" | "active" | "complete";
}

interface Auction {
  id: string;
  name: string;
  description: string;
  status: AuctionStatus;
  scheduledTime?: number;
  startTime?: number;
  endTime?: number;
  playerIds: string[];
  currentPlayerId?: string;
  rules: AuctionRules;
  timeline: AuctionTimelineStage[];
}

interface Bid {
  id: string;
  auctionId: string;
  playerId: string;
  bidderId: string;
  bidderName: string;
  amount: number;
  timestamp: number;
  isAutoBid?: boolean;
}

interface Notification {
  id: string;
  userId: string | "all";
  type: NotificationType;
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  payload?: Record<string, unknown>;
}

interface AutoBidConfig {
  id: string;
  auctionId: string;
  playerId: string;
  teamId: string;
  maxAmount: number;
  active: boolean;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  teamId?: string;
  avatar: string;
}

// --- Mock Data -----------------------------------------------------------

const indianCities = [
  "Mumbai",
  "Bengaluru",
  "Delhi",
  "Hyderabad",
  "Chennai",
  "Pune",
  "Gurgaon",
];

const entities = [
  "Infosys",
  "TCS",
  "HCL",
  "Accenture",
  "Wipro",
  "Tech Mahindra",
  "Reliance",
];

const departments = [
  "Engineering",
  "Product",
  "Marketing",
  "Sales",
  "Finance",
  "HR",
  "Operations",
];

const avatars = [
  "https://res.cloudinary.com/dv1eyqkzf/image/upload/v1738456202/auctionspot/captain-01.png",
  "https://res.cloudinary.com/dv1eyqkzf/image/upload/v1738456202/auctionspot/captain-02.png",
  "https://res.cloudinary.com/dv1eyqkzf/image/upload/v1738456202/auctionspot/captain-03.png",
  "https://res.cloudinary.com/dv1eyqkzf/image/upload/v1738456202/auctionspot/captain-04.png",
];

const randomFrom = <T,>(list: T[]): T => list[Math.floor(Math.random() * list.length)];

const sportList: GameType[] = [
  "Cricket",
  "Football",
  "Basketball",
  "Tennis",
  "Badminton",
  "Hockey",
];

const criteriaList: PlayerCriteria[] = [
  "Elite",
  "Professional",
  "Intermediate",
  "Beginner",
];

const genderList: Gender[] = ["Male", "Female"];
const employmentList: EmploymentType[] = [
  "Full-time",
  "Part-time",
  "Contract",
];

const generatePlayer = (index: number): Player => {
  const sport = randomFrom(sportList);
  const rating = () => Math.floor(Math.random() * 6) + 5; // 5-10
  const games: GameRating[] = Array.from(
    new Set([
      sport,
      randomFrom(sportList),
      randomFrom(sportList),
    ])
  )
    .slice(0, 4)
    .map((game) => ({ game, rating: rating() }));

  return {
    id: `player-${index}`,
    name: `${randomFrom([
      "Raj",
      "Priya",
      "Arjun",
      "Sneha",
      "Vikram",
      "Ishita",
      "Kabir",
      "Meera",
      "Dev",
      "Trisha",
    ])} ${randomFrom([
      "Sharma",
      "Verma",
      "Singh",
      "Patel",
      "Iyer",
      "Reddy",
      "Menon",
      "Desai",
      "Chowdhury",
      "Nair",
    ])}`,
    entity: randomFrom(entities),
    department: randomFrom(departments),
    location: randomFrom(indianCities),
    criteria: randomFrom(criteriaList),
    gender: randomFrom(genderList),
    employmentType: randomFrom(employmentList),
    games,
    isCaptain: index === 1,
    avatar: avatars[index % avatars.length],
    brief:
      "Indian enterprise athlete bringing clutch performances in inter-corporate leagues with proven leadership impact.",
    sportCategory: sport,
    basePrice: 10000 + Math.floor(Math.random() * 40000),
  };
};

const players: Player[] = Array.from({ length: 30 }).map((_, index) =>
  generatePlayer(index + 1)
);

const teams: Team[] = [
  {
    id: "team-umumba",
    name: "U Mumba Titans",
    ownerId: "user-admin",
    ownerName: "AuctionSpot Control",
    location: "Mumbai",
    budget: 500000,
    remainingBudget: 500000,
    players: [],
    captainId: players[0].id,
    sportFocus: ["Cricket", "Badminton"],
  },
  {
    id: "team-indiabulls",
    name: "Bengaluru Blitz",
    ownerId: "user-priya",
    ownerName: "Priya Verma",
    location: "Bengaluru",
    budget: 500000,
    remainingBudget: 500000,
    players: [],
    sportFocus: ["Football", "Basketball"],
  },
];

const baseTimeline: AuctionTimelineStage[] = [
  {
    key: "auction_setup",
    title: "Auction Setup",
    description: "Configure rules, budgets, and player pool",
    status: "complete",
  },
  {
    key: "team_registration",
    title: "Team Registration",
    description: "Captains register budgets and squad needs",
    status: "complete",
  },
  {
    key: "auction_start",
    title: "Auction Start",
    description: "Auctioneer opens live room",
    status: "active",
  },
  {
    key: "bidding_process",
    title: "Bidding Process",
    description: "Live bidding with countdown timers",
    status: "pending",
  },
  {
    key: "player_allocation",
    title: "Player Allocation",
    description: "Winners assigned to team budgets",
    status: "pending",
  },
  {
    key: "auction_continuation",
    title: "Auction Continuation",
    description: "Repeat until squads are filled",
    status: "pending",
  },
  {
    key: "post_auction_results",
    title: "Post-Auction Results",
    description: "Insights and analytics published",
    status: "pending",
  },
  {
    key: "tournament_integration",
    title: "Tournament Integration",
    description: "Teams synced with league fixtures",
    status: "pending",
  },
];

const auctions: Auction[] = [
  {
    id: "auction-spot-2025",
    name: "AuctionSpot Premier League 2025",
    description:
      "Enterprise sports auction for Indian corporates with multi-sport squads.",
    status: "live",
    scheduledTime: Date.now() + 3600 * 1000,
    startTime: Date.now() - 60 * 1000,
    playerIds: players.map((p) => p.id),
    currentPlayerId: players[0].id,
    rules: {
      minBidIncrement: 5000,
      maxPlayersPerTeam: 11,
      initialBudget: 500000,
      bidTimeout: 30,
      allowAutoBid: true,
      maxAutoBidPercentage: 40,
      leagueName: "AuctionSpot Premier League",
    },
    timeline: baseTimeline,
  },
];

const bids: Bid[] = [];

const notifications: Notification[] = [];

const autoBids: AutoBidConfig[] = [];

const users: UserProfile[] = [
  {
    id: "user-admin",
    name: "Control Admin",
    email: "admin@auctionspot.in",
    role: "admin",
    avatar: "https://res.cloudinary.com/dv1eyqkzf/image/upload/v1738456202/auctionspot/admin.png",
  },
  {
    id: "user-priya",
    name: "Priya Verma",
    email: "priya@auctionspot.in",
    role: "bidder",
    teamId: teams[1].id,
    avatar: avatars[1],
  },
  {
    id: "user-rohan",
    name: "Rohan Gupta",
    email: "rohan@auctionspot.in",
    role: "bidder",
    teamId: teams[0].id,
    avatar: avatars[2],
  },
];

// --- Helpers -------------------------------------------------------------

const getAuctionById = (auctionId: string) =>
  auctions.find((auction) => auction.id === auctionId);

const getPlayerById = (playerId: string) =>
  players.find((player) => player.id === playerId);

const getTeamById = (teamId: string) => teams.find((team) => team.id === teamId);

const broadcastNotification = (notification: Omit<Notification, "id" | "timestamp">) => {
  const notif: Notification = {
    ...notification,
    id: randomUUID(),
    timestamp: Date.now(),
  };
  notifications.unshift(notif);
  return notif;
};

const applyAutoBid = (
  auction: Auction,
  player: Player,
  previousBid?: Bid
): Bid | undefined => {
  if (!auction.rules.allowAutoBid) return undefined;

  const eligibleConfigs = autoBids.filter(
    (config) => config.auctionId === auction.id && config.playerId === player.id && config.active
  );

  const sorted = eligibleConfigs.sort((a, b) => b.maxAmount - a.maxAmount);
  const highestAuto = sorted[0];

  if (!highestAuto) return undefined;

  const team = getTeamById(highestAuto.teamId);
  if (!team) return undefined;

  const minAmount = previousBid ? previousBid.amount + auction.rules.minBidIncrement : player.basePrice;
  const cappedAmount = Math.min(
    highestAuto.maxAmount,
    team.remainingBudget,
    Math.floor((team.remainingBudget * auction.rules.maxAutoBidPercentage) / 100)
  );

  if (cappedAmount < minAmount) return undefined;

  const bidAmount = Math.min(cappedAmount, minAmount);

  const autoBid: Bid = {
    id: randomUUID(),
    auctionId: auction.id,
    playerId: player.id,
    bidderId: team.ownerId,
    bidderName: team.ownerName,
    amount: bidAmount,
    timestamp: Date.now(),
    isAutoBid: true,
  };

  bids.push(autoBid);
  broadcastNotification({
    userId: team.ownerId,
    type: "bid",
    title: "Auto-Bid Triggered",
    message: `Auto-bid placed ₹${bidAmount.toLocaleString("en-IN")} on ${player.name}`,
    read: false,
  });

  return autoBid;
};

// --- Server --------------------------------------------------------------

const app = express();
app.use(cors());
app.use(express.json());

// Lightweight request logger
app.use((req, _res, next) => {
  console.info(`API ${req.method} ${req.path}`);
  next();
});

// Mock auth middleware
app.use((req, _res, next) => {
  const roleHeader = req.header("x-user-role") as UserRole | undefined;
  const userId = req.header("x-user-id");
  (req as any).user = roleHeader
    ? { id: userId ?? "guest", role: roleHeader }
    : { id: "guest", role: "viewer" };
  next();
});

const requireRole = (role: UserRole) => (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const user = (req as any).user as { id: string; role: UserRole };
  if (user.role !== role) {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};

// --- Auth ---------------------------------------------------------------

app.post("/api/auth/login", (req, res) => {
  const { email } = req.body as { email?: string };
  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  res.json({
    token: "mock-jwt-token",
    user,
  });
});

// --- Player Management ---------------------------------------------------

app.get("/api/players", (req, res) => {
  const { search = "", game, limit = "50", sort = "name" } = req.query;
  const searchLower = String(search).toLowerCase();

  const filtered = players
    .filter((player) => {
      const haystack = `${player.name} ${player.entity} ${player.department} ${player.location}`.toLowerCase();
      const matchesSearch = haystack.includes(searchLower);
      const matchesGame = game ? player.games.some((g) => g.game === game) : true;
      return matchesSearch && matchesGame;
    })
    .sort((a, b) => {
      if (sort === "rating") {
        const avg = (player: Player) => player.games.reduce((sum, g) => sum + g.rating, 0) / player.games.length;
        return avg(b) - avg(a);
      }
      return a.name.localeCompare(b.name);
    })
    .slice(0, Number(limit));

  res.json({ data: filtered, total: filtered.length });
});

app.get("/api/players/:playerId", (req, res) => {
  const player = getPlayerById(req.params.playerId);
  if (!player) return res.status(404).json({ message: "Player not found" });
  res.json(player);
});

app.post("/api/players", requireRole("admin"), (req, res) => {
  const payload = req.body as Partial<Player>;
  const newPlayer: Player = {
    ...generatePlayer(players.length + 1),
    ...payload,
    id: randomUUID(),
  };
  players.push(newPlayer);
  res.status(201).json(newPlayer);
});

app.put("/api/players/:playerId", requireRole("admin"), (req, res) => {
  const index = players.findIndex((p) => p.id === req.params.playerId);
  if (index === -1) return res.status(404).json({ message: "Player not found" });
  players[index] = { ...players[index], ...req.body };
  res.json(players[index]);
});

// --- Auctions ------------------------------------------------------------

app.get("/api/auctions", (_req, res) => {
  res.json(auctions);
});

app.get("/api/auctions/:auctionId", (req, res) => {
  const auction = getAuctionById(req.params.auctionId);
  if (!auction) return res.status(404).json({ message: "Auction not found" });
  res.json(auction);
});

app.post("/api/auctions", requireRole("admin"), (req, res) => {
  const payload = req.body as Partial<Auction>;
  const newAuction: Auction = {
    id: randomUUID(),
    name: payload.name ?? "Untitled Auction",
    description: payload.description ?? "",
    status: "draft",
    playerIds: payload.playerIds ?? players.map((p) => p.id),
    rules: payload.rules ?? auctions[0].rules,
    timeline: baseTimeline,
  };
  auctions.push(newAuction);
  res.status(201).json(newAuction);
});

app.patch("/api/auctions/:auctionId/status", requireRole("admin"), (req, res) => {
  const auction = getAuctionById(req.params.auctionId);
  if (!auction) return res.status(404).json({ message: "Auction not found" });
  const { status } = req.body as { status: AuctionStatus };
  auction.status = status;
  if (status === "live") auction.startTime = Date.now();
  if (status === "completed") auction.endTime = Date.now();
  res.json(auction);
});

app.patch("/api/auctions/:auctionId/rules", requireRole("admin"), (req, res) => {
  const auction = getAuctionById(req.params.auctionId);
  if (!auction) return res.status(404).json({ message: "Auction not found" });
  auction.rules = { ...auction.rules, ...(req.body as Partial<AuctionRules>) };
  res.json(auction.rules);
});

app.get("/api/auctions/:auctionId/timeline", (req, res) => {
  const auction = getAuctionById(req.params.auctionId);
  if (!auction) return res.status(404).json({ message: "Auction not found" });
  res.json(auction.timeline);
});

// --- Bidding -------------------------------------------------------------

app.get("/api/auctions/:auctionId/bids", (req, res) => {
  const auction = getAuctionById(req.params.auctionId);
  if (!auction) return res.status(404).json({ message: "Auction not found" });
  const auctionBids = bids.filter((bid) => bid.auctionId === auction.id);
  res.json(auctionBids);
});

app.post("/api/auctions/:auctionId/bids", (req, res) => {
  const auction = getAuctionById(req.params.auctionId);
  if (!auction || auction.status !== "live") {
    return res.status(400).json({ message: "Auction not live" });
  }

  const { playerId, bidderId, amount } = req.body as {
    playerId?: string;
    bidderId?: string;
    amount?: number;
  };

  if (!playerId || !bidderId || !amount) {
    return res.status(422).json({ message: "Missing payload" });
  }

  const player = getPlayerById(playerId);
  const bidderTeam = teams.find((team) => team.ownerId === bidderId || team.id === bidderId);

  if (!player) return res.status(404).json({ message: "Player not found" });
  if (!bidderTeam) return res.status(404).json({ message: "Team not found" });
  if (bidderTeam.remainingBudget < amount)
    return res.status(400).json({ message: "Budget exceeded" });

  const previousHighest = bids
    .filter((bid) => bid.playerId === playerId)
    .sort((a, b) => b.amount - a.amount)[0];

  const minBid = previousHighest
    ? previousHighest.amount + auction.rules.minBidIncrement
    : player.basePrice;

  if (amount < minBid) {
    return res
      .status(400)
      .json({ message: `Minimum acceptable bid is ₹${minBid.toLocaleString("en-IN")}` });
  }

  const user = users.find((u) => u.id === bidderId);
  const newBid: Bid = {
    id: randomUUID(),
    auctionId: auction.id,
    playerId,
    bidderId,
    bidderName: user?.name ?? bidderTeam.ownerName,
    amount,
    timestamp: Date.now(),
    isAutoBid: false,
  };

  bids.push(newBid);

  if (previousHighest) {
    broadcastNotification({
      userId: previousHighest.bidderId,
      type: "outbid",
      title: "You were outbid",
      message: `${newBid.bidderName} bid ₹${amount.toLocaleString("en-IN")} for ${player.name}`,
      read: false,
      payload: { playerId },
    });
  }

  const autoResponse = applyAutoBid(auction, player, newBid);

  res.status(201).json({ bid: newBid, autoBid: autoResponse });
});

app.post("/api/auctions/:auctionId/players/:playerId/close", requireRole("admin"), (req, res) => {
  const auction = getAuctionById(req.params.auctionId);
  const player = getPlayerById(req.params.playerId);
  if (!auction || !player) return res.status(404).json({ message: "Not found" });

  const bestBid = bids
    .filter((bid) => bid.playerId === player.id)
    .sort((a, b) => b.amount - a.amount)[0];

  if (!bestBid) return res.status(400).json({ message: "No bids placed" });

  const team = teams.find((team) => team.ownerId === bestBid.bidderId || team.id === bestBid.bidderId);
  if (!team) return res.status(400).json({ message: "Winning team missing" });

  player.soldTo = team.name;
  player.soldPrice = bestBid.amount;
  team.players.push(player.id);
  team.remainingBudget -= bestBid.amount;

  broadcastNotification({
    userId: team.ownerId,
    type: "won",
    title: "Player allocated",
    message: `${player.name} joined ${team.name} for ₹${bestBid.amount.toLocaleString("en-IN")}`,
    read: false,
    payload: { playerId: player.id },
  });

  res.json({ player, team });
});

// --- Auto-Bid Config ----------------------------------------------------

app.get("/api/auctions/:auctionId/autobids", (req, res) => {
  const { auctionId } = req.params;
  res.json(autoBids.filter((config) => config.auctionId === auctionId));
});

app.post("/api/auctions/:auctionId/autobids", (req, res) => {
  const { auctionId } = req.params;
  const { playerId, teamId, maxAmount } = req.body as {
    playerId?: string;
    teamId?: string;
    maxAmount?: number;
  };

  if (!playerId || !teamId || !maxAmount) {
    return res.status(422).json({ message: "Missing fields" });
  }

  const config: AutoBidConfig = {
    id: randomUUID(),
    auctionId,
    playerId,
    teamId,
    maxAmount,
    active: true,
  };

  autoBids.push(config);
  res.status(201).json(config);
});

// --- Teams & Dashboards --------------------------------------------------

app.get("/api/teams", (_req, res) => {
  const enriched = teams.map((team) => ({
    ...team,
    players: team.players.map((id) => getPlayerById(id)).filter(Boolean),
  }));
  res.json(enriched);
});

app.get("/api/teams/:teamId", (req, res) => {
  const team = getTeamById(req.params.teamId);
  if (!team) return res.status(404).json({ message: "Team not found" });
  const playersData = team.players.map((id) => getPlayerById(id)).filter(Boolean);
  res.json({ ...team, players: playersData });
});

// --- Notifications ------------------------------------------------------

app.get("/api/notifications", (req, res) => {
  const user = (req as any).user as { id: string };
  const userNotifs = notifications.filter(
    (notif) => notif.userId === "all" || notif.userId === user.id
  );
  res.json(userNotifs);
});

app.post("/api/notifications", requireRole("admin"), (req, res) => {
  const notif = broadcastNotification({
    userId: req.body.userId ?? "all",
    type: req.body.type ?? "info",
    title: req.body.title ?? "Update",
    message: req.body.message ?? "New notification",
    read: false,
  });
  res.status(201).json(notif);
});

// --- Insights & UX Flow -------------------------------------------------

app.get("/api/how-it-works", (_req, res) => {
  const stages = baseTimeline.map((stage) => ({
    ...stage,
    timestamp: Date.now(),
  }));
  res.json(stages);
});

app.get("/api/analytics/summary", (_req, res) => {
  const soldPlayers = players.filter((player) => player.soldPrice);
  const grossSpend = teams.reduce((sum, team) => sum + (team.budget - team.remainingBudget), 0);

  res.json({
    totalPlayers: players.length,
    soldPlayers: soldPlayers.length,
    grossSpend,
    averageSellPrice: soldPlayers.length
      ? Math.round(soldPlayers.reduce((sum, player) => sum + (player.soldPrice ?? 0), 0) / soldPlayers.length)
      : 0,
    liveAuctionId: auctions.find((auction) => auction.status === "live")?.id,
  });
});

// --- Server start -------------------------------------------------------

const PORT = Number(process.env.PORT ?? 5000);

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`AuctionSpot backend running on http://localhost:${PORT}`);
  });
}

export default app;
