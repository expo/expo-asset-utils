import imageSizeAsync from './imageSizeAsync';
import fileInfoAsync from './fileInfoAsync';
import Expo from 'expo';

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

    return new Expo.Asset({ name, type, hash, uri, width, height });
  }
}

export default fromUriAsync;
