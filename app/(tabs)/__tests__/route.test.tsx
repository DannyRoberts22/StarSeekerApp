import React from 'react';

import { fireEvent, render } from '@testing-library/react-native';

import { useGates } from '@/src/hooks/useGates';
import { useIsOnline } from '@/src/hooks/useIsOnline';
import { useRoute } from '@/src/hooks/useRoute';

import RouteScreen from '../route';

jest.mock('@/src/hooks/useGates');
jest.mock('@/src/hooks/useRoute');
jest.mock('@/src/hooks/useIsOnline');
jest.mock('@/src/hooks/useMinimumLoadingTime', () => ({
  useMinimumLoadingTime: jest.fn(loading => loading),
}));
jest.mock('@/src/components/useColorScheme', () => ({
  useColorScheme: jest.fn(() => 'light'),
}));
jest.mock('@/src/lib/storage', () => ({
  storage: {
    pushRecentRoute: jest.fn(),
  },
}));

const mockUseGates = useGates as jest.MockedFunction<typeof useGates>;
const mockUseRoute = useRoute as jest.MockedFunction<typeof useRoute>;
const mockUseIsOnline = useIsOnline as jest.MockedFunction<typeof useIsOnline>;

describe('RouteScreen', () => {
  beforeEach(() => {
    mockUseGates.mockReturnValue({
      data: [
        { code: 'G1', name: 'Gate 1', links: [], createdAt: '', updatedAt: '' },
        { code: 'G2', name: 'Gate 2', links: [], createdAt: '', updatedAt: '' },
      ],
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    } as any);

    mockUseRoute.mockReturnValue({
      data: undefined,
      isFetching: false,
      error: null,
    } as any);

    mockUseIsOnline.mockReturnValue(true);
  });

  it('renders screen title', () => {
    const { getByText } = render(<RouteScreen />);
    expect(getByText('Cheapest Route')).toBeTruthy();
  });

  it('renders from and to pickers', () => {
    const { getByText } = render(<RouteScreen />);
    expect(getByText('From')).toBeTruthy();
    expect(getByText('To')).toBeTruthy();
  });

  it('renders find route button', () => {
    const { getByText } = render(<RouteScreen />);
    expect(getByText('Find route')).toBeTruthy();
  });

  it('allows button press', () => {
    const { getByText } = render(<RouteScreen />);
    const button = getByText('Find route');
    fireEvent.press(button);
    expect(button).toBeTruthy();
  });

  it('displays journey result when available', () => {
    mockUseRoute.mockReturnValue({
      data: {
        from: { code: 'G1', name: 'Gate 1' },
        to: { code: 'G2', name: 'Gate 2' },
        route: ['G1', 'G2'],
        totalCost: 100,
      },
      isFetching: false,
      error: null,
    } as any);

    const { getByText } = render(<RouteScreen />);
    expect(getByText(/From: Gate 1/)).toBeTruthy();
    expect(getByText(/To: Gate 2/)).toBeTruthy();
    expect(getByText(/Total Cost: 100/)).toBeTruthy();
  });

  it('shows offline notice when offline and find route is pressed', () => {
    mockUseIsOnline.mockReturnValue(false);
    const { getByText, getByTestId } = render(<RouteScreen />);
    const button = getByText('Find route');
    fireEvent.press(button);
    expect(getByTestId('offline-notice')).toBeTruthy();
    expect(
      getByText('You need an internet connection to find routes.')
    ).toBeTruthy();
  });

  it('does not show offline notice when online', () => {
    mockUseIsOnline.mockReturnValue(true);
    const { queryByTestId } = render(<RouteScreen />);
    expect(queryByTestId('offline-notice')).toBeNull();
  });
});
