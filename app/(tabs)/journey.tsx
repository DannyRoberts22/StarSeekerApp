import { StyleSheet } from 'react-native';

import { StyledText } from '@/src/components/StyledText';
import { View } from '@/src/components/Themed';

export default function JourneyScreen() {
  return (
    <View style={styles.container}>
      <StyledText>Hello Journey</StyledText>
      <StyledText style={styles.subtitle}>
        Calculate interstellar journey costs
      </StyledText>
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
