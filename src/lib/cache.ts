import { LRUCache } from "lru-cache";

export interface StatsData {
  approved: number;
  rejected: number;
  pending: number;
  forwarded?: number; 
}

export const statsCache = new LRUCache<string, StatsData>({
  max: 500,
  ttl: 1000 * 60 * 5, // 5 minutes
});
