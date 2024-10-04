export default class GroceryItem {
    constructor(ID: number = 0, name: string = "", unitID: number = 0, itemClassificationID: number = 0, useTimePerUnit: number = 0){
        ID = ID;
        name = name;
        unitID = unitID;
        itemClassificationID = itemClassificationID;
        useTimePerUnit= useTimePerUnit;
    };
    ID = 0;
    name = "";
    unitID = 0;
    itemClassificationID = 0;
    useTimePerUnit= 0;
}