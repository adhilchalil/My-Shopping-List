import { StyleProp, StyleSheet, TouchableOpacity, TouchableOpacityProps, useColorScheme, ViewProps, ViewStyle } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from './ThemedText';
import GroceryItem from '@/models/groceryItemModel';
import ItemMeasureUnit from '@/models/itemMeasreUnitModel';

export type ThemedItemProps = ViewProps & TouchableOpacityProps & {
  item: GroceryItem | ItemMeasureUnit;
  ID: number
};

export function Item({ style, onPress, ID, item, ...otherProps}: ThemedItemProps) {
  const theme = useColorScheme() ?? 'light';

  return (
    <ThemedView style={[style,styles.itemStyle]}>
      <TouchableOpacity
        onPress={onPress}
        style={styles.heading}
        activeOpacity={0.8}>
        <ThemedText style={styles.textStyle} type="subtitle">{item.name}</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  heading: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  itemStyle: {
    backgroundColor: 'none',
    alignItems: 'flex-start'
  },
  textStyle:{
    flexWrap: 'wrap'
  }
});
