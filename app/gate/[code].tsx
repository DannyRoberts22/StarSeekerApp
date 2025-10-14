import { useEffect } from 'react';
import { Alert, Button, ScrollView, StyleSheet } from 'react-native';

import { useLocalSearchParams, useNavigation } from 'expo-router';

import Colors from '@/constants/Colors';
import ErrorView from '@/src/components/ErrorView';
import Loading from '@/src/components/Loading';
import { StyledText } from '@/src/components/StyledText';
import { useColorScheme } from '@/src/components/useColorScheme';
import { useGate } from '@/src/hooks/useGate';
import { useMinimumLoadingTime } from '@/src/hooks/useMinimumLoadingTime';
import { storage } from '@/src/lib/storage';
import { ColorScheme, LIGHT } from '@/src/lib/types';

export default function GateDetails() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const { data, isLoading, error, refetch } = useGate(code!);
  const navigation = useNavigation();
  const colorScheme = useColorScheme() ?? LIGHT;
  const styles = createStyles(colorScheme);

  const showLoading = useMinimumLoadingTime(isLoading);

  useEffect(() => {
    if (data?.name) {
      navigation.setOptions({ title: data.name });
    } else if (code) {
      navigation.setOptions({ title: `Gate ${code}` });
    }
  }, [data?.name, code, navigation]);

  if (showLoading) return <Loading label="Loading gate..." />;
  if (error)
    return <ErrorView message={(error as Error).message} onRetry={refetch} />;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <StyledText style={styles.title}>{data?.name}</StyledText>
      <StyledText>Code: {data?.code}</StyledText>
      {data?.links ? (
        <StyledText selectable>Links: {JSON.stringify(data.links)}</StyledText>
      ) : null}
      {data?.createdAt ? (
        <StyledText>
          Created: {new Date(data.createdAt).toLocaleString()}
        </StyledText>
      ) : null}
      {data?.updatedAt ? (
        <StyledText>
          Updated: {new Date(data.updatedAt).toLocaleString()}
        </StyledText>
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
    },
  });
};
