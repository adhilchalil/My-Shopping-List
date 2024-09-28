import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Platform } from 'react-native';
import { Item } from '@/components/Items';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AllDataContext } from '../_layout';
import GroceryItem from '@/models/groceryItemModel';
import shoppingItem from '@/models/shoppingItemModel';

export default function ShoppingListScreen() {

  const [items, setItems] = useState([]);
  const [units, setUnits] = useState([]);
  const [shoppedItems, setShoppedItems] = useState<shoppingItem[]>([]);
  const [shoppingItems, setShoppingItems] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState([]);
  const [recommend, setRecommend] = useState(false);

  const data : any = useContext(AllDataContext);

  useEffect(() => {
    console.log("allcontext", data);
    setItems(data.items);
    setUnits(data.units);
    setShoppedItems(data.shoppedItems);
  }, [data])

  let moveToShoppingList = (item: GroceryItem) => {
    console.log(shoppingItems, shoppedItems, recommendations);
    let IDCalculated = item.ID;
    let shoppingItemAdd: any = {
      ID: IDCalculated,
      itemID: item.ID,
      purchaseAmount: 1,
      itemName: item.name,
      purchaseDate: new Date()
    }
    let currentShoppingList = [...shoppingItems];
    currentShoppingList.push(shoppingItemAdd);
    setShoppingList(currentShoppingList);
  };

  let removeFromShoppingList = (item: shoppingItem, index: number) => {
    let tempShoppingList = [...shoppingItems];
    if(item.ID == tempShoppingList[index].ID){
      tempShoppingList.splice(index,1);
    }
    setShoppingList(tempShoppingList);
  }

  let setShoppingList = (async (data: any[]) => {
    await AsyncStorage.setItem('my-shopping-list-shoplistitems', JSON.stringify(data));
    setShoppingItems(data);
  })

  let refreshShoppingItems = () => {
    let currentShoppingList = [...shoppingItems];
      let recommendableItems = [...items].filter((item:GroceryItem) => {
        if(currentShoppingList.find((currItem: shoppingItem) => currItem.itemID == item.ID)){
          return false;
        }
        return true;
      });

      let recentitems = [...shoppedItems];
      let shoppingListGenerated = recommendableItems.filter((item: GroceryItem) => {
        let recentData: any = recentitems.find((purchase: shoppingItem) => purchase.itemID == item.ID);
        let itemHistory: shoppingItem = recentData? recentData : new shoppingItem();
        if(itemHistory == undefined){
          return true;
        }
        let bufferDays = (Math.floor(itemHistory.purchaseAmount*item.useTimePerUnit)) - 2;
        let bufferDate = new Date(itemHistory.purchaseDate);
        bufferDate.setDate(bufferDate.getDate() + bufferDays);
        if(new Date() >= bufferDate){
          return true;
        }
        return false;
      });
      setRecommendations(shoppingListGenerated);
  }

  useEffect(() => {
    refreshShoppingItems();
  },[shoppingItems]);

  useEffect(() => {
    let asyncStorageDataString: any = [];
    (async () => {
      asyncStorageDataString = await AsyncStorage.getItem('my-shopping-list-shoplistitems');
    })();
    let asyncStorageData = [];
    if(asyncStorageDataString && asyncStorageDataString.length > 2 && !recommend){
      asyncStorageData = JSON.parse(asyncStorageDataString);
      setShoppingList(asyncStorageData);
    }
    
    if(asyncStorageData.length == 0 || recommend){
      refreshShoppingItems();
    }
    
  },[items, shoppedItems]);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={<Ionicons size={310} name="code-slash" style={styles.headerImage} />}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">My Shopping List</ThemedText>
      </ThemedView>
      {shoppingItems.length? shoppingItems?.map((item: any, index) => 
      <ThemedView  key={"shoppingItem" + item.ID} style={styles.titleContainer}>
      {/* <Item ID={item.ID} item={item}></Item> */}
      <ThemedText type="subtitle">
        {item.itemName}
        <Ionicons name={'remove'} onPress={() => {removeFromShoppingList(item, index)}}></Ionicons>
      </ThemedText>
    </ThemedView>
      ): <ThemedText type="subtitle">Add items to streamline your shopping!</ThemedText>}
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Recommendations</ThemedText>
      </ThemedView>
      {recommendations.length? recommendations?.map((item: GroceryItem) => 
      <ThemedView  key={"recommendedItem" + item.ID} style={styles.titleContainer}>
      <Item ID={item.ID} item={item}></Item>
      <ThemedText type="subtitle">
        <Ionicons name={'checkmark-circle'} onPress={() => {moveToShoppingList(item)}}></Ionicons>
        
      </ThemedText>
    </ThemedView>
      ): <ThemedText type="subtitle">No recommendations available!</ThemedText>}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    borderBottomWidth: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
