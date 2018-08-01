'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var reactNative = require('react-native');
var expoFileSystem = require('expo-file-system');
var expoAsset = require('expo-asset');

var isReactImageFormat = object =>
  object !== null &&
  typeof object === 'object' &&
  object.uri !== null &&
  typeof object.uri === 'string';

// 


async function imageSizeAsync(uri) {
  return await new Promise((res, rej) =>
    reactNative.Image.getSize(uri, (width, height) => res({ width, height }), rej)
  );
}

// 
function filenameFromUri(url) {
  return url
    .substring(url.lastIndexOf('/') + 1)
    .split('?')[0]
    .split('#')[0];
}

// 

function isAssetLibraryUri(uri) {
  return uri.toLowerCase().startsWith('assets-library://');
}

function isLocalUri(uri) {
  return uri.toLowerCase().startsWith('file://');
}

async function getHashAsync(uri) {
  const { md5 } = await expoFileSystem.FileSystem.getInfoAsync(uri, { md5: true });
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
  const localUri = expoFileSystem.FileSystem.cacheDirectory + name;

  if (isAssetLibraryUri(url)) {
    /// ios asset: we need to copy this over and then get the hash
    await expoFileSystem.FileSystem.copyAsync({
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
        console.error(
          "ExpoAssetUtils.fileInfoAsync: couldn't resolve md5 hash for local uri: " +
            url +
            ' or alternate: ' +
            localUri
        );
        return null;
      }
    }
    return file;
  } else {
    /// remote image: download first
    const { uri, md5: hash } = await expoFileSystem.FileSystem.downloadAsync(url, localUri, {
      md5: true,
    });
    return { uri, name, hash };
  }
}

// 

function isImageType(type) {
  return type.match(/(jpeg|jpg|gif|png|bmp)$/) != null;
}

function getExtension(url) {
  return url
    .split('.')
    .pop()
    .split('?')[0]
    .split('#')[0]
    .toLowerCase();
}

async function fromUriAsync(remoteUri, fileName) {
  const { uri, name, hash } = await fileInfoAsync(remoteUri, fileName);

  if (uri) {
    const type = getExtension(name);
    let width = undefined;
    let height = undefined;
    if (isImageType(type)) {
      const size = await imageSizeAsync(uri);
      width = size.width;
      height = size.height;
    }

    return new expoAsset.Asset({ name, type, hash, uri, width, height });
  }
}

// 




const resolveAsync = async (fileReference, options = {}) => {
  if (fileReference instanceof expoAsset.Asset) {
    /// Asset
    if (!fileReference.localUri) {
      await fileReference.downloadAsync();
    }
    return fileReference;
  } else if (typeof fileReference === 'string') {
    /// uri
    const asset = await fromUriAsync(fileReference, options.fileName);
    if (asset) {
      return await resolveAsync(asset);
    }
  } else if (typeof fileReference === 'number') {
    /// static resource
    const asset = await expoAsset.Asset.fromModule(fileReference);
    const output = await resolveAsync(asset);
    return output;
  } else if (isReactImageFormat(fileReference)) {
    /// { uri: string }
    const asset = await fromUriAsync(fileReference.uri, options.fileName);
    if (asset) {
      return await resolveAsync(asset);
    }
  }
};

// 

async function uriAsync(fileReference, options) {
  const asset = await resolveAsync(fileReference, options);
  if (!asset) {
    console.error('uriAsync: failed to resolve asset', fileReference);
  }
  return asset.localUri;
}

// 

function replaceNameInUri(url, filename) {
  const originalName = filenameFromUri(url);
  return url.replace(originalName, filename);
}

// 

async function copyAssetToSameDirectoryWithNewNameAsync(
  fileReference,
  name
) {
  const url = await uriAsync(fileReference);
  const nextUrl = replaceNameInUri(url, name);
  await expoFileSystem.FileSystem.copyAsync({ from: url, to: nextUrl });
  return nextUrl;
}

// 

async function base64ForSystemTagAsync(imageTag) {
  return new Promise((resolve, reject) => {
    reactNative.ImageStore.getBase64ForTag(imageTag, resolve, reject);
  });
}

// 



async function systemTagForImageAsync(uri) {
  const size = await imageSizeAsync(uri);

  const cropData = { offset: { x: 0, y: 0 }, size };
  const imageTag = await new Promise((resolve, reject) => {
    reactNative.ImageEditor.cropImage(uri, cropData, resolve, reject);
  });

  return { data: imageTag, size };
}

// 

async function base64forImageUriAsync(uri) {
  const { data: tag, size } = await systemTagForImageAsync(uri);

  let data;
  try {
    data = await base64ForSystemTagAsync(tag);
  } catch (error) {
    console.log(error);
  } finally {
    reactNative.ImageStore.removeImageForTag(tag);
  }
  return { data, size };
}

// 
function arrayFromObject(object) {
  let images = [];
  Object.keys(object).map(key => {
    let item = object[key];

    if (typeof item === 'object') {
      images = images.concat(arrayFromObject(item));
    } else {
      images.push(item);
    }
  });
  return images;
}

// 

function cacheAssetsAsync({
  images = [],
  files = [],
  fonts = [],
}) {
  return Promise.all([...cacheImages(images), ...raw(files), ...cacheFonts(fonts)]);
}

function raw(files) {
  return files.map(file => expoAsset.Asset.fromModule(file).downloadAsync());
}

function cacheImages(images) {
  return images.map(image => {
    if (typeof image === 'string') {
      return reactNative.Image.prefetch(image);
    } else {
      return expoAsset.Asset.fromModule(image).downloadAsync();
    }
  });
}

function cacheFonts(fonts) {
  try {
    const { Font } = require('expo');
    return fonts.map(font => Font.loadAsync(font));
  } catch (error) {
    throw new Error('Expo have to be installed if you want to use Font');
  }
}



var AssetUtils = /*#__PURE__*/Object.freeze({
  uriAsync: uriAsync,
  copyAssetToSameDirectoryWithNewNameAsync: copyAssetToSameDirectoryWithNewNameAsync,
  resolveAsync: resolveAsync,
  fromUriAsync: fromUriAsync,
  fileInfoAsync: fileInfoAsync,
  imageSizeAsync: imageSizeAsync,
  isReactImageFormat: isReactImageFormat,
  base64forImageUriAsync: base64forImageUriAsync,
  arrayFromObject: arrayFromObject,
  cacheAssetsAsync: cacheAssetsAsync
});

exports.default = AssetUtils;
exports.uriAsync = uriAsync;
exports.copyAssetToSameDirectoryWithNewNameAsync = copyAssetToSameDirectoryWithNewNameAsync;
exports.resolveAsync = resolveAsync;
exports.fromUriAsync = fromUriAsync;
exports.fileInfoAsync = fileInfoAsync;
exports.imageSizeAsync = imageSizeAsync;
exports.isReactImageFormat = isReactImageFormat;
exports.base64forImageUriAsync = base64forImageUriAsync;
exports.arrayFromObject = arrayFromObject;
exports.cacheAssetsAsync = cacheAssetsAsync;
