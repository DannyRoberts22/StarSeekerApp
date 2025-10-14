import { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Ionicons } from '@expo/vector-icons';
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
    return (
      <SafeAreaView style={styles.container}>
        <ErrorView message={(error as Error).message} onRetry={refetch} />
      </SafeAreaView>
    );

  const [isFavorite, setIsFavorite] = useState(false);

  // Check if gate is favorited on load
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (data?.code) {
        try {
          const favorites = await storage.getFavGates();
          setIsFavorite(favorites.includes(data.code));
        } catch {
          // Silent fail for favorite status check
        }
      }
    };
    checkFavoriteStatus();
  }, [data?.code]);

  const handleToggleFavorite = async () => {
    try {
      const favs = await storage.toggleFavGate(data!.code);
      setIsFavorite(favs.includes(data!.code));
      Alert.alert(
        'Favourites updated',
        `Now tracking ${favs.length} favourite gate(s).`
      );
    } catch {
      Alert.alert('Error', 'Failed to update favourites');
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Card */}
      <View style={styles.headerCard}>
        <View style={styles.headerContent}>
          <View style={styles.titleRow}>
            <View style={styles.titleContainer}>
              <Ionicons
                name="planet-outline"
                size={28}
                color={Colors[colorScheme].tint}
                style={styles.titleIcon}
              />
              <StyledText style={styles.title}>{data?.name}</StyledText>
            </View>
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={handleToggleFavorite}
              testID="favorite-button"
            >
              <Ionicons
                name={isFavorite ? 'star' : 'star-outline'}
                size={24}
                color={isFavorite ? '#FFD700' : Colors[colorScheme].text}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.codeContainer}>
            <Ionicons
              name="barcode-outline"
              size={16}
              color={Colors[colorScheme].tabIconDefault}
            />
            <StyledText style={styles.codeText}>{data?.code}</StyledText>
          </View>
        </View>
      </View>

      {/* Links Section */}
      {data?.links && data.links.length > 0 && (
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons
              name="link-outline"
              size={20}
              color={Colors[colorScheme].tint}
            />
            <StyledText style={styles.sectionTitle}>Connected Gates</StyledText>
          </View>
          <View style={styles.linksContainer}>
            {Array.isArray(data.links) ? (
              data.links.map((link, index) => (
                <View key={index} style={styles.linkItem}>
                  <Ionicons
                    name="arrow-forward-outline"
                    size={16}
                    color={Colors[colorScheme].tabIconDefault}
                  />
                  <StyledText style={styles.linkText}>
                    {typeof link === 'string' ? link : link.code}
                  </StyledText>
                </View>
              ))
            ) : (
              <View style={styles.linkItem}>
                <Ionicons
                  name="arrow-forward-outline"
                  size={16}
                  color={Colors[colorScheme].tabIconDefault}
                />
                <StyledText style={styles.linkText}>
                  {String(data.links)}
                </StyledText>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Metadata Section */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <Ionicons
            name="information-circle-outline"
            size={20}
            color={Colors[colorScheme].tint}
          />
          <StyledText style={styles.sectionTitle}>Details</StyledText>
        </View>

        {data?.createdAt && (
          <View style={styles.metadataItem}>
            <View style={styles.metadataLabel}>
              <Ionicons
                name="calendar-outline"
                size={16}
                color={Colors[colorScheme].tabIconDefault}
              />
              <StyledText style={styles.metadataLabelText}>Created</StyledText>
            </View>
            <StyledText style={styles.metadataValue}>
              {new Date(data.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </StyledText>
          </View>
        )}

        {data?.updatedAt && (
          <View style={styles.metadataItem}>
            <View style={styles.metadataLabel}>
              <Ionicons
                name="refresh-outline"
                size={16}
                color={Colors[colorScheme].tabIconDefault}
              />
              <StyledText style={styles.metadataLabelText}>Updated</StyledText>
            </View>
            <StyledText style={styles.metadataValue}>
              {new Date(data.updatedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </StyledText>
          </View>
        )}
      </View>
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
      gap: 16,
    },

    // Header Card Styles
    headerCard: {
      backgroundColor: colors.background,
      borderRadius: 16,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
      borderWidth: colorScheme === 'light' ? 1 : 0,
      borderColor: colorScheme === 'light' ? '#E5E7EB' : 'transparent',
    },
    headerContent: {
      gap: 12,
    },
    titleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    titleIcon: {
      marginRight: 12,
    },
    title: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.text,
      flex: 1,
    },
    favoriteButton: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: colorScheme === 'light' ? '#F3F4F6' : '#374151',
    },
    codeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colorScheme === 'light' ? '#F8FAFC' : '#1F2937',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
      alignSelf: 'flex-start',
    },
    codeText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.tint,
      marginLeft: 6,
      fontFamily: 'monospace',
    },

    // Card Styles
    card: {
      backgroundColor: colors.background,
      borderRadius: 12,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
      borderWidth: colorScheme === 'light' ? 1 : 0,
      borderColor: colorScheme === 'light' ? '#E5E7EB' : 'transparent',
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginLeft: 8,
    },

    // Links Styles
    linksContainer: {
      gap: 8,
    },
    linkItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colorScheme === 'light' ? '#F8FAFC' : '#1F2937',
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 8,
    },
    linkText: {
      fontSize: 15,
      color: colors.text,
      marginLeft: 8,
      fontWeight: '500',
    },

    // Metadata Styles
    metadataItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: colorScheme === 'light' ? '#F3F4F6' : '#374151',
    },
    metadataLabel: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    metadataLabelText: {
      fontSize: 15,
      color: colors.tabIconDefault,
      marginLeft: 6,
      fontWeight: '500',
    },
    metadataValue: {
      fontSize: 15,
      color: colors.text,
      textAlign: 'right',
      flex: 1,
      marginLeft: 12,
    },
  });
};
