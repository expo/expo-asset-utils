export { default as uriAsync } from './uriAsync';
export {
  default as copyAssetToSameDirectoryWithNewNameAsync,
} from './copyAssetToSameDirectoryWithNewNameAsync';
export { default as resolveAsync } from './resolveAsync';
export { default as fromUriAsync } from './fromUriAsync';
export { default as fileInfoAsync } from './fileInfoAsync';
export { default as isReactImageFormat } from './isReactImageFormat';
export { default as base64forImageUriAsync } from './base64forImageUriAsync';
export { default as arrayFromObject } from './arrayFromObject';
export { default as cacheAssetsAsync } from './cacheAssetsAsync';

import * as ImageUtils from './ImageUtils';

export { ImageUtils };

export function imageSizeAsync(...props) {
  console.warn('expo-asset-utils: imageSizeAsync() is deprecated. Use ImageUtils.getSizeAsync()');
  return ImageUtils.getSizeAsync(...props);
}
