import GroceryItemFull from "./groceryItemFullModel";
import GroceryItem from "./groceryItemModel";
import ItemMeasureUnit from "./itemMeasreUnitModel";

export default class shoppingItemFull{
    constructor(GroceryItem: GroceryItemFull,ID: number= 0, itemID: number= 0, purchaseAmount: number= 0, purchaseDate: Date = new Date()){
        this.ID = ID;
        this.itemID = itemID;
        this.purchaseAmount = purchaseAmount;
        this.purchaseDate= purchaseDate;
        this.GroceryItem= GroceryItem;
    }
    ID = 0;
    itemID = 0;
    GroceryItem= new GroceryItemFull(new ItemMeasureUnit());
    purchaseAmount = 0;
    purchaseDate= new Date();
}