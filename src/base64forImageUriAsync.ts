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
  const size = await getSizeAsync(asset.localUri!);
  const data = await readAsStringAsync(asset.localUri!, {
    encoding: EncodingType.Base64,
  });
  return { data, size };
}
