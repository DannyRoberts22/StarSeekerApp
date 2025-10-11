import { useState } from 'react';
import { Button, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Colors from '@/constants/Colors';
import ErrorView from '@/src/components/ErrorView';
import Loading from '@/src/components/Loading';
import OfflineNotice from '@/src/components/OfflineNotice';
import { StyledText } from '@/src/components/StyledText';
import { useColorScheme } from '@/src/components/useColorScheme';
import { useIsOnline } from '@/src/hooks/useIsOnline';
import { useMinimumLoadingTime } from '@/src/hooks/useMinimumLoadingTime';
import { useTransport } from '@/src/hooks/useTransport';
import { ColorScheme, DARK, LIGHT } from '@/src/lib/types';

export default function Calculator() {
  const [distance, setDistance] = useState<string>('');
  const [passengers, setPassengers] = useState<string>('');
  const [parking, setParking] = useState<string>('');
  const [submittedParams, setSubmittedParams] = useState<{
    distance?: number;
    passengers?: number;
    parking?: number;
  }>({});
  const [showOfflineNotice, setShowOfflineNotice] = useState(false);
  const colorScheme = useColorScheme() ?? LIGHT;
  const styles = createStyles(colorScheme);
  const isOnline = useIsOnline();

  const { data, error, isFetching } = useTransport(
    submittedParams.distance,
    submittedParams.passengers,
    submittedParams.parking
  );

  const showLoading = useMinimumLoadingTime(isFetching);

  const handleCalculate = () => {
    if (!isOnline) {
      setShowOfflineNotice(true);
      return;
    }

    setShowOfflineNotice(false);
    const d = distance ? Number(distance) : undefined;
    const p = passengers ? Number(passengers) : undefined;
    const prk = parking ? Number(parking) : undefined;

    if (d !== undefined && p !== undefined && prk !== undefined) {
      setSubmittedParams({ distance: d, passengers: p, parking: prk });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.innerContainer}
        keyboardShouldPersistTaps="handled"
      >
        <StyledText style={styles.title}>Journey Cost Calculator</StyledText>

        <StyledText>Distance (AU)</StyledText>
        <TextInput
          inputMode="decimal"
          value={distance}
          onChangeText={setDistance}
          placeholder="e.g. 12.5"
          placeholderTextColor={Colors[colorScheme].tertiaryText}
          style={styles.input}
        />

        <StyledText>Passengers</StyledText>
        <TextInput
          inputMode="numeric"
          value={passengers}
          onChangeText={setPassengers}
          placeholder="e.g. 3"
          placeholderTextColor={Colors[colorScheme].tertiaryText}
          style={styles.input}
        />

        <StyledText>Parking days</StyledText>
        <TextInput
          inputMode="numeric"
          value={parking}
          onChangeText={setParking}
          placeholder="e.g. 2"
          placeholderTextColor={Colors[colorScheme].tertiaryText}
          style={styles.input}
        />

        <Button title="Calculate" onPress={handleCalculate} />

        {showOfflineNotice && (
          <OfflineNotice message="You need an internet connection to calculate journey costs." />
        )}
        {showLoading && <Loading label="Calculating..." />}
        {error && <ErrorView message={(error as Error).message} />}
        {data && (
          <View style={styles.card}>
            <StyledText style={styles.cardTitle}>Cheapest Option</StyledText>
            <StyledText>Name: {data.recommendedTransport.name}</StyledText>
            <StyledText>
              Capacity: {data.recommendedTransport.capacity}
            </StyledText>
            <StyledText>
              Rate (per AU): {data.recommendedTransport.ratePerAu}
            </StyledText>
            <View style={{ height: 8 }} />
            <StyledText style={styles.boldText}>
              Journey: {data.currency} {data.journeyCost.toFixed(2)}
            </StyledText>
            <StyledText style={styles.boldText}>
              Parking: {data.currency} {data.parkingFee.toFixed(2)}
            </StyledText>
          </View>
        )}
      </ScrollView>
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
      gap: 10,
    },
    title: {
      fontSize: 22,
      fontWeight: '800',
    },
    input: {
      borderWidth: 1,
      borderColor: colors.inputBorder,
      borderRadius: 10,
      padding: 12,
      backgroundColor: colors.inputBackground,
      color: colors.text,
    },
    card: {
      backgroundColor: colors.cardBackground,
      padding: 16,
      borderRadius: 14,
      shadowColor: colors.cardShadow,
      shadowOpacity: 0.08,
      shadowRadius: 8,
      gap: 6,
      borderWidth: colorScheme === DARK ? 1 : 0,
      borderColor: colors.border,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: '700',
      marginBottom: 4,
    },
    boldText: {
      fontWeight: '700',
    },
  });
};
