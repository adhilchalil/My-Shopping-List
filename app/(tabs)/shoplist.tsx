import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Platform, Pressable } from 'react-native';
import { Item } from '@/components/Items';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AllDataContext } from '../_layout';
import GroceryItem from '@/models/groceryItemModel';
import shoppingItemFull from '@/models/shoppingItemFullModel';
import GroceryItemFull from '@/models/groceryItemFullModel';
import ItemMeasureUnit from '@/models/itemMeasreUnitModel';
import ShoppingItemInput from '@/components/ShoppingItemInput';

export default function ShoppingListScreen() {

  const [items, setItems] = useState([]);
  const [units, setUnits] = useState([]);
  const [shoppedItems, setShoppedItems] = useState<shoppingItemFull[]>([]);
  const [shoppingItems, setShoppingItems] = useState<shoppingItemFull[]>([]);
  const [recommendations, setRecommendations] = useState([]);
  const [recommend, setRecommend] = useState(false);

  const data : any = useContext(AllDataContext);

  useEffect(() => {
    setItems(data.items);
    setUnits(data.units);
    setShoppedItems(data.shoppedItems);
  }, [data])

  let moveToShoppingList = (item: GroceryItem) => {
    let IDCalculated = item.ID;
    let itemUnitArr = units.filter((unit: ItemMeasureUnit) => item.unitID == unit.ID);
    let itemUnit: ItemMeasureUnit = itemUnitArr?.length? itemUnitArr[0] : new ItemMeasureUnit();
    let groceryItemFull = new GroceryItemFull(itemUnit, item.ID, item.name, item.unitID, item.itemClassificationID, item.useTimePerUnit);
    console.log(item, units, itemUnitArr, itemUnit, groceryItemFull);
    let shoppingItemAdd: shoppingItemFull = {
      ID: IDCalculated,
      itemID: item.ID,
      purchaseAmount: 1,
      GroceryItem: groceryItemFull,
      purchaseDate: new Date()
    };
    let currentShoppingList = [...shoppingItems];
    currentShoppingList.push(shoppingItemAdd);
    setShoppingList(currentShoppingList);
  };

  let removeFromShoppingList = (item: shoppingItemFull, index: number) => {
    let tempShoppingList = [...shoppingItems];
    if(item.itemID == tempShoppingList[index].itemID){
      tempShoppingList.splice(index,1);
    }
    setShoppingList(tempShoppingList);
  }

  let editShoppingItem = (amount: string, item: shoppingItemFull, index: number) => {
    let amountValArr = amount.replace(/[^0-9.]/g, '').split(".");
    let findDecimalPoint = amount.indexOf(".");
    let amountVal = Number(amountValArr[0] +  (findDecimalPoint > 0? "." + (amountValArr.length > 1?amountValArr[1] : "0"):""));
    console.log("edit", amountVal)
    let tempShoppingList = [...shoppingItems];
    if(item.ID == tempShoppingList[index].ID){
      tempShoppingList[index].purchaseAmount = amountVal;
    }
    setShoppingList(tempShoppingList);
  }

  let saveShoppedItems = () => {
    console.log("savetoDB",shoppingItems)
  };

  let setShoppingList = (async (data: any[]) => {
    await AsyncStorage.setItem('my-shopping-list-shoplistitems', JSON.stringify(data));
    console.log(data);
    setShoppingItems(data);
  })

  let refreshShoppingItems = () => {
    let currentShoppingList = [...shoppingItems];
    let recommendableItems = [...items].filter((item:GroceryItem) => {
      if(currentShoppingList.find((currItem: shoppingItemFull) => currItem.itemID == item.ID)){
        return false;
      }
      return true;
    });

    let recentitems = [...shoppedItems];
    let shoppingListGenerated = recommendableItems.filter((item: GroceryItem) => {
      let recentData: any = recentitems.find((purchase: shoppingItemFull) => purchase.itemID == item.ID);
      let itemHistory: any = recentData? recentData : undefined;
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
    (async () => {
      let asyncStorageDataString: string = "";
      let jsonString = await AsyncStorage.getItem('my-shopping-list-shoplistitems');
      asyncStorageDataString = jsonString? jsonString: "";

      let asyncStorageData = [];
      if(asyncStorageDataString && asyncStorageDataString.length > 2 && !recommend){
        asyncStorageData = JSON.parse(asyncStorageDataString);
        setShoppingList(asyncStorageData);
      }
      
      if(asyncStorageData.length == 0 || recommend){
        refreshShoppingItems();
      }
    })();
  },[items, shoppedItems]);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={<Ionicons size={310} name="code-slash" style={styles.headerImage} />}>
      <ThemedView style={styles.headerContainer}>
        <ThemedText type="title">My Shopping List</ThemedText>
      </ThemedView>
      {shoppingItems.length? shoppingItems?.map((item: shoppingItemFull, index) => 
        <ThemedView  key={"shoppingItem" + item.ID} style={styles.titleContainer}>
          <ShoppingItemInput
            item = {item}
            editShoppingItem={editShoppingItem}
            index ={index}
            editable={true}
          >
          </ShoppingItemInput>
          <ThemedText type="subtitle">
            <Ionicons size={18} name={'remove-circle'} onPress={() => {removeFromShoppingList(item, index)}}></Ionicons>
          </ThemedText>
        </ThemedView>
      ): <ThemedText style={styles.buttonContainer} type="subtitle">Add items to streamline your shopping!</ThemedText>}
          {shoppingItems?.length>0 ? <Pressable
            style={[styles.button]}
            onPress={() => {saveShoppedItems()}}
          >
            <ThemedText style={styles.buttonTextStyle}>
              <Ionicons size={20} name={'checkmark-circle'} onPress={() => {saveShoppedItems()}}></Ionicons>
              <ThemedText type="subtitle">Done Shopping</ThemedText>
            </ThemedText>
          </Pressable>: ""}
      <ThemedView style={styles.headerContainer}>
        <ThemedText type="title">Recommendations</ThemedText>
      </ThemedView>
      {recommendations.length? recommendations?.map((item: GroceryItem) => 
      <ThemedView  key={"recommendedItem" + item.ID} style={styles.titleContainer}>
        <Item ID={item.ID} item={item}></Item>
        <ThemedText style={styles.buttonContainer} type="subtitle">
          <Ionicons size={18} name={'checkmark-circle'} onPress={() => {moveToShoppingList(item)}}></Ionicons>
        </ThemedText>
      </ThemedView>
      ): <ThemedText type="subtitle">No recommendations available!</ThemedText>}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  button:{
    backgroundColor: 'green',
    borderRadius: 20,
    padding: 12,
    elevation: 2,
  },
  buttonTextStyle:{
    flexDirection: 'row',
    justifyContent: 'space-around',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonContainer: {
    backgroundColor: '#2b2929',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 3,
  },
  textInput:{
    color: 'white'
  },
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
    justifyContent: 'space-between',
    width: "100%",
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRadius: 10
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
