import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Pressable, Alert } from 'react-native';
import { Item } from '@/components/Item';
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
import { ThemedTextInput } from '@/components/ThemedTextInput';
import shoppingItem from '@/models/shoppingItemModel';
import { saveShoppedItems } from '@/components/db-service';

export default function ShoppingListScreen() {

  const [items, setItems] = useState<GroceryItem[]>([]);
  const [units, setUnits] = useState<ItemMeasureUnit[]>([]);
  const [search, setSearch] = useState("");
  const [nextShoppingIn, setNextShoppingIn] = useState(String(2));
  const [searchRecommendations, setSearchRecommendations] = useState<GroceryItem[]>([]);
  const [shoppedItems, setShoppedItems] = useState<shoppingItemFull[]>([]);
  const [shoppingItems, setShoppingItems] = useState<shoppingItemFull[]>([]);
  const [recommendations, setRecommendations] = useState<GroceryItem[]>([]);
  const [savingData, setSavingData] = useState(false);
  const [edit, setEdit] = useState(true);
  const [recommend, setRecommend] = useState(false);

  const data : any = useContext(AllDataContext);

  useEffect(() => {
    setItems(data.items);
    setUnits(data.units);
    setShoppedItems(data.shoppedItems);
  }, [data])

  let changenextShoppingIn = (value: any) => {
    let amountValArr = value.nativeEvent.text.replace(/[^0-9.]/g, '').split(".");
    let findDecimalPoint = value.nativeEvent.text.indexOf(".");
    let amountVal = (amountValArr[0] +  (findDecimalPoint > 0? "." + (amountValArr.length > 1?amountValArr[1] : "0"):""));
    setNextShoppingIn(amountVal);
  }

  let moveToShoppingList = (item: GroceryItem) => {
    let IDCalculated = item.ID;
    let itemUnitArr = units.filter((unit: ItemMeasureUnit) => item.unitID == unit.ID);
    let itemUnit: ItemMeasureUnit = itemUnitArr?.length? itemUnitArr[0] : new ItemMeasureUnit();
    let groceryItemFull = new GroceryItemFull(itemUnit, item.ID, item.name, item.unitID, item.itemClassificationID, item.useTimePerUnit);
    let shoppingItemAdd: shoppingItemFull = {
      ID: IDCalculated,
      itemID: item.ID,
      purchaseAmount: 1,
      GroceryItem: groceryItemFull,
      purchaseDate: new Date()
    };
    let currentShoppingList = [...shoppingItems];
    let itemIndex = currentShoppingList.findIndex((curItem) => curItem.GroceryItem.ID == item.ID)
    if(itemIndex == -1){
      currentShoppingList.push(shoppingItemAdd);
      setShoppingList(currentShoppingList);
    }
    else{
      Alert.alert("Item already added!")
    }
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
    let tempShoppingList = [...shoppingItems];
    if(item.ID == tempShoppingList[index].ID){
      tempShoppingList[index].purchaseAmount = amountVal;
    }
    setShoppingList(tempShoppingList);
  }

  let savetoDBShoppedItems = async() => {
    if(!savingData){
      setSavingData(true);
      console.log("savetoDB",shoppingItems);
      let shoppedItemsFinal = shoppingItems.map((item) => {
        return new shoppingItem(0, item.itemID, item.purchaseAmount, new Date());
      });
      saveShoppedItems(shoppedItemsFinal)
      .then(() => {
        setShoppingList([]);
        setSavingData(false);
      })
      .catch((err) => {
        console.log("error saving to db", err);
        setSavingData(false);
      });
    }
  };

  let setShoppingList = (async (data: shoppingItemFull[]) => {
    await AsyncStorage.setItem('my-shopping-list-shoplistitems', JSON.stringify(data));
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
      let bufferDays = (Math.floor(itemHistory.purchaseAmount*item.useTimePerUnit)) - Number(nextShoppingIn);
      let bufferDate = new Date(itemHistory.purchaseDate);
      bufferDate.setDate(bufferDate.getDate() + bufferDays);
      if(new Date() >= bufferDate){
        return true;
      }
      return false;
    });
    setRecommendations(shoppingListGenerated);
  };

  useEffect(() => {
    let searchrecommend: GroceryItem[] = [];
    if(search?.length > 0){
      let searchTerm = search.toLowerCase();
      for(let item of items){
        if(item.name.toLowerCase().includes(searchTerm)){
          searchrecommend.push(item);
        }
      }
    }
    setSearchRecommendations(searchrecommend);
  }, [search])

  useEffect(() => {
    refreshShoppingItems();
  },[shoppingItems, nextShoppingIn]);

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
        <ThemedText type="title" onPress={() => setEdit(!edit)}><Ionicons size={20} name={edit?'lock-closed': 'lock-open'}></Ionicons></ThemedText>
      </ThemedView>
      {edit?<ThemedView style={styles.searchBarView}>
        <ThemedText style={{verticalAlign: 'middle'}}>
          <Ionicons size={20} name='search'></Ionicons>
        </ThemedText>
        <ThemedTextInput placeholder=' search...' style={styles.searchBar} value={search} onChangeText={setSearch}></ThemedTextInput>
      </ThemedView>
      :<></>}

      {searchRecommendations.length && edit? searchRecommendations?.map((item: GroceryItem) => 
      <ThemedView  key={"searchedItem" + item.ID} style={styles.titleContainer}>
        <Item style={styles.itemStyle} ID={item.ID} item={item}></Item>
        <ThemedText style={styles.buttonContainer} type="subtitle">
          <Ionicons size={18} name={'add'} onPress={() => {moveToShoppingList(item)}}></Ionicons>
        </ThemedText>
      </ThemedView>
      ): <></>}

      <ThemedView
        style={{
          borderBottomColor: 'blue',
          borderBottomWidth: StyleSheet.hairlineWidth,
        }}
      />
      {/* <ThemedView style={styles.headerContainer}>
        <ThemedText onPress={() => deleteShoppedTable()} type="title">Delete Shopped items Table</ThemedText>
      </ThemedView> */}

      {shoppingItems.length? shoppingItems?.map((item: shoppingItemFull, index) => 
        <ThemedView  key={"shoppingItem" + item.ID} style={styles.titleContainer}>
          <ShoppingItemInput
            style={styles.shoppingInput}
            item = {item}
            editShoppingItem={editShoppingItem}
            index ={index}
            editable={edit}
          >
          </ShoppingItemInput>
          {edit?
          <ThemedText type="subtitle">
            <Ionicons size={18} name={'trash'} onPress={() => {removeFromShoppingList(item, index)}}></Ionicons>
          </ThemedText>:
          <></>}
        </ThemedView>
      ): <ThemedText style={styles.emptyContainer} type="subtitle">Add items to streamline your shopping!</ThemedText>}
          {shoppingItems?.length>0 ? <Pressable
            style={[styles.button]}
            onPress={() => {savetoDBShoppedItems()}}
          >
            <ThemedText style={styles.buttonTextStyle}>
              <ThemedText style={{verticalAlign: 'middle'}}>
                {savingData?<Ionicons size={20} name={"ellipsis-horizontal"}/>:<Ionicons size={20} name={'checkmark-circle'} onPress={() => {savetoDBShoppedItems()}}></Ionicons>}
              </ThemedText>
              <ThemedText type="subtitle">Done Shopping</ThemedText>
            </ThemedText>
          </Pressable>: ""}

      {edit?
      <>
      <ThemedView style={styles.headerContainer}>
        <ThemedText type="subtitle">Recommend. for</ThemedText>
        <ThemedTextInput inputMode='numeric' value={String(nextShoppingIn)} onChangeText={(value) => setNextShoppingIn(value)} onEndEditing={changenextShoppingIn}></ThemedTextInput>
        <ThemedText type="subtitle">Days</ThemedText>
      </ThemedView>

      {recommendations.length? recommendations?.map((item: GroceryItem) => 
      <ThemedView  key={"recommendedItem" + item.ID} style={styles.titleContainer}>
        <Item style={styles.itemStyle} ID={item.ID} item={item}></Item>
        <ThemedText style={styles.buttonContainer} type="subtitle">
          <Ionicons size={20} name={'add'} onPress={() => {moveToShoppingList(item)}}></Ionicons>
        </ThemedText>
      </ThemedView>
      ): <ThemedText type="subtitle">No recommendations available!</ThemedText>}
      </>:<></>}
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
  searchBarView:{
    flexDirection: 'row',
    width: '100%',
    fontSize: 20
  },
  searchBar:{
    width: '100%',
    fontSize: 20
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
  buttonContainer: {
    backgroundColor: '#2b2929',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 3,
  },
  boldIcon: {
    fontWeight: 'bold'
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
    paddingHorizontal: 8,
    borderRadius: 10
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  itemStyle: {
    // width: '90%'
  },
  shoppingInput: {

  }
});
