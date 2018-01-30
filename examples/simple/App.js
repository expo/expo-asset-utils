import Expo from 'expo';
import AssetUtils from './node_modules/expo-asset-utils';
import React from 'react';
import { CameraRoll, FlatList, Image, StyleSheet, Text, View } from 'react-native';
import Assets from './Assets';
export default class App extends React.Component {
  state = {
    images: {},
    loading: true,
  };

  get fonts() {
    let items = {};
    const keys = Object.keys(Assets.fonts || {});
    for (let key of keys) {
      const item = Assets.fonts[key];
      const name = key.substr(0, key.lastIndexOf('.'));
      items[name] = item;
    }
    return [items];
  }

  get files() {
    return [
      ...AssetUtils.arrayFromObject(Assets.images || {}),
      ...AssetUtils.arrayFromObject(Assets.models || {}),
    ];
  }

  get audio() {
    return AssetUtils.arrayFromObject(Assets.audio);
  }

  async preloadAssets() {
    await AssetUtils.cacheAssetsAsync({
      fonts: this.fonts,
      files: this.files,
      audio: this.audio,
    });
    this.setState({ loading: false });
  }

  componentWillMount() {
    this.preloadAssets();
  }

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

    let parsed = {};
    const keys = Object.keys(assets);
    for (const key of keys) {
      const res = assets[key];
      const asset = await AssetUtils.resolveAsync(res);
      parsed[key] = asset;
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

  get loading() {
    return <Expo.AppLoading />;
  }
  get screen() {
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

  render() {
    return this.state.loading ? this.loading : this.screen;
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
    fontFamily: 'GothamNarrow-Book',
  },
  image: {
    width: 100,
    backgroundColor: 'green',
    height: 100,
  },
});
