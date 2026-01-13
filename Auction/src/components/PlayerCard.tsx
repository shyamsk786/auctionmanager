import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Award, Briefcase, MapPin, Shield, Trophy, Users } from "lucide-react";
import { Player } from "../types";

interface PlayerCardProps {
  player: Player;
  showBidding?: boolean;
  onBid?: () => void;
}

const CRITERIA_ACCENTS: Record<Player["criteria"], string> = {
  Elite: "from-[#f97316] to-[#facc15]",
  Professional: "from-[#38bdf8] to-[#6366f1]",
  Intermediate: "from-[#22c55e] to-[#0ea5e9]",
  Beginner: "from-[#94a3b8] to-[#64748b]",
};

const ratingColor = (value: number) => {
  if (value >= 8) return "text-emerald-300";
  if (value >= 5) return "text-amber-300";
  return "text-rose-300";
};

export const PlayerCard: React.FC<PlayerCardProps> = ({ player, showBidding, onBid }) => {
  const navigate = useNavigate();
  const avgRating = player.games.reduce((acc, g) => acc + g.rating, 0) / player.games.length;

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      className={`glass-panel neon-border bg-[#0a1224]/95 rounded-2xl p-4 border border-white/5 cursor-pointer transition-shadow ${
        player.isCaptain ? "shadow-[0_0_25px_rgba(249,115,22,0.4)]" : ""
      }`}
      onClick={() => navigate(`/player/${player.id}`)}
    >
      <div className="flex gap-4">
        <div className="relative">
          <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-[#64d9ff]/40 via-[#7c5dfa]/40 to-transparent p-[2px]">
            <div className="h-full w-full rounded-2xl bg-[#030712] flex items-center justify-center">
              <img
                src={player.avatar}
                alt={player.name}
                className="h-[86px] w-[86px] rounded-2xl object-cover border border-white/10"
              />
            </div>
          </div>
          {player.isCaptain && (
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#fbbf24] to-[#f97316] text-[10px] font-semibold tracking-[0.25em] text-[#050b19] px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
              <Trophy className="h-3 w-3" /> CAPTAIN
            </span>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[10px] text-[#64d9ff] uppercase tracking-[0.4em]">{player.matchTeam}</p>
              <h3 className="text-white text-base font-semibold tracking-wide mt-1">{player.name}</h3>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-[11px] uppercase tracking-[0.2em] bg-gradient-to-r ${CRITERIA_ACCENTS[player.criteria]}`}
            >
              {player.criteria}
            </span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-white/70">
            <div className="flex items-center gap-2">
              <Briefcase className="h-3.5 w-3.5 text-[#64d9ff]" />
              <span>{player.department}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-[#f97316]" />
              <span>{player.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-3.5 w-3.5 text-[#a78bfa]" />
              <span>{player.employmentType}</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-3.5 w-3.5 text-[#34d399]" />
              <span className="text-emerald-200 font-semibold">{avgRating.toFixed(1)}/10 Avg</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 border border-white/5 rounded-xl p-3 bg-[#050b19]/60">
        <div className="flex items-center justify-between text-[11px] text-white/50 mb-3">
          <span>Sport Stack</span>
          <span className="flex items-center gap-2">
            <Award className="h-3.5 w-3.5 text-[#7c5dfa]" />
            <span>{player.gender}</span>
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {player.games.map((game) => (
            <div
              key={`${player.id}-${game.game}`}
              className="px-3 py-1 rounded-full bg-white/5 text-white/80 text-[11px] flex items-center gap-1 border border-white/5"
            >
              <span>{game.game}</span>
              <span className={`${ratingColor(game.rating)} font-semibold`}>{game.rating}/10</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] text-white/40 uppercase tracking-[0.3em]">Base Credits</p>
          <p className="text-white text-lg font-semibold">{player.basePrice} Credits</p>
          {player.soldTo && (
            <div className="mt-1 text-[11px] text-emerald-300">
              Sold to {player.soldTo} for {player.soldPrice} Credits
            </div>
          )}
        </div>
        {showBidding && !player.soldTo && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBid?.();
            }}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#64d9ff] to-[#7c5dfa] text-[#050b19] font-semibold uppercase tracking-[0.2em] text-xs hover:opacity-90"
          >
            Bid
          </button>
        )}
      </div>
    </motion.div>
  );
};
