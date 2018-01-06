import { Image } from 'react-native';

export type Size = {
  width: number,
  height: number,
};

async function imageSizeAsync(uri: string): Promise<Size> {
  return await new Promise((res, rej) =>
    Image.getSize(uri, (width, height) => res({ width, height }), rej),
  );
}
export default imageSizeAsync;
