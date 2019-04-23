// @flow
import { Asset } from 'expo-asset';
import { loadAsync } from 'expo-font';
import { prefetch } from './ImageUtils';

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

function cacheImages(images: Array): Promise[] {
  return images.map(image => {
    if (typeof image === 'string') {
      return prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

function cacheFonts(fonts: Array): Array<Promise> {
  return fonts.map(font => loadAsync(font));
}
