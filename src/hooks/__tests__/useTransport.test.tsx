import type { UseQueryResult } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react-native';

import type { TransportCost } from '@/src/lib/types';

import { useTransport } from '../useTransport';

jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
}));

import { useQuery } from '@tanstack/react-query';

const mockUseQuery = useQuery as jest.MockedFunction<typeof useQuery>;

const createMockQueryResult = (
  overrides: Partial<UseQueryResult<TransportCost, unknown>> = {}
): UseQueryResult<TransportCost, unknown> =>
  ({
    data: undefined,
    error: null,
    isError: false,
    isLoading: false,
    isLoadingError: false,
    isRefetchError: false,
    isSuccess: false,
    isPending: false,
    isPaused: false,
    isPlaceholderData: false,
    isRefetching: false,
    isStale: false,
    failureCount: 0,
    failureReason: null,
    status: 'pending',
    fetchStatus: 'idle',
    refetch: jest.fn(),
    ...overrides,
  }) as UseQueryResult<TransportCost, unknown>;

describe('useTransport', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when all parameters are provided', () => {
    it('should call useQuery with correct parameters', () => {
      const mockTransportData: TransportCost = {
        currency: 'USD',
        journeyCost: 150.75,
        parkingFee: 25.0,
        recommendedTransport: {
          capacity: 4,
          name: 'Economy Shuttle',
          ratePerAu: 1.25,
        },
      };

      const mockReturn = createMockQueryResult({
        data: mockTransportData,
        isSuccess: true,
        status: 'success',
      });
      mockUseQuery.mockReturnValue(mockReturn);

      const { result } = renderHook(() => useTransport(100, 2, 20));

      expect(mockUseQuery).toHaveBeenCalledWith({
        queryKey: ['transport', { distance: 100, passengers: 2, parking: 20 }],
        enabled: true,
        queryFn: expect.any(Function),
      });

      expect(result.current).toBe(mockReturn);
    });

    it('should be enabled when all parameters are provided', () => {
      const mockReturn = createMockQueryResult();
      mockUseQuery.mockReturnValue(mockReturn);

      renderHook(() => useTransport(150, 3, 30));

      expect(mockUseQuery).toHaveBeenCalledWith({
        queryKey: ['transport', { distance: 150, passengers: 3, parking: 30 }],
        enabled: true,
        queryFn: expect.any(Function),
      });
    });

    it('should handle loading state', () => {
      const mockReturn = createMockQueryResult({
        isLoading: true,
        isPending: true,
        status: 'pending',
        fetchStatus: 'fetching',
      });
      mockUseQuery.mockReturnValue(mockReturn);

      const { result } = renderHook(() => useTransport(100, 2, 20));

      expect(result.current.isLoading).toBe(true);
      expect(result.current.isPending).toBe(true);
      expect(result.current.data).toBeUndefined();
    });

    it('should handle error state', () => {
      const mockError = new Error('Transport cost calculation failed');
      const mockReturn = createMockQueryResult({
        isError: true,
        error: mockError,
        status: 'error',
      });
      mockUseQuery.mockReturnValue(mockReturn);

      const { result } = renderHook(() => useTransport(100, 2, 20));

      expect(result.current.isError).toBe(true);
      expect(result.current.error).toBe(mockError);
      expect(result.current.data).toBeUndefined();
    });

    it('should handle zero values as valid parameters', () => {
      const mockReturn = createMockQueryResult();
      mockUseQuery.mockReturnValue(mockReturn);

      renderHook(() => useTransport(0, 0, 0));

      expect(mockUseQuery).toHaveBeenCalledWith({
        queryKey: ['transport', { distance: 0, passengers: 0, parking: 0 }],
        enabled: true,
        queryFn: expect.any(Function),
      });
    });
  });

  describe('when parameters are missing', () => {
    it('should be disabled when all parameters are missing', () => {
      const mockReturn = createMockQueryResult();
      mockUseQuery.mockReturnValue(mockReturn);

      renderHook(() => useTransport());

      expect(mockUseQuery).toHaveBeenCalledWith({
        queryKey: [
          'transport',
          { distance: undefined, passengers: undefined, parking: undefined },
        ],
        enabled: false,
        queryFn: expect.any(Function),
      });
    });

    it('should be disabled when distance is missing', () => {
      const mockReturn = createMockQueryResult();
      mockUseQuery.mockReturnValue(mockReturn);

      renderHook(() => useTransport(undefined, 2, 20));

      expect(mockUseQuery).toHaveBeenCalledWith({
        queryKey: [
          'transport',
          { distance: undefined, passengers: 2, parking: 20 },
        ],
        enabled: false,
        queryFn: expect.any(Function),
      });
    });

    it('should be disabled when passengers is missing', () => {
      const mockReturn = createMockQueryResult();
      mockUseQuery.mockReturnValue(mockReturn);

      renderHook(() => useTransport(100, undefined, 20));

      expect(mockUseQuery).toHaveBeenCalledWith({
        queryKey: [
          'transport',
          { distance: 100, passengers: undefined, parking: 20 },
        ],
        enabled: false,
        queryFn: expect.any(Function),
      });
    });

    it('should be disabled when parking is missing', () => {
      const mockReturn = createMockQueryResult();
      mockUseQuery.mockReturnValue(mockReturn);

      renderHook(() => useTransport(100, 2, undefined));

      expect(mockUseQuery).toHaveBeenCalledWith({
        queryKey: [
          'transport',
          { distance: 100, passengers: 2, parking: undefined },
        ],
        enabled: false,
        queryFn: expect.any(Function),
      });
    });

    it('should be disabled when only some parameters are provided', () => {
      const mockReturn = createMockQueryResult();
      mockUseQuery.mockReturnValue(mockReturn);

      renderHook(() => useTransport(100, undefined, 20));

      expect(mockUseQuery).toHaveBeenCalledWith({
        queryKey: [
          'transport',
          { distance: 100, passengers: undefined, parking: 20 },
        ],
        enabled: false,
        queryFn: expect.any(Function),
      });
    });

    it('should not fetch data when disabled', () => {
      const mockReturn = createMockQueryResult({
        data: undefined,
        isLoading: false,
      });
      mockUseQuery.mockReturnValue(mockReturn);

      const { result } = renderHook(() => useTransport(100, undefined, 20));

      expect(result.current.data).toBeUndefined();
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('query key generation', () => {
    it('should generate unique query keys for different parameter combinations', () => {
      const mockReturn = createMockQueryResult();
      mockUseQuery.mockReturnValue(mockReturn);

      const { rerender } = renderHook(
        ({
          distance,
          passengers,
          parking,
        }: {
          distance?: number;
          passengers?: number;
          parking?: number;
        }) => useTransport(distance, passengers, parking),
        { initialProps: { distance: 100, passengers: 2, parking: 20 } }
      );

      expect(mockUseQuery).toHaveBeenLastCalledWith({
        queryKey: ['transport', { distance: 100, passengers: 2, parking: 20 }],
        enabled: true,
        queryFn: expect.any(Function),
      });

      rerender({ distance: 200, passengers: 4, parking: 30 });

      expect(mockUseQuery).toHaveBeenLastCalledWith({
        queryKey: ['transport', { distance: 200, passengers: 4, parking: 30 }],
        enabled: true,
        queryFn: expect.any(Function),
      });
    });

    it('should handle large parameter values', () => {
      const mockReturn = createMockQueryResult();
      mockUseQuery.mockReturnValue(mockReturn);

      renderHook(() => useTransport(999999, 100, 5000));

      expect(mockUseQuery).toHaveBeenCalledWith({
        queryKey: [
          'transport',
          { distance: 999999, passengers: 100, parking: 5000 },
        ],
        enabled: true,
        queryFn: expect.any(Function),
      });
    });
  });

  describe('enabled logic', () => {
    it('should use strict undefined check for enabled condition', () => {
      const mockReturn = createMockQueryResult();
      mockUseQuery.mockReturnValue(mockReturn);

      renderHook(() => useTransport(0, 0, 0));
      expect(mockUseQuery).toHaveBeenLastCalledWith(
        expect.objectContaining({ enabled: true })
      );

      renderHook(() => useTransport(100, 2, 20));
      expect(mockUseQuery).toHaveBeenLastCalledWith(
        expect.objectContaining({ enabled: true })
      );

      renderHook(() => useTransport(undefined, 2, 20));
      expect(mockUseQuery).toHaveBeenLastCalledWith(
        expect.objectContaining({ enabled: false })
      );

      renderHook(() => useTransport(100, undefined, 20));
      expect(mockUseQuery).toHaveBeenLastCalledWith(
        expect.objectContaining({ enabled: false })
      );

      renderHook(() => useTransport(100, 2, undefined));
      expect(mockUseQuery).toHaveBeenLastCalledWith(
        expect.objectContaining({ enabled: false })
      );
    });
  });
});
