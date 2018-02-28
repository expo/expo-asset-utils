import Expo from 'expo';

import filenameFromUri from './filenameFromUri';

function isAssetLibraryUri(uri: string): boolean {
  return uri.toLowerCase().startsWith('assets-library://');
}

function isLocalUri(uri: string): boolean {
  return uri.toLowerCase().startsWith('file://');
}

async function getHashAsync(uri: string): string {
  const { md5 } = await Expo.FileSystem.getInfoAsync(uri, { md5: true });
  return md5;
}

async function resolveLocalFileAsync({ uri, name }) {
  let hash = await getHashAsync(uri);
  if (!hash) {
    return null;
  }
  return { uri, name, hash };
}

async function fileInfoAsync(url, name) {
  if (!url) {
    console.error('fileInfoAsync: cannot load from empty url!');
    return null;
  }
  name = name || filenameFromUri(url);
  const localUri = Expo.FileSystem.cacheDirectory + name;

  if (isAssetLibraryUri(url)) {
    /// ios asset: we need to copy this over and then get the hash
    await Expo.FileSystem.copyAsync({
      from: url,
      to: localUri,
    });
    const hash = await getHashAsync(localUri);
    return { uri: localUri, name, hash };
  } else if (isLocalUri(url)) {
    /// local image: we just need the hash
    let file = await resolveLocalFileAsync({uri: url, name})
    if (!file) {
      file = await resolveLocalFileAsync({uri: localUri, name})
      if (!file) {
        console.error("ExpoAssetUtils.fileInfoAsync: couldn't resolve md5 hash for local uri: " + url + " or alternate: " + localUri)
        return null;
      }
    }
    return file;
  } else {
    /// remote image: download first
    const { uri, md5: hash } = await Expo.FileSystem.downloadAsync(
      url,
      localUri,
      {
        md5: true,
      },
    );
    return { uri, name, hash };
  }
}
export default fileInfoAsync;
