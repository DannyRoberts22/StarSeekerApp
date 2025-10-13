import type { UseQueryResult } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react-native';

import type { Gate } from '@/src/lib/types';

import { useGates } from '../useGates';

jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
}));

import { useQuery } from '@tanstack/react-query';

const mockUseQuery = useQuery as jest.MockedFunction<typeof useQuery>;

const createMockQueryResult = (
  overrides: Partial<UseQueryResult<Gate[], unknown>> = {}
): UseQueryResult<Gate[], unknown> =>
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
  }) as UseQueryResult<Gate[], unknown>;

describe('useGates', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call useQuery with correct parameters', () => {
    const mockGatesData: Gate[] = [
      {
        uuid: '1',
        code: 'ABC',
        name: 'Gate A',
        createdAt: Date.now(),
        links: null,
        updatedAt: null,
      },
      {
        uuid: '2',
        code: 'DEF',
        name: 'Gate B',
        createdAt: Date.now(),
        links: null,
        updatedAt: null,
      },
    ];

    const mockReturn = createMockQueryResult({
      data: mockGatesData,
      isSuccess: true,
      status: 'success',
    });
    mockUseQuery.mockReturnValue(mockReturn);

    const { result } = renderHook(() => useGates());

    expect(mockUseQuery).toHaveBeenCalledWith({
      queryKey: ['gates'],
      queryFn: expect.any(Function),
    });

    expect(result.current).toBe(mockReturn);
  });

  it('should handle loading state', () => {
    const mockReturn = createMockQueryResult({
      isLoading: true,
      isPending: true,
      status: 'pending',
      fetchStatus: 'fetching',
    });
    mockUseQuery.mockReturnValue(mockReturn);

    const { result } = renderHook(() => useGates());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isPending).toBe(true);
    expect(result.current.data).toBeUndefined();
  });

  it('should handle error state', () => {
    const mockError = new Error('Failed to fetch gates');
    const mockReturn = createMockQueryResult({
      isError: true,
      error: mockError,
      status: 'error',
    });
    mockUseQuery.mockReturnValue(mockReturn);

    const { result } = renderHook(() => useGates());

    expect(result.current.isError).toBe(true);
    expect(result.current.error).toBe(mockError);
    expect(result.current.data).toBeUndefined();
  });

  it('should handle successful data fetch with empty array', () => {
    const mockReturn = createMockQueryResult({
      data: [],
      isSuccess: true,
      status: 'success',
    });
    mockUseQuery.mockReturnValue(mockReturn);

    const { result } = renderHook(() => useGates());

    expect(result.current.data).toEqual([]);
    expect(result.current.isSuccess).toBe(true);
    expect(result.current.isError).toBe(false);
  });

  it('should handle successful data fetch with multiple gates', () => {
    const mockGatesData: Gate[] = [
      {
        uuid: '1',
        code: 'GATE001',
        name: 'Main Entrance',
        createdAt: 1633024800000,
        links: [{ code: 'LINK1', hu: '5.2' }],
        updatedAt: '2023-10-13T10:00:00Z',
      },
      {
        uuid: '2',
        code: 'GATE002',
        name: 'Emergency Exit',
        createdAt: 1633024900000,
        links: null,
        updatedAt: null,
      },
    ];

    const mockReturn = createMockQueryResult({
      data: mockGatesData,
      isSuccess: true,
      status: 'success',
    });
    mockUseQuery.mockReturnValue(mockReturn);

    const { result } = renderHook(() => useGates());

    expect(result.current.data).toEqual(mockGatesData);
    expect(result.current.isSuccess).toBe(true);
    expect(result.current.data).toHaveLength(2);
  });
});
