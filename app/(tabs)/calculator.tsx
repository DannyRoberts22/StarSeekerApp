import { useState } from 'react';
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Colors from '@/constants/Colors';
import ErrorView from '@/src/components/ErrorView';
import Loading from '@/src/components/Loading';
import { useColorScheme } from '@/src/components/useColorScheme';
import { useTransport } from '@/src/hooks/useTransport';

export default function Calculator() {
  const [distance, setDistance] = useState<string>('');
  const [passengers, setPassengers] = useState<string>('');
  const [parking, setParking] = useState<string>('');
  const [submittedParams, setSubmittedParams] = useState<{
    distance?: number;
    passengers?: number;
    parking?: number;
  }>({});
  const colorScheme = useColorScheme() ?? 'light';
  const styles = createStyles(colorScheme);

  const { data, error, isFetching } = useTransport(
    submittedParams.distance,
    submittedParams.passengers,
    submittedParams.parking
  );

  const handleCalculate = () => {
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
        <Text style={styles.title}>Journey Cost Calculator</Text>

        <Text style={styles.label}>Distance (AU)</Text>
        <TextInput
          inputMode="decimal"
          value={distance}
          onChangeText={setDistance}
          placeholder="e.g. 12.5"
          placeholderTextColor={Colors[colorScheme].tertiaryText}
          style={styles.input}
        />

        <Text style={styles.label}>Passengers</Text>
        <TextInput
          inputMode="numeric"
          value={passengers}
          onChangeText={setPassengers}
          placeholder="e.g. 3"
          placeholderTextColor={Colors[colorScheme].tertiaryText}
          style={styles.input}
        />

        <Text style={styles.label}>Parking days</Text>
        <TextInput
          inputMode="numeric"
          value={parking}
          onChangeText={setParking}
          placeholder="e.g. 2"
          placeholderTextColor={Colors[colorScheme].tertiaryText}
          style={styles.input}
        />

        <Button title="Calculate" onPress={handleCalculate} />

        {isFetching && <Loading label="Calculating..." />}
        {error && <ErrorView message={(error as Error).message} />}
        {data && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Cheapest Option</Text>
            <Text style={styles.text}>
              Name: {data.recommendedTransport.name}
            </Text>
            <Text style={styles.text}>
              Capacity: {data.recommendedTransport.capacity}
            </Text>
            <Text style={styles.text}>
              Rate (per AU): {data.recommendedTransport.ratePerAu}
            </Text>
            <View style={{ height: 8 }} />
            <Text style={styles.boldText}>
              Journey: {data.currency} {data.journeyCost.toFixed(2)}
            </Text>
            <Text style={styles.boldText}>
              Parking: {data.currency} {data.parkingFee.toFixed(2)}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colorScheme: 'light' | 'dark') => {
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
      color: colors.text,
    },
    label: {
      color: colors.text,
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
      borderWidth: colorScheme === 'dark' ? 1 : 0,
      borderColor: colors.border,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: '700',
      marginBottom: 4,
      color: colors.text,
    },
    text: {
      color: colors.text,
    },
    boldText: {
      fontWeight: '700',
      color: colors.text,
    },
  });
};
