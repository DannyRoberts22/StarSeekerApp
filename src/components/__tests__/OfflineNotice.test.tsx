import React from 'react';

import { render, screen } from '@testing-library/react-native';

import OfflineNotice from '../OfflineNotice';

jest.mock('../useColorScheme', () => ({
  useColorScheme: () => 'light',
}));

describe('OfflineNotice', () => {
  it('should render with default message', () => {
    render(<OfflineNotice />);

    expect(screen.getByTestId('offline-notice')).toBeTruthy();
    expect(screen.getByText("You're Offline")).toBeTruthy();
    expect(
      screen.getByText(
        'No internet connection. Please check your network and try again.'
      )
    ).toBeTruthy();
  });

  it('should render with custom message', () => {
    render(<OfflineNotice message="Custom offline message" />);

    expect(screen.getByTestId('offline-notice')).toBeTruthy();
    expect(screen.getByText("You're Offline")).toBeTruthy();
    expect(screen.getByText('Custom offline message')).toBeTruthy();
  });

  it('should display wifi-off icon', () => {
    render(<OfflineNotice />);

    expect(screen.getByTestId('offline-icon')).toBeTruthy();
  });

  it('should render in dark mode', () => {
    jest
      .spyOn(require('../useColorScheme'), 'useColorScheme')
      .mockReturnValue('dark');

    const { getByTestId } = render(<OfflineNotice />);

    expect(getByTestId('offline-notice')).toBeTruthy();
  });

  it('should have correct text styling', () => {
    render(<OfflineNotice />);

    const title = screen.getByText("You're Offline");
    expect(title.props.style).toMatchObject({
      fontSize: 18,
      fontWeight: '700',
    });
  });
});
