import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

type RocketLoadingProps = {
  size?: number;
  color?: string;
};

export function RocketLoading({
  size = 60,
  color = '#fff',
}: RocketLoadingProps) {
  const flame1Scale = useSharedValue(1);
  const flame1Opacity = useSharedValue(1);
  const flame2Scale = useSharedValue(0.8);
  const flame2Opacity = useSharedValue(0.8);
  const flame3Scale = useSharedValue(0.6);
  const flame3Opacity = useSharedValue(0.6);

  useEffect(() => {
    // Flame 1 - main engine fire
    flame1Scale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 150, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.8, { duration: 150, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
    flame1Opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 150 }),
        withTiming(0.7, { duration: 150 })
      ),
      -1,
      false
    );

    // Flame 2 - delayed for stagger effect
    flame2Scale.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 200, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.6, { duration: 200, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
    flame2Opacity.value = withRepeat(
      withSequence(
        withTiming(0.9, { duration: 200 }),
        withTiming(0.5, { duration: 200 })
      ),
      -1,
      false
    );

    // Flame 3 - most delayed for stagger effect
    flame3Scale.value = withRepeat(
      withSequence(
        withTiming(0.9, { duration: 250, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.5, { duration: 250, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
    flame3Opacity.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: 250 }),
        withTiming(0.3, { duration: 250 })
      ),
      -1,
      false
    );
  }, [
    flame1Scale,
    flame1Opacity,
    flame2Scale,
    flame2Opacity,
    flame3Scale,
    flame3Opacity,
  ]);

  const flame1Style = useAnimatedStyle(() => ({
    transform: [{ scaleY: flame1Scale.value }],
    opacity: flame1Opacity.value,
  }));

  const flame2Style = useAnimatedStyle(() => ({
    transform: [{ scaleY: flame2Scale.value }],
    opacity: flame2Opacity.value,
  }));

  const flame3Style = useAnimatedStyle(() => ({
    transform: [{ scaleY: flame3Scale.value }],
    opacity: flame3Opacity.value,
  }));

  const rocketSize = size;
  const flameWidth = rocketSize * 0.4;
  const flameHeight = rocketSize * 0.5;

  return (
    <View style={[styles.container, { width: rocketSize, height: rocketSize }]}>
      {/* Rocket body */}
      <View
        style={[
          styles.rocketBody,
          {
            width: rocketSize * 0.4,
            height: rocketSize * 0.6,
            backgroundColor: color,
            borderTopLeftRadius: rocketSize * 0.2,
            borderTopRightRadius: rocketSize * 0.2,
          },
        ]}
      >
        {/* Rocket tip */}
        <View
          style={[
            styles.rocketTip,
            {
              width: 0,
              height: 0,
              borderLeftWidth: rocketSize * 0.2,
              borderRightWidth: rocketSize * 0.2,
              borderBottomWidth: rocketSize * 0.3,
              borderBottomColor: color,
              top: -rocketSize * 0.3,
            },
          ]}
        />

        {/* Window */}
        <View
          style={[
            styles.window,
            {
              width: rocketSize * 0.15,
              height: rocketSize * 0.15,
              borderRadius: rocketSize * 0.075,
              backgroundColor: '#4A90E2',
            },
          ]}
        />
      </View>

      {/* Flames - rendered behind rocket */}
      <View style={styles.flameContainer}>
        {/* Flame 3 - outermost */}
        <Animated.View
          style={[
            styles.flame,
            {
              width: flameWidth * 1.4,
              height: flameHeight * 1.2,
              backgroundColor: '#FFA500',
              borderBottomLeftRadius: flameHeight * 0.6,
              borderBottomRightRadius: flameHeight * 0.6,
            },
            flame3Style,
          ]}
        />
        {/* Flame 2 - middle */}
        <Animated.View
          style={[
            styles.flame,
            {
              width: flameWidth * 1.1,
              height: flameHeight,
              backgroundColor: '#FF6B00',
              borderBottomLeftRadius: flameHeight * 0.5,
              borderBottomRightRadius: flameHeight * 0.5,
            },
            flame2Style,
          ]}
        />
        {/* Flame 1 - innermost/brightest */}
        <Animated.View
          style={[
            styles.flame,
            {
              width: flameWidth,
              height: flameHeight * 0.8,
              backgroundColor: '#FFD700',
              borderBottomLeftRadius: flameHeight * 0.4,
              borderBottomRightRadius: flameHeight * 0.4,
            },
            flame1Style,
          ]}
        />
      </View>

      {/* Fins */}
      <View
        style={[
          styles.fin,
          styles.finLeft,
          {
            width: rocketSize * 0.25,
            height: rocketSize * 0.3,
            backgroundColor: color,
            left: -rocketSize * 0.15,
            bottom: 0,
          },
        ]}
      />
      <View
        style={[
          styles.fin,
          styles.finRight,
          {
            width: rocketSize * 0.25,
            height: rocketSize * 0.3,
            backgroundColor: color,
            right: -rocketSize * 0.15,
            bottom: 0,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  rocketBody: {
    position: 'relative',
    zIndex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rocketTip: {
    position: 'absolute',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  window: {
    marginTop: 10,
  },
  flameContainer: {
    position: 'absolute',
    bottom: -10,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  flame: {
    position: 'absolute',
  },
  fin: {
    position: 'absolute',
    zIndex: 1,
  },
  finLeft: {
    transform: [{ skewY: '-20deg' }],
  },
  finRight: {
    transform: [{ skewY: '20deg' }],
  },
});
