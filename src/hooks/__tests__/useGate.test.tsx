import type { UseQueryResult } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react-native';

import type { Gate } from '@/src/lib/types';

import { useGate } from '../useGate';

jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
}));

import { useQuery } from '@tanstack/react-query';

const mockUseQuery = useQuery as jest.MockedFunction<typeof useQuery>;

const createMockQueryResult = (
  overrides: Partial<UseQueryResult<Gate, unknown>> = {}
): UseQueryResult<Gate, unknown> =>
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
  }) as UseQueryResult<Gate, unknown>;

describe('useGate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when code is provided', () => {
    it('should call useQuery with correct parameters', () => {
      const mockReturn = createMockQueryResult({
        data: {
          uuid: '123',
          code: 'ABC',
          name: 'Test Gate',
          createdAt: Date.now(),
          links: null,
          updatedAt: null,
        },
        isSuccess: true,
      });
      mockUseQuery.mockReturnValue(mockReturn);

      const { result } = renderHook(() => useGate('ABC'));

      expect(mockUseQuery).toHaveBeenCalledWith({
        queryKey: ['gate', 'ABC'],
        enabled: true,
        queryFn: expect.any(Function),
      });

      expect(result.current).toBe(mockReturn);
    });

    it('should be enabled when code is provided', () => {
      const mockReturn = createMockQueryResult();
      mockUseQuery.mockReturnValue(mockReturn);

      renderHook(() => useGate('GATE123'));

      expect(mockUseQuery).toHaveBeenCalledWith({
        queryKey: ['gate', 'GATE123'],
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

      const { result } = renderHook(() => useGate('ABC'));

      expect(result.current.isLoading).toBe(true);
      expect(result.current.isPending).toBe(true);
      expect(result.current.data).toBeUndefined();
    });

    it('should handle error state', () => {
      const mockError = new Error('Gate not found');
      const mockReturn = createMockQueryResult({
        isError: true,
        error: mockError,
        status: 'error',
      });
      mockUseQuery.mockReturnValue(mockReturn);

      const { result } = renderHook(() => useGate('INVALID'));

      expect(result.current.isError).toBe(true);
      expect(result.current.error).toBe(mockError);
      expect(result.current.data).toBeUndefined();
    });

    it('should handle successful data fetch', () => {
      const mockGateData: Gate = {
        uuid: '456',
        code: 'DEF',
        name: 'Another Gate',
        createdAt: 1633024800000,
        links: [{ code: 'LINK1', hu: '10.5' }],
        updatedAt: '2023-10-13T10:00:00Z',
      };

      const mockReturn = createMockQueryResult({
        data: mockGateData,
        isSuccess: true,
        status: 'success',
      });
      mockUseQuery.mockReturnValue(mockReturn);

      const { result } = renderHook(() => useGate('DEF'));

      expect(result.current.data).toEqual(mockGateData);
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.isError).toBe(false);
    });
  });

  describe('when code is empty or invalid', () => {
    it('should be disabled when code is empty string', () => {
      const mockReturn = createMockQueryResult();
      mockUseQuery.mockReturnValue(mockReturn);

      renderHook(() => useGate(''));

      expect(mockUseQuery).toHaveBeenCalledWith({
        queryKey: ['gate', ''],
        enabled: false,
        queryFn: expect.any(Function),
      });
    });

    it('should be enabled when code is whitespace only (Boolean behavior)', () => {
      const mockReturn = createMockQueryResult();
      mockUseQuery.mockReturnValue(mockReturn);

      renderHook(() => useGate('   '));

      expect(mockUseQuery).toHaveBeenCalledWith({
        queryKey: ['gate', '   '],
        enabled: true,
        queryFn: expect.any(Function),
      });
    });

    it('should not fetch data when disabled', () => {
      const mockReturn = createMockQueryResult({
        data: undefined,
        isLoading: false,
      });
      mockUseQuery.mockReturnValue(mockReturn);

      const { result } = renderHook(() => useGate(''));

      expect(result.current.data).toBeUndefined();
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('query key generation', () => {
    it('should generate unique query keys for different gate codes', () => {
      const mockReturn = createMockQueryResult();
      mockUseQuery.mockReturnValue(mockReturn);

      const { rerender } = renderHook(
        ({ code }: { code: string }) => useGate(code),
        {
          initialProps: { code: 'GATE1' },
        }
      );

      expect(mockUseQuery).toHaveBeenLastCalledWith({
        queryKey: ['gate', 'GATE1'],
        enabled: true,
        queryFn: expect.any(Function),
      });

      rerender({ code: 'GATE2' });

      expect(mockUseQuery).toHaveBeenLastCalledWith({
        queryKey: ['gate', 'GATE2'],
        enabled: true,
        queryFn: expect.any(Function),
      });
    });

    it('should handle special characters in gate codes', () => {
      const mockReturn = createMockQueryResult();
      mockUseQuery.mockReturnValue(mockReturn);

      renderHook(() => useGate('GATE-123/ABC'));

      expect(mockUseQuery).toHaveBeenCalledWith({
        queryKey: ['gate', 'GATE-123/ABC'],
        enabled: true,
        queryFn: expect.any(Function),
      });
    });
  });

  describe('query function', () => {
    it('should provide a query function', () => {
      const mockReturn = createMockQueryResult();
      mockUseQuery.mockReturnValue(mockReturn);

      renderHook(() => useGate('ABC'));

      const callArgs = mockUseQuery.mock.calls[0][0];
      expect(callArgs.queryFn).toEqual(expect.any(Function));
    });

    it('should use Boolean(code) for enabled condition', () => {
      const mockReturn = createMockQueryResult();
      mockUseQuery.mockReturnValue(mockReturn);

      renderHook(() => useGate('ABC'));
      expect(mockUseQuery).toHaveBeenLastCalledWith(
        expect.objectContaining({ enabled: true })
      );

      renderHook(() => useGate(''));
      expect(mockUseQuery).toHaveBeenLastCalledWith(
        expect.objectContaining({ enabled: false })
      );
    });
  });
});
