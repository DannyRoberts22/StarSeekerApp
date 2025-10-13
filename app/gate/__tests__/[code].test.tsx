import React from 'react';
import { Alert } from 'react-native';

import { fireEvent, render } from '@testing-library/react-native';

import { useGate } from '@/src/hooks/useGate';
import { storage } from '@/src/lib/storage';

import GateDetails from '../[code]';

jest.mock('@/src/hooks/useGate');
jest.mock('@/src/lib/storage', () => ({
  storage: {
    toggleFavGate: jest.fn(),
  },
}));
jest.mock('@/src/components/useColorScheme', () => ({
  useColorScheme: jest.fn(() => 'light'),
}));
jest.mock('expo-router', () => ({
  useLocalSearchParams: jest.fn(() => ({ code: 'GATE001' })),
  Stack: {
    Screen: ({ children }: any) => children,
  },
}));

jest.spyOn(Alert, 'alert');

const mockUseGate = useGate as jest.MockedFunction<typeof useGate>;

describe('GateDetails Screen', () => {
  const mockGateData = {
    code: 'GATE001',
    name: 'Alpha Centauri Gate',
    links: ['GATE002', 'GATE003'],
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render gate name', () => {
    mockUseGate.mockReturnValue({
      data: mockGateData,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    } as any);

    const { getByText } = render(<GateDetails />);
    expect(getByText('Alpha Centauri Gate')).toBeTruthy();
  });

  it('should render gate code', () => {
    mockUseGate.mockReturnValue({
      data: mockGateData,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    } as any);

    const { getByText } = render(<GateDetails />);
    expect(getByText(/Code: GATE001/)).toBeTruthy();
  });

  it('should render toggle favourite button', () => {
    mockUseGate.mockReturnValue({
      data: mockGateData,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    } as any);

    const { getByText } = render(<GateDetails />);
    expect(getByText('★ Toggle Favourite')).toBeTruthy();
  });

  it('should render created date when available', () => {
    mockUseGate.mockReturnValue({
      data: mockGateData,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    } as any);

    const { getByText } = render(<GateDetails />);
    expect(getByText(/Created:/)).toBeTruthy();
  });

  it('should render updated date when available', () => {
    mockUseGate.mockReturnValue({
      data: mockGateData,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    } as any);

    const { getByText } = render(<GateDetails />);
    expect(getByText(/Updated:/)).toBeTruthy();
  });

  it('should handle toggle favourite button press', async () => {
    (storage.toggleFavGate as jest.Mock).mockResolvedValue(['GATE001']);

    mockUseGate.mockReturnValue({
      data: mockGateData,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    } as any);

    const { getByText } = render(<GateDetails />);
    const button = getByText('★ Toggle Favourite');

    fireEvent.press(button);

    expect(storage.toggleFavGate).toHaveBeenCalledWith('GATE001');
  });
});
