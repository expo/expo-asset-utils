import Expo from 'expo';
import uriAsync from './uriAsync';
import replaceNameInUri from './replaceNameInUri';

async function copyAssetToSameDirectoryWithNewNameAsync(
  fileReference,
  name: string,
): Promise {
  const url = await uriAsync(fileReference);
  const nextUrl = replaceNameInUri(url, name);
  await Expo.FileSystem.copyAsync({ from: url, to: nextUrl });
  return nextUrl;
}

export default copyAssetToSameDirectoryWithNewNameAsync;
