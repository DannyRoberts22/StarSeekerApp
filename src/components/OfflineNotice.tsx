import React from 'react';
import { StyleSheet, View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import Colors from '@/constants/Colors';
import { StyledText } from '@/src/components/StyledText';
import { useColorScheme } from '@/src/components/useColorScheme';
import { ColorScheme, DARK, LIGHT } from '@/src/lib/types';

interface OfflineNoticeProps {
  message?: string;
}

export default function OfflineNotice({
  message = 'No internet connection. Please check your network and try again.',
}: OfflineNoticeProps) {
  const colorScheme = useColorScheme() ?? LIGHT;
  const styles = createStyles(colorScheme);

  return (
    <View style={styles.container} testID="offline-notice">
      <MaterialIcons
        name="wifi-off"
        size={48}
        color={styles.icon.color}
        testID="offline-icon"
      />
      <StyledText style={styles.title}>You're Offline</StyledText>
      <StyledText style={styles.message}>{message}</StyledText>
    </View>
  );
}

const createStyles = (colorScheme: ColorScheme) => {
  const colors = Colors[colorScheme];

  return StyleSheet.create({
    container: {
      padding: 20,
      backgroundColor: colors.cardBackground,
      borderRadius: 12,
      alignItems: 'center',
      borderWidth: colorScheme === DARK ? 1 : 0,
      borderColor: colors.border,
      marginVertical: 16,
    },
    icon: {
      color: colors.tertiaryText,
      marginBottom: 12,
    },
    title: {
      fontSize: 18,
      fontWeight: '700',
      marginBottom: 8,
      textAlign: 'center',
    },
    message: {
      fontSize: 14,
      color: colors.secondaryText,
      textAlign: 'center',
      lineHeight: 20,
    },
  });
};
