import { openDatabaseAsync, SQLiteDatabase } from 'expo-sqlite';
import GroceryItem from '@/models/groceryItemModel';
import shoppingItem from '@/models/shoppingItemModel';
import ItemMeasureUnit from '@/models/itemMeasreUnitModel';

const groceryTableName = 'groceryData';
const shoppingListTableName = "shoppedlistData";
const itemMeasureUnitTableName = "measureUnitsData";
const groceryItemModel = new GroceryItem();
const shoppingItemModel = new shoppingItem();
const ItemMeasureUnitModel = new ItemMeasureUnit();

const spreadModelProperties = (object: any, type: string) => {
  let keys = "";
  for (const [key, value] of Object.entries(object)) {
    if(key != "ID"){
      if(type == "key"){
        keys += String(key) + ", "; 
      }
      else if(type == "value"){
        let valueModified = value;
        console.log(key, typeof(value));
        if(typeof(value) == "object"){
          let valueModified : Date | any = value;
          console.log("DateValue", valueModified.toUTCString());
        }
        keys += String(typeof value == "string" || typeof value == "object"? `'${value}'`: `${value}`) + `, `; 
      }
      else if(type == "key&value"){
        keys += String(key) + " = " + String(typeof value == "string" || typeof value == "object"? `'${value}'`: `${value}`) + `, `;
      }
    }
  }
  return keys.length > 2? keys.substring(0, keys.length - 2) : "";
}

var db: SQLiteDatabase;

export const getDBConnection = async () => {
  db = await openDatabaseAsync('grocery-data.db');
  await createGroceryItemTable();
  await createShoppingListTable();
  await createItemMeasureUnit();
};

export const createGroceryItemTable = async () => {
  if(db == undefined){
    await getDBConnection();
  }
  // create table if not exists
  console.log(`creating if not exists ${groceryTableName}`)
  const query = `CREATE TABLE IF NOT EXISTS ${groceryTableName}(
      ID INTEGER PRIMARY KEY AUTOINCREMENT, name varchar(255),unitID INTEGER NOT NULL,itemClassificationID INTEGER NOT NULL,useTimePerUnit INTEGER NOT NULL
    );`;
  await db.execAsync(query);
};

export const createShoppingListTable = async () => {
  // create table if not exists
  if(db == undefined){
    await getDBConnection();
  }
  console.log(`creating if not exists ${shoppingListTableName}`)
  const query = `CREATE TABLE IF NOT EXISTS ${shoppingListTableName}(
    ID INTEGER PRIMARY KEY AUTOINCREMENT, itemID INTEGER NOT NULL,purchaseAmount INTEGER NOT NULL,purchaseDate DATE
  );`;
  await db.execAsync(query);
};

export const createItemMeasureUnit = async () => {
  // create table if not exists
  if(db == undefined){
    await getDBConnection();
  }
  console.log(`creating if not exists ${itemMeasureUnitTableName}`)
  const query = `CREATE TABLE IF NOT EXISTS ${itemMeasureUnitTableName}(
      ID INTEGER PRIMARY KEY AUTOINCREMENT, name varchar(255), shortName varchar(255), subUnitName varchar(255), subUnitShortName varchar(255),subUnitRatio INTEGER NOT NULL
    );`;
  await db.execAsync(query);
};


/*-------------------------GROCERY ITEMS TABLE------------------------------------------*/
export const getGroceryItems = async (): Promise<GroceryItem[]> => {
  try {
    if(db == undefined){
      await getDBConnection();
    }
    const groceryItems: GroceryItem[] = [];
    await db.getAllAsync(`SELECT * FROM ${groceryTableName}`).then((results: any) => {
      results.forEach((result: any) => {
        groceryItems.push(result);
      });
    })
    
    return groceryItems;
  } catch (error) {
    console.error(error);
    throw Error('Failed to get groceryItems !!!');
  }
};

export const saveGroceryItems = async (groceryItems: GroceryItem[]) => {
  if(db == undefined){
    await getDBConnection();
  }
  const insertQuery =
    `INSERT OR REPLACE INTO ${groceryTableName} (` + spreadModelProperties(groceryItemModel, "key") + `) values` +
    groceryItems.map(item => `(${spreadModelProperties(item, "value")})`).join(',');
    console.log("Query",insertQuery); 
  return db.runAsync(insertQuery);
};

export const updateGroceryItems = async (id: number, GroceryItems: GroceryItem) => {
  if(db == undefined){
    await getDBConnection();
  }
  const insertQuery =
    `UPDATE ${groceryTableName} SET ${spreadModelProperties(GroceryItems, "key&value")} where ID=${id}`;
  return db.execAsync(insertQuery);
};

export const deleteGroceryItem = async (id: number) => {
  if(db == undefined){
    await getDBConnection();
  }
  const deleteQuery = `DELETE from ${groceryTableName} where ID = ${id}`;
  await db.execAsync(deleteQuery);
};

