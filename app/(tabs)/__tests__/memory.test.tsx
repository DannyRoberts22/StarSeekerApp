import React from 'react';

import { fireEvent, render, waitFor } from '@testing-library/react-native';

import { storage } from '@/src/lib/storage';

import Memory from '../memory';

jest.mock('@/src/lib/storage', () => ({
  storage: {
    getFavGates: jest.fn(),
    getRecentRoutes: jest.fn(),
    pushRecentRoute: jest.fn(),
    toggleFavGate: jest.fn(),
  },
}));

jest.mock('@/src/components/useColorScheme', () => ({
  useColorScheme: jest.fn(() => 'light'),
}));

describe('Memory Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (storage.getFavGates as jest.Mock).mockResolvedValue([]);
    (storage.getRecentRoutes as jest.Mock).mockResolvedValue([]);
  });

  it('should render screen title', async () => {
    const { getByText } = render(<Memory />);
    await waitFor(() => {
      expect(getByText('Journey Memory')).toBeTruthy();
    });
  });

  it('should render section titles', async () => {
    const { getByText } = render(<Memory />);
    await waitFor(() => {
      expect(getByText('Favourite Gates')).toBeTruthy();
      expect(getByText('Recent Routes')).toBeTruthy();
    });
  });

  it('should render refresh button', async () => {
    const { getByText } = render(<Memory />);
    await waitFor(() => {
      expect(getByText('Refresh')).toBeTruthy();
    });
  });

  it('should display empty state when no favourites', async () => {
    const { getByText } = render(<Memory />);
    await waitFor(() => {
      expect(getByText('No favourites yet')).toBeTruthy();
    });
  });

  it('should display empty state when no recent routes', async () => {
    const { getByText } = render(<Memory />);
    await waitFor(() => {
      expect(getByText('No recent routes')).toBeTruthy();
    });
  });

  it('should display favourite gates when available', async () => {
    (storage.getFavGates as jest.Mock).mockResolvedValue([
      'GATE001',
      'GATE002',
    ]);

    const { getByText } = render(<Memory />);
    await waitFor(() => {
      expect(getByText('• GATE001')).toBeTruthy();
      expect(getByText('• GATE002')).toBeTruthy();
    });
  });

  it('should display recent routes when available', async () => {
    (storage.getRecentRoutes as jest.Mock).mockResolvedValue([
      {
        from: 'G1',
        to: 'G2',
        totalCost: 100,
        savedAt: Date.now(),
      },
    ]);

    const { getByText } = render(<Memory />);
    await waitFor(() => {
      expect(getByText(/G1 → G2/)).toBeTruthy();
    });
  });

  it('should refresh button reloads data', async () => {
    const { getByText } = render(<Memory />);

    await waitFor(() => {
      expect(getByText('Refresh')).toBeTruthy();
    });

    fireEvent.press(getByText('Refresh'));

    await waitFor(() => {
      expect(storage.getFavGates).toHaveBeenCalled();
      expect(storage.getRecentRoutes).toHaveBeenCalled();
    });
  });
});
