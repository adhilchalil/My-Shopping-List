import { StyleProp, StyleSheet, TouchableOpacity, useColorScheme, ViewStyle } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from './ThemedText';
import GroceryItem from '@/models/groceryItemModel';
import ItemMeasureUnit from '@/models/itemMeasreUnitModel';

export function Item({ style, ID, item}: {style: StyleProp<ViewStyle>} & { item: GroceryItem | ItemMeasureUnit} & {ID: number}) {
  const theme = useColorScheme() ?? 'light';

  return (
    <ThemedView style={[style,styles.itemStyle]}>
      <TouchableOpacity
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
