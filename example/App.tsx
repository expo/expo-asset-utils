import { Asset } from 'expo-asset';
import * as AssetUtils from 'expo-asset-utils';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import React from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';

const remoteImageUri =
  'https://upload.wikimedia.org/wikipedia/en/1/17/Batman-BenAffleck.jpg';
const localImageResource = require('./icon.png');
const reactNativeRemoteImage = { uri: remoteImageUri };

const staticImages = {
  localImageResource,
  reactNativeRemoteImage,
};

async function getAssetsAsync() {
  const expoAsset = await Asset.fromModule(localImageResource).downloadAsync();

  const assets = {
    remoteImageUri,
    expoAsset,
    localImageUri: expoAsset.localUri,
  };

  const parsed = {};

  for (const [key, value] of Object.entries(assets)) {
    parsed[key] = await AssetUtils.resolveAsync(value);
  }

  const base64 = await AssetUtils.base64forImageUriAsync(remoteImageUri);
  const pngPrefix = 'data:image/png;base64,';
  parsed['base64'] = { uri: pngPrefix + base64.data };

  return parsed;
}

export default function App() {
  const [images, setImages] = React.useState({});
  const data = { ...staticImages, ...images };
  const [permission] = Permissions.usePermissions(Permissions.CAMERA, {
    ask: true,
  });

  React.useEffect(() => {
    if (!permission || permission.status !== 'granted') {
      // alert('failed to get library asset, please enable and restart demo');
      return;
    }

    getAssetsAsync()
      .then(images => {
        setImages(images);
      })
      .catch(error => {
        console.log('error: ', error);
      });
  }, [permission]);

  const renderItem = ({ item: key, index }) => {
    const item = data[key];
    return (
      <View key={index} style={styles.item}>
        <Image style={styles.image} source={item} />
        <Text style={styles.text}>{key}</Text>
      </View>
    );
  };

  return (
    <FlatList
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingTop: Constants.statusBarHeight }}
      data={Object.keys(data)}
      keyExtractor={(item, index) => `-${index}`}
      renderItem={renderItem}
    />
  );
}

const styles = StyleSheet.create({
  item: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 4,
  },
  text: {
    textAlign: 'center',
    fontSize: 16,
    marginLeft: 16,
  },
  image: {
    width: 100,
    resizeMode: 'contain',
    backgroundColor: 'gray',
    height: 100,
  },
});
