import { Platform, StyleSheet, View } from 'react-native';

import LottieView from 'lottie-react-native';

import Colors from '@/constants/Colors';
import { StyledText } from '@/src/components/StyledText';
import { useColorScheme } from '@/src/components/useColorScheme';
import { ColorScheme, LIGHT } from '@/src/lib/types';

export default function Loading({ label = 'Loading...' }: { label?: string }) {
  const colorScheme = useColorScheme() ?? LIGHT;
  const styles = createStyles(colorScheme);

  return (
    <View style={styles.container}>
      <LottieView
        source={require('../../assets/lottie/loading.json')}
        autoPlay
        loop
        style={styles.lottie}
        enableMergePathsAndroidForKitKatAndAbove
        cacheComposition
        imageAssetsFolder={Platform.select({
          android: 'assets/lottie',
          ios: undefined,
        })}
      />
      <StyledText style={styles.text}>{label}</StyledText>
    </View>
  );
}

const createStyles = (colorScheme: ColorScheme) => {
  const colors = Colors[colorScheme];

  return StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'center',
      alignItems: 'center',
      gap: 24,
      backgroundColor: colors.loadingOverlay,
    },
    lottie: {
      width: 200,
      height: 200,
    },
    text: {
      fontSize: 18,
    },
  });
};
