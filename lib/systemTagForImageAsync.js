import { ImageEditor } from 'react-native';
import imageSizeAsync from './imageSizeAsync';

import type { Size } from './imageSizeAsync';

export type Data = {
  data: string,
  size: Size,
};

async function systemTagForImageAsync(uri: string): Promise<Data> {
  const size = await imageSizeAsync(uri);

  const cropData = { offset: { x: 0, y: 0 }, size };
  const imageTag = await new Promise((resolve, reject) => {
    ImageEditor.cropImage(uri, cropData, resolve, reject);
  });

  return { data: imageTag, size };
}
export default systemTagForImageAsync;
