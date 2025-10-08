import React from 'react';
import { FlatList, RefreshControl, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Colors from '@/constants/Colors';
import GateItem from '@/src/components/GateItem';
import { useColorScheme } from '@/src/components/useColorScheme';
import { useGates } from '@/src/hooks/useGates';

export default function GatesScreen() {
  const { data, isLoading, error, refetch, isRefetching } = useGates();
  const colorScheme = useColorScheme() ?? 'light';
  const styles = createStyles(colorScheme);

  if (isLoading) return null;
  if (error || !data) return null;

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={g => g.code}
        renderItem={({ item }) => <GateItem gate={item} />}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        contentContainerStyle={styles.contentContainer}
      />
    </SafeAreaView>
  );
}

const createStyles = (colorScheme: 'light' | 'dark') => {
  const colors = Colors[colorScheme];

  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 12,
      backgroundColor: colors.background,
    },
    contentContainer: {
      paddingBottom: 40,
    },
  });
};
