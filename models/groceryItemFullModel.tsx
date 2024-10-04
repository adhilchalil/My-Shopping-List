import ItemMeasureUnit from "./itemMeasreUnitModel";

export default class GroceryItemFull{
    ID = 0;
    name = "";
    unitID = 0;
    itemClassificationID = 0;
    ItemMeasureUnit = new ItemMeasureUnit();
    useTimePerUnit= 0;
    constructor( ItemMeasureUnit: ItemMeasureUnit, ID: number = 0, name: string = "", unitID: number = 0, itemClassificationID: number = 0, useTimePerUnit: number = 0){
        this.ID = ID;
        this.name = name;
        this.unitID = unitID;
        this.itemClassificationID = itemClassificationID;
        this.ItemMeasureUnit = ItemMeasureUnit;
        this.useTimePerUnit= useTimePerUnit;
    };
}