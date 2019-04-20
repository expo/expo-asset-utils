// @flow
import { Image } from 'react-native';

export function prefetch(url: string): any {
  if (!Image.prefetch) throw new Error(`expo-asset-utils: Image.prefetch is not supported.`);
  return Image.prefetch(url);
}

export function getSizeAsync(uri: string): Promise<{ width: number, height: number }> {
  if (!Image.getSize) throw new Error(`expo-asset-utils: Image.getSize is not supported.`);
  return new Promise((resolve, reject) =>
    Image.getSize(uri, (width, height) => resolve({ width, height }), reject)
  );
}
