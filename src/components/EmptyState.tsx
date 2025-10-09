import { StyleSheet, View } from 'react-native';

import Colors from '@/constants/Colors';
import { StyledText } from '@/src/components/StyledText';
import { useColorScheme } from '@/src/components/useColorScheme';
import { ColorScheme, LIGHT } from '@/src/lib/types';

export default function EmptyState({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  const colorScheme = useColorScheme() ?? LIGHT;
  const styles = createStyles(colorScheme);

  return (
    <View style={styles.container}>
      <StyledText style={styles.title}>{title}</StyledText>
      {subtitle ? <StyledText style={styles.subtitle}>{subtitle}</StyledText> : null}
    </View>
  );
}

const createStyles = (colorScheme: ColorScheme) => {
  const colors = Colors[colorScheme];

  return StyleSheet.create({
    container: {
      padding: 24,
      alignItems: 'center',
      gap: 6,
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
    },
    subtitle: {
      color: colors.emptyStateText,
      textAlign: 'center',
    },
  });
};
