import { Button, StyleSheet, Text, View } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/src/components/useColorScheme';
import { ColorScheme, LIGHT } from '@/src/lib/types';

export default function ErrorView({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  const colorScheme = useColorScheme() ?? LIGHT;
  const styles = createStyles(colorScheme);

  return (
    <View style={styles.container}>
      <Text style={styles.errorTitle}>Something went wrong</Text>
      <Text selectable style={styles.message}>
        {message}
      </Text>
      {onRetry ? <Button title="Try again" onPress={onRetry} /> : null}
    </View>
  );
}

const createStyles = (colorScheme: ColorScheme) => {
  const colors = Colors[colorScheme];

  return StyleSheet.create({
    container: {
      padding: 16,
      gap: 12,
    },
    errorTitle: {
      color: colors.errorText,
      fontWeight: '600',
    },
    message: {
      color: colors.text,
    },
  });
};
