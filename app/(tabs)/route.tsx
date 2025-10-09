import { useEffect, useMemo, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Picker as RNPicker } from '@react-native-picker/picker';

import Colors from '@/constants/Colors';
import ErrorView from '@/src/components/ErrorView';
import Loading from '@/src/components/Loading';
import { useColorScheme } from '@/src/components/useColorScheme';
import { useGates } from '@/src/hooks/useGates';
import { useRoute as useCheapestRoute } from '@/src/hooks/useRoute';
import { storage } from '@/src/lib/storage';
import { ColorScheme, DARK, LIGHT } from '@/src/lib/types';

const Picker = RNPicker as unknown as typeof RNPicker; // RN 0.74+ might use @react-native-picker/picker

export default function RouteScreen() {
  const { data: gates, isLoading, error, refetch } = useGates();
  const [from, setFrom] = useState<string | undefined>();
  const [to, setTo] = useState<string | undefined>();
  const [submittedRoute, setSubmittedRoute] = useState<{
    from?: string;
    to?: string;
  }>({});
  const colorScheme = useColorScheme() ?? LIGHT;
  const styles = createStyles(colorScheme);

  const { data: journey, isFetching } = useCheapestRoute(
    submittedRoute.from,
    submittedRoute.to
  );

  const handleFindRoute = () => {
    if (from && to) {
      setSubmittedRoute({ from, to });
    }
  };

  const gateOptions = useMemo(
    () =>
      gates?.map(g => ({ label: `${g.name} (${g.code})`, value: g.code })) ??
      [],
    [gates]
  );

  useEffect(() => {
    if (submittedRoute.from && submittedRoute.to && journey) {
      storage.pushRecentRoute({
        from: submittedRoute.from,
        to: submittedRoute.to,
        totalCost: journey.totalCost,
        savedAt: Date.now(),
      });
    }
  }, [submittedRoute.from, submittedRoute.to, journey]);

  if (isLoading) return <Loading label="Loading gates..." />;
  if (error)
    return <ErrorView message={(error as Error).message} onRetry={refetch} />;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.innerContainer}>
        <Text style={styles.title}>Cheapest Route</Text>

        <Text style={styles.label}>From</Text>
        <Picker selectedValue={from} onValueChange={v => setFrom(v)}>
          <RNPicker.Item label="Select start gate" value={undefined} />
          {gateOptions.map(opt => (
            <RNPicker.Item
              key={opt.value}
              label={opt.label}
              value={opt.value}
            />
          ))}
        </Picker>

        <Text style={styles.label}>To</Text>
        <Picker selectedValue={to} onValueChange={v => setTo(v)}>
          <RNPicker.Item label="Select target gate" value={undefined} />
          {gateOptions.map(opt => (
            <RNPicker.Item
              key={opt.value}
              label={opt.label}
              value={opt.value}
            />
          ))}
        </Picker>

        <Button title="Find route" onPress={handleFindRoute} />

        {isFetching && <Loading label="Calculating route..." />}

        {journey && (
          <View style={styles.card}>
            <Text style={styles.boldText}>From: {journey.from}</Text>
            <Text style={styles.boldText}>To: {journey.to}</Text>
            <Text style={styles.text}>Hops:</Text>
            {journey.route.map((step, idx) => (
              <Text key={idx} style={styles.text}>
                • {step}
              </Text>
            ))}
            <Text style={styles.extraBoldText}>
              Total Cost: {journey.totalCost}
            </Text>
            <View style={{ height: 8 }} />
            <Button
              title="Save to Journey Memory"
              onPress={() =>
                storage.pushRecentRoute({
                  from: journey.from,
                  to: journey.to,
                  totalCost: journey.totalCost,
                  savedAt: Date.now(),
                })
              }
            />
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
      gap: 12,
    },
    title: {
      fontSize: 22,
      fontWeight: '800',
      color: colors.text,
    },
    label: {
      color: colors.text,
    },
    card: {
      backgroundColor: colors.cardBackground,
      padding: 16,
      borderRadius: 14,
      gap: 8,
      shadowColor: colors.cardShadow,
      shadowOpacity: 0.08,
      shadowRadius: 8,
      borderWidth: colorScheme === DARK ? 1 : 0,
      borderColor: colors.border,
    },
    text: {
      color: colors.text,
    },
    boldText: {
      fontWeight: '700',
      color: colors.text,
    },
    extraBoldText: {
      fontWeight: '800',
      marginTop: 8,
      color: colors.text,
    },
  });
};
