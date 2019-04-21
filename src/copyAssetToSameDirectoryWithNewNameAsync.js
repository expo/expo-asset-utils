// @flow
import { copyAsync } from 'expo-file-system';
import uriAsync from './uriAsync';
import replaceNameInUri from './replaceNameInUri';

async function copyAssetToSameDirectoryWithNewNameAsync(
  fileReference,
  name: string
): Promise<string> {
  const url = await uriAsync(fileReference);
  const nextUrl = replaceNameInUri(url, name);
  await copyAsync({ from: url, to: nextUrl });
  return nextUrl;
}

export default copyAssetToSameDirectoryWithNewNameAsync;
