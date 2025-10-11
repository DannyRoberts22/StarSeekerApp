import React from 'react';

import { render } from '@testing-library/react-native';

import Colors from '@/constants/Colors';

import Loading from '../Loading';

jest.mock('../useColorScheme', () => ({
  useColorScheme: jest.fn(() => 'light'),
}));

describe('Loading', () => {
  it('renders correctly with default label', () => {
    const { getByText } = render(<Loading />);
    expect(getByText('Loading...')).toBeTruthy();
  });

  it('renders with custom label', () => {
    const { getByText } = render(<Loading label="Fetching data..." />);
    expect(getByText('Fetching data...')).toBeTruthy();
  });

  it('renders LottieView component', () => {
    const { UNSAFE_root } = render(<Loading />);
    const lottieView = UNSAFE_root.findAllByType('LottieView');
    expect(lottieView.length).toBeGreaterThan(0);
  });

  it('applies fullscreen container styles', () => {
    const { UNSAFE_root } = render(<Loading />);
    const container = UNSAFE_root.findByType('View', { deep: false });
    const styleArray = Array.isArray(container.props.style)
      ? container.props.style
      : [container.props.style];
    const flattenedStyles = styleArray.flat(Infinity);

    expect(flattenedStyles).toContainEqual(
      expect.objectContaining({
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      })
    );
  });

  it('applies loading overlay background color for light theme', () => {
    const { UNSAFE_root } = render(<Loading />);
    const container = UNSAFE_root.findByType('View', { deep: false });
    const styleArray = Array.isArray(container.props.style)
      ? container.props.style
      : [container.props.style];
    const flattenedStyles = styleArray.flat(Infinity);

    expect(flattenedStyles).toContainEqual(
      expect.objectContaining({
        backgroundColor: Colors.light.loadingOverlay,
      })
    );
  });

  it('applies loading overlay background color for dark theme', () => {
    const useColorScheme = require('../useColorScheme').useColorScheme;
    useColorScheme.mockReturnValue('dark');

    const { UNSAFE_root } = render(<Loading />);
    const container = UNSAFE_root.findByType('View', { deep: false });
    const styleArray = Array.isArray(container.props.style)
      ? container.props.style
      : [container.props.style];
    const flattenedStyles = styleArray.flat(Infinity);

    expect(flattenedStyles).toContainEqual(
      expect.objectContaining({
        backgroundColor: Colors.dark.loadingOverlay,
      })
    );
  });

  it('configures LottieView with correct props', () => {
    const { UNSAFE_root } = render(<Loading />);
    const lottieView = UNSAFE_root.findByType('LottieView');

    expect(lottieView.props.autoPlay).toBe(true);
    expect(lottieView.props.loop).toBe(true);
    expect(lottieView.props.enableMergePathsAndroidForKitKatAndAbove).toBe(
      true
    );
    expect(lottieView.props.cacheComposition).toBe(true);
  });

  it('sets correct animation size', () => {
    const { UNSAFE_root } = render(<Loading />);
    const lottieView = UNSAFE_root.findByType('LottieView');

    expect(lottieView.props.style).toEqual({ width: 200, height: 200 });
  });

  it('applies correct text styles', () => {
    const { getByText } = render(<Loading label="Test" />);
    const textElement = getByText('Test');
    const flattenedStyles = textElement.props.style.flat(Infinity);

    expect(flattenedStyles).toContainEqual(
      expect.objectContaining({ fontSize: 18 })
    );
  });

  it('configures imageAssetsFolder based on platform', () => {
    const { UNSAFE_root } = render(<Loading />);
    const lottieView = UNSAFE_root.findByType('LottieView');

    expect(
      lottieView.props.imageAssetsFolder === 'assets/lottie' ||
        lottieView.props.imageAssetsFolder === undefined
    ).toBe(true);
  });
});
