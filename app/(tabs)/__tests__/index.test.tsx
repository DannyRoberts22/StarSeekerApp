import React from 'react';

import { render } from '@testing-library/react-native';

import { useGates } from '@/src/hooks/useGates';

import GatesScreen from '../index';

jest.mock('@/src/hooks/useGates');
jest.mock('@/src/components/useColorScheme', () => ({
  useColorScheme: jest.fn(() => 'light'),
}));

const mockUseGates = useGates as jest.MockedFunction<typeof useGates>;

describe('GatesScreen', () => {
  it('should render without crashing when loading', () => {
    mockUseGates.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      refetch: jest.fn(),
      isRefetching: false,
    } as any);

    const { UNSAFE_root } = render(<GatesScreen />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should render without crashing when error occurs', () => {
    mockUseGates.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Test error'),
      refetch: jest.fn(),
      isRefetching: false,
    } as any);

    const { UNSAFE_root } = render(<GatesScreen />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should render gate list when data is available', () => {
    const mockGates = [
      {
        code: 'GATE001',
        name: 'Alpha Gate',
        links: [],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
    ];

    mockUseGates.mockReturnValue({
      data: mockGates,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
      isRefetching: false,
    } as any);

    const { getByText } = render(<GatesScreen />);
    expect(getByText('Alpha Gate')).toBeTruthy();
  });
});
