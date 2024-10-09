export default class shoppingItem {
    constructor(ID: number= 0, itemID: number= 0, purchaseAmount: number= 0, purchaseDate: Date = new Date()){
        this.ID = ID;
        this.itemID = itemID;
        this.purchaseAmount = purchaseAmount;
        this.purchaseDate= purchaseDate;
    };
    ID = 0;
    itemID = 0;
    purchaseAmount = 0;
    purchaseDate= new Date();
}