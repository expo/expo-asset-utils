# Changelog

## 2.0.0

### 🛠 Breaking changes

- `fromUriAsync` is deprecated in favor of `Asset.fromURI('...')` from `expo-asset`.
- `uriAsync` is deprecated in favor of `(await resolveAsync()).localUri`.
- `ImageUtils` is deprecated in favor of `Image.getSize` and `Image.prefetch` from `react-native`.
- `fileInfoAsync` is deprecated.
- `arrayFromObject` is deprecated.
- `isReactImageFormat` is deprecated.
- `cacheAssetsAsync` is deprecated.

### 🎉 New features

- Converted to TypeScript

### 🐛 Bug fixes
