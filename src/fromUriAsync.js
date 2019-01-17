// @flow
import { Asset } from 'expo-asset';
import { getSizeAsync } from './ImageUtils';
import fileInfoAsync from './fileInfoAsync';

function isImageType(type: string): boolean {
  return type.match(/(jpeg|jpg|gif|png|bmp)$/) != null;
}

function getExtension(url: string): string {
  return url
    .split('.')
    .pop()
    .split('?')[0]
    .split('#')[0]
    .toLowerCase();
}

async function fromUriAsync(remoteUri: string, fileName: ?string): Promise<Asset> {
  const { uri, name, hash } = await fileInfoAsync(remoteUri, fileName);

  if (uri) {
    const type = getExtension(name);
    let width = undefined;
    let height = undefined;
    if (isImageType(type)) {
      const size = await getSizeAsync(uri);
      width = size.width;
      height = size.height;
    }

    return new Asset({ name, type, hash, uri, width, height });
  }
}

export default fromUriAsync;
