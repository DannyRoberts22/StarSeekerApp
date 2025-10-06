import { FlatList, RefreshControl, View } from 'react-native';

import { StyledText } from '@/src/components/StyledText';
import { useGates } from '@/src/hooks/useGates';

export default function GatesScreen() {
  const { data, refetch, isRefetching } = useGates();
  console.log('🚀 ~ GatesScreen ~ data:', data);

  return (
    <View style={{ flex: 1, padding: 12, borderColor: 'red', borderWidth: 1 }}>
      <FlatList
        data={data}
        keyExtractor={g => g.code}
        renderItem={({ item }) => (
          <View>
            <StyledText style={{ color: 'white' }}>{item.name}</StyledText>
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </View>
  );
}
