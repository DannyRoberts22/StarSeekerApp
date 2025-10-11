import React from 'react';

import { fireEvent, render } from '@testing-library/react-native';

import { useTransport } from '@/src/hooks/useTransport';

import Calculator from '../calculator';

jest.mock('@/src/hooks/useTransport');
jest.mock('@/src/components/useColorScheme', () => ({
  useColorScheme: jest.fn(() => 'light'),
}));

const mockUseTransport = useTransport as jest.MockedFunction<
  typeof useTransport
>;

describe('Calculator Screen', () => {
  beforeEach(() => {
    mockUseTransport.mockReturnValue({
      data: undefined,
      error: null,
      isFetching: false,
    } as any);
  });

  it('renders screen title', () => {
    const { getByText } = render(<Calculator />);
    expect(getByText('Journey Cost Calculator')).toBeTruthy();
  });

  it('renders input fields', () => {
    const { getByText } = render(<Calculator />);
    expect(getByText('Distance (AU)')).toBeTruthy();
    expect(getByText('Passengers')).toBeTruthy();
    expect(getByText('Parking days')).toBeTruthy();
  });

  it('renders calculate button', () => {
    const { getByText } = render(<Calculator />);
    expect(getByText('Calculate')).toBeTruthy();
  });

  it('displays result when data is available', () => {
    mockUseTransport.mockReturnValue({
      data: {
        recommendedTransport: {
          name: 'Starship X',
          capacity: 100,
          ratePerAu: 50,
        },
        journeyCost: 500,
        parkingFee: 100,
        currency: 'CR',
      },
      error: null,
      isFetching: false,
    } as any);

    const { getByText } = render(<Calculator />);
    expect(getByText('Cheapest Option')).toBeTruthy();
    expect(getByText('Name: Starship X')).toBeTruthy();
  });

  it('allows button press', () => {
    const { getByText } = render(<Calculator />);
    const button = getByText('Calculate');
    fireEvent.press(button);
    expect(button).toBeTruthy();
  });
});
