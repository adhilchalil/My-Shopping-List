// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/

import Ionicons from '@expo/vector-icons/Ionicons';
import { type IconProps } from '@expo/vector-icons/build/createIconSet';
import { type ComponentProps } from 'react';
import { ThemedText } from './ThemedText';

export function OptionIcon({ style, ...rest }: IconProps<ComponentProps<typeof Ionicons>['name']>) {
  return <ThemedText><Ionicons size={18} style={[{ marginBottom: -3 }, style]} {...rest} /></ThemedText>;
}
