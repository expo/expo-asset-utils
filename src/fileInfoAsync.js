// @flow
import * as FileSystem from 'expo-file-system';
import { Platform } from '@unimodules/core';
import filenameFromUri from './filenameFromUri';

function isAssetLibraryUri(uri: string): boolean {
  return uri.toLowerCase().startsWith('assets-library://');
}

function isLocalUri(uri: string): boolean {
  return uri.toLowerCase().startsWith('file://');
}

async function getHashAsync(uri: string): Promise<string> {
  const { md5 } = await FileSystem.getInfoAsync(uri, { md5: true });
  return md5;
}

export type ImageData = {
  uri: string,
  name: string,
  hash?: string,
};

async function resolveLocalFileAsync({ uri, name }: ImageData): Promise<ImageData> {
  if (Platform.OS === 'web') return { uri, name, hash: null };

  const hash = await getHashAsync(uri);
  if (!hash) {
    return null;
  }
  return { uri, name, hash };
}

async function fileInfoAsync(url: ?string, name: string): Promise<ImageData> {
  if (!url) {
    throw new Error('expo-asset-utils: fileInfoAsync(): cannot load from empty url!');
    return null;
  }
  name = name || filenameFromUri(url);

  if (Platform.OS === 'web') {
    return { uri: url, name, hash: null };
  }

  const localUri = FileSystem.cacheDirectory + name;

  if (isAssetLibraryUri(url)) {
    /// ios asset: we need to copy this over and then get the hash
    await FileSystem.copyAsync({
      from: url,
      to: localUri,
    });
    const hash = await getHashAsync(localUri);
    return { uri: localUri, name, hash };
  } else if (isLocalUri(url)) {
    /// local image: we just need the hash
    let file = await resolveLocalFileAsync({ uri: url, name });
    if (!file) {
      file = await resolveLocalFileAsync({ uri: localUri, name });
      if (!file) {
        throw new Error(
          `expo-asset-utils: fileInfoAsync(): couldn't resolve md5 hash for local uri: ${url} or alternate: ${localUri}`
        );
        return null;
      }
    }
    return file;
  } else {
    /// remote image: download first
    const { uri, md5: hash } = await FileSystem.downloadAsync(url, localUri, {
      md5: true,
    });
    return { uri, name, hash };
  }
}
export default fileInfoAsync;
