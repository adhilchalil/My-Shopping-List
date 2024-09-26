import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState, createContext } from 'react';
import GroceryItem from '@/models/groceryItemModel';
import ItemMeasureUnit from '@/models/itemMeasreUnitModel';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [items, setItems] = useState([
    {
      ID: 1,
      name: "tomato",
      unitID: 1,
      useTimePerUnit: 8
    },
    {
      ID: 2,
      name: "onion",
      unitID: 1,
      useTimePerUnit: 5
    },
    {
      ID: 3,
      name: "rope",
      unitID: 2,
      useTimePerUnit: 2
    }
  ]);

  const [units, setUnits] = useState([
    {
      ID: 1,
      name: "Kilogram",
      shortName: "Kg",
    },
    {
      ID: 2,
      name: "Meters",
      shortName: "m",
    },
  ]);

  let newItem = new GroceryItem();
  let newUnit = new ItemMeasureUnit();

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const createNewItem = (name: string, unit: number, useTimePerUnit: number) =>{
    let itemList = [...items];
    itemList.push({
      ID: items.length+1,
      name: name,
      unitID: unit,
      useTimePerUnit: useTimePerUnit
    })
    setItems(itemList);
    newItem = new GroceryItem();
  };

  const saveEditedItem = (ID: number, name: string, unitID: number, useTimePerUnit: number) => {
    let itemList = [...items];
    let index = itemList.findIndex((item) => item.ID == ID && item.name == name);
    if(index != -1){
      itemList.splice(index,1);
    }
    setItems(itemList);
  }

  const deleteItem= (ID: number, name: string) => {
    let itemList = [...items];
    let index = itemList.findIndex((item) => item.ID == ID && item.name == name);
    if(index != -1){
      itemList.splice(index,1);
    }
    setItems(itemList);
  };

  const createNewUnit = (name: string, shortName: string) =>{
    let unitList = [...units];
    unitList.push({
      ID: units.length+1,
      name: name,
      shortName: shortName
    })
    setUnits(unitList);
  };

  const saveEditedUnit = (ID: number, name: string, shortName: string) => {

  }

  const deleteUnit= (ID: number, name: string) => {
    let unitList = [...units];
    let index = unitList.findIndex((unit) => unit.ID == ID && unit.name == name);
    console.log("deleted", index);
    if(index != -1){
      unitList.splice(index,1);
    }
    setUnits(unitList);
    newUnit = new ItemMeasureUnit();
  };

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AllDataContext.Provider value={{
        items, units,
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
