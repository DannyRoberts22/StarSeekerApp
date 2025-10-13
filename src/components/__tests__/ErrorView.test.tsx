import React from 'react';

import { fireEvent, render } from '@testing-library/react-native';

import Colors from '@/constants/Colors';

import ErrorView from '../ErrorView';

jest.mock('../useColorScheme', () => ({
  useColorScheme: jest.fn(() => 'light'),
}));

describe('ErrorView', () => {
  const defaultProps = {
    message: 'Something went wrong',
  };

  it('should render correctly with required props', () => {
    const { getAllByText } = render(<ErrorView {...defaultProps} />);

    const elements = getAllByText('Something went wrong');
    expect(elements.length).toBeGreaterThan(0);
  });

  it('should display the error title', () => {
    const { getAllByText } = render(<ErrorView {...defaultProps} />);
    const elements = getAllByText('Something went wrong');
    expect(elements.length).toBeGreaterThan(0);
  });

  it('should display the error message', () => {
    const { getByText } = render(
      <ErrorView message="Network connection failed" />
    );
    expect(getByText('Network connection failed')).toBeTruthy();
  });

  it('should make error message selectable', () => {
    const { getAllByText } = render(<ErrorView {...defaultProps} />);
    const elements = getAllByText(defaultProps.message);
    const messageElement = elements.find(el => el.props.selectable);
    expect(messageElement).toBeTruthy();
    expect(messageElement?.props.selectable).toBe(true);
  });

  it('should render retry button when onRetry is provided', () => {
    const onRetry = jest.fn();
    const { getByText } = render(
      <ErrorView {...defaultProps} onRetry={onRetry} />
    );

    expect(getByText('Try again')).toBeTruthy();
  });

  it('should not render retry button when onRetry is not provided', () => {
    const { queryByText } = render(<ErrorView {...defaultProps} />);

    expect(queryByText('Try again')).toBeNull();
  });

  it('should call onRetry when retry button is pressed', () => {
    const onRetry = jest.fn();
    const { getByText } = render(
      <ErrorView {...defaultProps} onRetry={onRetry} />
    );

    const retryButton = getByText('Try again');
    fireEvent.press(retryButton);

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('should apply error text color to title in light theme', () => {
    const { getAllByText } = render(<ErrorView {...defaultProps} />);
    const elements = getAllByText('Something went wrong');
    const titleElement = elements[0];
    const flattenedStyles = titleElement.props.style.flat(Infinity);

    expect(flattenedStyles).toContainEqual(
      expect.objectContaining({
        color: Colors.light.errorText,
      })
    );
  });

  it('should apply error text color to title in dark theme', () => {
    const useColorScheme = require('../useColorScheme').useColorScheme;
    useColorScheme.mockReturnValue('dark');

    const { getAllByText } = render(<ErrorView {...defaultProps} />);
    const elements = getAllByText('Something went wrong');
    const titleElement = elements[0];
    const flattenedStyles = titleElement.props.style.flat(Infinity);

    expect(flattenedStyles).toContainEqual(
      expect.objectContaining({
        color: Colors.dark.errorText,
      })
    );
  });

  it('should apply correct title font weight', () => {
    const { getAllByText } = render(<ErrorView {...defaultProps} />);
    const elements = getAllByText('Something went wrong');
    const titleElement = elements[0];
    const flattenedStyles = titleElement.props.style.flat(Infinity);

    expect(flattenedStyles).toContainEqual(
      expect.objectContaining({
        fontWeight: '600',
      })
    );
  });

  it('should handle long error messages', () => {
    const longMessage =
      'This is a very long error message that should still render correctly and be selectable for the user to copy if needed';
    const { getByText } = render(<ErrorView message={longMessage} />);

    expect(getByText(longMessage)).toBeTruthy();
  });

  it('should handle multiple retry button presses', () => {
    const onRetry = jest.fn();
    const { getByText } = render(
      <ErrorView {...defaultProps} onRetry={onRetry} />
    );

    const retryButton = getByText('Try again');
    fireEvent.press(retryButton);
    fireEvent.press(retryButton);
    fireEvent.press(retryButton);

    expect(onRetry).toHaveBeenCalledTimes(3);
  });

  it('should apply correct container padding and gap', () => {
    const { UNSAFE_root } = render(<ErrorView {...defaultProps} />);
    const container = UNSAFE_root.findByType('View', { deep: false });
    const styleArray = Array.isArray(container.props.style)
      ? container.props.style
      : [container.props.style];
    const flattenedStyles = styleArray.flat(Infinity);

    expect(flattenedStyles).toContainEqual(
      expect.objectContaining({
        padding: 16,
        gap: 12,
      })
    );
  });
});
