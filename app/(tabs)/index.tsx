import { StyledText } from '@/components/StyledText';
import { View } from '@/components/Themed';
import { StyleSheet } from 'react-native';

export default function GatesScreen() {
  return (
    <View style={styles.container}>
      <StyledText>Hello Gates</StyledText>
      <StyledText>Display list of hyperspace gates</StyledText>
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