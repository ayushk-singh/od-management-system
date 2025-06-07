import { LRUCache } from "lru-cache";

export const statsCache = new LRUCache<string, any>({
  max: 500,
  ttl: 1000 * 60 * 5, // 5 minutes
});
