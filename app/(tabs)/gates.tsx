import { View, Text, StyleSheet } from 'react-native';

export default function GatesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello Gates</Text>
      <Text style={styles.subtitle}>Display list of hyperspace gates</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000014',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },
});