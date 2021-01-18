import { Asset } from 'expo-asset';

const isReactImageFormat = object =>
  object !== null &&
  typeof object === 'object' &&
  !(object instanceof Asset) &&
  object.uri !== null &&
  typeof object.uri === 'string';

export async function resolveAsync(fileReference: any): Promise<Asset> {
  // Reduce format
  if (isReactImageFormat(fileReference)) {
    return resolveAsync(fileReference.uri);
  } else if (typeof fileReference === 'number') {
    const asset = Asset.fromModule(fileReference);
    return resolveAsync(asset);
  } else if (typeof fileReference === 'string') {
    const asset = Asset.fromURI(fileReference);
    return resolveAsync(asset);
  }

  // Load asset URI
  if (fileReference instanceof Asset) {
    if (!fileReference.localUri) {
      try {
        await fileReference.downloadAsync();
      } catch (error) {
        // Handle weird Expo iOS error where remote URIs cannot be downloaded.
        if (error.message.includes('unsupported URL')) {
          fileReference.localUri = fileReference.uri;
        } else {
          throw error;
        }
      }
    }
    return fileReference;
  }
  throw new Error(`Cannot resolve asset automatically: ${fileReference}`);
}
