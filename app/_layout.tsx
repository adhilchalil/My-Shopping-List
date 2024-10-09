import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState, createContext } from 'react';
import GroceryItem from '@/models/groceryItemModel';
import ItemMeasureUnit from '@/models/itemMeasreUnitModel';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import shoppingItem from '@/models/shoppingItemModel';
import { deleteGroceryItem, deleteItemMeasureUnit, getDBConnection, getGroceryItems, getItemMeasureUnits, getShoppedItems, saveGroceryItems, saveItemMeasureUnits, updateGroceryItems, updateItemMeasureUnits } from '@/components/db-service';
import { SQLiteDatabase } from 'expo-sqlite';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
var database: SQLiteDatabase;

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [items, setItems] = useState<GroceryItem[]>([
    {
      ID: 1,
      name: "tomato",
      unitID: 1,
      useTimePerUnit: 5,
      itemClassificationID: 0
    },
    {
      ID: 2,
      name: "onion",
      unitID: 1,
      useTimePerUnit: 5,
      itemClassificationID: 0
    },
    {
      ID: 3,
      name: "rope",
      unitID: 2,
      useTimePerUnit: 2,
      itemClassificationID: 0
    }
  ]);

  const [units, setUnits] = useState<ItemMeasureUnit[]>([
    {
      ID: 1,
      name: "Kilogram",
      shortName: "Kg",
      subUnitName: "gram",
      subUnitShortName: "gm",
      subUnitRatio: 1000
    },
    {
      ID: 2,
      name: "Meters",
      shortName: "m",
      subUnitName: "centimeters",
      subUnitShortName: "cm",
      subUnitRatio: 100
    },
  ]);

  const [shoppedItems, setShoppedItems] = useState<shoppingItem[]>([]);

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
      (async() => {
        let tempUnits = await getItemMeasureUnits();
        setUnits(tempUnits);
        console.log("db units", tempUnits);
        let tempShoppedItems = await getShoppedItems();
        console.log("db shopped Items", tempShoppedItems);
        setShoppedItems(tempShoppedItems);
        let tempGroceryItems = await getGroceryItems();
        console.log("db grocery items", tempGroceryItems);
        setItems(tempGroceryItems);
      })()
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const createNewItem = async(ID: number, name: string, unitID: number, itemClassificationID: number, useTimePerUnit: number) =>{
    let itemList = [...items];
    let newGroceryItems = [new GroceryItem(0, name, unitID, itemClassificationID, useTimePerUnit)];
    console.log("creating items", newGroceryItems, name, unitID, useTimePerUnit);
    let resp = saveGroceryItems(newGroceryItems).then((resp) => {
      console.log("created item", resp.lastInsertRowId);
      itemList.push({
        ID: resp.lastInsertRowId,
        name: name,
        unitID: unitID,
        useTimePerUnit: useTimePerUnit,
        itemClassificationID: itemClassificationID
      })
      setItems(itemList);
    })
  };

  const saveEditedItem = async(ID: number, name: string, unitID: number, itemClassificationID: number, useTimePerUnit: number) => {
    let itemList = [...items];
    let index = itemList.findIndex((item) => item.ID == ID);
    let editGroceryItems = new GroceryItem(ID, name, unitID, itemClassificationID, useTimePerUnit);
    if(index != -1){
      let resp = await updateGroceryItems(ID, editGroceryItems).then(() => {
        itemList.splice(index,1, editGroceryItems);
        setItems(itemList);
      });
    }
    else console.log("Couldnt find item to Edit");
  }

  const deleteItem= (ID: number, name: string) => {
    let itemList = [...items];
    let index = itemList.findIndex((item) => item.ID == ID && item.name == name);
    if(index != -1){
      let resp =  deleteGroceryItem(ID).then(() => {
        itemList.splice(index,1);
        setItems(itemList);
      });
    }
    else console.log("Couldnt find item to Delete");
  };

  const createNewUnit = async(ID: number, name: string, shortName: string, subUnitName: string, subUnitShortName: string, subUnitRatio: number) =>{
    let unitList = [...units];
    let newItemMeasureUnit = [ new ItemMeasureUnit(ID, name, shortName, subUnitName, subUnitShortName, subUnitRatio)];
    console.log("creating Unit", newItemMeasureUnit);
    let resp = await saveItemMeasureUnits(newItemMeasureUnit).then((resp) => {
      console.log("created Unit", resp);
      unitList.push({
        ID: resp.lastInsertRowId,
        name: name,
        shortName: shortName,
        subUnitName: subUnitName,
        subUnitShortName: subUnitShortName,
        subUnitRatio: subUnitRatio
      })
      setUnits(unitList);
    })
    .catch((err) => {
      console.log("Error posting Unit", err);
    }) 
  };

  const saveEditedUnit = async(ID: number, name: string, shortName: string, subUnitName: string, subUnitShortName: string, subUnitRatio: number) => {
    let unitList = [...units];
    let index = unitList.findIndex((item) => item.ID == ID);
    let editMeasurUnit = new ItemMeasureUnit(ID, name, shortName, subUnitName, subUnitShortName, subUnitRatio);
    if(index != -1){
      let resp = await updateItemMeasureUnits(ID, editMeasurUnit).then(() => {
        unitList.splice(index,1, editMeasurUnit);
        setUnits(unitList);
      });
    }
    else console.log("Couldnt find Unit to Edit");
  }

  const deleteUnit= (ID: number, name: string) => {
    let unitList = [...units];
    let index = unitList.findIndex((unit) => unit.ID == ID && unit.name == name);
    if(index != -1){
      let resp =  deleteItemMeasureUnit(ID).then(() => {
        unitList.splice(index,1);
        setUnits(unitList);
      });
    }
    else console.log("Couldnt find Unit to Delete");
  };

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AllDataContext.Provider value={{
        items, units, shoppedItems,
        createNewItem, saveEditedItem, deleteItem,
        createNewUnit, saveEditedUnit, deleteUnit
        }}
      >
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </AllDataContext.Provider>
    </ThemeProvider>
  );
}

export const AllDataContext:any = createContext(null);
