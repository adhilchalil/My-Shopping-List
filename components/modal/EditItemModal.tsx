import GroceryItem from '@/models/groceryItemModel';
import { Ionicons } from '@expo/vector-icons';
import React, {ComponentProps, useEffect, useState} from 'react';
import {Alert, Modal, StyleSheet, Text, Pressable, View} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';
import ItemMeasureUnit from '@/models/itemMeasreUnitModel';
import SelectDropdown from 'react-native-select-dropdown';

const EditItemModal = ({item, saveItem, iconType, units}: {item: GroceryItem} & {saveItem: any} & {units: ItemMeasureUnit[]} & {iconType: ComponentProps<typeof Ionicons>['name'] }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState(item.name);
  const [unit, setUnit] = useState(item.unitID);
  const [useTimePerUnit, setUseTimePerUnit] = useState(item.useTimePerUnit);

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <ThemedView style={styles.modalView}>
            <TextInput
                style={styles.input}
                onChangeText={setName}
                placeholder="Item Name"
                value={name}
            />
            <SelectDropdown
              data={units}
              defaultValue={units.find(unitval => unitval.ID == unit)}
              onSelect={(selectedItem: ItemMeasureUnit, index) => {
                setUnit(selectedItem.ID);
              }}
              renderButton={(selectedItem, isOpened) => {
                return (
                  <View style={styles.dropdownButtonStyle}>
                    <Text style={styles.dropdownButtonTxtStyle}>
                      {(selectedItem && `${selectedItem.shortName} - ${selectedItem.name}`) || 'Select Unit'}
                    </Text>
                    <Ionicons name={isOpened ? 'chevron-up' : 'chevron-down'} style={styles.dropdownButtonArrowStyle} />
                  </View>
                );
              }}
              renderItem={(item, index, isSelected) => {
                return (
                  <View style={{...styles.dropdownItemStyle, ...(isSelected && {backgroundColor: '#D2D9DF'})}}>
                    <Text style={styles.dropdownItemTxtStyle}>{item.shortName} - {item.name}</Text>
                  </View>
                );
              }}
              showsVerticalScrollIndicator={false}
              dropdownStyle={styles.dropdownMenuStyle}
            />
            <TextInput
                style={styles.input}
                onChangeText={(val) => setUseTimePerUnit(Number(val))}
                value={String(useTimePerUnit)}
                placeholder="Days to consume unit of item"
                keyboardType="numeric"
            />

            <View style={styles.buttonsSection}>
                <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => {saveItem(name, unit, useTimePerUnit);setModalVisible(!modalVisible)}}>
                <Text style={styles.textStyle}>Save</Text>
                </Pressable>
                <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.textStyle}>Close</Text>
                </Pressable>
            </View>

          </ThemedView>
        </View>
      </Modal>
      <Pressable
        style={[styles.button, styles.buttonOpen]}
        onPress={() => setModalVisible(true)}>
        <Text style={styles.textStyle}><Ionicons name={iconType}></Ionicons></Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: 'green',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    buttonsSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    dropdownButtonStyle: {
      width: 200,
      height: 50,
      backgroundColor: '#E9ECEF',
      borderRadius: 12,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 12,
    },
    dropdownButtonTxtStyle: {
      flex: 1,
      fontSize: 18,
      fontWeight: '500',
      color: '#151E26',
    },
    dropdownButtonArrowStyle: {
      fontSize: 28,
    },
    dropdownButtonIconStyle: {
      fontSize: 28,
      marginRight: 8,
    },
    dropdownMenuStyle: {
      backgroundColor: '#E9ECEF',
      borderRadius: 8,
    },
    dropdownItemStyle: {
      width: '100%',
      flexDirection: 'row',
      paddingHorizontal: 12,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 8,
    },
    dropdownItemTxtStyle: {
      flex: 1,
      fontSize: 18,
      fontWeight: '500',
      color: '#151E26',
    },
    dropdownItemIconStyle: {
      fontSize: 28,
      marginRight: 8,
    },
});

export default EditItemModal;