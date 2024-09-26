import { enablePromise, openDatabase, SQLiteDatabase } from 'react-native-sqlite-storage';
import GroceryItem from '@/models/groceryItemModel';

const groceryTableName = 'groceryData';
const shoppingListTableName = "shoppinglistData";

enablePromise(true);

export const getDBConnection = async () => {
  return openDatabase({ name: 'grocery-data.db', location: 'default' });
};

export const createGroceryItemTable = async (db: SQLiteDatabase) => {
  // create table if not exists
  const query = `CREATE TABLE IF NOT EXISTS ${groceryTableName}(
        name varchar(255) NOT NULL,unit varchar(20),useTimePerUnit int NOT NULL
    );`;

  await db.executeSql(query);
};

export const createShoppingListTable = async (db: SQLiteDatabase) => {
    // create table if not exists
    const query = `CREATE TABLE IF NOT EXISTS ${shoppingListTableName}(
            itemID int, name varchar(255) NOT NULL,unit varchar(20),useTimePerUnit int NOT NULL
        );`;

    await db.executeSql(query);
};

export const getGroceryItems = async (db: SQLiteDatabase): Promise<GroceryItem[]> => {
    try {
      const groceryItems: GroceryItem[] = [];
      const results = await db.executeSql(`SELECT * FROM ${groceryTableName}`);
      results.forEach(result => {
        for (let index = 0; index < result.rows.length; index++) {
          groceryItems.push(result.rows.item(index))
        }
      });
      return groceryItems;
    } catch (error) {
      console.error(error);
      throw Error('Failed to get groceryItems !!!');
    }
  };
  
  export const saveGroceryItems = async (db: SQLiteDatabase, groceryItems: GroceryItem[]) => {
    const insertQuery =
      `INSERT OR REPLACE INTO ${groceryTableName}(rowid, value) values` +
      groceryItems.map(i => `(${i.ID}, '${i.name}')`).join(',');
  
    return db.executeSql(insertQuery);
  };
  
  export const deleteGroceryItem = async (db: SQLiteDatabase, id: number) => {
    const deleteQuery = `DELETE from ${groceryTableName} where rowid = ${id}`;
    await db.executeSql(deleteQuery);
  };
  
  export const deleteTable = async (db: SQLiteDatabase) => {
    const query = `drop table ${groceryTableName}`;
  
    await db.executeSql(query);
  };