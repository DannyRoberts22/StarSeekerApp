import { useEffect, useMemo, useRef, useState } from 'react';
import { Button, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Picker as RNPicker } from '@react-native-picker/picker';

import Colors from '@/constants/Colors';
import ErrorView from '@/src/components/ErrorView';
import Loading from '@/src/components/Loading';
import { StyledText } from '@/src/components/StyledText';
import { useColorScheme } from '@/src/components/useColorScheme';
import { useGates } from '@/src/hooks/useGates';
import { useMinimumLoadingTime } from '@/src/hooks/useMinimumLoadingTime';
import { useRoute as useCheapestRoute } from '@/src/hooks/useRoute';
import { storage } from '@/src/lib/storage';
import { ColorScheme, DARK, LIGHT } from '@/src/lib/types';

const Picker = RNPicker as unknown as typeof RNPicker;

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
  const scrollViewRef = useRef<ScrollView>(null);
  const journeyCardRef = useRef<View>(null);

  const {
    data: journey,
    isFetching,
    error: routeError,
  } = useCheapestRoute(submittedRoute.from, submittedRoute.to);

  const showInitialLoading = useMinimumLoadingTime(isLoading);
  const showRouteLoading = useMinimumLoadingTime(isFetching);

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
        from: journey.from.code,
        to: journey.to.code,
        totalCost: journey.totalCost,
        savedAt: Date.now(),
      });
    }
  }, [submittedRoute.from, submittedRoute.to, journey]);

  useEffect(() => {
    if (journey && !showRouteLoading && journeyCardRef.current) {
      journeyCardRef.current.measureLayout(
        scrollViewRef.current as any,
        (_x, y) => {
          scrollViewRef.current?.scrollTo({
            y: y - 100,
            animated: true,
          });
        },
        () => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }
      );
    }
  }, [journey, showRouteLoading]);

  if (showInitialLoading) return <Loading label="Loading gates..." />;
  if (error)
    return <ErrorView message={(error as Error).message} onRetry={refetch} />;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.innerContainer}
      >
        <StyledText style={styles.title}>Cheapest Route</StyledText>

        <StyledText>From</StyledText>
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

        <StyledText>To</StyledText>
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

        {showRouteLoading && <Loading label="Calculating route..." />}

        {routeError && (
          <ErrorView
            message={`Route calculation failed: ${(routeError as Error).message}`}
            onRetry={() => setSubmittedRoute({ ...submittedRoute })}
          />
        )}

        {journey && (
          <View ref={journeyCardRef} style={styles.card}>
            <StyledText style={styles.boldText}>
              From: {journey.from.name} ({journey.from.code})
            </StyledText>
            <StyledText style={styles.boldText}>
              To: {journey.to.name} ({journey.to.code})
            </StyledText>
            <StyledText>Hops:</StyledText>
            {journey.route.map((step, idx) => (
              <StyledText key={idx}>• {step}</StyledText>
            ))}
            <StyledText style={styles.extraBoldText}>
              Total Cost: {journey.totalCost}
            </StyledText>
            <View style={{ height: 8 }} />
            <Button
              title="Save to Journey Memory"
              onPress={() =>
                storage.pushRecentRoute({
                  from: journey.from.code,
                  to: journey.to.code,
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
    boldText: {
      fontWeight: '700',
    },
    extraBoldText: {
      fontWeight: '800',
      marginTop: 8,
    },
  });
};
