import { Asset } from 'expo-asset';

const isReactImageFormat = object =>
  object !== null &&
  typeof object === 'object' &&
  object.uri !== null &&
  typeof object.uri === 'string';

export async function resolveAsync(fileReference: any): Promise<Asset> {
  if (fileReference instanceof Asset) {
    if (!fileReference.localUri) {
      await fileReference.downloadAsync();
    }
    return fileReference;
  } else if (typeof fileReference === 'number') {
    const asset = await Asset.fromModule(fileReference);
    return resolveAsync(asset);
  } else if (typeof fileReference === 'string') {
    return Asset.fromURI(fileReference);
  } else if (isReactImageFormat(fileReference)) {
    return Asset.fromURI(fileReference.uri);
  }
  throw new Error(`Cannot resolve asset automatically: ${fileReference}`);
}
