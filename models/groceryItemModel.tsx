export default class GroceryItem {
    ID = 0;
    name = "";
    unitID = 0;
    itemClassificationID = 0;
    useTimePerUnit= 0;
    constructor(ID: number = 0, name: string = "", unitID: number = 0, itemClassificationID: number = 0, useTimePerUnit: number = 0){
        this.ID = ID;
        this.name = name;
        this.unitID = unitID;
        this.itemClassificationID = itemClassificationID;
        this.useTimePerUnit= useTimePerUnit;
    };
}