import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/src/components/useColorScheme';
import { ColorScheme, LIGHT } from '@/src/lib/types';

export default function Loading({ label = 'Loading...' }: { label?: string }) {
  const colorScheme = useColorScheme() ?? LIGHT;
  const styles = createStyles(colorScheme);

  return (
    <View style={styles.container}>
      <ActivityIndicator color={Colors[colorScheme].text} />
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const createStyles = (colorScheme: ColorScheme) => {
  const colors = Colors[colorScheme];

  return StyleSheet.create({
    container: {
      padding: 24,
      alignItems: 'center',
      gap: 8,
    },
    text: {
      color: colors.text,
    },
  });
};
