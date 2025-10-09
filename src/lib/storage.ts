import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  FAV_GATES: 'fav_gates',
  RECENT_ROUTES: 'recent_routes',
} as const;

export type RecentRoute = {
  from: string;
  to: string;
  savedAt: number;
  totalCost?: number;
};

export const storage = {
  async getFavGates(): Promise<string[]> {
    const raw = await AsyncStorage.getItem(KEYS.FAV_GATES);
    return raw ? JSON.parse(raw) : [];
  },
  async setFavGates(codes: string[]) {
    await AsyncStorage.setItem(KEYS.FAV_GATES, JSON.stringify(codes));
  },
  async toggleFavGate(code: string) {
    const all = await storage.getFavGates();
    const next = all.includes(code)
      ? all.filter(c => c !== code)
      : [...all, code];
    await storage.setFavGates(next);
    return next;
  },
  async getRecentRoutes(): Promise<RecentRoute[]> {
    const raw = await AsyncStorage.getItem(KEYS.RECENT_ROUTES);
    return raw ? JSON.parse(raw) : [];
  },
  async pushRecentRoute(route: RecentRoute) {
    const all = await storage.getRecentRoutes();
    const next = [{ ...route }, ...all].slice(0, 25);
    await AsyncStorage.setItem(KEYS.RECENT_ROUTES, JSON.stringify(next));
  },
};
