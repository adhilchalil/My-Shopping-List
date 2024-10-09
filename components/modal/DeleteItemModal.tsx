import GroceryItem from '@/models/groceryItemModel';
import { Ionicons } from '@expo/vector-icons';
import React, {ComponentProps, useEffect, useState} from 'react';
import {Alert, Modal, StyleSheet, Text, Pressable, View} from 'react-native';
import { ThemedView } from '../ThemedView';

const DeleteItemModal = ({item, deleteItem, iconType}: {item: GroceryItem} & {deleteItem: any} & {iconType: ComponentProps<typeof Ionicons>['name'] }) => {
  const [modalVisible, setModalVisible] = useState(false);

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
            <Text
                style={styles.message}
            >Are you sure you want to delete item: {item.name}</Text>

            <View style={styles.buttonsSection}>
                <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => {deleteItem(item.ID, item.name);setModalVisible(!modalVisible)}}>
                <Text style={styles.textStyle}>Delete</Text>
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
    message: {

    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 11,
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

export default DeleteItemModal;