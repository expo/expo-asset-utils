import { Image } from 'react-native';
import { Asset, Font } from 'expo';

export default function cacheAssetsAsync({
  images = [],
  files = [],
  fonts = [],
}) {
  return Promise.all([
    ...cacheImages(images),
    ...raw(files),
    ...cacheFonts(fonts),
  ]);
}

function raw(files) {
  return files.map(file => Asset.fromModule(file).downloadAsync());
}

function cacheImages(images) {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

function cacheFonts(fonts) {
  return fonts.map(font => Font.loadAsync(font));
}
