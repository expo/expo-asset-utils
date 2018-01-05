import Expo from 'expo';
import uriAsync from './uriAsync';
import replaceFilenameFromUri from './replaceFilenameFromUri';

async function copyAssetToSameDirectoryWithNewNameAsync(
  fileReference,
  name: string,
): Promise {
  const url = await uriAsync(fileReference);
  const nextUrl = replaceFilenameFromUri(url, name);
  await Expo.FileSystem.copyAsync({ from: url, to: nextUrl });
}

export default copyAssetToSameDirectoryWithNewNameAsync;
