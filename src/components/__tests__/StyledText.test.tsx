import React from 'react';

import { render } from '@testing-library/react-native';

import Colors from '@/constants/Colors';

import { StyledText } from '../StyledText';

jest.mock('../useColorScheme', () => ({
  useColorScheme: jest.fn(() => 'light'),
}));

describe('StyledText', () => {
  it('should render correctly with default props', () => {
    const { getByText } = render(<StyledText>Test Text</StyledText>);
    expect(getByText('Test Text')).toBeTruthy();
  });

  it('should apply SpaceMono font family', () => {
    const { getByText } = render(<StyledText>Test Text</StyledText>);
    const textElement = getByText('Test Text');
    const flattenedStyles = textElement.props.style.flat(Infinity);
    expect(flattenedStyles).toContainEqual(
      expect.objectContaining({ fontFamily: 'SpaceMono' })
    );
  });

  it('should apply default text color based on theme', () => {
    const { getByText } = render(<StyledText>Test Text</StyledText>);
    const textElement = getByText('Test Text');
    const flattenedStyles = textElement.props.style.flat(Infinity);
    expect(flattenedStyles).toContainEqual(
      expect.objectContaining({ color: Colors.light.text })
    );
  });

  it('should apply custom styles when provided', () => {
    const customStyle = { fontSize: 24, fontWeight: 'bold' as const };
    const { getByText } = render(
      <StyledText style={customStyle}>Test Text</StyledText>
    );
    const textElement = getByText('Test Text');
    const flattenedStyles = textElement.props.style.flat(Infinity);
    expect(flattenedStyles).toContainEqual(
      expect.objectContaining(customStyle)
    );
  });

  it('should preserve all TextProps', () => {
    const { getByText } = render(
      <StyledText numberOfLines={2} ellipsizeMode="tail">
        Test Text
      </StyledText>
    );
    const textElement = getByText('Test Text');
    expect(textElement.props.numberOfLines).toBe(2);
    expect(textElement.props.ellipsizeMode).toBe('tail');
  });

  it('should render with dark theme colors', () => {
    const useColorScheme = require('../useColorScheme').useColorScheme;
    useColorScheme.mockReturnValue('dark');

    const { getByText } = render(<StyledText>Test Text</StyledText>);
    const textElement = getByText('Test Text');
    const flattenedStyles = textElement.props.style.flat(Infinity);
    expect(flattenedStyles).toContainEqual(
      expect.objectContaining({ color: Colors.dark.text })
    );
  });

  it('should render children correctly', () => {
    const { getByText } = render(
      <StyledText>
        Multiple <StyledText>nested</StyledText> children
      </StyledText>
    );
    expect(getByText(/Multiple/)).toBeTruthy();
    expect(getByText('nested')).toBeTruthy();
  });

  it('should handle testID prop', () => {
    const { getByTestId } = render(
      <StyledText testID="custom-text">Test Text</StyledText>
    );
    expect(getByTestId('custom-text')).toBeTruthy();
  });

  it('should handle selectable prop', () => {
    const { getByText } = render(
      <StyledText selectable>Selectable Text</StyledText>
    );
    const textElement = getByText('Selectable Text');
    expect(textElement.props.selectable).toBe(true);
  });
});
