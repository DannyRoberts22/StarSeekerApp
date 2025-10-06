import React from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import GateItem from '@/src/components/GateItem';
import { useGates } from '@/src/hooks/useGates';

export default function GatesScreen() {
  const { data, isLoading, error, refetch, isRefetching } = useGates();

  if (isLoading) return null;
  if (error || !data) return null;

  return (
    <SafeAreaView style={{ flex: 1, padding: 12 }}>
      <FlatList
        data={data}
        keyExtractor={g => g.code}
        renderItem={({ item }) => <GateItem gate={item} />}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </SafeAreaView>
  );
}
