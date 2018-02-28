import Expo from 'expo';
import AssetUtils from './node_modules/expo-asset-utils';
import React from 'react';
import { CameraRoll, Clipboard, FlatList, Image, StyleSheet, Text, View } from 'react-native';
import Assets from './Assets';
import getGalleryImageAsync from './getGalleryImageAsync';
export default class App extends React.Component {
  state = {
    images: {},
    loading: true,
    tookPicture: false,
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
    const remoteImageUri = 'https://upload.wikimedia.org/wikipedia/en/1/17/Batman-BenAffleck.jpg';
    const rnRemoteImageUri =
      'https://pbs.twimg.com/profile_images/875417069650497536/wPCwhgrt_400x400.jpg';
    const localImageResource = require('./icon.png');
    const staticResource = require('./static.jpg');
    const reactNativeRemoteImage = { uri: remoteImageUri };
    const expoAsset = Expo.Asset.fromModule(localImageResource);
    await Expo.Asset.fromModule(require('./charlie.jpeg')).downloadAsync();
    const localImageUri = Expo.Asset.fromModule(require('./charlie.jpeg')).localUri;
    const assetLibraryImage = await getGalleryImageAsync();

    const assets = {
      remoteImageUri: {
        title: 'Remote image from the web',
        description:
          'Web images will be downloaded and cached, then we will get a localUri, md5 hash, width, and height',
        asset: remoteImageUri,
        example: `AssetUtils.resolveAsync("${remoteImageUri}");`,
      },
      localImageResource: {
        title: 'Static Image',
        description: 'Referenced as "require(\'./static.jpg\')"',
        asset: staticResource,
        example: `AssetUtils.resolveAsync(require('./static.jpg'));`,
      },
      reactNativeRemoteImage: {
        title: '<Image source/> format',
        description: 'Following the RN convention of \'{uri: "webimage.png"}\' `',
        asset: rnRemoteImageUri,
        example: `AssetUtils.resolveAsync({uri: "${rnRemoteImageUri}"});`,
      },
      expoAsset: {
        title: 'Expo Asset',
        description: 'From "Asset.fromModule()"',
        asset: expoAsset,
        example: `AssetUtils.resolveAsync(Expo.Asset.fromModule(require('./charlie.jpeg')));`,
      },
      localImageUri: {
        title: 'Local Image URI',
        description: 'From "FileSystem" with a prefix of "file://"',
        asset: localImageUri,
        example: `await Expo.Asset.fromModule(require('./icon.png').downloadAsync();
AssetUtils.resolveAsync(Expo.Asset.fromModule(require('./icon.png').localUri ));`,
      },
      assetLibraryImage: {
        title: 'Asset Library Image',
        description:
          'Taken from your gallery through "CameraRoll", on iOS these images have an "asset-library://" prefix, they must be saved to another location to read',
        asset: assetLibraryImage,
        example: `const { edges } = await CameraRoll.getPhotos({ first: 1 });
const asset = edges.map(({ node: { image } }) => image.uri)[0];
AssetUtils.resolveAsync(asset);`,
      },
    };

    let parsed = {};
    const keys = Object.keys(assets);
    for (const key of keys) {
      const { asset: res, ...props } = assets[key];
      const asset = await AssetUtils.resolveAsync(res);
      parsed[key] = { asset, ...props };
    }

    const base64 = await AssetUtils.base64forImageUriAsync(remoteImageUri);
    const pngPrefix = 'data:image/png;base64,';
    parsed['base64'] = {
      title: 'Base64 Encoded',
      description:
        'From "ImageStore" this is a large string with a prefix of "data:image/png;base64,"',
      asset: { uri: pngPrefix + base64.data },
      example: `const { data } = await AssetUtils.base64forImageUriAsync(remoteImageUri);
const base64 = '${pngPrefix}' + data;`,
    };

    this.setState({ images: parsed });
  }

  renderItem = ({ item: key, index }) => {
    const { images } = this.state;

    const { title, description, example, asset } = images[key];
    return (
      <View key={index} style={styles.item}>
        <View style={styles.itemContent}>
          <Image style={styles.image} source={asset} />
          <View style={styles.itemTextContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.desctiption}>{description}</Text>
          </View>
        </View>
        <Text
          onPress={() => {
            Clipboard.setString(example);
          }}
          style={styles.example}>
          {example}
        </Text>
      </View>
    );
  };

  renderFooter = () => {
    const { tookPicture } = this.state;
    if (tookPicture) {
      return null;
    }
    return (
      <View style={styles.footerContainer}>
        <Text style={styles.footerText} onPress={this.takePictureAsync}>
          Take Picture
        </Text>
      </View>
    );
  };

  takePictureAsync = async () => {
    const { cancelled, uri } = await Expo.ImagePicker.launchCameraAsync({
      allowsEditing: false,
      aspect: [4, 3],
    });

    if (cancelled) {
      alert(`cancelled ¯\_(ツ)_/¯`);
      return;
    } else {
      const images = this.state.images;
      const asset = await AssetUtils.resolveAsync(uri);
      images['camera'] = {
        title: 'Photo from camera',
        description:
          'A picture taken from ImagePicker.launchCameraAsync that has "ImagePicker/" added before the name in the path',
        asset,
        example: `const {uri} = await Expo.ImagePicker.launchCameraAsync();
await AssetUtils.resolveAsync(uri);`,
      };
      this.setState({ images, tookPicture: true });
    }
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
        ListFooterComponent={this.renderFooter}
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
    maxWidth: '100%',
    paddingHorizontal: 18,
    paddingBottom: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'gray',
  },
  itemContent: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 4,
    maxWidth: '100%',
  },
  example: {
    flex: 1,
    fontSize: 14,
    padding: 8,
    backgroundColor: '#EAEAEA',
  },
  itemTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontFamily: 'GothamNarrow-Medium',
  },
  description: {
    marginTop: 8,
    fontSize: 14,
    fontFamily: 'GothamNarrow-Book',
  },
  image: {
    width: 100,
    backgroundColor: '#EAEAEA',
    height: 100,
  },
  footerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  footerText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
