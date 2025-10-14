import React, { useState } from 'react';
import { FlatList, RefreshControl, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Colors from '@/constants/Colors';
import ErrorView from '@/src/components/ErrorView';
import GateItem from '@/src/components/GateItem';
import Loading from '@/src/components/Loading';
import OfflineNotice from '@/src/components/OfflineNotice';
import { useColorScheme } from '@/src/components/useColorScheme';
import { useGates } from '@/src/hooks/useGates';
import { useIsOnline } from '@/src/hooks/useIsOnline';
import { useMinimumLoadingTime } from '@/src/hooks/useMinimumLoadingTime';
import { ColorScheme, LIGHT } from '@/src/lib/types';

export default function GatesScreen() {
  const { data, isLoading, error, refetch, isRefetching } = useGates();
  const [showOfflineNotice, setShowOfflineNotice] = useState(false);
  const isOnline = useIsOnline();
  const colorScheme = useColorScheme() ?? LIGHT;
  const styles = createStyles(colorScheme);

  const showLoading = useMinimumLoadingTime(isLoading);

  const handleRefresh = () => {
    if (!isOnline) {
      setShowOfflineNotice(true);
      return;
    }
    setShowOfflineNotice(false);
    refetch();
  };

  if (showLoading) return <Loading label="Loading gates..." />;
  if (error)
    return (
      <SafeAreaView style={styles.container}>
        <ErrorView message={(error as Error).message} onRetry={refetch} />
      </SafeAreaView>
    );
  if (!data)
    return (
      <SafeAreaView style={styles.container}>
        <ErrorView message="No gates available" onRetry={refetch} />
      </SafeAreaView>
    );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={g => g.code}
        renderItem={({ item }) => <GateItem gate={item} />}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={handleRefresh} />
        }
        contentContainerStyle={styles.contentContainer}
        ListFooterComponent={
          showOfflineNotice ? (
            <OfflineNotice message="You need an internet connection to refresh the gates list." />
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const createStyles = (colorScheme: ColorScheme) => {
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
