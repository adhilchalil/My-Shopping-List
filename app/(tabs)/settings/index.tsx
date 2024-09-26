import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Platform, useColorScheme } from 'react-native';
import { Option } from '@/components/Option';
import { useContext, useEffect, useState } from 'react';
import { Item } from '@/components/Items';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import EditItemModal from '@/components/modal/EditItemModal';
import GroceryItem from '@/models/groceryItemModel';
import EditUnitModal from '@/components/modal/EditUnitModal';
import ItemMeasureUnit from '@/models/itemMeasreUnitModel';
import DeleteUnitModal from '@/components/modal/DeleteUnitModal';
import DeleteItemModal from '@/components/modal/DeleteItemModal';
import { AllDataContext } from '@/app/_layout';

export default function ItemsAndSettingsScreen() {
  const [page, setPage] = useState("Main");
  const theme = useColorScheme() ?? 'light';
  
  const data:any = useContext(AllDataContext);

  let newItem = new GroceryItem();
  let newUnit = new ItemMeasureUnit();

  const changePage = (value: string) => {
    setPage(value);
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={<Ionicons size={310} name="settings" style={styles.headerImage} />}>
        {page == "Main" &&
          <>
          <ThemedView style={styles.titleContainer}>
            <ThemedText type="title">Settings</ThemedText>
          </ThemedView>
          <Option title={'Items'} toPage={'Items'} icon={"bag"} iconColor={theme == "light"? "black": "white"} setPage={changePage}></Option>
          <Option title={'Units'} toPage={'Units'} icon={"scale"} iconColor={theme == "light"? "black": "white"} setPage={changePage}></Option>
          {/* <Option title={'Items'} toPage={'Items'} icon={"home"} iconColor={theme == "light"? "black": "white"} setPage={changePage}></Option> */}
          </>
        }
        {page == "Items" &&
          <>
            <ThemedView style={styles.backButton}>
            <Option title={'Back'} toPage={'Main'} icon={"chevron-back"} forwardIcon={false} iconColor={theme == "light"? "black": "white"} setPage={changePage}></Option>
            </ThemedView>
            <ThemedView style={styles.titleContainer}>
              <ThemedText type="title">Items</ThemedText>
            </ThemedView>
            {data?.items.map((item: GroceryItem) => 
              <ThemedView  key={"item" + item.ID} style={styles.titleContainer}>
                <Item ID={item.ID} item={item}></Item>
                <EditItemModal item={item} saveItem={data.saveEditedItem} iconType='pencil' units={data.units}></EditItemModal>
                <DeleteItemModal item={item} deleteItem={data.deleteItem} iconType='trash'></DeleteItemModal>
              </ThemedView>
            )}
            <ThemedView  key={"item0"} style={styles.titleContainer}>
              <Item ID={0} item={newItem}></Item>
              <EditItemModal item={newItem} saveItem={data.createNewItem} iconType='add' units={data.units}></EditItemModal>
            </ThemedView>
          </>
        }
        {page == "Units" &&
          <>
            <ThemedView style={styles.backButton}>
            <Option title={'Back'} toPage={'Main'} icon={"chevron-back"} forwardIcon={false} iconColor={theme == "light"? "black": "white"} setPage={changePage}></Option>
            </ThemedView>
            <ThemedView style={styles.titleContainer}>
              <ThemedText type="title">Items</ThemedText>
            </ThemedView>
            {data?.units.map((unit: ItemMeasureUnit) => 
              <ThemedView  key={"units" + unit.ID} style={styles.titleContainer}>
                <Item ID={unit.ID} item={unit}></Item>
                <EditUnitModal unit={unit} saveItem={data.saveEditedUnit} iconType='pencil'></EditUnitModal>
                <DeleteUnitModal unit={unit} deleteunit={data.deleteUnit} iconType='trash'></DeleteUnitModal>
              </ThemedView>
            )}
            <ThemedView  key={"unit0"} style={styles.titleContainer}>
              <Item ID={0} item={newItem}></Item>
              <EditUnitModal unit={newUnit} saveItem={data.createNewUnit} iconType='add'></EditUnitModal>
            </ThemedView>
          </>
        }

      {/* <Collapsible title="File-based routing">
        <ThemedText>
          This app has two screens:{' '}
          <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> and{' '}
          <ThemedText type="defaultSemiBold">app/(tabs)/explore.tsx</ThemedText>
        </ThemedText>
        <ThemedText>
          The layout file in <ThemedText type="defaultSemiBold">app/(tabs)/_layout.tsx</ThemedText>{' '}
          sets up the tab navigator.
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/router/introduction">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Android, iOS, and web support">
        <ThemedText>
          You can open this project on Android, iOS, and the web. To open the web version, press{' '}
          <ThemedText type="defaultSemiBold">w</ThemedText> in the terminal running this project.
        </ThemedText>
      </Collapsible>
      <Collapsible title="Images">
        <ThemedText>
          For static images, you can use the <ThemedText type="defaultSemiBold">@2x</ThemedText> and{' '}
          <ThemedText type="defaultSemiBold">@3x</ThemedText> suffixes to provide files for
          different screen densities
        </ThemedText>
        <Image source={require('@/assets/images/react-logo.png')} style={{ alignSelf: 'center' }} />
        <ExternalLink href="https://reactnative.dev/docs/images">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Custom fonts">
        <ThemedText>
          Open <ThemedText type="defaultSemiBold">app/_layout.tsx</ThemedText> to see how to load{' '}
          <ThemedText style={{ fontFamily: 'SpaceMono' }}>
            custom fonts such as this one.
          </ThemedText>
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/versions/latest/sdk/font">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Light and dark mode components">
        <ThemedText>
          This template has light and dark mode support. The{' '}
          <ThemedText type="defaultSemiBold">useColorScheme()</ThemedText> hook lets you inspect
          what the user's current color scheme is, and so you can adjust UI colors accordingly.
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Animations">
        <ThemedText>
          This template includes an example of an animated component. The{' '}
          <ThemedText type="defaultSemiBold">components/HelloWave.tsx</ThemedText> component uses
          the powerful <ThemedText type="defaultSemiBold">react-native-reanimated</ThemedText> library
          to create a waving hand animation.
        </ThemedText>
        {Platform.select({
          ios: (
            <ThemedText>
              The <ThemedText type="defaultSemiBold">components/ParallaxScrollView.tsx</ThemedText>{' '}
              component provides a parallax effect for the header image.
            </ThemedText>
          ),
        })}
      </Collapsible> */}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: "100%",
  },
  backButton: {
    borderBottomColor: "red",
    borderBottomWidth: 2,
    paddingBottom: 10
  }
});
