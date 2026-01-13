import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export interface TimelineStage {
  key: string;
  title: string;
  description: string;
  status: "pending" | "active" | "complete";
  timestamp: number;
}

export interface AnalyticsSummary {
  totalPlayers: number;
  soldPlayers: number;
  grossSpend: number;
  averageSellPrice: number;
  liveAuctionId?: string;
}

export const fetchHowItWorks = async () => {
  const { data } = await api.get<TimelineStage[]>("/api/how-it-works");
  return data;
};

export const fetchAnalyticsSummary = async () => {
  const { data } = await api.get<AnalyticsSummary>("/api/analytics/summary");
  return data;
};
