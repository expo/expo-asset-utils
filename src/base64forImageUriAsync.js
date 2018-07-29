// @flow
import { ImageStore } from 'react-native';

import base64ForSystemTagAsync from './base64ForSystemTagAsync';
import systemTagForImageAsync from './systemTagForImageAsync';
import type { Data } from './systemTagForImageAsync';

async function base64forImageUriAsync(uri: string): Promise<Data> {
  const { data: tag, size } = await systemTagForImageAsync(uri);

  let data: string;
  try {
    data = await base64ForSystemTagAsync(tag);
  } catch (error) {
    console.log(error);
  } finally {
    ImageStore.removeImageForTag(tag);
  }
  return { data, size };
}

export default base64forImageUriAsync;
