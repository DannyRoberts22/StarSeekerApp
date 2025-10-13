import type { NetInfoState } from '@react-native-community/netinfo';
import { act, renderHook, waitFor } from '@testing-library/react-native';

import { useIsOnline } from '../useIsOnline';

jest.mock('@react-native-community/netinfo', () => ({
  addEventListener: jest.fn(),
  fetch: jest.fn(),
}));

import NetInfo from '@react-native-community/netinfo';

const mockNetInfo = NetInfo as jest.Mocked<typeof NetInfo>;

describe('useIsOnline', () => {
  let mockUnsubscribe: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUnsubscribe = jest.fn();

    mockNetInfo.addEventListener.mockReturnValue(mockUnsubscribe);
    mockNetInfo.fetch.mockResolvedValue({
      isConnected: true,
      isInternetReachable: true,
      type: 'wifi',
      details: {},
    } as NetInfoState);
  });

  it('should return true by default', () => {
    const { result } = renderHook(() => useIsOnline());

    expect(result.current).toBe(true);
  });

  it('should set up event listener on mount', () => {
    renderHook(() => useIsOnline());

    expect(mockNetInfo.addEventListener).toHaveBeenCalledWith(
      expect.any(Function)
    );
  });

  it('should fetch initial network state on mount', () => {
    renderHook(() => useIsOnline());

    expect(mockNetInfo.fetch).toHaveBeenCalled();
  });

  it('should update state when network state changes to offline', async () => {
    const { result } = renderHook(() => useIsOnline());

    const eventListener = mockNetInfo.addEventListener.mock.calls[0][0];

    act(() => {
      eventListener({
        isConnected: false,
        isInternetReachable: false,
        type: 'none',
        details: null,
      } as NetInfoState);
    });

    await waitFor(() => {
      expect(result.current).toBe(false);
    });
  });

  it('should update state when network state changes to online', async () => {
    const { result } = renderHook(() => useIsOnline());

    const eventListener = mockNetInfo.addEventListener.mock.calls[0][0];

    act(() => {
      eventListener({
        isConnected: false,
        isInternetReachable: false,
        type: 'none',
        details: null,
      } as NetInfoState);
    });

    await waitFor(() => {
      expect(result.current).toBe(false);
    });

    act(() => {
      eventListener({
        isConnected: true,
        isInternetReachable: true,
        type: 'wifi',
        details: {},
      } as NetInfoState);
    });

    await waitFor(() => {
      expect(result.current).toBe(true);
    });
  });

  it('should handle connected but no internet reachable as offline', async () => {
    const { result } = renderHook(() => useIsOnline());

    const eventListener = mockNetInfo.addEventListener.mock.calls[0][0];

    act(() => {
      eventListener({
        isConnected: true,
        isInternetReachable: false,
        type: 'wifi',
        details: {},
      } as NetInfoState);
    });

    await waitFor(() => {
      expect(result.current).toBe(false);
    });
  });

  it('should handle not connected but internet reachable as offline', async () => {
    const { result } = renderHook(() => useIsOnline());

    const eventListener = mockNetInfo.addEventListener.mock.calls[0][0];

    act(() => {
      eventListener({
        isConnected: false,
        isInternetReachable: true,
        type: 'none',
        details: null,
      } as NetInfoState);
    });

    await waitFor(() => {
      expect(result.current).toBe(false);
    });
  });

  it('should update state based on initial fetch result', async () => {
    mockNetInfo.fetch.mockResolvedValue({
      isConnected: false,
      isInternetReachable: false,
      type: 'none',
      details: null,
    } as NetInfoState);

    const { result } = renderHook(() => useIsOnline());

    await waitFor(() => {
      expect(result.current).toBe(false);
    });
  });

  it('should handle null values from NetInfo gracefully', async () => {
    const { result } = renderHook(() => useIsOnline());

    const eventListener = mockNetInfo.addEventListener.mock.calls[0][0];

    act(() => {
      eventListener({
        isConnected: null,
        isInternetReachable: null,
        type: 'unknown',
        details: null,
      } as NetInfoState);
    });

    await waitFor(() => {
      expect(result.current).toBe(false);
    });
  });

  it('should unsubscribe when component unmounts', () => {
    const { unmount } = renderHook(() => useIsOnline());

    unmount();

    expect(mockUnsubscribe).toHaveBeenCalled();
  });

  it('should maintain functionality even when fetch initially fails', async () => {
    mockNetInfo.fetch.mockResolvedValue({
      isConnected: true,
      isInternetReachable: true,
      type: 'wifi',
      details: {},
    } as NetInfoState);

    const { result } = renderHook(() => useIsOnline());

    expect(result.current).toBe(true);

    const eventListener =
      mockNetInfo.addEventListener.mock.calls[
        mockNetInfo.addEventListener.mock.calls.length - 1
      ][0];

    act(() => {
      eventListener({
        isConnected: false,
        isInternetReachable: false,
        type: 'none',
        details: null,
      } as NetInfoState);
    });

    await waitFor(() => {
      expect(result.current).toBe(false);
    });
  });
});
