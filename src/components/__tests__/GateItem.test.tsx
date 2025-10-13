import React from 'react';

import { fireEvent, render } from '@testing-library/react-native';

import Colors from '@/constants/Colors';
import { Gate } from '@/src/lib/types';

import GateItem from '../GateItem';

jest.mock('../useColorScheme', () => ({
  useColorScheme: jest.fn(() => 'light'),
}));

const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('GateItem', () => {
  const mockGate: Gate = {
    code: 'GATE001',
    name: 'Alpha Centauri Gate',
    links: [],
    createdAt: Date.parse('2024-01-01T00:00:00.000Z'),
    updatedAt: '2024-01-15T00:00:00.000Z',
  };

  beforeEach(() => {
    mockPush.mockClear();
  });

  it('should render correctly with gate data', () => {
    const { getByText } = render(<GateItem gate={mockGate} />);

    expect(getByText('Alpha Centauri Gate')).toBeTruthy();
    expect(getByText('Code: GATE001')).toBeTruthy();
  });

  it('should display gate name', () => {
    const { getByText } = render(<GateItem gate={mockGate} />);
    expect(getByText('Alpha Centauri Gate')).toBeTruthy();
  });

  it('should display gate code', () => {
    const { getByText } = render(<GateItem gate={mockGate} />);
    expect(getByText('Code: GATE001')).toBeTruthy();
  });

  it('should display formatted update date when updatedAt is provided', () => {
    const { getByText } = render(<GateItem gate={mockGate} />);
    const updatedText = getByText(/Updated:/);
    expect(updatedText).toBeTruthy();
  });

  it('should not display update date when updatedAt is not provided', () => {
    const gateWithoutUpdate = { ...mockGate, updatedAt: undefined };
    const { queryByText } = render(<GateItem gate={gateWithoutUpdate} />);

    expect(queryByText(/Updated:/)).toBeNull();
  });

  it('should navigate to gate detail screen when pressed', () => {
    const { getByText } = render(<GateItem gate={mockGate} />);

    const item = getByText('Alpha Centauri Gate');
    fireEvent.press(item);

    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/gate/[code]',
      params: { code: 'GATE001' },
    });
  });

  it('should apply correct title styles', () => {
    const { getByText } = render(<GateItem gate={mockGate} />);
    const titleElement = getByText('Alpha Centauri Gate');
    const flattenedStyles = titleElement.props.style.flat(Infinity);

    expect(flattenedStyles).toContainEqual(
      expect.objectContaining({
        fontWeight: '700',
        fontSize: 16,
      })
    );
  });

  it('should apply secondary text color to code text in light theme', () => {
    const { getByText } = render(<GateItem gate={mockGate} />);
    const codeElement = getByText('Code: GATE001');
    const flattenedStyles = codeElement.props.style.flat(Infinity);

    expect(flattenedStyles).toContainEqual(
      expect.objectContaining({
        color: Colors.light.secondaryText,
        fontSize: 14,
      })
    );
  });

  it('should apply tertiary text color to updated text in light theme', () => {
    const { getByText } = render(<GateItem gate={mockGate} />);
    const updatedElement = getByText(/Updated:/);
    const flattenedStyles = updatedElement.props.style.flat(Infinity);

    expect(flattenedStyles).toContainEqual(
      expect.objectContaining({
        color: Colors.light.tertiaryText,
        fontSize: 14,
      })
    );
  });

  it('applies correct colors in dark theme', () => {
    const useColorScheme = require('../useColorScheme').useColorScheme;
    useColorScheme.mockReturnValue('dark');

    const { getByText } = render(<GateItem gate={mockGate} />);
    const codeElement = getByText('Code: GATE001');
    const flattenedStyles = codeElement.props.style.flat(Infinity);

    expect(flattenedStyles).toContainEqual(
      expect.objectContaining({
        color: Colors.dark.secondaryText,
      })
    );
  });

  it('applies theme-specific border styles', () => {
    const { UNSAFE_root } = render(<GateItem gate={mockGate} />);
    const pressable = UNSAFE_root.findByType('View');
    const flattenedStyles = pressable.props.style.flat(Infinity);

    const hasBorderWidth = flattenedStyles.some(
      (style: any) => style && typeof style.borderWidth !== 'undefined'
    );
    const hasBorderRadius = flattenedStyles.some(
      (style: any) => style && style.borderRadius === 12
    );

    expect(hasBorderWidth).toBe(true);
    expect(hasBorderRadius).toBe(true);
  });

  it('formats date correctly', () => {
    const { getByText } = render(<GateItem gate={mockGate} />);
    const updatedElement = getByText(/Updated:/);

    expect(updatedElement).toBeTruthy();
    expect(updatedElement.props.children[0]).toBe('Updated: ');
  });

  it('handles gate with no name', () => {
    const gateNoName = { ...mockGate, name: '' };
    const { getByText } = render(<GateItem gate={gateNoName} />);

    expect(getByText('Code: GATE001')).toBeTruthy();
  });

  it('handles press events correctly', () => {
    const { getByText } = render(<GateItem gate={mockGate} />);
    const item = getByText('Alpha Centauri Gate');

    fireEvent.press(item);
    fireEvent.press(item);

    expect(mockPush).toHaveBeenCalledTimes(2);
    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/gate/[code]',
      params: { code: 'GATE001' },
    });
  });

  it('applies correct container styles', () => {
    const { UNSAFE_root } = render(<GateItem gate={mockGate} />);
    const container = UNSAFE_root.findByType('View');
    const flattenedStyles = container.props.style.flat(Infinity);

    expect(flattenedStyles).toContainEqual(
      expect.objectContaining({
        padding: 14,
        borderRadius: 12,
        marginBottom: 10,
      })
    );
  });

  it('handles gates with different codes', () => {
    const gate2 = { ...mockGate, code: 'GATE999', name: 'Beta Gate' };
    const { getByText } = render(<GateItem gate={gate2} />);

    fireEvent.press(getByText('Beta Gate'));

    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/gate/[code]',
      params: { code: 'GATE999' },
    });
  });
});
