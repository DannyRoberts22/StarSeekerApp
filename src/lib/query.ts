import { AppState } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import {
  focusManager,
  onlineManager,
  QueryClient,
} from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 1000 * 60 * 60,
      retry: 2,
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
    },
  },
});

export const persister = createAsyncStoragePersister({ storage: AsyncStorage });

onlineManager.setEventListener(setOnline => {
  const unsubscribe = NetInfo.addEventListener(state => {
    setOnline(Boolean(state.isConnected && state.isInternetReachable));
  });
  return unsubscribe;
});

focusManager.setEventListener(handleFocus => {
  const listener = AppState.addEventListener('change', state => {
    handleFocus(state === 'active');
  });
  return () => listener.remove();
});
