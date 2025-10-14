import React from 'react';

import type { UseQueryResult } from '@tanstack/react-query';
import { render } from '@testing-library/react-native';

import { useGates } from '@/src/hooks/useGates';
import { useIsOnline } from '@/src/hooks/useIsOnline';
import { useMinimumLoadingTime } from '@/src/hooks/useMinimumLoadingTime';
import type { Gate } from '@/src/lib/types';

import GatesScreen from '../index';

jest.mock('@/src/hooks/useGates');
jest.mock('@/src/hooks/useIsOnline');
jest.mock('@/src/hooks/useMinimumLoadingTime');
jest.mock('@/src/components/useColorScheme', () => ({
  useColorScheme: jest.fn(() => 'light'),
}));

const mockUseGates = useGates as jest.MockedFunction<typeof useGates>;
const mockUseIsOnline = useIsOnline as jest.MockedFunction<typeof useIsOnline>;
const mockUseMinimumLoadingTime = useMinimumLoadingTime as jest.MockedFunction<
  typeof useMinimumLoadingTime
>;

const createMockQueryResult = (
  overrides: Partial<UseQueryResult<Gate[], Error>> = {}
): UseQueryResult<Gate[], Error> =>
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
  }) as UseQueryResult<Gate[], Error>;

describe('GatesScreen', () => {
  beforeEach(() => {
    // Default mocks
    mockUseIsOnline.mockReturnValue(true);
    mockUseMinimumLoadingTime.mockReturnValue(false);
  });

  it('should show loading component when loading', () => {
    mockUseGates.mockReturnValue(
      createMockQueryResult({
        isLoading: true,
      })
    );
    mockUseMinimumLoadingTime.mockReturnValue(true);

    const { getByText } = render(<GatesScreen />);
    expect(getByText('Loading gates...')).toBeTruthy();
  });

  it('should show error view when error occurs', () => {
    const testError = new Error('Test error');
    mockUseGates.mockReturnValue(
      createMockQueryResult({
        isError: true,
        error: testError,
      })
    );

    const { getByText } = render(<GatesScreen />);
    expect(getByText('Test error')).toBeTruthy();
  });

  it('should show error view when no data is available', () => {
    mockUseGates.mockReturnValue(
      createMockQueryResult({
        data: undefined,
      })
    );

    const { getByText } = render(<GatesScreen />);
    expect(getByText('No gates available')).toBeTruthy();
  });

  it('should render gate list when data is available', () => {
    const mockGates = [
      {
        uuid: '1',
        code: 'GATE001',
        name: 'Alpha Gate',
        links: [],
        createdAt: 1640995200000,
        updatedAt: '2024-01-01',
      },
    ];

    mockUseGates.mockReturnValue(
      createMockQueryResult({
        data: mockGates,
        isSuccess: true,
      })
    );

    const { getByText } = render(<GatesScreen />);
    expect(getByText('Alpha Gate')).toBeTruthy();
  });
});
