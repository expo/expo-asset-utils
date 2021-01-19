# expo-asset-utils

> This package is no longer required for parsing assets, use [`expo-asset`](https://www.npmjs.com/package/expo-asset) and [`expo-file-system`](https://www.npmjs.com/package/expo-file-system) instead.

# [expo-asset-utils](https://snack.expo.io/@bacon/expo-asset-utils-example)

### Installation

```bash
yarn add expo-asset-utils
```

### Usage

Import the library into your JavaScript file:

```ts
import * as AssetUtils from 'expo-asset-utils';
```

## Functions

### resolveAsync

Given a reference to some asset, this will return a promise that resolves to an Expo.Asset that has been cached.

- Expo asset: `Expo.Asset.fromModule(require('./image.png'))`
- static resource: `require('./image.png')`
- remote image: `'https://upload.wikimedia.org/wikipedia/en/1/17/Batman-BenAffleck.jpg'`
- local file: `'file:///var/image.png'`
- asset library file: `'asset-library:///var/image.png'`
- React Native Image source: `{uri: 'https://upload.wikimedia.org/wikipedia/en/1/17/Batman-BenAffleck.jpg'}`

| Property      |                       Type                        | Description                                      |
| ------------- | :-----------------------------------------------: | ------------------------------------------------ |
| fileReference | `Expo.Asset`, `number`, `string`, `{uri: string}` | This will resolve into a downloaded `Expo.Asset` |

### base64forImageUriAsync

Given a image URI `string`, this will return a base64 encoded string and the image size: `{ data: string, size: { width: number, height: number } }`

| Property |   Type   | Description                          |
| -------- | :------: | ------------------------------------ |
| uri      | `string` | This URI will be converted to base64 |

### uriAsync

> Deprecated: Use `(await resolveAsync()).localUri`

### fromUriAsync

> Deprecated: Use `Asset.fromURI('...')` from `expo-asset`

### arrayFromObject

> Deprecated

### cacheAssetsAsync

> Deprecated
