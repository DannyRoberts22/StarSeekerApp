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

  it('renders correctly with required props', () => {
    const { getAllByText } = render(<ErrorView {...defaultProps} />);

    const elements = getAllByText('Something went wrong');
    expect(elements.length).toBeGreaterThan(0);
  });

  it('displays the error title', () => {
    const { getAllByText } = render(<ErrorView {...defaultProps} />);
    const elements = getAllByText('Something went wrong');
    expect(elements.length).toBeGreaterThan(0);
  });

  it('displays the error message', () => {
    const { getByText } = render(
      <ErrorView message="Network connection failed" />
    );
    expect(getByText('Network connection failed')).toBeTruthy();
  });

  it('makes error message selectable', () => {
    const { getAllByText } = render(<ErrorView {...defaultProps} />);
    const elements = getAllByText(defaultProps.message);
    const messageElement = elements.find(el => el.props.selectable);
    expect(messageElement).toBeTruthy();
    expect(messageElement?.props.selectable).toBe(true);
  });

  it('renders retry button when onRetry is provided', () => {
    const onRetry = jest.fn();
    const { getByText } = render(
      <ErrorView {...defaultProps} onRetry={onRetry} />
    );

    expect(getByText('Try again')).toBeTruthy();
  });

  it('does not render retry button when onRetry is not provided', () => {
    const { queryByText } = render(<ErrorView {...defaultProps} />);

    expect(queryByText('Try again')).toBeNull();
  });

  it('calls onRetry when retry button is pressed', () => {
    const onRetry = jest.fn();
    const { getByText } = render(
      <ErrorView {...defaultProps} onRetry={onRetry} />
    );

    const retryButton = getByText('Try again');
    fireEvent.press(retryButton);

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('applies error text color to title in light theme', () => {
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

  it('applies error text color to title in dark theme', () => {
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

  it('applies correct title font weight', () => {
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

  it('handles long error messages', () => {
    const longMessage =
      'This is a very long error message that should still render correctly and be selectable for the user to copy if needed';
    const { getByText } = render(<ErrorView message={longMessage} />);

    expect(getByText(longMessage)).toBeTruthy();
  });

  it('handles multiple retry button presses', () => {
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

  it('applies correct container padding and gap', () => {
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
