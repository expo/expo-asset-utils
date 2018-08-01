// @flow
import { Image } from 'react-native';
import { Asset } from 'expo-asset';

export type CacheOptions = {
  images: Array,
  files: Array,
  fonts: Array,
};
export default function cacheAssetsAsync({
  images = [],
  files = [],
  fonts = [],
}: CacheOptions): Promise<Array> {
  return Promise.all([...cacheImages(images), ...raw(files), ...cacheFonts(fonts)]);
}

function raw(files: Array<number>): Array<Promise> {
  return files.map(file => Asset.fromModule(file).downloadAsync());
}

function cacheImages(images: Array): Promise {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

function cacheFonts(fonts: Array): Array<Promise> {
  try {
    const { Font } = require('expo');
    return fonts.map(font => Font.loadAsync(font));
  } catch (error) {
    throw new Error('Expo have to be installed if you want to use Font');
  }
}
