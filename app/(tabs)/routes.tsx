import { StyledText } from '@/components/StyledText';
import { View } from '@/components/Themed';
import { StyleSheet } from 'react-native';

export default function RoutesScreen() {
  return (
    <View style={styles.container}>
      <StyledText>Hello Routes</StyledText>
      <StyledText style={styles.subtitle}>Find cheapest routes between gates</StyledText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },
});