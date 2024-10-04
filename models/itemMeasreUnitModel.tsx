export default class ItemMeasureUnit {
    ID = 0;
    name = "";
    shortName = "";
    subUnitName = "";
    subUnitShortName = "";
    subUnitRatio = 0;
    constructor(ID: number = 0, name: string = "", shortName: string = "", subUnitName: string = "", subUnitShortName: string = "", subUnitRatio: number = 0){
        this.ID = ID;
        this.name = name;
        this.shortName = shortName;
        this.subUnitName = subUnitName;
        this.subUnitShortName = subUnitShortName;
        this.subUnitRatio = subUnitRatio;
    };
}