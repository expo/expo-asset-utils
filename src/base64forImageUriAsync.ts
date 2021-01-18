import { EncodingType, readAsStringAsync } from 'expo-file-system';
import { Image } from 'react-native';
import { resolveAsync } from './resolveAsync';

function getSizeAsync(uri: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) =>
    Image.getSize(uri, (width, height) => resolve({ width, height }), reject)
  );
}

export async function base64forImageUriAsync(
  file: any
): Promise<{
  data: string;
  size: {
    width: number;
    height: number;
  };
}> {
  const asset = await resolveAsync(file);
  const url = asset.localUri || asset.uri;
  const size = await getSizeAsync(url);
  const data = await readAsStringAsync(url, {
    encoding: EncodingType.Base64,
  });
  return { data, size };
}
