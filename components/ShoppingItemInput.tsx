import { useEffect, useRef, useState } from "react";
import { ThemedText } from "./ThemedText";
import { TextInput } from "react-native";
import shoppingItemFull from "@/models/shoppingItemFullModel";
import { StyleSheet } from 'react-native';

export default function ShoppingItemInput({item, editShoppingItem, index, editable}: {item: shoppingItemFull} & {editShoppingItem: any} & {index: number} & {editable: boolean}) {
    const [blur, setBlur] = useState(true);
    const [purchaseAmount, setPurchaseAmount] = useState(String(item.purchaseAmount));
    const inputElement = useRef<TextInput>(null);

    useEffect(() => {
      if(blur){
        let amountValArr = purchaseAmount.replace(/[^0-9.]/g, '').split(".");
        let findDecimalPoint = purchaseAmount.indexOf(".");
        let amountVal = (amountValArr[0] +  (findDecimalPoint > 0? "." + (amountValArr.length > 1?amountValArr[1] : "0"):""));
        setPurchaseAmount(amountVal);
        editShoppingItem(purchaseAmount, item, index);
      }
      if(!blur){
        inputElement.current?.focus();
      }
    },[blur]);

    useEffect(() => {
      setPurchaseAmount(String(item.purchaseAmount));
    }, [item])

    return (editable && !blur?
    <>
      <ThemedText type="subtitle">
        {item.GroceryItem?.name}asdsa
      </ThemedText>
      <ThemedText type="subtitle">
        <TextInput 
          style={styles.textInput}
          keyboardType='numeric'
          onChangeText={(amount) => setPurchaseAmount(amount)}
          value={purchaseAmount}
          onBlur={(event) => {
            setBlur(true);
          }}
          maxLength={10}
          ref={inputElement}
        />
        {item.GroceryItem?.ItemMeasureUnit.shortName}
      </ThemedText>
    </>:
    <>
      <ThemedText type="subtitle">
        {item.GroceryItem?.name}
      </ThemedText>
      <ThemedText type="subtitle" onPress={() => setBlur(false)}>
        {Math.floor(item.purchaseAmount)} {item.GroceryItem?.ItemMeasureUnit.shortName}
        {" "}
        {item.purchaseAmount%1 > 0?
          (Math.round((item.purchaseAmount%1)*item.GroceryItem.ItemMeasureUnit.subUnitRatio))
          + " " + (item.GroceryItem?.ItemMeasureUnit.subUnitShortName)
        :""}
      </ThemedText>
    </>);
}

const styles = StyleSheet.create({
    textInput:{
      color: 'white'
    },
    titleContainer: {
      backgroundColor: '#2b2929',
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: "100%",
      alignItems: 'center',
      paddingHorizontal: 10,
      borderRadius: 10
    },
    textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });