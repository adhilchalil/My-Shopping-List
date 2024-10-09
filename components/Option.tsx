import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { type ComponentProps } from 'react';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { OptionIcon } from './OptionIcon';

export function Option({ title, toPage, icon, forwardIcon=true , iconColor, setPage }: { title: string } & {toPage: string} & { iconColor: string } & { icon: ComponentProps<typeof Ionicons>['name'] } & {forwardIcon?: boolean} & {setPage: React.Dispatch<React.SetStateAction<any>>}) {

  return (
    <ThemedView>
      <TouchableOpacity
        style={styles.heading}
        onPress={() => setPage(toPage)}
        activeOpacity={0.8}>
        <TouchableOpacity
          style={styles.heading}
          onPress={() => setPage(toPage)}
          activeOpacity={0.8}>
          <OptionIcon name={icon ? icon : 'home-outline'} color={iconColor}/>
          <ThemedText  style={styles.content} type="defaultSemiBold">{title}</ThemedText>
        </TouchableOpacity>
        {forwardIcon && <OptionIcon style={styles.content} name={'chevron-forward'} color={iconColor}/>}
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  content: {
  },
});
