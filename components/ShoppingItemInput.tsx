import { useEffect, useRef, useState } from "react";
import { ThemedText } from "./ThemedText";
import { StyleProp, TextInput, View, ViewStyle } from "react-native";
import shoppingItemFull from "@/models/shoppingItemFullModel";
import { StyleSheet } from 'react-native';

export default function ShoppingItemInput({style, item, editShoppingItem, index, editable}:{style: StyleProp<ViewStyle>} & {item: shoppingItemFull} & {editShoppingItem: any} & {index: number} & {editable: boolean}) {
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

    return <View style={[style, styles.viewStyle, editable? styles.editableViewWidth: styles.lockedViewWidth]}>
      <ThemedText style={styles.textStyle} type="subtitle">
        {item.GroceryItem?.name}
      </ThemedText>
      {editable && !blur?
      <>
        <TextInput 
          style={[styles.textInput,styles.textInputWrap]}
          keyboardType='numeric'
          onChangeText={(amount) => setPurchaseAmount(amount)}
          value={purchaseAmount}
          onBlur={(event) => {
            setBlur(true);
          }}
          maxLength={10}
          ref={inputElement}
        />
        <ThemedText type="subtitle" style={styles.textInputWrap}>
          {item.GroceryItem?.ItemMeasureUnit.shortName}
        </ThemedText>
      </>:
      <ThemedText style={styles.textStyle} type="subtitle" onPress={() => setBlur(false)}>
        {Math.floor(item.purchaseAmount)} {item.GroceryItem?.ItemMeasureUnit.shortName}
        {" "}
        {item.purchaseAmount%1 > 0?
          (Math.round((item.purchaseAmount%1)*item.GroceryItem.ItemMeasureUnit.subUnitRatio))
          + " " + (item.GroceryItem?.ItemMeasureUnit.subUnitShortName)
        :""}
      </ThemedText>}
    </View>
}

const styles = StyleSheet.create({
    editableViewWidth: {
      width: '80%',
    },
    lockedViewWidth:{
      width: '100%',
    },
    viewStyle:{
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    textInput:{
      color: 'white',
      padding: 0,
      margin: 0,
      fontSize: 20,
      fontWeight: 'bold',
    },
    titleContainer: {
      backgroundColor: '#2b2929',
      flexDirection: 'row',
      // justifyContent: 'space-between',
      width: "100%",
      alignItems: 'center',
      paddingHorizontal: 10,
      borderRadius: 10
    },
    textStyle: {
      color: 'white',
      flexWrap: 'wrap',
      fontWeight: 'bold',
      textAlign: 'center',
      marginVertical:10,
    },
    textInputWrap: {
      marginVertical: 10
    }
  });