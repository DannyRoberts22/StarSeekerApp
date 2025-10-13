import type { UseQueryResult } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react-native';

import type { Journey } from '@/src/lib/types';

import { useRoute } from '../useRoute';

jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
}));

import { useQuery } from '@tanstack/react-query';

const mockUseQuery = useQuery as jest.MockedFunction<typeof useQuery>;

const createMockQueryResult = (
  overrides: Partial<UseQueryResult<Journey, unknown>> = {}
): UseQueryResult<Journey, unknown> =>
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
  }) as UseQueryResult<Journey, unknown>;

describe('useRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when both gates are provided', () => {
    it('should call useQuery with correct parameters', () => {
      const mockJourneyData: Journey = {
        from: {
          uuid: '1',
          code: 'ABC',
          name: 'Gate ABC',
          createdAt: Date.now(),
          links: null,
          updatedAt: null,
        },
        to: {
          uuid: '2',
          code: 'DEF',
          name: 'Gate DEF',
          createdAt: Date.now(),
          links: null,
          updatedAt: null,
        },
        route: ['ABC', 'INTERMEDIATE', 'DEF'],
        totalCost: 150.5,
      };

      const mockReturn = createMockQueryResult({
        data: mockJourneyData,
        isSuccess: true,
        status: 'success',
      });
      mockUseQuery.mockReturnValue(mockReturn);

      const { result } = renderHook(() => useRoute('ABC', 'DEF'));

      expect(mockUseQuery).toHaveBeenCalledWith({
        queryKey: ['route', { from: 'ABC', to: 'DEF' }],
        enabled: true,
        queryFn: expect.any(Function),
      });

      expect(result.current).toBe(mockReturn);
    });

    it('should be enabled when both from and to gates are provided', () => {
      const mockReturn = createMockQueryResult();
      mockUseQuery.mockReturnValue(mockReturn);

      renderHook(() => useRoute('GATE1', 'GATE2'));

      expect(mockUseQuery).toHaveBeenCalledWith({
        queryKey: ['route', { from: 'GATE1', to: 'GATE2' }],
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

      const { result } = renderHook(() => useRoute('ABC', 'DEF'));

      expect(result.current.isLoading).toBe(true);
      expect(result.current.isPending).toBe(true);
      expect(result.current.data).toBeUndefined();
    });

    it('should handle error state', () => {
      const mockError = new Error('Route not found');
      const mockReturn = createMockQueryResult({
        isError: true,
        error: mockError,
        status: 'error',
      });
      mockUseQuery.mockReturnValue(mockReturn);

      const { result } = renderHook(() => useRoute('ABC', 'INVALID'));

      expect(result.current.isError).toBe(true);
      expect(result.current.error).toBe(mockError);
      expect(result.current.data).toBeUndefined();
    });
  });

  describe('when gates are missing', () => {
    it('should be disabled when from gate is missing', () => {
      const mockReturn = createMockQueryResult();
      mockUseQuery.mockReturnValue(mockReturn);

      renderHook(() => useRoute(undefined, 'DEF'));

      expect(mockUseQuery).toHaveBeenCalledWith({
        queryKey: ['route', { from: undefined, to: 'DEF' }],
        enabled: false,
        queryFn: expect.any(Function),
      });
    });

    it('should be disabled when to gate is missing', () => {
      const mockReturn = createMockQueryResult();
      mockUseQuery.mockReturnValue(mockReturn);

      renderHook(() => useRoute('ABC', undefined));

      expect(mockUseQuery).toHaveBeenCalledWith({
        queryKey: ['route', { from: 'ABC', to: undefined }],
        enabled: false,
        queryFn: expect.any(Function),
      });
    });

    it('should be disabled when both gates are missing', () => {
      const mockReturn = createMockQueryResult();
      mockUseQuery.mockReturnValue(mockReturn);

      renderHook(() => useRoute(undefined, undefined));

      expect(mockUseQuery).toHaveBeenCalledWith({
        queryKey: ['route', { from: undefined, to: undefined }],
        enabled: false,
        queryFn: expect.any(Function),
      });
    });

    it('should be disabled when from gate is empty string', () => {
      const mockReturn = createMockQueryResult();
      mockUseQuery.mockReturnValue(mockReturn);

      renderHook(() => useRoute('', 'DEF'));

      expect(mockUseQuery).toHaveBeenCalledWith({
        queryKey: ['route', { from: '', to: 'DEF' }],
        enabled: false,
        queryFn: expect.any(Function),
      });
    });

    it('should be disabled when to gate is empty string', () => {
      const mockReturn = createMockQueryResult();
      mockUseQuery.mockReturnValue(mockReturn);

      renderHook(() => useRoute('ABC', ''));

      expect(mockUseQuery).toHaveBeenCalledWith({
        queryKey: ['route', { from: 'ABC', to: '' }],
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

      const { result } = renderHook(() => useRoute('', 'DEF'));

      expect(result.current.data).toBeUndefined();
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('query key generation', () => {
    it('should generate unique query keys for different route combinations', () => {
      const mockReturn = createMockQueryResult();
      mockUseQuery.mockReturnValue(mockReturn);

      const { rerender } = renderHook(
        ({ from, to }: { from?: string; to?: string }) => useRoute(from, to),
        { initialProps: { from: 'GATE1', to: 'GATE2' } }
      );

      expect(mockUseQuery).toHaveBeenLastCalledWith({
        queryKey: ['route', { from: 'GATE1', to: 'GATE2' }],
        enabled: true,
        queryFn: expect.any(Function),
      });

      rerender({ from: 'GATE3', to: 'GATE4' });

      expect(mockUseQuery).toHaveBeenLastCalledWith({
        queryKey: ['route', { from: 'GATE3', to: 'GATE4' }],
        enabled: true,
        queryFn: expect.any(Function),
      });
    });

    it('should handle special characters in gate codes', () => {
      const mockReturn = createMockQueryResult();
      mockUseQuery.mockReturnValue(mockReturn);

      renderHook(() => useRoute('GATE-123/ABC', 'GATE_456#DEF'));

      expect(mockUseQuery).toHaveBeenCalledWith({
        queryKey: ['route', { from: 'GATE-123/ABC', to: 'GATE_456#DEF' }],
        enabled: true,
        queryFn: expect.any(Function),
      });
    });
  });

  describe('enabled logic', () => {
    it('should use Boolean(from && to) for enabled condition', () => {
      const mockReturn = createMockQueryResult();
      mockUseQuery.mockReturnValue(mockReturn);

      renderHook(() => useRoute('ABC', 'DEF'));
      expect(mockUseQuery).toHaveBeenLastCalledWith(
        expect.objectContaining({ enabled: true })
      );

      renderHook(() => useRoute('', 'DEF'));
      expect(mockUseQuery).toHaveBeenLastCalledWith(
        expect.objectContaining({ enabled: false })
      );

      renderHook(() => useRoute('ABC', ''));
      expect(mockUseQuery).toHaveBeenLastCalledWith(
        expect.objectContaining({ enabled: false })
      );

      renderHook(() => useRoute(undefined, undefined));
      expect(mockUseQuery).toHaveBeenLastCalledWith(
        expect.objectContaining({ enabled: false })
      );
    });
  });
});
