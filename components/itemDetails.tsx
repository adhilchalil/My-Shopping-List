import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Platform, useColorScheme } from 'react-native';
import { Option } from '@/components/Option';
import { useContext, useEffect, useState } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import GroceryItem from '@/models/groceryItemModel';
import ItemMeasureUnit from '@/models/itemMeasreUnitModel';
import { AllDataContext } from '@/app/_layout';
import { getShoppedItemsById } from '@/components/db-service';
import shoppingItem from '@/models/shoppingItemModel';

import GroceryItemFull from '@/models/groceryItemFullModel';

export default function ItemDetails({item, changePage}: {item: GroceryItem} & {changePage: any}) {
  const [shoppingHistory, setShoppingHistory] = useState<shoppingItem[]>([]);
  const [itemDataFull, setItemDataFull] = useState<GroceryItemFull>();
  const [loadingHistory, setLoadingHistory] = useState(false);
  const theme = useColorScheme() ?? 'light';
  
  const data:any = useContext(AllDataContext);

  let newItem = new GroceryItem();
  let newUnit = new ItemMeasureUnit();

  useEffect(() => {
    setLoadingHistory(true);
    let itemUnitArr = data.units.filter((unit: ItemMeasureUnit) => item.unitID == unit.ID);
    let itemUnit: ItemMeasureUnit = itemUnitArr?.length? itemUnitArr[0] : new ItemMeasureUnit();
    let groceryItemFull = new GroceryItemFull(itemUnit, item.ID, item.name, item.unitID, item.itemClassificationID, item.useTimePerUnit);
    setItemDataFull(groceryItemFull);
    if(item.ID != 0){
      getShoppedItemsById(item.ID)
      .then((history) => {
        setShoppingHistory(history);
        setLoadingHistory(false);
      })
      .catch((err) => {
        setLoadingHistory(false);
      })
    }
    else{
      setShoppingHistory([]);
    }
  }, [item, data])

  return (
    <>
      <ThemedView style={styles.backButton}>
      </ThemedView>
      <ThemedView style={styles.backButton}>
      <Option title={'Back'} toPage={'Items'} icon={"chevron-back"} forwardIcon={false} iconColor={theme == "light"? "black": "white"} setPage={changePage}></Option>
      </ThemedView>
      <ThemedView style={styles.headerContainer}>
        <ThemedText type="title">{itemDataFull?.name}</ThemedText>
      </ThemedView>
      {/* <ThemedView style={styles.headerContainer}>
        <ThemedText onPress={() => deleteGroceryTable()} type="title">Delete Items Table</ThemedText>
      </ThemedView> */}
      {shoppingHistory.map((item: shoppingItem) => 
        <ThemedView  key={"item" + item.ID} style={styles.titleContainer}>
          <ThemedView style={styles.buttonContainer}>
            <ThemedText>{`${item.purchaseAmount} ${itemDataFull?.ItemMeasureUnit.shortName} on ${item.purchaseDate.toLocaleDateString()}`}</ThemedText>
          </ThemedView>
        </ThemedView>
      )}
      {shoppingHistory.length == 0 && !loadingHistory?
        <ThemedText style={styles.emptyContainer} type="subtitle">No Purchase History!</ThemedText>
        :<></>
      }
    </>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: "100%",
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  titleContainer: {
    backgroundColor: '#2b2929',
    flexDirection: 'row',
    width: "100%",
    alignItems: 'center',
    paddingHorizontal: 3,
    borderRadius: 10
  },
  buttonContainer: {
    width: '100%',
    backgroundColor: 'none',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
    gap: 5,
  },
  backButton: {
    borderBottomColor: "red",
    borderBottomWidth: 2,
    paddingBottom: 10,
  },
  itemStyle: {
    width: '70%'
  },
  emptyContainer: {
    backgroundColor: '#2b2929',
    color: 'yellow',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 3,
    textAlign: 'center',
    borderRadius: 20
  },
});
