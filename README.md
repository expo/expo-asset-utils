[![NPM](https://nodei.co/npm/expo-asset-utils.png)](https://nodei.co/npm/expo-asset-utils/)

---

# [expo-asset-utils](https://snack.expo.io/@bacon/expo-asset-utils-example)

Utilities for converting files into Expo Assets.
**Uses:**

* Caching remote files
* Parsing `asset-library://` files from ios `CameraRoll`
* Parsing local files from Android's file system
* Preparing assets to be rendered in GL 😁

### Installation

```bash
yarn add expo-asset-utils
```

### Usage

Import the library into your JavaScript file:

```bash
import AssetUtils from 'expo-asset-utils';
```

## Functions

#### resolveAsync

Given a reference to some asset, this will return a promise that resolves to an Expo.Asset that has been cached.

* Expo asset: `Expo.Asset.fromModule(require('./image.png'))`
* static resource: `require('./image.png')`
* remote image: `'https://upload.wikimedia.org/wikipedia/en/1/17/Batman-BenAffleck.jpg'`
* local file: `'file:///var/image.png'`
* asset library file: `'asset-library:///var/image.png'`
* React Native Image source: `{uri: 'https://upload.wikimedia.org/wikipedia/en/1/17/Batman-BenAffleck.jpg'}`

| Property      |                       Type                        | Description                                      |
| ------------- | :-----------------------------------------------: | ------------------------------------------------ |
| fileReference | `Expo.Asset`, `number`, `string`, `{uri: string}` | This will resolve into a downloaded `Expo.Asset` |

#### uriAsync

Given a reference to some asset, this will return a promise that resolves to a local uri.

| Property      |                       Type                        | Description                                      |
| ------------- | :-----------------------------------------------: | ------------------------------------------------ |
| fileReference | `Expo.Asset`, `number`, `string`, `{uri: string}` | This will resolve into a downloaded `Expo.Asset` |

#### copyAssetToSameDirectoryWithNewNameAsync

Given a reference to some asset, and a name (ex: 'file.png') this will copy that asset to the same directory with the provided name. This is used for libraries that parse files by extracting the relative path and appending some arbitrary file name to that path.

| Property      |                       Type                        | Description                                      |
| ------------- | :-----------------------------------------------: | ------------------------------------------------ |
| fileReference | `Expo.Asset`, `number`, `string`, `{uri: string}` | This will resolve into a downloaded `Expo.Asset` |
| name          |                     `string`                      | The file will be copied with this name           |

#### fromUriAsync

Given a file URI `string`, this will return an `Expo.Asset` that hasn't been downloaded yet.

| Property  |   Type   | Description                                                            |
| --------- | :------: | ---------------------------------------------------------------------- |
| remoteUri | `string` | This remote URI will be downloaded and it's file info will be gathered |
| fileName  | `string` | This will be assigned to the `Expo.Asset.name`                         |

#### fileInfoAsync

Given a file URI `string`, this will cache the file and collect the `MD5` hash

| Property |   Type   | Description                                                                                                |
| -------- | :------: | ---------------------------------------------------------------------------------------------------------- |
| uri      | `string` | This URI (local, remote, asset library) will be cached and it's `MD5` hash will be retrieved               |
| name     | `string` | This will be assigned to the `Expo.Asset.name`, if not provided the last component of the uri will be used |

##### base64forImageUriAsync

Given a image URI `string`, this will return a base64 encoded string and the image size: `{ data: string, size: { width: number, height: number } }`

| Property |   Type   | Description                          |
| -------- | :------: | ------------------------------------ |
| uri      | `string` | This URI will be converted to base64 |

##### arrayFromObject

Given an object this will recursively surface the items into an array. Generally used for preloading assets.

| Property |   Type   | Description                          |
| -------- | :------: | ------------------------------------ |
| object   | `Object` | This will be converted into an array |

##### cacheAssetsAsync

Given a image URI `string`, this will return a base64 encoded string and the image size: `{ data: string, size: { width: number, height: number } }`

| Property |  Type   | Description                                                                                                                                   |
| -------- | :-----: | --------------------------------------------------------------------------------------------------------------------------------------------- |
| images   | `Array` | These will be loaded using React Native `Image` if they are strings, and Expo preloading if they are static resources                         |
| files    | `Array` | An `Array` of static resources that will be downloaded using Expo preloading                                                                  |
| fonts    | `Array` | An `Array` of `{ [fontFamily]: staticResource }` that will be loaded using `Expo.Font` and then be available through `fontFamily` style props |

### [Example](/examples/simple/App.js)

```js
import AssetUtils from 'expo-asset-utils';

const remoteImage = 'https://upload.wikimedia.org/wikipedia/en/1/17/Batman-BenAffleck.jpg';
const asset = await AssetUtil.resolveAsync(remoteImage);
const { localUri, width, height } = asset;
```

[**Checkout this Snack!**](https://snack.expo.io/@bacon/expo-asset-utils-example)

### TODO

* Parse HEIC from iOS 11
