// @flow
import { readAsStringAsync, EncodingType } from 'expo-file-system';
import { getSizeAsync } from './ImageUtils';

async function base64forImageUriAsync(uri: string): Promise<Data> {
  const size = await getSizeAsync(uri);
  const data = await readAsStringAsync(uri, {
    encoding: EncodingType.Base64,
  });
  return { data, size };
}

export default base64forImageUriAsync;
