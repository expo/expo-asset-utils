import AssetUtils from 'expo-asset-utils';
import React from 'react';
import { View } from 'react-native';

export default class App extends React.Component {
  async componentDidMount() {
    const remoteImage = 'https://upload.wikimedia.org/wikipedia/en/1/17/Batman-BenAffleck.jpg';
    const asset = await AssetUtils.resolveAsync(remoteImage);
    const { localUri, width, height } = asset;
    console.log(localUri, width, height);
  }
  render() {
    return <View />;
  }
}
