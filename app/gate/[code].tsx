import { Alert, Button, ScrollView, StyleSheet, Text } from 'react-native';

import { Stack, useLocalSearchParams } from 'expo-router';

import Colors from '@/constants/Colors';
import ErrorView from '@/src/components/ErrorView';
import Loading from '@/src/components/Loading';
import { useColorScheme } from '@/src/components/useColorScheme';
import { useGate } from '@/src/hooks/useGate';
import { storage } from '@/src/lib/storage';
import { ColorScheme, LIGHT } from '@/src/lib/types';

export default function GateDetails() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const { data, isLoading, error, refetch } = useGate(code!);
  const colorScheme = useColorScheme() ?? LIGHT;
  const styles = createStyles(colorScheme);

  if (isLoading) return <Loading label="Loading gate..." />;
  if (error)
    return <ErrorView message={(error as Error).message} onRetry={refetch} />;

  return (
    <>
      <Stack.Screen
        options={{
          title: data?.name || code,
        }}
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <Text style={styles.title}>{data?.name}</Text>
        <Text style={styles.text}>Code: {data?.code}</Text>
        {data?.links ? (
          <Text selectable style={styles.text}>
            Links: {JSON.stringify(data.links)}
          </Text>
        ) : null}
        {data?.createdAt ? (
          <Text style={styles.text}>
            Created: {new Date(data.createdAt).toLocaleString()}
          </Text>
        ) : null}
        {data?.updatedAt ? (
          <Text style={styles.text}>
            Updated: {new Date(data.updatedAt).toLocaleString()}
          </Text>
        ) : null}

        <Button
          title="★ Toggle Favourite"
          onPress={async () => {
            const favs = await storage.toggleFavGate(data!.code);
            Alert.alert(
              'Favourites updated',
              `Now tracking ${favs.length} favourite gate(s).`
            );
          }}
        />
      </ScrollView>
    </>
  );
}

const createStyles = (colorScheme: ColorScheme) => {
  const colors = Colors[colorScheme];

  return StyleSheet.create({
    container: {
      backgroundColor: colors.background,
    },
    contentContainer: {
      padding: 16,
      gap: 12,
    },
    title: {
      fontSize: 22,
      fontWeight: '800',
      color: colors.text,
    },
    text: {
      color: colors.text,
    },
  });
};
