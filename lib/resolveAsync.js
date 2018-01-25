// @flow
import { Asset } from 'expo';
import isReactImageFormat from './isReactImageFormat';
import fromUriAsync from './fromUriAsync';
import Expo from 'expo';
type ImageFormat = {
  uri: string,
};
export type WildCard = Asset | number | string | ImageFormat;

const resolveAsync = async (fileReference: WildCard): Promise<?Expo.Asset> => {
  if (fileReference instanceof Asset) {
    /// Asset
    if (!fileReference.localUri) {
      await fileReference.downloadAsync();
    }
    return fileReference;
  } else if (typeof fileReference === 'string') {
    /// uri
    const asset = await fromUriAsync(fileReference);
    asset.downloaded = true;
    return asset;
  } else if (typeof fileReference === 'number') {
    /// static resource
    const asset = await Asset.fromModule(fileReference);
    const output = await resolveAsync(asset);
    return output;
  } else if (isReactImageFormat(fileReference)) {
    /// { uri: string }
    const asset = await fromUriAsync(fileReference.uri);
    if (asset) {
      return await resolveAsync(asset);
    }
  }
};

export default resolveAsync;
