import { useEffect, useState } from 'react';
import { Button, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Colors from '@/constants/Colors';
import EmptyState from '@/src/components/EmptyState';
import { useColorScheme } from '@/src/components/useColorScheme';
import { RecentRoute, storage } from '@/src/lib/storage';
import { ColorScheme, LIGHT } from '@/src/lib/types';

export default function Memory() {
  const [favGates, setFavGates] = useState<string[]>([]);
  const [recent, setRecent] = useState<RecentRoute[]>([]);
  const colorScheme = useColorScheme() ?? LIGHT;
  const styles = createStyles(colorScheme);

  async function load() {
    const [f, r] = await Promise.all([
      storage.getFavGates(),
      storage.getRecentRoutes(),
    ]);
    setFavGates(f);
    setRecent(r);
  }

  useEffect(() => {
    load();
  }, []);

  // Create a single data structure for the FlatList
  const sections = [
    { type: 'header', data: null },
    { type: 'refresh-button', data: null },
    { type: 'section-title', data: 'Favourite Gates' },
    ...(favGates.length === 0
      ? [{ type: 'empty-fav', data: null }]
      : favGates.map(gate => ({ type: 'fav-gate', data: gate }))),
    { type: 'section-title', data: 'Recent Routes' },
    ...(recent.length === 0
      ? [{ type: 'empty-recent', data: null }]
      : recent.map(route => ({ type: 'recent-route', data: route }))),
  ];

  type SectionItem = {
    type: string;
    data: string | RecentRoute | null;
  };

  const renderItem = ({ item }: { item: SectionItem }) => {
    switch (item.type) {
      case 'header':
        return <Text style={styles.title}>Journey Memory</Text>;
      case 'refresh-button':
        return (
          <View style={styles.buttonContainer}>
            <Button title="Refresh" onPress={load} />
          </View>
        );
      case 'section-title':
        return (
          <Text
            style={
              item.data === 'Recent Routes'
                ? styles.sectionTitleSpaced
                : styles.sectionTitle
            }
          >
            {String(item.data)}
          </Text>
        );
      case 'empty-fav':
        return (
          <EmptyState
            title="No favourites yet"
            subtitle="Open a gate and tap ★ Toggle Favourite."
          />
        );
      case 'empty-recent':
        return (
          <EmptyState
            title="No recent routes"
            subtitle="Calculate a route to see it here."
          />
        );
      case 'fav-gate':
        return <Text style={styles.text}>• {String(item.data)}</Text>;
      case 'recent-route': {
        const route = item.data as RecentRoute;
        return (
          <Text style={styles.text}>
            • {route.from} → {route.to}{' '}
            {route.totalCost != null ? `(cost: ${route.totalCost})` : ''} –{' '}
            {new Date(route.savedAt).toLocaleString()}
          </Text>
        );
      }
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={sections}
        keyExtractor={(item, index) => `${item.type}-${index}`}
        renderItem={renderItem}
        contentContainerStyle={styles.innerContainer}
      />
    </SafeAreaView>
  );
}

const createStyles = (colorScheme: ColorScheme) => {
  const colors = Colors[colorScheme];

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    innerContainer: {
      padding: 16,
      gap: 16,
    },
    title: {
      fontSize: 22,
      fontWeight: '800',
      color: colors.text,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.text,
    },
    sectionTitleSpaced: {
      fontSize: 16,
      fontWeight: '700',
      marginTop: 8,
      color: colors.text,
    },
    text: {
      color: colors.text,
    },
    listContainer: {
      flex: 1,
      minHeight: 100,
    },
    list: {
      flexGrow: 0,
    },
    buttonContainer: {
      marginBottom: 16,
    },
  });
};
