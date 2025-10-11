import React from 'react';

import { render } from '@testing-library/react-native';

import Colors from '@/constants/Colors';

import EmptyState from '../EmptyState';

jest.mock('../useColorScheme', () => ({
  useColorScheme: jest.fn(() => 'light'),
}));

describe('EmptyState', () => {
  it('renders correctly with only title', () => {
    const { getByText } = render(<EmptyState title="No items found" />);
    expect(getByText('No items found')).toBeTruthy();
  });

  it('renders with title and subtitle', () => {
    const { getByText } = render(
      <EmptyState title="No items found" subtitle="Try adding some items" />
    );

    expect(getByText('No items found')).toBeTruthy();
    expect(getByText('Try adding some items')).toBeTruthy();
  });

  it('does not render subtitle when not provided', () => {
    const { queryByText } = render(<EmptyState title="No items found" />);

    const texts = queryByText(/Try/);
    expect(texts).toBeNull();
  });

  it('applies correct title styles', () => {
    const { getByText } = render(<EmptyState title="No items found" />);
    const titleElement = getByText('No items found');
    const flattenedStyles = titleElement.props.style.flat(Infinity);

    expect(flattenedStyles).toContainEqual(
      expect.objectContaining({
        fontSize: 18,
        fontWeight: '600',
      })
    );
  });

  it('applies correct subtitle text color in light theme', () => {
    const { getByText } = render(
      <EmptyState title="No items found" subtitle="Try again" />
    );
    const subtitleElement = getByText('Try again');
    const flattenedStyles = subtitleElement.props.style.flat(Infinity);

    expect(flattenedStyles).toContainEqual(
      expect.objectContaining({
        color: Colors.light.emptyStateText,
      })
    );
  });

  it('applies correct subtitle text color in dark theme', () => {
    const useColorScheme = require('../useColorScheme').useColorScheme;
    useColorScheme.mockReturnValue('dark');

    const { getByText } = render(
      <EmptyState title="No items found" subtitle="Try again" />
    );
    const subtitleElement = getByText('Try again');
    const flattenedStyles = subtitleElement.props.style.flat(Infinity);

    expect(flattenedStyles).toContainEqual(
      expect.objectContaining({
        color: Colors.dark.emptyStateText,
      })
    );
  });

  it('applies text align center to subtitle', () => {
    const { getByText } = render(
      <EmptyState
        title="No items found"
        subtitle="This is a centered subtitle"
      />
    );
    const subtitleElement = getByText('This is a centered subtitle');
    const flattenedStyles = subtitleElement.props.style.flat(Infinity);

    expect(flattenedStyles).toContainEqual(
      expect.objectContaining({
        textAlign: 'center',
      })
    );
  });

  it('handles long title text', () => {
    const longTitle =
      'This is a very long title that should still render correctly in the empty state component';
    const { getByText } = render(<EmptyState title={longTitle} />);

    expect(getByText(longTitle)).toBeTruthy();
  });

  it('handles long subtitle text', () => {
    const longSubtitle =
      'This is a very long subtitle that provides detailed information about the empty state and what the user should do next';
    const { getByText } = render(
      <EmptyState title="No items" subtitle={longSubtitle} />
    );

    expect(getByText(longSubtitle)).toBeTruthy();
  });

  it('handles empty string subtitle', () => {
    const { queryByText } = render(
      <EmptyState title="No items found" subtitle="" />
    );

    expect(queryByText('')).toBeNull();
  });

  it('renders with special characters in title', () => {
    const { getByText } = render(
      <EmptyState title="No items found! (0 results)" />
    );

    expect(getByText('No items found! (0 results)')).toBeTruthy();
  });

  it('renders with special characters in subtitle', () => {
    const { getByText } = render(
      <EmptyState
        title="No items"
        subtitle="Try searching with different keywords: #hashtag @mention"
      />
    );

    expect(
      getByText('Try searching with different keywords: #hashtag @mention')
    ).toBeTruthy();
  });
});
