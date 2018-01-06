import AssetUtils from './node_modules/expo-asset-utils';
import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, CameraRoll } from 'react-native';
import Expo from 'expo';

export default class App extends React.Component {
  state = {
    images: {},
  };
  async componentDidMount() {
    const { status } = await Expo.Permissions.askAsync(Expo.Permissions.CAMERA_ROLL);
    if (status !== 'granted') {
      alert('failed to get library asset, please enable and restart demo');
      return;
    }

    const remoteImageUri = 'https://upload.wikimedia.org/wikipedia/en/1/17/Batman-BenAffleck.jpg';
    const localImageResource = require('./icon.png');
    const reactNativeRemoteImage = { uri: remoteImageUri };
    const expoAsset = Expo.Asset.fromModule(localImageResource);
    await expoAsset.downloadAsync();
    const localImageUri = expoAsset.localUri;
    const { edges } = await CameraRoll.getPhotos({ first: 1 });
    const assetLibraryImage = edges.map(({ node: { image, timestamp } }, index) => image.uri)[0];

    const assets = {
      remoteImageUri,
      localImageResource,
      reactNativeRemoteImage,
      expoAsset,
      localImageUri,
      assetLibraryImage,
    };

    console.log(assets);

    let parsed = {};
    const keys = Object.keys(assets);
    for (const key of keys) {
      const res = assets[key];

      const asset = await AssetUtils.resolveAsync(res);
      parsed[key] = asset;
      console.log(key, 'parsed', asset);
    }

    const base64 = await AssetUtils.base64forImageUriAsync(remoteImageUri);
    const pngPrefix = 'data:image/png;base64,';
    parsed['base64'] = { uri: pngPrefix + base64.data };

    this.setState({ images: parsed });
  }

  renderItem = ({ item: key, index }) => {
    const { images } = this.state;

    const item = images[key];
    return (
      <View key={index} style={styles.item}>
        <Image style={styles.image} source={item} />
        <Text style={styles.text}>{key}</Text>
      </View>
    );
  };
  render() {
    const { images } = this.state;
    return (
      <FlatList
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingTop: Expo.Constants.statusBarHeight }}
        data={Object.keys(images)}
        keyExtractor={(item, index) => index}
        renderItem={this.renderItem}
      />
    );
  }
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
    backgroundColor: 'green',
    height: 100,
  },
});
