import { act, renderHook } from '@testing-library/react-native';

import { useMinimumLoadingTime } from '../useMinimumLoadingTime';

jest.useFakeTimers();

describe('useMinimumLoadingTime', () => {
  beforeEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.useFakeTimers();
  });

  it('should return true immediately when loading starts', () => {
    const { result } = renderHook(() => useMinimumLoadingTime(true, 2000));

    expect(result.current).toBe(true);
  });

  it('should continue showing loading for minimum time even after loading finishes', () => {
    const { result, rerender } = renderHook(
      ({ isLoading }: { isLoading: boolean }) =>
        useMinimumLoadingTime(isLoading, 2000),
      { initialProps: { isLoading: true } }
    );

    expect(result.current).toBe(true);

    act(() => {
      jest.advanceTimersByTime(500);
    });

    rerender({ isLoading: false });

    expect(result.current).toBe(true);

    act(() => {
      jest.advanceTimersByTime(1500);
    });

    expect(result.current).toBe(false);
  });

  it('should stop showing loading immediately if minimum time has already elapsed', () => {
    const { result, rerender } = renderHook(
      ({ isLoading }: { isLoading: boolean }) =>
        useMinimumLoadingTime(isLoading, 1000),
      { initialProps: { isLoading: true } }
    );

    expect(result.current).toBe(true);

    act(() => {
      jest.advanceTimersByTime(1500);
    });

    rerender({ isLoading: false });

    expect(result.current).toBe(false);
  });

  it('should use default minimum time of 1500ms when not specified', () => {
    const { result, rerender } = renderHook(
      ({ isLoading }: { isLoading: boolean }) =>
        useMinimumLoadingTime(isLoading),
      { initialProps: { isLoading: true } }
    );

    expect(result.current).toBe(true);

    act(() => {
      jest.advanceTimersByTime(500);
    });

    rerender({ isLoading: false });
    expect(result.current).toBe(true);

    act(() => {
      jest.advanceTimersByTime(999);
    });
    expect(result.current).toBe(true);

    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(result.current).toBe(false);
  });

  it('should handle multiple loading cycles correctly', () => {
    const { result, rerender } = renderHook(
      ({ isLoading }: { isLoading: boolean }) =>
        useMinimumLoadingTime(isLoading, 1000),
      { initialProps: { isLoading: false } }
    );

    expect(result.current).toBe(false);

    rerender({ isLoading: true });
    expect(result.current).toBe(true);

    act(() => {
      jest.advanceTimersByTime(200);
    });
    rerender({ isLoading: false });
    expect(result.current).toBe(true);

    act(() => {
      jest.advanceTimersByTime(800);
    });
    expect(result.current).toBe(false);

    rerender({ isLoading: true });
    expect(result.current).toBe(true);

    act(() => {
      jest.advanceTimersByTime(1200);
    });
    rerender({ isLoading: false });
    expect(result.current).toBe(false);
  });

  it('should clean up timers when unmounted', () => {
    const clearTimeoutSpy = jest.spyOn(globalThis, 'clearTimeout');

    const { rerender, unmount } = renderHook(
      ({ isLoading }: { isLoading: boolean }) =>
        useMinimumLoadingTime(isLoading, 1000),
      { initialProps: { isLoading: true } }
    );

    act(() => {
      jest.advanceTimersByTime(200);
    });
    rerender({ isLoading: false });

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
  });
});
