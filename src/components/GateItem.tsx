import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useRouter } from 'expo-router';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/src/components/useColorScheme';
import { ColorScheme, DARK, type Gate, LIGHT } from '@/src/lib/types';

export default function GateItem({ gate }: { gate: Gate }) {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? LIGHT;
  const styles = createStyles(colorScheme);

  return (
    <Pressable
      onPress={() =>
        router.push({ pathname: '/gate/[code]', params: { code: gate.code } })
      }
      style={({ pressed }) => [
        styles.container,
        pressed && styles.containerPressed,
      ]}
    >
      <Text style={styles.title}>{gate.name}</Text>
      <View style={styles.detailsRow}>
        <Text style={styles.codeText}>Code: {gate.code}</Text>
        {gate.updatedAt ? (
          <Text style={styles.updatedText}>
            Updated: {new Date(gate.updatedAt).toLocaleDateString()}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const createStyles = (colorScheme: ColorScheme) => {
  const colors = Colors[colorScheme];

  return StyleSheet.create({
    container: {
      padding: 14,
      backgroundColor: colors.background,
      borderRadius: 12,
      shadowOpacity: 0.06,
      shadowRadius: 8,
      marginBottom: 10,
      borderWidth: colorScheme === DARK ? 1 : 0,
      borderColor: colors.border,
    },
    containerPressed: {
      backgroundColor: colors.pressedBackground,
    },
    title: {
      fontWeight: '700',
      color: colors.text,
      fontSize: 16,
    },
    detailsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 4,
    },
    codeText: {
      color: colors.secondaryText,
      fontSize: 14,
    },
    updatedText: {
      color: colors.tertiaryText,
      fontSize: 14,
    },
  });
};
