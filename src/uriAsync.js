// @flow

import type { WildCard } from './resolveAsync';
import resolveAsync from './resolveAsync';

async function uriAsync(fileReference: WildCard, options): Promise<?string> {
  const asset = await resolveAsync(fileReference, options);
  if (!asset) {
    throw new Error(`expo-asset-utils: uriAsync(): failed to resolve asset: ${fileReference}`);
  }
  return asset.localUri;
}

export default uriAsync;
