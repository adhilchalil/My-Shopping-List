import { Ionicons } from '@expo/vector-icons';
import React, {ComponentProps, useEffect, useState} from 'react';
import {Alert, Modal, StyleSheet, Text, Pressable, View} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';
import ItemMeasureUnit from '@/models/itemMeasreUnitModel';

const EditUnitModal = ({unit, saveItem, iconType}: {unit: ItemMeasureUnit} & {saveItem: any} & {iconType: ComponentProps<typeof Ionicons>['name'] }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState(unit.name);
  const [shortName, setShortName] = useState(unit.shortName);

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
                placeholder="Unit Name"
                value={name}
            />
            <TextInput
                style={styles.input}
                onChangeText={setShortName}
                placeholder="Short Name"
                value={shortName}
            />

            <View style={styles.buttonsSection}>
                <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => {saveItem(name, shortName);setModalVisible(!modalVisible)}}>
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
});

export default EditUnitModal;