// @flow

// Add support for projects that don't use React Native.
let Image;
try {
  const ReactNative = require('react-native');
  Image = ReactNative.Image;
} catch (error) {
  Image = {
    async prefetch(): Promise<> {
      console.warn('expo-asset-utils: Image.prefetch is not supported.');
    },
    getSize(uri, callback) {
      console.warn('expo-asset-utils: Image.getSize is not supported.');
      callback({ width: null, height: null });
    },
  };
}

export function prefetch(url: string): any {
  return Image.prefetch(url);
}

export function getSizeAsync(uri: string): Promise<{ width: number, height: number }> {
  return new Promise((resolve, reject) =>
    Image.getSize(uri, (width, height) => resolve({ width, height }), reject)
  );
}
