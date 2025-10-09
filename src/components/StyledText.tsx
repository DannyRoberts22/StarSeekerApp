import Colors from '@/constants/Colors';
import { useColorScheme } from '@/src/components/useColorScheme';

import { LIGHT } from '../lib/types';
import { Text, TextProps } from './Themed';

export function StyledText(props: TextProps) {
  const colorScheme = useColorScheme() ?? LIGHT;
  const colors = Colors[colorScheme];

  return (
    <Text
      {...props}
      style={[{ fontFamily: 'SpaceMono', color: colors.text }, props.style]}
    />
  );
}