export const deleteGroceryTable = async () => {
  if(db == undefined){
    await getDBConnection();
  }
  console.log(`deleting table ${groceryTableName}`);
  const query = `drop table ${groceryTableName}`;
  await db.execAsync(query);
};

/*-------------------------SHOPPED ITEMS TABLE------------------------------------------*/
export const getShoppedItems = async (): Promise<shoppingItem[]> => {
  try {
    if(db == undefined){
      await getDBConnection();
    }
    const shoppedItems: shoppingItem[] = [];
    await db.getAllAsync(`SELECT * FROM ${shoppingListTableName}`).then((results: any) => {
      results.forEach((result: any) => {
        result.purchaseDate = new Date(result.purchaseDate);
        shoppedItems.push(result);
      });
      shoppedItems.sort((a,b) => a.purchaseDate < b.purchaseDate? 1: -1);
    })
    
    return shoppedItems;
  } catch (error) {
    console.error(error);
    throw Error('Failed to get groceryItems !!!');
  }
};

export const getShoppedItemsById = async (ID: number): Promise<shoppingItem[]> => {
  try {
    if(db == undefined){
      await getDBConnection();
    }
    const shoppedItems: shoppingItem[] = [];
    await db.getAllAsync(`SELECT * FROM ${shoppingListTableName} WHERE itemID=${ID}`).then((results: any) => {
      results.forEach((result: any) => {
        result.purchaseDate = new Date(result.purchaseDate);
        shoppedItems.push(result);
      });
    })
    shoppedItems.sort((a,b) => a.purchaseDate < b.purchaseDate? 1: -1);
    return shoppedItems;
  } catch (error) {
    console.error(error);
    throw Error('Failed to get groceryItems !!!');
  }
};

export const saveShoppedItems = async (ShoppedItems: shoppingItem[]) => {
  if(db == undefined){
    await getDBConnection();
  }
  console.log("saving shopped Items", ShoppedItems);
  const insertQuery =
    `INSERT OR REPLACE INTO ${shoppingListTableName} (` + spreadModelProperties(shoppingItemModel, "key") + `) values ` +
    ShoppedItems.map(item => `(${spreadModelProperties(item, "value")})`).join(',');
  console.log("Query", insertQuery);
  return db.runAsync(insertQuery);
};

export const deleteShoppedItem = async (id: number) => {
  if(db == undefined){
    await getDBConnection();
  }
  const deleteQuery = `DELETE from ${shoppingListTableName} where ID = ${id}`;
  await db.execAsync(deleteQuery);
};

export const deleteShoppedTable = async () => {
  if(db == undefined){
    await getDBConnection();
  }
  console.log(`deleting table ${shoppingListTableName}`);
  const query = `drop table ${shoppingListTableName}`;
  await db.execAsync(query);
};

/*-------------------------ITEM MEASUREMENT UNITS TABLE------------------------------------------*/
export const getItemMeasureUnits = async (): Promise<ItemMeasureUnit[]> => {
  try {
    if(db == undefined){
      await getDBConnection();
    }
    const itemMeasureUnits: ItemMeasureUnit[] = [];
    await db.getAllAsync(`SELECT * FROM ${itemMeasureUnitTableName}`).then((results: any) => {
      results.forEach((result: any) => {
        itemMeasureUnits.push(result)
      });
    })
    
    return itemMeasureUnits;
  } catch (error) {
    console.error(error);
    throw Error('Failed to get groceryItems !!!');
  }
};

export const saveItemMeasureUnits = async (itemMeasureUnits: ItemMeasureUnit[]) => {
  if(db == undefined){
    await getDBConnection();
  }
  const insertQuery =
    `INSERT OR REPLACE INTO ${itemMeasureUnitTableName} (` + spreadModelProperties(ItemMeasureUnitModel, "key") + `) values ` +
    itemMeasureUnits.map(item => `(${spreadModelProperties(item, "value")})`).join(',');
    console.log("Query",insertQuery);
  return db.runAsync(insertQuery);
};

export const updateItemMeasureUnits = async (id: number, itemMeasureUnits: ItemMeasureUnit) => {
  if(db == undefined){
    await getDBConnection();
  }
  const insertQuery =
    `UPDATE ${itemMeasureUnitTableName} SET ` + `${spreadModelProperties(itemMeasureUnits, "key&value")} where ID=${id}`;
  return db.execAsync(insertQuery);
};

export const deleteItemMeasureUnit = async (id: number) => {
  if(db == undefined){
    await getDBConnection();
  }
  const deleteQuery = `DELETE from ${itemMeasureUnitTableName} where ID = ${id}`;
  await db.execAsync(deleteQuery);
};

export const deleteItemMeasureUnitTable = async () => {
  if(db == undefined){
    await getDBConnection();
  }
  console.log(`deleting table ${itemMeasureUnitTableName}`);
  const query = `drop table ${itemMeasureUnitTableName}`;
  await db.execAsync(query);
};

